import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    console.log("DEBUG: Webhook received. Signature:", signature ? "Preset" : "Missing");
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log("DEBUG: Webhook verified. Type:", event.type);
  } catch (err: any) {
    console.error(`DEBUG: Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // GESTION ABONNEMENT
    if (session.mode === "subscription") {
      const userId = session.metadata?.userId;
      const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);

      if (userId) {
        await prisma.subscription.upsert({
          where: { userId: userId },
          create: {
            userId: userId,
            stripeCustomerId: session.customer as string,
            stripePriceId: (stripeSubscription as any).items.data[0].price.id,
            status: "active",
            currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
          },
          update: {
            status: "active",
            currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
          }
        });
      }
    }

    // GESTION RÉSERVATION (Payment classique)
    if (session.mode === "payment") {
      const slotId = session.metadata?.slotId;
      const amountPaid = session.amount_total ? session.amount_total / 100 : 0;
      const buyerEmail = session.customer_details?.email || "inconnu@email.com";

      if (slotId) {
        await prisma.adSlot.update({
          where: { id: slotId },
          data: {
            isBooked: true,
            booking: {
              upsert: {
                create: {
                  amountPaid: amountPaid,
                  buyerEmail: buyerEmail,
                  status: "PENDING",
                  // adImage et adLink sont maintenant optionnels, on les attend via la page success
                },
                update: {
                  amountPaid: amountPaid,
                  buyerEmail: buyerEmail,
                  // On ne touche pas au reste si ça existe déjà
                }
              }
            }
          }
        });
        console.log(`[STRIPE WEBHOOK] Booking created for slot ${slotId} with amount ${amountPaid}€`);
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}