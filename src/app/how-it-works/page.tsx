import React from 'react';
import { MousePointerClick, CreditCard, Layout } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MousePointerClick className="text-blue-600" size={32} />,
      title: "Créez votre inventaire",
      desc: "Définissez vos disponibilités, vos types d'emplacements et vos tarifs fixes directement depuis votre tableau de bord professionnel."
    },
    {
      icon: <Layout className="text-blue-600" size={32} />,
      title: "Intégrez le Widget",
      desc: "Copiez-collez notre iframe légère. Elle alterne automatiquement entre un bouton de réservation et les publicités de vos sponsors."
    },
    {
      icon: <CreditCard className="text-blue-600" size={32} />,
      title: "Paiements Automatisés",
      desc: "Les fonds sont sécurisés via Stripe et envoyés instantanément sur votre compte. Plus de factures ni de relances manuelles."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-24 px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900">Comment ça marche</h1>
        <p className="text-slate-500 text-lg mb-16">L'infrastructure moderne pour la monétisation de votre contenu.</p>
        
        <div className="grid md:grid-cols-3 gap-16">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="bg-slate-50 w-20 h-20 flex items-center justify-center rounded-3xl mb-6 shadow-sm border border-slate-100">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 pt-10 border-t border-slate-100">
          <Link href="/" className="text-blue-600 font-bold hover:text-blue-700 transition">
            ← Retour à la plateforme
          </Link>
        </div>
      </div>
    </div>
  );
}