import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-950/40 p-4 lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Sponsio</p>
                <p className="text-lg font-black text-white">HQ Admin</p>
              </div>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase text-slate-300">
                Admin
              </span>
            </div>

            <nav className="mt-6 space-y-1">
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
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                    item.active
                      ? "bg-slate-900 text-white border border-slate-800"
                      : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
                  )}
                >
                  <span className={cx("text-slate-400", item.active && "text-white")}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Insight</p>
              <p className="mt-2 text-sm text-slate-300">
                Objectif : pousser le CTR et remplir les slots premium. Ajoute une alerte quand{" "}
                <span className="font-bold text-white">CTR &lt; 1.2%</span>.
              </p>
            </div>
          </aside>

          {/* Main */}
          <main className="space-y-6">
            {/* Topbar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white md:text-3xl">Dashboard Admin</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Centre de commande Sponsio — suivi KPI, ventes et activité.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      placeholder="Rechercher (buyer, montant, statut...)"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/40 pl-10 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-slate-700"
                    />
                  </div>

                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white hover:bg-slate-900">
                    30 jours <ChevronDown className="h-4 w-4 text-slate-300" />
                  </button>

                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-bold text-white hover:bg-slate-900">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* KPI */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-black text-white">{stat.value}</p>
                    </div>

                    <div className={cx("rounded-2xl border p-3", stat.pill)}>{stat.icon}</div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-slate-600" />
                    Dernière mise à jour: live
                  </div>
                </div>
              ))}
            </section>

            {/* Charts row (UI placeholders) */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">Revenus (UI)</h3>
                    <p className="mt-1 text-sm text-slate-400">Courbe des paiements encaissés sur la période.</p>
                  </div>
                  <span className="rounded-full border border-slate-800 bg-slate-950/40 px-2 py-1 text-[10px] font-bold uppercase text-slate-300">
                    Coming soon
                  </span>
                </div>

                <div className="mt-6 h-40 rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 flex items-center justify-center text-sm text-slate-500">
                  Zone chart (Recharts / Tremor / etc.)
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-base font-black text-white">Insights</h3>
                <p className="mt-1 text-sm text-slate-400">Lecture rapide des signaux business.</p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">CTR réseau</p>
                    <p className="mt-1 text-sm text-slate-200">
                      Surveille les placements qui génèrent beaucoup de clics mais peu de ventes.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Slots premium</p>
                    <p className="mt-1 text-sm text-slate-200">
                      Ajoute une alerte quand <span className="font-bold text-white">stock &lt; 5</span>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Table */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white">Dernières Transactions</h3>
                  <p className="mt-1 text-sm text-slate-400">Flux des paiements les plus récents.</p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-xs uppercase font-bold text-slate-500">
                    <tr>
                      <th className="pb-4">Acheteur</th>
                      <th className="pb-4">Montant</th>
                      <th className="pb-4">Statut</th>
                      <th className="pb-4">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {lastTransactions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 text-slate-300">{t.buyer}</td>
                        <td className="py-4 font-black text-white">{t.amount}</td>
                        <td className="py-4">
                          <span
                            className={cx(
                              "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase border",
                              t.status === "validé" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
                              t.status === "en attente" && "bg-amber-500/10 text-amber-300 border-amber-500/20"
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
