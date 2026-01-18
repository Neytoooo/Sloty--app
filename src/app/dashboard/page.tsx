import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdSlot } from "./actions";
import { Plus, Euro, MousePointer2, ExternalLink, X, Trash2, Home, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import CategoryBoard from "@/components/dashboard/category-board";

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
        orderBy: { order: 'asc' }
      }
    }
  });

  if (dbUser && !dbUser.isAdmin && !dbUser.businessVerified) {
    redirect("/dashboard/setup-business");
  }

  // Fetch Categories for DnD
  const categories = await prisma.category.findMany({
    where: { user: { clerkId: userId } },
    orderBy: { createdAt: 'asc' }
  });

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

                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="title" placeholder="Titre (ex: Youtube)" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                  <input type="date" name="endDate" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                </div>
                <input type="url" name="contentLink" placeholder="Lien du contenu (ex: https://youtube.com/...)" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" />

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

          {/* --- LIST & DRAG AND DROP --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-0">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
                Mes Espaces Publicitaires
              </h2>

              <CategoryBoard initialSlots={slots} initialCategories={categories} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}