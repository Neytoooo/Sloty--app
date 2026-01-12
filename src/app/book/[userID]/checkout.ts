"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2024-12-18.acacia", // Version stable garantie
});

export async function createCheckoutSession(slotId: string, price: number, displayType: string) {
  // 1. On crée la session de paiement
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Sponsoring : ${displayType}`,
            description: `Réservation pour le créneau du slot #${slotId}`,
          },
          unit_amount: Math.round(price * 100), // Stripe veut des centimes
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?slotId=${slotId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
    metadata: {
      slotId: slotId, // Très important pour savoir quel slot a été payé
    },
  });

  // 2. On redirige l'annonceur vers Stripe
  redirect(session.url!);
}