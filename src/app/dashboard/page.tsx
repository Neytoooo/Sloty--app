import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdSlot } from "./actions";
import { Plus, Tag, Euro, Calendar, Link as LinkIcon, Code } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const slots = await prisma.adSlot.findMany({
    where: { creatorId: userId },
    orderBy: { date: 'asc' }
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/book/${userId}`;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
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
          
          {/* --- Formulaire de création --- */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-6 text-blue-400">
                <Plus size={20} />
                <h2 className="text-lg font-semibold text-slate-200">Nouveau créneau</h2>
              </div>

              <form action={createAdSlot} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Date de diffusion</label>
                  <input type="date" name="date" required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Prix du sponsoring (€)</label>
                  <div className="relative">
                    <input type="number" name="price" placeholder="0.00" required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition text-white" />
                    <Euro size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Type d'emplacement</label>
                  <div className="relative text-slate-400">
                    <select name="type" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition">
                      <option value="Haut de Newsletter">Haut de Newsletter</option>
                      <option value="Milieu de Newsletter">Milieu de Newsletter</option>
                      <option value="Sponsoring Podcast">Sponsoring Podcast</option>
                    </select>
                    <Tag size={16} className="absolute left-3 top-3.5 text-slate-500" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                  Mettre en vente
                </button>
              </form>
            </div>
          </div>

          {/* --- Liste des créneaux + Codes Widgets --- */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-400 italic text-sm uppercase tracking-widest">
              Vos créneaux actifs ({slots.length})
            </h2>
            <div className="grid gap-6">
              {slots.map((slot) => (
                <div key={slot.id} className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl border-l-4 border-l-blue-500 shadow-sm transition hover:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-5">
                      <Calendar size={24} className="text-slate-500" />
                      <div>
                        <p className="font-bold text-lg">{new Date(slot.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm text-slate-500">{slot.displayType}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-blue-400">{slot.price}€</p>
                  </div>

                  {/* Bloc Iframe pour le Widget Dynamique */}
                  <div className="mt-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                      <Code size={14} />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Intégrer le Widget</span>
                    </div>
                    <code className="text-[11px] text-slate-300 break-all bg-black/30 p-2 block rounded border border-white/5 select-all">
                      {`<iframe src="${baseUrl}/widget/${slot.id}" width="600" height="200" frameborder="0"></iframe>`}
                    </code>
                    <p className="text-[9px] text-slate-500 mt-2">
                      Copiez ce code pour afficher la publicité (ou l'appel à l'achat) sur votre site.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}