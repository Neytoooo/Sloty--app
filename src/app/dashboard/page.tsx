import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdSlot } from "./actions";
import { Plus, Euro, MousePointer2, ExternalLink, X, Trash2, Home, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import CategoryBoard from "@/components/dashboard/category-board";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>
            Sponsio Dashboard
          </h1>
          <div className={styles.headerActions}>
            <Link
              href="/"
              className={styles.backButton}
            >
              <Home size={14} />
              <span>Retour</span>
            </Link>
            <div className={styles.shareContainer}>
              <LinkIcon size={14} className={styles.shareIcon} />
              <span className={styles.shareText}>{shareUrl}</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>

        {/* --- STATS --- */}
        <div className={styles.statsHeader}>
          <h2 className={styles.statsTitle}>
            {selectedSlot ? `Détails : ${selectedSlot.displayType}` : "Statistiques Globales"}
          </h2>
          {selectedSlot && (
            <Link href="/dashboard" className={styles.viewAllLink}>
              <X size={14} /> Voir le total
            </Link>
          )}
        </div>

        <div className={styles.statsGrid}>
          <div className={cx(styles.statCardBase, selectedSlot ? styles.borderGreen : styles.borderDefault)}>
            <div className={styles.statIconWrapperGreen}>
              <Euro size={20} />
              <span className={styles.statLabel}>Argent généré</span>
            </div>
            <p className={styles.statValue}>{displayRevenue}€</p>
          </div>

          <div className={cx(styles.statCardBase, selectedSlot ? styles.borderBlue : styles.borderDefault)}>
            <div className={styles.statIconWrapperBlue}>
              <MousePointer2 size={20} />
              <span className={styles.statLabel}>Nombre de clics</span>
            </div>
            <p className={styles.statValue}>{displayClicks}</p>
          </div>

          <div className={cx(styles.statCardBase, styles.borderDefault)}>
            <div className={styles.statIconWrapperDefault}>
              <ExternalLink size={20} />
              <span className={styles.statLabel}>Page Publique</span>
            </div>
            <Link href={shareUrl} target="_blank" className={styles.publicPageLink}>
              {shareUrl}
            </Link>
          </div>
        </div>

        <div className={styles.contentGrid}>

          {/* --- FORMULAIRE --- */}
          <div className={styles.formColumn}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Nouveau créneau</h2>
              <form action={createAdSlot} className={styles.formStack}>
                <input type="date" name="date" required className={styles.input} />
                <div className={styles.inputWithIconWrapper}>
                  <input type="number" name="price" placeholder="Prix (€)" required className={styles.inputWithIcon} />
                  <Euro size={16} className={styles.inputIcon} />
                </div>

                <div className={styles.dateGrid}>
                  <input type="text" name="title" placeholder="Titre (ex: Youtube)" className={styles.input} />
                  <input type="date" name="endDate" className={styles.input} />
                </div>
                <input type="url" name="contentLink" placeholder="Lien du contenu (ex: https://youtube.com/...)" className={styles.input} />

                <select name="displayType" className={styles.input}>
                  <option value="Haut de Newsletter">Haut de Newsletter</option>
                  <option value="Milieu de Newsletter">Milieu de Newsletter</option>
                  <option value="Sponsoring Podcast">Sponsoring Podcast</option>
                </select>
                <button type="submit" className={styles.submitButton}>
                  Publier
                </button>
              </form>
            </div>
          </div>

          {/* --- LIST & DRAG AND DROP --- */}
          <div className={styles.listColumn}>
            <div className={styles.slotsHeader}>
              <h2 className={styles.slotsTitle}>
                <span className={styles.titleIndicator}></span>
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