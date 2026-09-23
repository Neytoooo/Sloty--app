import React from 'react';
import { Zap, Percent, ShieldCheck, Lock, CreditCard, HelpCircle, ArrowLeft } from 'lucide-react';
import { syncSubscription } from "@/lib/subscription";
import { createSubscriptionSession } from './actions';
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ConfettiSideCannons } from "@/components/confetti-side-cannons";
import { PricingCard } from "@/components/pricing-card";
import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Background3D from "@/components/background-3d";
import styles from "../home.module.css"; // Reuse home styles for consistency

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
      isFree: true
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
      button: isPro ? "Plan Actif" : "Passer au Plan Pro",
      highlight: true,
      icon: <Zap className="text-yellow-500" />,
      action: createSubscriptionSession,
      isSubscribed: isPro
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans pb-24 relative overflow-hidden">
      <Background3D />
      {showConfetti && <ConfettiSideCannons />}

      <div className="pt-6 px-8 relative z-10">
        <nav className={styles.nav}>
          <div className={styles.brand}>Sponsio</div>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Accueil</Link>
            <Link href="/explore" className="text-blue-600 font-black">Explorer le Catalogue</Link>
          </div>
          <div className={styles.authContainer}>
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className={styles.signInButton}>Connexion</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className={styles.dashboardLink}>Mon Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full font-bold text-sm mb-6 shadow-sm backdrop-blur-sm">
            ✨ Simple et transparent
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Tarification <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">flexible.</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Choisissez le modèle qui vous convient : payez uniquement quand vous vendez, ou passez sur un abonnement fixe pour maximiser vos revenus.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center mb-16 relative z-10">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-8 md:p-12 shadow-sm mb-24 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">100% Sécurisé</h4>
              <p className="text-sm text-slate-500">Vos données et celles de vos annonceurs sont cryptées de bout en bout.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <CreditCard size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Paiement via Stripe</h4>
              <p className="text-sm text-slate-500">L'infrastructure de paiement la plus fiable au monde. Aucun frais caché.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Lock size={24} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Sans engagement</h4>
              <p className="text-sm text-slate-500">L'abonnement Pro est annulable à tout moment en un seul clic.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Questions fréquentes</h2>
            <p className="text-slate-500">Tout ce que vous devez savoir sur la facturation Sponsio.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="text-blue-500" size={20} /> Puis-je changer de forfait plus tard ?
              </h3>
              <p className="text-slate-600">Bien sûr ! Vous pouvez commencer avec le forfait gratuit et passer au plan Pro dès que le volume de vos ventes justifie d'économiser sur les 10% de commission.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="text-blue-500" size={20} /> Comment fonctionne la commission de 10% ?
              </h3>
              <p className="text-slate-600">Sur le plan Liberté, lorsqu'un annonceur achète un créneau à 100€, vous recevez 90€ directement sur votre compte bancaire. Les 10€ sont automatiquement prélevés pour faire fonctionner Sponsio.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="text-blue-500" size={20} /> Quand est-ce que je reçois mon argent ?
              </h3>
              <p className="text-slate-600">Les fonds sont encaissés dès que l'annonceur réserve et valide son paiement. Selon votre banque, l'argent arrive sur votre compte sous 2 à 5 jours ouvrés via Stripe Connect.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
