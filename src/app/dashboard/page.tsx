import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdSlot, deleteAdSlot } from "./actions";
import { Plus, Tag, Euro, Calendar, Link as LinkIcon, Code, MousePointer2, ExternalLink, X, Trash2, Home } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ slotId?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slotId: selectedSlotId } = await searchParams;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      adSlots: {
        include: { booking: true },
        orderBy: { date: 'asc' }
      }
    }
  });

  if (dbUser && !dbUser.isAdmin && !dbUser.businessVerified) {
    redirect("/dashboard/setup-business");
  }

  const slots = dbUser?.adSlots || [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/book/${dbUser?.id}`;

  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  const displayRevenue = selectedSlot
    ? (selectedSlot.booking?.amountPaid || 0)
    : slots.reduce((acc, s) => acc + (s.booking?.amountPaid || 0), 0);

  const displayClicks = selectedSlot
    ? (selectedSlot.booking?.clicks || 0)
    : slots.reduce((acc, s) => acc + (s.booking?.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20">
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Sponsio Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:bg-slate-700/50 hover:text-white transition-all text-slate-400"
            >
              <Home size={14} />
              <span>Retour</span>
            </Link>
            <div className="flex items-center gap-4 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <LinkIcon size={14} className="text-blue-400" />
              <span className="truncate max-w-[200px]">{shareUrl}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* --- STATS --- */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
            {selectedSlot ? `Détails : ${selectedSlot.displayType}` : "Statistiques Globales"}
          </h2>
          {selectedSlot && (
            <Link href="/dashboard" className="text-xs flex items-center gap-1 text-blue-400 hover:text-white transition">
              <X size={14} /> Voir le total
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`bg-slate-800/40 border p-8 rounded-[2.5rem] transition-all ${selectedSlot ? 'border-green-500/50' : 'border-slate-700'}`}>
            <div className="flex items-center gap-3 text-green-400 mb-4">
              <Euro size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Argent généré</span>
            </div>
            <p className="text-4xl font-black text-white">{displayRevenue}€</p>
          </div>

          <div className={`bg-slate-800/40 border p-8 rounded-[2.5rem] transition-all ${selectedSlot ? 'border-blue-500/50' : 'border-slate-700'}`}>
            <div className="flex items-center gap-3 text-blue-400 mb-4">
              <MousePointer2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Nombre de clics</span>
            </div>
            <p className="text-4xl font-black text-white">{displayClicks}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <ExternalLink size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Page Publique</span>
            </div>
            <Link href={shareUrl} target="_blank" className="text-xs font-bold text-blue-400 truncate block">
              {shareUrl}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* --- FORMULAIRE --- */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-[2rem]">
              <h2 className="text-lg font-bold mb-6 text-white">Nouveau créneau</h2>
              <form action={createAdSlot} className="space-y-5">
                <input type="date" name="date" required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                <div className="relative">
                  <input type="number" name="price" placeholder="Prix (€)" required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white" />
                  <Euro size={16} className="absolute left-3 top-4 text-slate-500" />
                </div>
                <select name="displayType" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white">
                  <option value="Haut de Newsletter">Haut de Newsletter</option>
                  <option value="Milieu de Newsletter">Milieu de Newsletter</option>
                  <option value="Sponsoring Podcast">Sponsoring Podcast</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                  Publier
                </button>
              </form>
            </div>
          </div>

          {/* --- LISTE --- */}
          <div className="lg:col-span-2 space-y-6">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`group border-2 p-6 rounded-[2rem] transition-all ${selectedSlotId === slot.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <Link href={`/dashboard?slotId=${slot.id}`} scroll={false} className="flex items-center gap-5 flex-1">
                    <div className={`p-3 rounded-2xl ${slot.isBooked ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="font-black text-lg text-white">{new Date(slot.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{slot.displayType}</p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-4">
                    {/* BOUTON SUPPRIMER */}
                    <form action={async () => {
                      "use server";
                      await deleteAdSlot(slot.id);
                    }}>
                      <button className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={20} />
                      </button>
                    </form>

                    <div className="text-right">
                      <p className="text-2xl font-black text-white">{slot.price}€</p>
                      {slot.isBooked && <span className="text-[10px] font-black text-green-500 uppercase">Vendu</span>}
                    </div>
                  </div>
                </div>

                {/* Widget Code (Uniquement si sélectionné) */}
                {selectedSlotId === slot.id && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <Code size={14} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Code Widget</span>
                    </div>
                    <code className="text-[10px] text-slate-400 bg-black/20 p-3 block rounded-xl border border-white/5 truncate">
                      {`<iframe src="${baseUrl}/widget/${slot.id}" width="600" height="200" frameborder="0"></iframe>`}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}