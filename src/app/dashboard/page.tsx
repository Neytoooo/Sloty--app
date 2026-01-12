import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CalendarDays, Check, ArrowRight, Tag } from "lucide-react";

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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* --- Header --- */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Sponsio Dashboard
          </h1>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                <LinkIcon size={14} className="text-blue-400" />
                <span className="text-xs font-medium truncate max-w-[200px]">{shareUrl}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- Colonne Gauche : Formulaire --- */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                  <Plus size={20} />
                </div>
                <h2 className="text-lg font-semibold">Nouveau créneau</h2>
              </div>

              <form action={createAdSlot} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Date de diffusion</label>
                  <input 
                    type="date" 
                    name="date" 
                    required 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Prix du sponsoring (€)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="price" 
                      placeholder="0.00"
                      required 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    <Euro size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Type d'emplacement</label>
                  <div className="relative">
                    <select 
                      name="type" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="Haut de Newsletter">Haut de Newsletter</option>
                      <option value="Milieu de Newsletter">Milieu de Newsletter</option>
                      <option value="Sponsoring Podcast">Sponsoring Podcast</option>
                      <option value="Post Réseaux Sociaux">Post Réseaux Sociaux</option>
                    </select>
                    <Tag size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  Mettre en vente
                </button>
              </form>
            </div>
          </div>

          {/* --- Colonne Droite : Liste des slots --- */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              Vos créneaux actifs
              <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full border border-slate-700">
                {slots.length}
              </span>
            </h2>

            <div className="grid gap-4">
              {slots.length === 0 ? (
                <div className="border-2 border-dashed border-slate-800 rounded-2xl py-20 text-center">
                  <p className="text-slate-500">Aucun créneau créé pour le moment.</p>
                </div>
              ) : (
                slots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className="group bg-slate-800/30 border border-slate-700 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-800/50 transition-all border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-slate-900 p-3 rounded-xl text-slate-400">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          {new Date(slot.date).toLocaleDateString('fr-FR', { 
                            day: 'numeric', month: 'long', year: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          <Tag size={14} /> {slot.displayType}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-400">{slot.price}€</p>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Disponible</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}