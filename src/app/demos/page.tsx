import React from 'react';
import { Layout, Mail, Mic, ArrowRight, CheckCircle, XCircle, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DemosPage() {
  const demoCases = [
    {
      title: "Blog & Site Web",
      icon: <Layout className="text-blue-600" />,
      description: "Une bannière élégante qui s'intègre parfaitement dans vos articles de blog.",
      previewColor: "bg-slate-50",
      type: "Bannière 728x90"
    },
    {
      title: "Newsletter",
      icon: <Mail className="text-blue-600" />,
      description: "L'emplacement idéal en haut de vos emails pour un taux de clic maximal.",
      previewColor: "bg-blue-50",
      type: "En-tête Newsletter"
    },
    {
      title: "Podcast",
      icon: <Mic className="text-blue-600" />,
      description: "Affichez le sponsor de votre épisode actuel de manière visuelle sur votre site.",
      previewColor: "bg-purple-50",
      type: "Carte Podcast"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-24 px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Exemples d'intégration
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Découvrez comment nos widgets transforment votre audience en revenus publicitaires automatisés.
          </p>
        </div>

        {/* --- Grille de Démos --- */}
        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {demoCases.map((demo, i) => (
            <div key={i} className="group border border-slate-200 rounded-[2.5rem] p-8 hover:border-blue-500 transition-all hover:shadow-xl bg-white">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                {demo.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{demo.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{demo.description}</p>

              <div className={`w-full aspect-video ${demo.previewColor} rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Aperçu Widget</span>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-800 tracking-tight">Votre pub ici</p>
                  <p className="text-[10px] text-blue-600 font-bold italic">Réserver (50€)</p>
                </div>
                <span className="mt-4 text-[10px] font-medium text-slate-400">{demo.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* --- Section Statistiques (Preuve de Performance) --- */}
        <section className="grid md:grid-cols-3 gap-8 border-y border-slate-100 py-16 mb-24">
          <div className="text-center">
            <p className="text-5xl font-black text-blue-600 mb-2">+4.2%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Taux de clic (CTR) moyen</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-5xl font-black text-blue-600 mb-2">&lt; 2 min</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Temps de configuration</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-black text-blue-600 mb-2">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Automatisé (Zéro Email)</p>
          </div>
        </section>

        {/* --- Comparatif Avant / Après --- */}
        <section className="mb-24">
          <h2 className="text-3xl font-black text-center mb-12 text-slate-900">Pourquoi passer à Sponsio ?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
              <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
                <XCircle className="text-red-500" /> Gestion Manuelle
              </h4>
              <ul className="space-y-4 text-slate-600 text-sm">
                <li className="flex items-center gap-2">❌ 15 échanges de mails par vente</li>
                <li className="flex items-center gap-2">❌ Relances incessantes pour le paiement</li>
                <li className="flex items-center gap-2">❌ Récupération manuelle des visuels</li>
                <li className="flex items-center gap-2">❌ Mise à jour manuelle du code site</li>
              </ul>
            </div>
            <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
              <h4 className="font-bold mb-6 flex items-center gap-2 text-white">
                <CheckCircle className="text-blue-200" /> Avec Sponsio
              </h4>
              <ul className="space-y-4 text-blue-100 text-sm">
                <li className="flex items-center gap-2 font-medium">✅ L'annonceur réserve en autonomie</li>
                <li className="flex items-center gap-2 font-medium">✅ Paiement sécurisé immédiat via Stripe</li>
                <li className="flex items-center gap-2 font-medium">✅ Upload direct des créas par le client</li>
                <li className="flex items-center gap-2 font-medium">✅ Le widget se met à jour en temps réel</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- Section Expérience Annonceur --- */}
        <div className="flex flex-col lg:flex-row items-center gap-16 bg-slate-950 rounded-[3.5rem] p-12 lg:p-20 text-white mb-24">
          <div className="flex-1">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold mb-6 leading-tight">
              Une expérience premium pour vos annonceurs
            </h3>
            <p className="text-slate-400 text-lg mb-8">
              Vos sponsors accèdent à une interface dédiée pour suivre leurs performances (clics et impressions) en temps réel. Donnez-leur des résultats, ils reviendront. 
            </p>
            <div className="flex items-center gap-4 text-blue-400 font-bold">
              <Zap size={20} /> Inclus dans le plan Pro
            </div>
          </div>
          <div className="flex-1 w-full bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <div className="h-4 w-24 bg-slate-800 rounded"></div>
                <div className="h-8 w-8 bg-blue-600/20 rounded-full border border-blue-500/30"></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                  <span className="block text-2xl font-black text-white">2,480</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Impressions</span>
               </div>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                  <span className="block text-2xl font-black text-green-400">142</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Clics (5.7%)</span>
               </div>
             </div>
             <div className="mt-4 h-20 w-full bg-gradient-to-t from-blue-600/10 to-transparent rounded-xl border-b border-blue-500/20"></div>
          </div>
        </div>

        {/* --- CTA Final --- */}
        <div className="text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-200 transform hover:-translate-y-1">
            Commencer à vendre <ArrowRight size={24} />
          </Link>
          <p className="mt-6 text-slate-400 font-medium">Aucune carte de crédit requise pour débuter.</p>
        </div>
      </div>
    </div>
  );
}