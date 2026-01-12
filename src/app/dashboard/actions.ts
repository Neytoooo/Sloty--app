"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAdSlot(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser(); // On récupère les infos complètes de l'utilisateur
  
  if (!userId || !user) throw new Error("Vous devez être connecté");

  const dateValue = formData.get("date") as string;
  const price = formData.get("price") as string;
  const displayType = formData.get("type") as string;

  if (!dateValue || !price) return;

  // L'email principal de ton compte Clerk
  const email = user.emailAddresses[0].emailAddress;

  // 1. On crée/met à jour l'utilisateur avec son email
  await prisma.user.upsert({
    where: { id: userId },
    update: { email: email }, // On met à jour l'email au cas où il change
    create: { 
      id: userId,
      email: email 
    },
  });

  // 2. On crée le créneau
  await prisma.adSlot.create({
    data: {
      date: new Date(dateValue).toISOString(),
      price: parseFloat(price),
      displayType: displayType,
      creatorId: userId,
    },
  });

  revalidatePath("/dashboard");
}