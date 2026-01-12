"use server";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleAssetsUpload(formData: FormData) {
  const file = formData.get("adImage") as File;
  const adLink = formData.get("adLink") as string;
  const slotId = formData.get("slotId") as string;

  if (!file || !adLink || !slotId) return;

  // 1. Convertir le fichier pour Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResponse: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "slots_ads" }, (error, result) => {
      if (error) reject(error);
      resolve(result);
    }).end(buffer);
  });

  // 2. Mettre à jour le Booking dans la DB
  await prisma.booking.update({
    where: { slotId: slotId },
    data: {
      adImage: uploadResponse.secure_url,
      adLink: adLink,
    },
  });

  redirect("/dashboard?success=true");
}