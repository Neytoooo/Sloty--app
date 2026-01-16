"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createAdSlot(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Vous devez être connecté.");

  const email = user.emailAddresses[0].emailAddress;
  const price = parseFloat(formData.get("price") as string) || 0;
  const date = new Date(formData.get("date") as string);
  
  // ON GARDE TES OPTIONS EXACTES ICI
  const displayType = (formData.get("displayType") as string) || "Haut de Newsletter";

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

  await prisma.adSlot.create({
    data: {
      price: price,
      date: date,
      displayType: displayType,
      creator: { connect: { id: dbUser.id } }
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteAdSlot(slotId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Non connecté");

  const slot = await prisma.adSlot.findUnique({
    where: { id: slotId },
    include: { creator: true }
  });

  if (!slot || slot.creator.clerkId !== clerkId) throw new Error("Interdit");

  await prisma.adSlot.delete({ where: { id: slotId } });
  revalidatePath("/dashboard");
}

// CETTE ACTION SERA APPELÉE PAR TON BOUTON DANS PRICING
export async function createSubscriptionSession() {
  const { userId } = await auth();
  if (!userId) throw new Error("Non connecté");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: "price_XXXXXXXXXXXXXX", quantity: 1 }],
    metadata: { userId: userId },
    success_url: `${baseUrl}/dashboard?success=subscription`,
    cancel_url: `${baseUrl}/pricing`,
  });

  if (session.url) redirect(session.url);
}