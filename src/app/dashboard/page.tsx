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
  Link as LinkIcon 
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import CategoryBoard from "@/components/dashboard/category-board";
import CreateSlotModal from "@/components/dashboard/create-slot-modal";
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

  return (
    <div className={styles.dashboardLayout}>
      
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.sidebarBrand}>Sponsio</div>
          <nav className={styles.sidebarNav}>
            <Link href="/dashboard" className={styles.sidebarLinkActive}>
              <LayoutDashboard size={18} />
              Tableau de bord
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
          </nav>
        </div>
        
        <div className={styles.sidebarFooter}>
          <UserButton showName />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        
        {/* Topbar */}
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>
            {selectedSlot ? `Détails : ${selectedSlot.displayType}` : "Aperçu général"}
          </h1>
          <div className={styles.topbarActions}>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className={styles.shareContainer}>
              <LinkIcon size={14} className={styles.shareIcon} />
              <span className={styles.shareText}>Lien de réservation</span>
            </a>
            <CreateSlotModal />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className={styles.scrollableContent}>
          
          {/* Bento Grid Stats */}
          <div className={styles.bentoGrid}>
            
            {/* Primary Stat (Revenue) */}
            <div className={`${styles.bentoCard} ${styles.bentoCardPrimary}`}>
              <div>
                <div className={`${styles.bentoIconWrapper} ${styles.bentoIconPrimary}`}>
                  <Euro size={24} />
                </div>
                <h3 className={`${styles.bentoLabel} ${styles.bentoLabelPrimary}`}>Revenus générés</h3>
                <p className={`${styles.bentoValue} ${styles.bentoValuePrimary}`}>{displayRevenue} €</p>
              </div>
              <div className={styles.bentoDecoration}></div>
            </div>

            {/* Secondary Stat (Clicks) */}
            <div className={styles.bentoCard}>
              <div>
                <div className={`${styles.bentoIconWrapper} ${styles.bentoIconSecondary}`}>
                  <MousePointer2 size={24} />
                </div>
                <h3 className={styles.bentoLabel}>Clics totaux</h3>
                <p className={`${styles.bentoValue} ${styles.bentoValueSecondary}`}>{displayClicks}</p>
              </div>
            </div>

            {/* Third Stat (Active Slots) */}
            <div className={styles.bentoCard}>
              <div>
                <div className={`${styles.bentoIconWrapper} ${styles.bentoIconSecondary}`}>
                  <LayoutDashboard size={24} />
                </div>
                <h3 className={styles.bentoLabel}>Créneaux Actifs</h3>
                <p className={`${styles.bentoValue} ${styles.bentoValueSecondary}`}>
                  {slots.filter(s => !s.isBooked).length} <span className="text-lg text-slate-400 font-medium">/ {slots.length}</span>
                </p>
              </div>
            </div>

          </div>

          {/* Kanban Board */}
          <div className={styles.boardSection}>
            <div className={styles.boardHeader}>
              <h2 className={styles.boardTitle}>
                <span className={styles.titleIndicator}></span>
                Gestion des Espaces
              </h2>
            </div>
            
            <CategoryBoard initialSlots={slots} initialCategories={categories} />
          </div>

        </main>
      </div>
    </div>
  );
}