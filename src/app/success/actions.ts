"use server";

import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fonction de modération avec Gemini
async function verifyImageContent(fileBuffer: Buffer, mimeType: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analyse cette image. Réponds uniquement par 'SAFE' si elle est appropriée pour une publicité sur une newsletter pro, ou 'UNSAFE' si elle contient du contenu choquant, sexuel, violent ou de la propagande. Si tu n'es pas sûr, réponds 'UNSAFE'.";

    const imagePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    console.log(`[GEMINI MODERATION] Result: ${text}`);

    return text.includes("SAFE") && !text.includes("UNSAFE");
  } catch (error) {
    console.error("[GEMINI MODERATION] Error:", error);
    // En cas d'erreur de l'API (ex: quota, clé invalide), on peut décider de laisser passer ou bloquer. 
    // Pour la sécurité, on bloque par défaut ou on log l'erreur.
    // Ici, je retourne false pour être safe, mais tu peux changer ça.
    return false;
  }
}

export async function handleAssetsUpload(formData: FormData) {
  // Configuration Cloudinary utilisant tes variables d'environnement [cite: 181]
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const file = formData.get("image") as File;
  const link = formData.get("link") as string;
  const slotId = formData.get("slotId") as string;

  if (!file || !link || !slotId) return;

  // 0. VÉRIFICATION GEMINI AVANT UPLOAD
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // On vérifie l'image avec Gemini (sauf si admin)
  const { userId } = await auth();
  let isSafe = false;

  const user = userId ? await prisma.user.findUnique({ where: { clerkId: userId } }) : null;

  if (user?.isAdmin) {
    console.log("[MODERATION] Skipped for Admin");
    isSafe = true;
  } else {
    isSafe = await verifyImageContent(buffer, file.type);
  }

  if (!isSafe) {
    console.warn(`[MODERATION] Image rejected for slot ${slotId}`);
    // Redirection avec erreur ou lancer une erreur pour que le client le sache
    // Comme c'est un serveur action appelé par un form, on peut redirect avec un param error
    redirect(`/dashboard/setup-business?error=moderation_failed`);
    // Note: ajuster l'URL de redirection selon où se trouve le formulaire
  }

  // 1. RÉCUPÉRATION DU PRIX RÉEL [cite: 22, 92]
  // On cherche le prix défini par le créateur pour ce slot précis
  const slot = await prisma.adSlot.findUnique({
    where: { id: slotId },
    select: { price: true }
  });

  if (!slot) {
    console.error("Slot introuvable");
    return;
  }

  // 2. UPLOAD VERS CLOUDINARY [cite: 184, 185]
  // On utilise le buffer qu'on a déjà créé
  const uploadResponse: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "slots_ads" }, (error, result) => {
      if (error) reject(error);
      resolve(result);
    }).end(buffer);
  });

  // 3. MISE À JOUR DE LA BDD [cite: 186, 188]
  // On remplace le '0' par 'slot.price' pour que l'argent s'affiche sur le dashboard
  await prisma.adSlot.update({
    where: { id: slotId },
    data: {
      isBooked: true,
      booking: {
        upsert: {
          create: {
            adImage: uploadResponse.secure_url,
            adLink: link,
            buyerEmail: "annonceur@pro.com", // Sera écrasé par le webhook Stripe si utilisé [cite: 54]
            amountPaid: slot.price,          // MODIFICATION : Utilise le prix du slot 
          },
          update: {
            adImage: uploadResponse.secure_url,
            adLink: link,
            amountPaid: slot.price,          // On s'assure que le prix est correct
            status: "APPROVED"               // On valide la réservation une fois les assets uploadés
          }
        }
      }
    },
  });

  // Purge du cache pour mettre à jour le dashboard et le widget immédiatement [cite: 189]
  revalidatePath("/");
  revalidatePath("/dashboard");

  redirect("/dashboard?success=true");
}
