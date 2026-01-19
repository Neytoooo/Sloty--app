import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function syncSubscription(sessionId: string) {
    console.log(`Syncing subscription for session: ${sessionId}`);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode === "subscription" && session.subscription) {
        const userId = session.metadata?.userId;
        if (!userId) {
            console.error("No userId in session metadata");
            return;
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // Get the price ID safely
        const priceId = stripeSubscription.items.data[0]?.price.id;

        if (!priceId) {
            console.error("No price ID found in subscription");
            return;
        }

        await prisma.subscription.upsert({
            where: { userId: userId },
            create: {
                userId: userId,
                stripeCustomerId: session.customer as string,
                stripePriceId: priceId,
                status: stripeSubscription.status,
                currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
            },
            update: {
                status: stripeSubscription.status,
                currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
            }
        });
        console.log(`Subscription synced for user ${userId}`);
    }
}
