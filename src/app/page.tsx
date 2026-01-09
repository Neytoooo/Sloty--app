import React from 'react';
import { ArrowRight, Calendar, CheckCircle, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7-xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-blue-600">Sponsio</div>
        <div className="hidden md:flex space-x-8 font-medium">
          <a href="#" className="hover:text-blue-600 transition">Comment ça marche ?</a>
          <a href="#" className="hover:text-blue-600 transition">Tarifs</a>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 transition">
          Connexion
        </button>
      </nav>

      {/* --- Hero Section --- */}
      <header className="px-8 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
          Vendez vos sponsorings <br />
          <span className="text-blue-600">en pilote automatique.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          La plateforme tout-en-un pour les créateurs de Newsletters et Podcasts. 
          Gérez vos réservations, vos paiements et vos créas sans envoyer un seul mail.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center">
            Je suis un créateur <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="w-full md:w-auto bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition">
            Voir les démos
          </button>
        </div>
      </header>

      {/* --- Argumentaire (Features) --- */}
      <section className="bg-slate-50 py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
              <Calendar className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Calendrier Public</h3>
            <p className="text-slate-600">Partagez votre lien et laissez les annonceurs choisir leurs dates disponibles.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
              <Zap className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Paiements Immédiats</h3>
            <p className="text-slate-600">Fini les impayés. L'argent est sécurisé via Stripe avant même la diffusion.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
              <CheckCircle className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Zéro Gestion de Mail</h3>
            <p className="text-slate-600">Recevez directement les visuels et les liens publicitaires sur votre dashboard.</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        © 2026 Sponsio. Tous droits réservés.
      </footer>
    </div>
  );
}