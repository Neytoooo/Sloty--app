import React from 'react';
import { Zap, Percent } from 'lucide-react';
import { syncSubscription } from "@/lib/subscription";
import { createSubscriptionSession } from './actions';
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ConfettiSideCannons } from "@/components/confetti-side-cannons";
import { PricingCard } from "@/components/pricing-card";

export default async function Pricing(props: {
  searchParams: Promise<{ success?: string, canceled?: string, session_id?: string }>
}) {
  const searchParams = await props.searchParams;
  const showConfetti = searchParams.success === 'true';

  if (searchParams.session_id) {
    try {
      await syncSubscription(searchParams.session_id);
    } catch (e) {
      console.error("Error syncing subscription:", e);
    }
  }

  const user = await currentUser();
  let isPro = false;

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { subscription: true }
    });

    // On considère qu'il est pro si le statut est 'active'
    console.log("DEBUG: Checking subscription for user", user.id);
    console.log("DEBUG: DB User found:", dbUser ? "Yes" : "No");
    console.log("DEBUG: Subscription status:", dbUser?.subscription?.status);

    if (dbUser?.subscription?.status === 'active') {
      isPro = true;
    }
  }

  const plans = [
    {
      name: "Liberté (Commission)",
      price: "0",
      description: "Idéal pour débuter sans aucun risque financier.",
      features: [
        "Accès complet au Dashboard",
        "Widgets illimités",
        "Commission de 10% par vente",
        "Paiements via Stripe"
      ],
      button: "Commencer gratuitement",
      highlight: false,
      icon: <Percent className="text-blue-600" />,
      link: "/dashboard",
      isFree: true // Flag pour identifier le plan gratuit
    },
    {
      name: "Abonnement Pro",
      price: "29",
      description: "Pour les créateurs avec un volume régulier.",
      features: [
        "0% de commission sur vos ventes",
        "Statistiques détaillées (clics/vues)",
        "Support prioritaire",
        "Personnalisation avancée du Widget"
      ],
      // Si pro, on change le texte et l'état
      button: isPro ? "Plan Actif" : "Passer au Plan Pro",
      highlight: true,
      icon: <Zap className="text-yellow-500" />,
      action: createSubscriptionSession,
      isSubscribed: isPro
    }
  ];

  return (
    <div className="min-h-screen bg-white py-24 px-8">
      {showConfetti && <ConfettiSideCannons />}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Tarification flexible</h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Choisissez le modèle qui vous convient : payez uniquement quand vous vendez, ou passez sur un abonnement fixe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} />
          ))}
        </div>

        <p className="text-center mt-20 text-slate-500 text-sm font-medium italic">
          Tous les paiements sont sécurisés par Stripe. Aucun frais caché.
        </p>
      </div>
    </div>
  );
}
