import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Check, ArrowRight, Tag, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { createCheckoutSession } from "./checkout";
import styles from "./booking.module.css";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default async function PublicBookingPage(props: {
  params: Promise<{ userID: string }>
}) {
  const { userID } = await props.params;

  if (!userID) return notFound();

  // Récupère les créneaux
  const slots = await prisma.adSlot.findMany({
    where: { creatorId: userID },
    orderBy: { date: 'asc' },
    include: { booking: true }
  });

  const creator = await prisma.user.findUnique({
    where: { id: userID }
  });

  if (!creator) return notFound();

  return (
    <div className={styles.container}>
      {/* --- Hero Section --- */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <Sparkles size={16} />
            Disponible pour sponsorings
          </div>
          <h1 className={styles.heroTitle}>
            Propulsez votre marque avec <br />
            <span className={styles.heroBrand}>@{creator.email.split('@')[0]}</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Sélectionnez un créneau disponible ci-dessous pour toucher une audience engagée et qualifiée.
          </p>
        </div>
      </div>

      <main className={styles.main}>
        {/* --- Statistiques Rapides / Filtre visuel --- */}
        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <p className={styles.statsLabel}>Disponibles</p>
            <p className={styles.statsValue}>{slots.filter(s => !s.isBooked).length} créneaux</p>
          </div>
          <div className={cx(styles.statsCard, styles.statsCardHiddenMobile)}>
            <p className={styles.statsLabel}>Audience</p>
            <p className={styles.statsValue}>Vérifiée</p>
          </div>
          <div className={styles.statsCardBlue}>
            <p className={cx(styles.statsLabel, styles.statsLabelBlue)}>Support</p>
            <p className={styles.statsValueWhite}>Direct</p>
          </div>
        </div>

        {/* --- Liste des Slots --- */}
        <div className={styles.slotsContainer}>
          <h2 className={styles.slotsHeader}>
            <CalendarIcon size={22} className="text-blue-600" />
            Prochains créneaux de diffusion
          </h2>

          {slots.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>Aucun créneau n'est listé pour le moment.</p>
            </div>
          ) : (
            slots.map((slot) => (
              <div
                key={slot.id}
                className={cx(
                  styles.slotCardBase,
                  slot.isBooked ? styles.slotCardBooked : styles.slotCardAvailable
                )}
              >
                <div className={styles.cardContent}>

                  {/* Date & Info */}
                  <div className={styles.cardLeft}>
                    <div className={cx(
                      styles.dateBadgeBase,
                      slot.isBooked ? styles.dateBadgeBooked : styles.dateBadgeAvailable
                    )}>
                      <span className={styles.dateMonth}>
                        {new Date(slot.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                      <span className={styles.dateDay}>
                        {new Date(slot.date).toLocaleDateString('fr-FR', { day: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <h3 className={styles.slotTitle}>
                        {slot.title || slot.displayType}
                      </h3>
                      <p className={styles.slotDateRange}>
                        {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        {slot.endDate && ` - ${new Date(slot.endDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}`}
                      </p>
                      {slot.contentLink && (
                        <a href={slot.contentLink} target="_blank" rel="noopener noreferrer" className={styles.contentLink}>
                          Voir le support
                        </a>
                      )}
                      <div className={styles.tagsContainer}>
                        <span className={styles.tagBase}>
                          <Tag size={12} />
                          {slot.displayType}
                        </span>
                        {slot.isBooked ? (
                          <span className={styles.statusTagBooked}>Indisponible</span>
                        ) : (
                          <span className={styles.statusTagAvailable}>
                            <Check size={14} /> En ligne
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prix & Action */}
                  <div className={styles.cardRight}>
                    <div className={styles.priceContainer}>
                      <p className={styles.priceLabel}>Tarif fixe</p>
                      <p className={styles.priceValue}>{slot.price}€</p>
                    </div>

                    {!slot.isBooked && (
                      <form action={async () => { "use server"; await createCheckoutSession(slot.id, slot.price, slot.displayType); }}>
                        <button type="submit" className={styles.bookButton}>
                          Réserver <ArrowRight size={20} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Trust Badge --- */}
        <div className={styles.trustBadgeContainer}>
          <p className={styles.trustBadgeText}>
            Paiement sécurisé par <span className="text-slate-900">Stripe</span>
          </p>
        </div>
      </main>
    </div>
  );
}