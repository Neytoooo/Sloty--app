import React from 'react';
import { ArrowRight, Calendar, CheckCircle, Zap } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./home.module.css";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* --- Navigation --- */}
      <nav className={styles.nav}>
        <div className={styles.brand}>Sponsio</div>
        <div className={styles.navLinks}>
          <Link href="/how-it-works" className={styles.navLink}>Comment ça fonctionne ?</Link>
          <Link href="/pricing" className={styles.navLink}>Abonnement</Link>
        </div>

        <div className={styles.authContainer}>
          {/* Affiche "Connexion" si l'utilisateur est déconnecté */}
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className={styles.signInButton}>
                Connexion
              </button>
            </SignInButton>
          </SignedOut>

          {/* Affiche le bouton profil et le lien Dashboard si connecté */}
          <SignedIn>
            <Link href="/dashboard" className={styles.dashboardLink}>
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className={styles.heroHeader}>
        <h1 className={styles.heroTitle}>
          Vendez vos sponsorings <br />
          <span className={styles.heroTitleHighlight}>en pilote automatique.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          La plateforme tout-en-un pour les créateurs de Newsletters et Podcasts.
          Gérez vos réservations, vos paiements et vos créas sans envoyer un seul mail.
        </p>

        <div className={styles.heroActions}>
          {/* Section dynamique pour le bouton principal du Hero */}
          <SignedOut>
            <SignInButton
              mode="modal"
              forceRedirectUrl="/dashboard"
              signUpForceRedirectUrl="/dashboard"
            >
              <button className={styles.primaryButton}>
                Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className={styles.primaryButton}>
              Aller au Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </SignedIn>

          <button className={styles.secondaryButton}>
            <Link href="/demos" className={styles.navLink}>Démos</Link>
          </button>
        </div>
      </header>

      {/* --- Argumentaire (Features) --- */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, styles.iconWrapperBlue)}>
              <Calendar className={styles.iconBlue} />
            </div>
            <h3 className={styles.featureTitle}>Calendrier Public</h3>
            <p className={styles.featureDescription}>Partagez votre lien et laissez les annonceurs choisir leurs dates disponibles.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, styles.iconWrapperGreen)}>
              <Zap className={styles.iconGreen} />
            </div>
            <h3 className={styles.featureTitle}>Paiements Immédiats</h3>
            <p className={styles.featureDescription}>Fini les impayés. L'argent est sécurisé via Stripe avant même la diffusion.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, styles.iconWrapperPurple)}>
              <CheckCircle className={styles.iconPurple} />
            </div>
            <h3 className={styles.featureTitle}>Zéro Gestion de Mail</h3>
            <p className={styles.featureDescription}>Recevez directement les visuels et les liens publicitaires sur votre dashboard.</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={styles.footer}>
        © 2026 Sponsio. Tous droits réservés.
      </footer>
    </div>
  );
}