"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * ACTION : Créer un nouveau créneau publicitaire
 */
export async function createAdSlot(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Vous devez être connecté.");
  }

  const email = user.emailAddresses[0].emailAddress;
  
  // Récupération sécurisée des données [cite: 96]
  const price = parseFloat(formData.get("price") as string) || 0;
  const date = new Date(formData.get("date") as string);
  
  // S'assure que displayType n'est jamais null [cite: 97, 114]
  const displayType = (formData.get("displayType") as string) || "Bannière Standard";

  // 1. Synchronisation de l'utilisateur en base [cite: 98]
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

  // 2. Création du créneau lié à l'utilisateur [cite: 99]
  await prisma.adSlot.create({
    data: {
      price: price,
      date: date,
      displayType: displayType,
      creator: {
        connect: { id: dbUser.id }
      }
    },
  });

  revalidatePath("/dashboard");
}

/**
 * ACTION : Supprimer un créneau publicitaire
 */
export async function deleteAdSlot(slotId: string) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    throw new Error("Vous devez être connecté pour supprimer un créneau.");
  }

  // 1. On récupère le slot pour vérifier qu'il appartient bien à l'utilisateur [cite: 103, 117]
  const slot = await prisma.adSlot.findUnique({
    where: { id: slotId },
    include: { creator: true }
  });

  // Sécurité : on empêche la suppression si l'utilisateur n'est pas le créateur [cite: 104]
  if (!slot || slot.creator.clerkId !== clerkId) {
    throw new Error("Vous n'avez pas l'autorisation de supprimer ce créneau.");
  }

  // 2. Suppression du créneau
  // Note : Grâce à la relation Prisma, le Booking associé sera traité selon ton schéma (Cascade) [cite: 23, 24]
  await prisma.adSlot.delete({
    where: { id: slotId }
  });

  // 3. Mise à jour de l'interface
  revalidatePath("/dashboard");
}