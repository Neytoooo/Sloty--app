import React from 'react';
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Tag, ChevronRight } from "lucide-react";
import styles from "./explore.module.css";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  // Fetch all unbooked AdSlots with their Category and Creator (User)
  const availableSlots = await prisma.adSlot.findMany({
    where: {
      isBooked: false,
    },
    include: {
      creator: true,
      category: true,
    },
    orderBy: {
      date: 'asc'
    }
  });

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className="flex items-center gap-4">
          <Link href="/" className={styles.backButton}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className={styles.brand}>Sponsio <span className="text-slate-400 font-medium">Marketplace</span></div>
        </div>
        <Link href="/dashboard" className={styles.dashboardLink}>
          Mon Dashboard
        </Link>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          Trouvez l'audience <br /> parfaite pour votre marque.
        </h1>
        <p className={styles.subtitle}>
          Parcourez les espaces publicitaires disponibles chez des centaines de créateurs qualifiés.
        </p>
      </header>

      {/* Grid of Slots */}
      <main className={styles.main}>
        {availableSlots.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            Aucun créneau disponible pour le moment.
          </div>
        ) : (
          <div className={styles.grid}>
            {availableSlots.map((slot) => (
              <div key={slot.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.categoryBadge}>
                    {slot.category?.name || 'Général'}
                  </div>
                  <div className={styles.price}>
                    {slot.price} €
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.slotTitle}>{slot.title || 'Support Média'}</h3>
                  <div className={styles.creatorInfo}>
                    Par <span className="font-semibold text-slate-700">{slot.creator.email}</span>
                  </div>
                  
                  <div className={styles.slotDetails}>
                    <div className={styles.detailItem}>
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span>{slot.displayType}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{slot.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {slot.description && (
                    <p className={styles.description}>
                      {slot.description}
                    </p>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  {slot.contentLink && (
                    <a 
                      href={slot.contentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.linkButton}
                    >
                      Voir le support <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                  <Link href={`/book/${slot.creator.id}?slotId=${slot.id}`} className={styles.bookButton}>
                    Réserver <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
