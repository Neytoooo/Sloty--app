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
    console.log("[GEMINI MODERATION] Initialisation de l'API Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = "Analyse cette image. Réponds uniquement par 'SAFE' si l'image est correcte pour une publicité tout public (y compris jeux vidéo, divertissement, etc.), ou 'UNSAFE' si elle contient explicitement du contenu choquant, sexuel, très violent, illégal ou de la propagande haineuse. Si c'est une simple image de jeu vidéo comme Minecraft, réponds 'SAFE'.";

    console.log("[GEMINI MODERATION] Préparation de l'image (Taille:", fileBuffer.length, "bytes, Type:", mimeType, ")");
    const imagePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    console.log("[GEMINI MODERATION] Envoi de la requête à Gemini...");
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    console.log(`[GEMINI MODERATION] Réponse brute de Gemini: "${text}"`);

    return text.includes("SAFE") && !text.includes("UNSAFE");
  } catch (error: any) {
    console.error("[GEMINI MODERATION] Erreur API:", error?.message || error);
    // En cas d'erreur de l'API (ex: quota, clé invalide), on peut décider de laisser passer ou bloquer. 
    // Pour la sécurité, on bloque par défaut ou on log l'erreur.
    // Ici, je retourne false pour être safe, mais tu peux changer ça.
    return false;
  }
}

export async function handleAssetsUpload(formData: FormData) {
  console.log("-----------------------------------------");
  console.log("[UPLOAD] Début de l'action handleAssetsUpload");
  
  // Configuration Cloudinary utilisant tes variables d'environnement [cite: 181]
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const file = formData.get("image") as File;
  const link = formData.get("link") as string;
  const slotId = formData.get("slotId") as string;

  console.log(`[UPLOAD] Données reçues: slotId=${slotId}, link=${link}, file size=${file?.size} bytes`);

  if (!file || file.size === 0 || !link || !slotId) {
    console.error("[UPLOAD] ERREUR: Champs manquants ou image vide.");
    redirect(`/success?slotId=${slotId}&error=missing_fields`);
  }

  // 0. VÉRIFICATION GEMINI AVANT UPLOAD
  console.log("[UPLOAD] Conversion de l'image en buffer...");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // On vérifie l'image avec Gemini (sauf si admin)
  const { userId } = await auth();
  let isSafe = false;

  console.log(`[UPLOAD] Vérification de l'utilisateur Clerk (${userId})...`);
  const user = userId ? await prisma.user.findUnique({ where: { clerkId: userId } }) : null;

  if (user?.isAdmin) {
    console.log("[MODERATION] Utilisateur Admin -> Vérification Gemini ignorée");
    isSafe = true;
  } else {
    console.log("[MODERATION] Utilisateur standard -> Lancement de la vérification Gemini");
    isSafe = await verifyImageContent(buffer, file.type);
  }

  if (!isSafe) {
    console.warn(`[MODERATION] ❌ Image rejetée pour le slot ${slotId}`);
    // Redirection avec erreur ou lancer une erreur pour que le client le sache
    // Comme c'est un serveur action appelé par un form, on peut redirect avec un param error
    redirect(`/success?slotId=${slotId}&error=moderation_failed`);
  } else {
    console.log(`[MODERATION] ✅ Image approuvée !`);
  }

  // 1. RÉCUPÉRATION DU PRIX RÉEL [cite: 22, 92]
  console.log(`[UPLOAD] Recherche du slot ${slotId} en BDD...`);
  // On cherche le prix défini par le créateur pour ce slot précis
  const slot = await prisma.adSlot.findUnique({
    where: { id: slotId },
    select: { price: true }
  });

  if (!slot) {
    console.error("[UPLOAD] ERREUR: Slot introuvable en BDD");
    return;
  }

  // 2. UPLOAD VERS CLOUDINARY [cite: 184, 185]
  console.log("[UPLOAD] Démarrage de l'upload Cloudinary...");
  // On utilise le buffer qu'on a déjà créé
  const uploadResponse: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "slots_ads" }, (error, result) => {
      if (error) {
        console.error("[UPLOAD] ❌ Erreur Cloudinary:", error);
        reject(error);
      }
      resolve(result);
    }).end(buffer);
  });
  console.log("[UPLOAD] ✅ Upload Cloudinary réussi! URL:", uploadResponse.secure_url);

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
