import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Check, ArrowRight, Tag, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { createCheckoutSession } from "./checkout";

export default async function PublicBookingPage(props: { 
  params: Promise<{ userID: string }> 
}) {
  const { userID } = await props.params;

  if (!userID) return notFound();

  // Récupère les créneaux
  const slots = await prisma.adSlot.findMany({
    where: { creatorId: userID },
    orderBy: { date: 'asc' },
    include: { booking: true }
  });

  const creator = await prisma.user.findUnique({
    where: { id: userID }
  });

  if (!creator) return notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      {/* --- Hero Section --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} />
            Disponible pour sponsorings
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 leading-tight">
            Propulsez votre marque avec <br />
            <span className="text-blue-600">@{creator.email.split('@')[0]}</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Sélectionnez un créneau disponible ci-dessous pour toucher une audience engagée et qualifiée.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-8">
        {/* --- Statistiques Rapides / Filtre visuel --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Disponibles</p>
             <p className="text-2xl font-black text-slate-900">{slots.filter(s => !s.isBooked).length} créneaux</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hidden md:block">
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Audience</p>
             <p className="text-2xl font-black text-slate-900">Vérifiée</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-200">
             <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Support</p>
             <p className="text-2xl font-black text-white">Direct</p>
          </div>
        </div>

        {/* --- Liste des Slots --- */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <CalendarIcon size={22} className="text-blue-600" /> 
            Prochains créneaux de diffusion
          </h2>

          {slots.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
              <p className="text-slate-400 font-medium italic">Aucun créneau n'est listé pour le moment.</p>
            </div>
          ) : (
            slots.map((slot) => (
              <div 
                key={slot.id} 
                className={`group relative overflow-hidden bg-white border ${
                  slot.isBooked ? 'border-slate-100 opacity-60' : 'border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl'
                } p-6 md:p-8 rounded-[2rem] transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Date & Info */}
                  <div className="flex items-center gap-6">
                    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border ${
                      slot.isBooked ? 'bg-slate-50 border-slate-100' : 'bg-blue-50 border-blue-100'
                    }`}>
                      <span className="text-[10px] font-black uppercase text-blue-600">
                        {new Date(slot.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                      <span className="text-3xl font-black text-slate-900">
                        {new Date(slot.date).toLocaleDateString('fr-FR', { day: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xl md:text-2xl text-slate-900 capitalize leading-tight">
                        {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                          <Tag size={12} />
                          {slot.displayType}
                        </span>
                        {slot.isBooked ? (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Indisponible</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase tracking-tighter">
                            <Check size={14} /> En ligne
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prix & Action */}
                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="md:text-right mb-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tarif fixe</p>
                      <p className="text-4xl font-black text-slate-900 leading-none">{slot.price}€</p>
                    </div>
                    
                    {!slot.isBooked && (
                      <form action={async () => { "use server"; await createCheckoutSession(slot.id, slot.price, slot.displayType); }}>
                        <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg active:scale-95">
                          Réserver <ArrowRight size={20} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Trust Badge --- */}
        <div className="mt-16 text-center opacity-50">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
             Paiement sécurisé par <span className="text-slate-900">Stripe</span>
           </p>
        </div>
      </main>
    </div>
  );
}