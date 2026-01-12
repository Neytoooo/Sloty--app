import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CalendarDays, Check, ArrowRight, Tag } from "lucide-react";
import { createCheckoutSession } from "./checkout";

export default async function PublicBookingPage(props: { 
  params: Promise<{ userId?: string; userID?: string; id?: string }> 
}) {
  
  // On attend la résolution des paramètres
  const resolvedParams = await props.params;
  
  // On récupère l'ID peu importe comment le dossier est nommé
  const id = resolvedParams.userId || resolvedParams.userID || resolvedParams.id;

  // LOG DE DEBUG : Regarde ton terminal VS Code après avoir rafraîchi la page
  console.log("ID récupéré depuis l'URL :", id);

  if (!id) {
    console.error("ERREUR : Aucun ID trouvé dans params", resolvedParams);
    return notFound();
  }

  // 1. On récupère les créneaux
  const slots = await prisma.adSlot.findMany({
    where: { creatorId: id },
    orderBy: { date: 'asc' }
  });

  // 2. On récupère le créateur
  const creator = await prisma.user.findUnique({
    where: { id: id }
  });

  if (!creator) {
    console.error("ERREUR : Utilisateur non trouvé dans la base pour l'ID :", id);
    return notFound();
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* --- Header / Hero --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            Réservation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Réservez votre prochain <span className="text-blue-600">sponsoring</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Sélectionnez une date disponible ci-dessous pour promouvoir votre marque auprès de l'audience de <span className="font-semibold text-slate-900">{creator.email.split('@')[0]}</span>.
          </p>
        </div>
      </div>

      {/* --- Liste des créneaux --- */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid gap-6">
          {slots.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <CalendarDays className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">Aucun créneau disponible pour le moment.</p>
              <p className="text-sm text-slate-400">Revenez plus tard ou contactez le créateur.</p>
            </div>
          ) : (
            slots.map((slot) => (
              <div 
                key={slot.id} 
                className="group bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
              >
                <form action={async () => {
  "use server";
  await createCheckoutSession(slot.id, slot.price, slot.displayType);
}}>
  <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg">
    Réserver <ArrowRight size={18} />
  </button>
</form>
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  {/* Badge Date */}
                  <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl w-20 h-20 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(slot.date).toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {new Date(slot.date).toLocaleDateString('fr-FR', { day: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-slate-900 capitalize">
                      {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <Tag size={14} />
                        {slot.displayType}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <Check size={16} /> Disponible
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-400 font-medium">Tarif fixe</p>
                    <p className="text-3xl font-black text-slate-900">{slot.price}€</p>
                  </div>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transform hover:scale-105 transition-all active:scale-95 shadow-lg shadow-slate-200">
                    Réserver <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Footer / Trust --- */}
        <footer className="mt-16 text-center border-t border-slate-200 pt-8">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            Paiement sécurisé par <span className="font-bold text-slate-600">Stripe</span>
          </p>
        </footer>
      </main>
    </div>
  );
}