import React from 'react';
import { Check, Zap, Percent } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
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
      icon: <Percent className="text-blue-600" />
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
      button: "Passer au Plan Pro",
      highlight: true,
      icon: <Zap className="text-yellow-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Tarification flexible</h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Choisissez le modèle qui vous convient : payez uniquement quand vous vendez, ou passez sur un abonnement fixe.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center">
          {plans.map((plan, i) => (
            <div key={i} className={`relative p-10 rounded-[2.5rem] border-2 transition-all ${
              plan.highlight 
                ? 'bg-slate-900 text-white border-blue-600 shadow-2xl scale-105 z-10' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-slate-300'
            }`}>
              
              <div className={`mb-6 w-12 h-12 rounded-2xl flex items-center justify-center ${
                plan.highlight ? 'bg-slate-800' : 'bg-blue-50'
              }`}>
                {plan.icon}
              </div>

              <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h3>
              <p className={`text-sm mb-8 font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                {plan.description}
              </p>
              
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black tracking-tighter">{plan.price}€</span>
                <span className={`font-bold ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>/mois</span>
              </div>

              <ul className="space-y-5 mb-12">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-semibold">
                    <Check size={18} className="text-blue-500 flex-shrink-0" strokeWidth={3} /> 
                    <span className={plan.highlight ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 ${
                plan.highlight 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
              }`}>
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-20 text-slate-500 text-sm font-medium italic">
          Tous les paiements sont sécurisés par Stripe. Aucun frais caché.
        </p>
      </div>
    </div>
  );
}