import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await (headers())).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`❌ Erreur Webhook: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Si le paiement est validé
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // On récupère le slotId qu'on a passé dans les metadata lors du checkout
    const slotId = session.metadata?.slotId;
    const buyerEmail = session.customer_details?.email || "inconnu@test.com";

    if (slotId) {
      try {
        // On effectue les deux opérations en une fois (Transaction)
        await prisma.$transaction([
          // 1. On marque le slot comme vendu pour qu'il disparaisse de la liste publique
          prisma.adSlot.update({
            where: { id: slotId },
            data: { isBooked: true },
          }),
          // 2. On crée l'entrée de réservation avec des placeholders pour l'image
          prisma.booking.create({
            data: {
              slotId: slotId,
              buyerEmail: buyerEmail,
              amountPaid: session.amount_total ? session.amount_total / 100 : 0,
              adImage: "https://via.placeholder.com/600x200?text=En+attente+du+visuel",
              adLink: "#",
            },
          }),
        ]);
        
        console.log(`✅ Succès : Slot ${slotId} réservé et Booking créé.`);
      } catch (dbError) {
        console.error("❌ Erreur Base de données lors du webhook:", dbError);
        return new NextResponse("Database Error", { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}