"use client";
import React from 'react';
import styles from './wallet-card.module.css';

export default function WalletCard({ balance }: { balance: number }) {
  const formattedBalance = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(balance);
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.wallet}>
        <div className={styles.walletBack} />
        
        <div className={`${styles.card} ${styles.stripe}`}>
          <div className={styles.cardInner}>
            <div className={styles.cardTop}>
              <span>Stripe Connect</span>
              <div className={styles.chip} />
            </div>
            <div className={styles.cardBottom}>
              <div className={styles.cardInfo}>
                <span className={styles.label}>Titulaire</span>
                <span className={styles.value}>SPONSIO PAYOUT</span>
              </div>
              <div className={styles.cardNumberWrapper}>
                <span className={styles.hiddenStars}>**** 4242</span>
                <span className={styles.cardNumber}>5524 9910 4242</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${styles.card} ${styles.wise}`}>
          <div className={styles.cardInner}>
            <div className={styles.cardTop}>
              <span>Virement Bancaire</span>
              <div className={styles.chip} />
            </div>
            <div className={styles.cardBottom}>
              <div className={styles.cardInfo}>
                <span className={styles.label}>IBAN</span>
                <span className={styles.value}>FR76 ****</span>
              </div>
              <div className={styles.cardNumberWrapper}>
                <span className={styles.hiddenStars}>**** 8810</span>
                <span className={styles.cardNumber}>9012 4432 8810</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${styles.card} ${styles.paypal}`}>
          <div className={styles.cardInner}>
            <div className={styles.cardTop}>
              <span>Pay<b style={{color: '#0079C1'}}>Pal</b></span>
              <div className={styles.chip} />
            </div>
            <div className={styles.cardBottom}>
              <div className={styles.cardInfo}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>createur@sponsio.fr</span>
              </div>
              <div className={styles.cardNumberWrapper}>
                <span className={styles.hiddenStars}>**** 0094</span>
                <span className={styles.cardNumber}>3312 0045 0094</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.pocket}>
          <svg className="w-full h-full" viewBox="0 0 280 160" fill="none">
            <path d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z" fill="#1e341e" />
            <path d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z" stroke="#3d5635" strokeWidth="1.5" strokeDasharray="6 4" />
          </svg>
          <div className={styles.pocketContent}>
            <div style={{position: 'relative', height: 24, width: '100%'}}>
              <div className={styles.balanceStars}>******</div>
              <div className={styles.balanceReal}>{formattedBalance}</div>
            </div>
            <div style={{color: '#698263', fontSize: 12, fontWeight: 500}}>
              Solde en attente
            </div>
            <div className={styles.eyeIconWrapper}>
              <svg className={`${styles.eyeIcon} ${styles.eyeSlash}`} width={20} height={20} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx={12} cy={12} r={3} />
                <line x1={3} y1={3} x2={21} y2={21} />
              </svg>
              <svg className={`${styles.eyeIcon} ${styles.eyeOpen}`} style={{opacity: 0}} width={20} height={20} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx={12} cy={12} r={3} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
