import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import styles from "./admin.module.css";
import {
  Users,
  BarChart3,
  ShoppingCart,
  MousePointer2,
  LayoutDashboard,
  CreditCard,
  Megaphone,
  Settings,
  Search,
  Download,
  ChevronDown,
} from "lucide-react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default async function AdminDashboard() {
  const { userId } = await auth();

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId as string } });
  if (!dbUser?.isAdmin) redirect("/dashboard");

  const totalUsers = await prisma.user.count();
  const totalRevenue = await prisma.booking.aggregate({ _sum: { amountPaid: true } });
  const totalClicks = await prisma.booking.aggregate({ _sum: { clicks: true } });
  const totalSales = await prisma.adSlot.count({ where: { isBooked: true } });

  const stats = [
    {
      label: "Utilisateurs",
      value: totalUsers,
      icon: <Users className="h-5 w-5 text-blue-400" />,
      pill: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "C.A. Global",
      value: `${totalRevenue._sum.amountPaid || 0}€`,
      icon: <BarChart3 className="h-5 w-5 text-emerald-400" />,
      pill: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Ventes",
      value: totalSales,
      icon: <ShoppingCart className="h-5 w-5 text-violet-400" />,
      pill: "bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Clics Réseau",
      value: totalClicks._sum.clicks || 0,
      icon: <MousePointer2 className="h-5 w-5 text-amber-400" />,
      pill: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  // Optionnel (demo UI) : tu remplaceras par prisma.booking.findMany() plus tard
  const lastTransactions = [
    { buyer: "test-buyer@example.com", amount: "49.00€", status: "validé", date: "Aujourd’hui" },
    { buyer: "agency@sample.io", amount: "199.00€", status: "en attente", date: "Hier" },
    { buyer: "brand@demo.co", amount: "99.00€", status: "validé", date: "Il y a 2 jours" },
  ] as const;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.gridLayout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div>
                <p className={styles.brandName}>Sponsio</p>
                <p className={styles.brandTitle}>HQ Admin</p>
              </div>
              <span className={styles.adminTag}>
                Admin
              </span>
            </div>

            <nav className={styles.nav}>
              {[
                { label: "Overview", icon: <LayoutDashboard className="h-4 w-4" />, active: true },
                { label: "Transactions", icon: <CreditCard className="h-4 w-4" /> },
                { label: "Ad Slots", icon: <Megaphone className="h-4 w-4" /> },
                { label: "Settings", icon: <Settings className="h-4 w-4" /> },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={cx(
                    styles.navItem,
                    item.active ? styles.navItemActive : styles.navItemInactive
                  )}
                >
                  <span className={cx(styles.navIcon, item.active && styles.navIconActive)}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className={styles.insightBox}>
              <p className={styles.brandName}>Insight</p>
              <p className="mt-2 text-sm text-slate-300">
                Objectif : pousser le CTR et remplir les slots premium. Ajoute une alerte quand{" "}
                <span className="font-bold text-white">CTR &lt; 1.2%</span>.
              </p>
            </div>
          </aside>

          {/* Main */}
          <main className={styles.mainContent}>
            {/* Topbar */}
            <div className={styles.topbar}>
              <div className={styles.topbarFlex}>
                <div>
                  <h1 className={styles.pageTitle}>Dashboard Admin</h1>
                  <p className={styles.pageSubtitle}>
                    Centre de commande Sponsio — suivi KPI, ventes et activité.
                  </p>
                </div>

                <div className={styles.actionsContainer}>
                  <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input
                      placeholder="Rechercher (buyer, montant, statut...)"
                      className={styles.searchInput}
                    />
                  </div>

                  <button className={styles.actionButton}>
                    30 jours <ChevronDown className="h-4 w-4 text-slate-300" />
                  </button>

                  <button className={styles.actionButton}>
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* KPI */}
            <section className={styles.statsGrid}>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={styles.statCard}
                >
                  <div className={styles.statHeader}>
                    <div>
                      <p className={styles.statLabel}>
                        {stat.label}
                      </p>
                      <p className={styles.statValue}>{stat.value}</p>
                    </div>

                    <div className={cx(styles.statPillBase, stat.pill)}>{stat.icon}</div>
                  </div>

                  <div className={styles.statMeta}>
                    <span className="h-2 w-2 rounded-full bg-slate-600" />
                    Dernière mise à jour: live
                  </div>
                </div>
              ))}
            </section>

            {/* Charts row (UI placeholders) */}
            <section className={styles.sectionsGrid}>
              <div className={styles.chartCard}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>Revenus (UI)</h3>
                    <p className={styles.pageSubtitle}>Courbe des paiements encaissés sur la période.</p>
                  </div>
                  <span className={styles.comingSoonTag}>
                    Coming soon
                  </span>
                </div>

                <div className={styles.chartPlaceholder}>
                  Zone chart (Recharts / Tremor / etc.)
                </div>
              </div>

              <div className={styles.insightsCard}>
                <h3 className={styles.sectionTitle}>Insights</h3>
                <p className={styles.pageSubtitle}>Lecture rapide des signaux business.</p>

                <div className="mt-5 space-y-3">
                  <div className={styles.insightItem}>
                    <p className={styles.brandName}>CTR réseau</p>
                    <p className="mt-1 text-sm text-slate-200">
                      Surveille les placements qui génèrent beaucoup de clics mais peu de ventes.
                    </p>
                  </div>
                  <div className={styles.insightItem}>
                    <p className={styles.brandName}>Slots premium</p>
                    <p className="mt-1 text-sm text-slate-200">
                      Ajoute une alerte quand <span className="font-bold text-white">stock &lt; 5</span>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Table */}
            <section className={styles.tableContainer}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className={styles.sectionTitle}>Dernières Transactions</h3>
                  <p className={styles.pageSubtitle}>Flux des paiements les plus récents.</p>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className="pb-4">Acheteur</th>
                      <th className="pb-4">Montant</th>
                      <th className="pb-4">Statut</th>
                      <th className="pb-4">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {lastTransactions.map((t, idx) => (
                      <tr key={idx} className={styles.tableRow}>
                        <td className="py-4 text-slate-300">{t.buyer}</td>
                        <td className="py-4 font-black text-white">{t.amount}</td>
                        <td className="py-4">
                          <span
                            className={cx(
                              styles.statusPill,
                              t.status === "validé" && styles.statusValidated,
                              t.status === "en attente" && styles.statusPending
                            )}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-4 text-slate-500">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
