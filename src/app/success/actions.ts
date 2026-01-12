"use server";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

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
            amountPaid: slot.price,          // On met à jour aussi ici pour corriger les anciens tests à 0€
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