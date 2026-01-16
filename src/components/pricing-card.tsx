"use client";

import React, { useState } from 'react';
import { Check, Zap, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
    plan: {
        name: string;
        description: string;
        features: string[];
        price: string;
        button: string;
        highlight: boolean;
        icon: React.ReactNode;
        link?: string;
        action?: (formData: FormData) => Promise<void>;
        isSubscribed?: boolean;
        isFree?: boolean; // New prop to identify the free plan logic
    };
}

export function PricingCard({ plan }: PricingCardProps) {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const handleFreeStartClick = (e: React.MouseEvent) => {
        if (!isSignedIn) {
            e.preventDefault();
            setShowLoginPopup(true);
        } else {
            router.push(plan.link || "/dashboard");
        }
    };

    return (
        <>
            <div className={`relative p-10 rounded-[2.5rem] border-2 transition-all ${plan.highlight
                ? 'bg-slate-900 text-white border-blue-600 shadow-2xl scale-105 z-10'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-slate-300'
                }`}>

                {/* Checkmark vert si abonné sur le plan highlight */}
                {plan.isSubscribed && (
                    <div className="absolute top-0 right-0 p-4">
                        <div className="bg-green-500 rounded-full p-2 shadow-lg animate-in zoom-in spin-in-12 duration-500">
                            <CheckCircle2 className="text-white" size={24} strokeWidth={3} />
                        </div>
                    </div>
                )}

                <div className={`mb-6 w-12 h-12 rounded-2xl flex items-center justify-center ${plan.highlight ? 'bg-slate-800' : 'bg-blue-50'
                    }`}>
                    {plan.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h3>
                <p className={`text-sm mb-8 font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-10">
                    <span className="text-5xl font-black tracking-tighter">{plan.price}€</span>
                    <span className={`font-bold ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>/mois</span>
                </div>

                <ul className="space-y-5 mb-12">
                    {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm font-semibold">
                            <Check size={18} className="text-blue-500 flex-shrink-0" strokeWidth={3} />
                            <span className={plan.highlight ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                        </li>
                    ))}
                </ul>

                {/* Logique conditionnelle pour le bouton */}
                {plan.isSubscribed ? (
                    <button disabled className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center bg-slate-700 text-slate-400 cursor-not-allowed">
                        {plan.button}
                    </button>
                ) : plan.action ? (
                    <form action={plan.action}>
                        <button type="submit" className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center ${plan.highlight
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                            }`}>
                            {plan.button}
                        </button>
                    </form>
                ) : (
                    <button
                        type="button"
                        onClick={plan.isFree ? handleFreeStartClick : undefined}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center ${plan.highlight
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                            }`}
                    >
                        {plan.isFree ? plan.button : <Link href={plan.link || "#"} className="w-full h-full flex items-center justify-center">{plan.button}</Link>}
                    </button>
                )}
            </div>

            {/* POPUP DE CONNEXION */}
            {showLoginPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full mx-4 border border-slate-200 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowLoginPopup(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center">
                            <div className="mb-6 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Compte requis</h3>
                            <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                                Pour accéder au tableau de bord et commencer à gagner de l'argent, vous devez vous connecter.
                            </p>

                            <div className="space-y-3">
                                <Link href="/sign-in" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200">
                                    Se connecter
                                </Link>
                                <Link href="/sign-up" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all">
                                    Créer un compte
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
