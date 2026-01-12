"use server";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleAssetsUpload(formData: FormData) {
  const file = formData.get("image") as File; 
  const link = formData.get("link") as string;
  const slotId = formData.get("slotId") as string;

  if (!file || !link || !slotId) return;

  // 1. Upload vers Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResponse: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "slots_ads" }, (error, result) => {
      if (error) reject(error);
      resolve(result);
    }).end(buffer);
  });

  // 2. Mise à jour de la BDD selon ton schéma actuel
  // On met à jour l'AdSlot pour marquer qu'il est réservé
  // Et on crée/met à jour le Booking associé
  await prisma.adSlot.update({
    where: { id: slotId },
    data: {
      isBooked: true,
      booking: {
        upsert: {
          create: {
            adImage: uploadResponse.secure_url, // Nom exact dans ton schéma
            adLink: link,                       // Nom exact dans ton schéma
            buyerEmail: "test@example.com",     // Champ obligatoire dans ton schéma
            amountPaid: 0,                      // Champ obligatoire dans ton schéma
          },
          update: {
            adImage: uploadResponse.secure_url,
            adLink: link,
          }
        }
      }
    },
  });

  revalidatePath("/");
  redirect("/dashboard?success=true");
}