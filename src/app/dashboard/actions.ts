"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAdSlot(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Vous devez être connecté.");
  }

  const email = user.emailAddresses[0].emailAddress;
  
  // Récupération sécurisée des données
  const price = parseFloat(formData.get("price") as string) || 0;
  const date = new Date(formData.get("date") as string);
  
  // Correction ici : On s'assure que displayType n'est jamais null
  const displayType = (formData.get("displayType") as string) || "Bannière Standard";

  // 1. Synchronisation de l'utilisateur
  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email: email },
    create: {
      clerkId: userId,
      email: email,
      isAdmin: false,
      businessVerified: false,
    },
  });

  // 2. Création du créneau
  await prisma.adSlot.create({
    data: {
      price: price,
      date: date,
      displayType: displayType, // On envoie la valeur nettoyée
      creator: {
        connect: { id: dbUser.id }
      }
    },
  });

  revalidatePath("/dashboard");
}