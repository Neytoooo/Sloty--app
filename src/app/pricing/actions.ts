"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // @ts-ignore
    apiVersion: "2025-01-27.acacia", // Utilisation de la version définie précédemment ou compatible
    typescript: true,
});

export async function createSubscriptionSession() {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
        redirect("/sign-in");
    }

    // Récupérer l'utilisateur BDD
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });

    if (!dbUser) {
        // Cas rare : utilisateur connecté Clerk mais pas en BDD -> redirection ou erreur
        throw new Error("User not found in database");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: "Abonnement Pro",
                        description: "Accès complet aux fonctionnalités Pro",
                    },
                    unit_amount: 2900, // 29.00€
                    recurring: {
                        interval: "month",
                    },
                },
            },
        ],
        metadata: {
            userId: dbUser.id,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
    });

    if (session.url) {
        redirect(session.url);
    }
}
