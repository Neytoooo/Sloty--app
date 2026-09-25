import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  Euro, 
  MousePointer2, 
  ExternalLink, 
  LayoutDashboard, 
  Settings, 
  Megaphone,
  Link as LinkIcon,
  Search,
  Bell,
  Plus,
  Download,
  CalendarDays,
  ChevronDown,
  TrendingUp,
  Users,
  Home
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import CategoryBoard from "@/components/dashboard/category-board";
import CreateSlotModal from "@/components/dashboard/create-slot-modal";
import RevenueChart from "@/components/dashboard/revenue-chart";
import WalletCard from "@/components/dashboard/wallet-card";
import DashboardClient from "@/components/dashboard/dashboard-client";
import styles from "./dashboard.module.css";

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

  // Formatting helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className={styles.dashboardLayout}>
      
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.sidebarBrand}>
            Sponsio
          </div>
          
          <nav className={styles.sidebarNav}>
            <Link href="/dashboard" className={styles.sidebarLinkActive}>
              <LayoutDashboard size={18} />
              Tableau de bord
              <span className="ml-auto bg-blue-100 text-blue-600 py-0.5 px-2 rounded-md text-xs font-bold">{slots.length}</span>
            </Link>
            <Link href="/explore" className={styles.sidebarLink}>
              <Megaphone size={18} />
              Catalogue Public
            </Link>
            <Link href={shareUrl} target="_blank" className={styles.sidebarLink}>
              <ExternalLink size={18} />
              Ma Page Créateur
            </Link>
            <Link href="#" className={styles.sidebarLink}>
              <Settings size={18} />
              Paramètres
            </Link>
            <Link href="/" className={styles.sidebarLink}>
              <Home size={18} />
              Retour à l'accueil
            </Link>
          </nav>
        </div>
        
        <div className={styles.sidebarFooter}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl text-white mb-6 shadow-xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h4 className="font-bold mb-1">Passer Pro !</h4>
            <p className="text-blue-100 text-xs mb-4">0% de commission sur toutes vos ventes.</p>
            <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg text-sm shadow-sm hover:bg-slate-50 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">K</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <Bell size={18} />
            </button>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className={styles.scrollableContent}>
          
          {/* Draggable Widgets Client */}
          <DashboardClient slots={slots} />

          {/* Board Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-50 mb-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                Vos espaces en vente
              </h2>
              <div className="flex items-center gap-2">
                <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                  <LinkIcon size={14} />
                  Lien public
                </a>
                <CreateSlotModal />
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 rounded-xl min-h-[400px]">
              <CategoryBoard initialSlots={slots} initialCategories={categories} shareUrl={shareUrl} />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}