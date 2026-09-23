import React from 'react';
import { ArrowRight, Calendar, CheckCircle, Zap, ShieldCheck, Sparkles, BarChart3 } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { GithubButton, LinkedinButton, DiscordButton } from "@/components/social-buttons";
import StarryButton from "@/components/starry-button";
import Background3D from "@/components/background-3d";
import styles from "./home.module.css";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <Background3D />
      
      {/* --- Navigation --- */}
      <nav className={styles.nav}>
        <div className={styles.brand}>Sponsio</div>
        <div className={styles.navLinks}>
          <Link href="/explore" className="text-blue-600 font-black">Explorer le Catalogue</Link>
          <Link href="#features" className={styles.navLink}>Fonctionnalités</Link>
          <Link href="#how-it-works" className={styles.navLink}>Comment ça marche ?</Link>
          <Link href="/pricing" className={styles.navLink}>Tarifs</Link>
        </div>

        <div className={styles.authContainer}>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className={styles.signInButton}>Connexion</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className={styles.dashboardLink}>Mon Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className={styles.heroHeader}>
        <div className="inline-block px-4 py-2 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full font-bold text-sm mb-6 shadow-sm backdrop-blur-sm">
          ✨ Nouvelle version propulsée par l'IA
        </div>
        <h1 className={styles.heroTitle}>
          Vendez vos sponsorings <br />
          <span className={styles.heroTitleHighlight}>en pilote automatique.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          La plateforme tout-en-un pour les créateurs de Newsletters, Podcasts et Chaînes YouTube. 
          Gérez vos réservations, vos paiements sécurisés et l'approbation de vos créas publicitaires sans envoyer un seul e-mail.
        </p>

        <div className={styles.heroActions}>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
              <button className={styles.primaryButton}>
                Créer mon espace gratuitement <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <StarryButton href="/dashboard">
              Accéder au Dashboard
            </StarryButton>
          </SignedIn>

          <button className={styles.secondaryButton}>
            <Link href="/explore">Voir le catalogue</Link>
          </button>
        </div>
      </header>

      {/* --- Fonctionnalités (Features) --- */}
      <section id="features" className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Une gestion <span className="text-blue-600">sans compromis</span></h2>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, styles.iconWrapperBlue)}>
              <Calendar className={styles.iconBlue} />
            </div>
            <h3 className={styles.featureTitle}>Calendrier Public Interactif</h3>
            <p className={styles.featureDescription}>Partagez un lien unique à vos annonceurs. Ils consultent vos disponibilités en temps réel et réservent le créneau de leur choix en quelques clics.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, styles.iconWrapperGreen)}>
              <Zap className={styles.iconGreen} />
            </div>
            <h3 className={styles.featureTitle}>Paiements Immédiats via Stripe</h3>
            <p className={styles.featureDescription}>Fini les factures impayées et les relances. L'argent de votre sponsoring est encaissé et sécurisé avant même la diffusion de votre contenu.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, styles.iconWrapperPurple)}>
              <CheckCircle className={styles.iconPurple} />
            </div>
            <h3 className={styles.featureTitle}>Zéro Gestion de Mail</h3>
            <p className={styles.featureDescription}>Les annonceurs uploadent directement leurs visuels, liens et textes publicitaires sur votre dashboard. Validez ou refusez d'un seul clic.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, "bg-indigo-100/80")}>
              <Sparkles className="text-indigo-600" />
            </div>
            <h3 className={styles.featureTitle}>Analyse et Validation par l'IA</h3>
            <p className={styles.featureDescription}>Notre Intelligence Artificielle scanne automatiquement les textes et liens proposés par les annonceurs pour s'assurer qu'ils respectent votre charte éditoriale.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, "bg-slate-100/80")}>
              <ShieldCheck className="text-slate-600" />
            </div>
            <h3 className={styles.featureTitle}>Sécurité & Anti-Fraude</h3>
            <p className={styles.featureDescription}>Vos données et celles de vos annonceurs sont cryptées. Sponsio vérifie l'identité des entreprises acheteuses pour vous protéger des scams et des spams.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={cx(styles.iconWrapperBase, "bg-rose-100/80")}>
              <BarChart3 className="text-rose-600" />
            </div>
            <h3 className={styles.featureTitle}>Analytique & Suivi de ROI</h3>
            <p className={styles.featureDescription}>Sponsio traque les clics et le taux d'engagement de vos espaces publicitaires. Prouvez facilement la valeur de votre audience à vos futurs partenaires.</p>
          </div>
        </div>
      </section>

      {/* --- Comment ça marche (Steps) --- */}
      <section id="how-it-works" className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>Votre sponsoring en <span className="text-blue-600">3 étapes simples</span></h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Créez vos espaces</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Définissez vos prix, vos dates de publication et vos types de contenu (bannière, mention audio, etc.) depuis votre dashboard.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Partagez votre lien</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Ajoutez votre lien Sponsio dans votre bio, votre kit média ou vos e-mails de prospection pour laisser les annonceurs acheter.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Encaissez et publiez</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Validez le matériel publicitaire reçu et recevez vos fonds directement sur votre compte bancaire. Vous n'avez plus qu'à publier !</p>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Prêt à monétiser votre audience ?</h2>
          <p className={styles.ctaSubtitle}>Rejoignez des centaines de créateurs qui gagnent du temps et sécurisent leurs revenus grâce à Sponsio.</p>
          
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
              <button className={styles.ctaButton}>
                Créer mon compte gratuitement
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className={styles.ctaButton}>
                Accéder à mon tableau de bord
              </button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={styles.footer}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="text-xl font-black text-slate-300">Sponsio</div>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <GithubButton />
            <LinkedinButton />
            <DiscordButton />
          </div>
          <div className="text-slate-500">© 2026 Sponsio. La plateforme des créateurs pro. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}