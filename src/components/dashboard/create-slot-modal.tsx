"use client";

import React, { useState } from "react";
import { Plus, Euro, X } from "lucide-react";
import { createAdSlot } from "@/app/dashboard/actions";
import styles from "@/app/dashboard/dashboard.module.css";

export default function CreateSlotModal() {
  const [isOpen, setIsOpen] = useState(false);

  // We can use an async action wrapper if we want to close the modal on submit,
  // or we can let Next.js handle the server action and close on successful return.
  // For simplicity, we just submit and close.
  const handleSubmit = async (formData: FormData) => {
    await createAdSlot(formData);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#1b405b] hover:bg-[#163144] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md"
      >
        <Plus size={16} />
        Nouveau créneau
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-[#1b405b] tracking-tight">Nouveau créneau</h2>
            
            <form action={handleSubmit} className="space-y-5">
              <input type="date" name="date" required className="w-full bg-white/70 border border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100/50 rounded-2xl px-5 py-3.5 text-[#1b405b] placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none" />
              
              <div className="relative">
                <input type="number" name="price" placeholder="Prix (€)" required className="w-full bg-white/70 border border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100/50 rounded-2xl px-5 py-3.5 pl-12 text-[#1b405b] placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none" />
                <Euro size={16} className="absolute left-4 top-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="title" placeholder="Titre (ex: Youtube)" className="w-full bg-white/70 border border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100/50 rounded-2xl px-5 py-3.5 text-[#1b405b] placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none" />
                <input type="date" name="endDate" className="w-full bg-white/70 border border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100/50 rounded-2xl px-5 py-3.5 text-[#1b405b] placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none" />
              </div>
              
              <input type="url" name="contentLink" placeholder="Lien du contenu (ex: https://youtube.com/...)" className="w-full bg-white/70 border border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100/50 rounded-2xl px-5 py-3.5 text-[#1b405b] placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none" />

              <select name="displayType" className="w-full bg-white/70 border border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100/50 rounded-2xl px-5 py-3.5 text-[#1b405b] placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none">
                <optgroup label="🌐 Site Web / Blog">
                  <option value="Bannière Header">Bannière Header (Haut de page)</option>
                  <option value="Bannière Footer">Bannière Footer (Bas de page)</option>
                  <option value="Encart Latéral (Sidebar)">Encart Latéral (Sidebar)</option>
                  <option value="Encart Carrousel">Encart Carrousel (Images défilantes)</option>
                  <option value="Article Sponsorisé (Natif)">Article Sponsorisé (Natif)</option>
                  <option value="Pop-up / Interstitiel">Pop-up / Interstitiel</option>
                  <option value="Habillage (Takeover)">Habillage de Site (Takeover)</option>
                </optgroup>
                <optgroup label="📧 Newsletter">
                  <option value="Bannière Email (Haut)">Bannière Email (Haut)</option>
                  <option value="Encart Texte (Milieu)">Encart Texte (Milieu)</option>
                  <option value="Lien Sponsorisé">Lien Sponsorisé (Bas)</option>
                </optgroup>
                <optgroup label="🎙️ Podcast & Vidéo">
                  <option value="Sponsoring Début (Pre-roll)">Sponsoring Début (Pre-roll)</option>
                  <option value="Sponsoring Milieu (Mid-roll)">Sponsoring Milieu (Mid-roll)</option>
                  <option value="Placement de Produit">Placement de Produit Vidéo</option>
                </optgroup>
              </select>
              
              <button type="submit" className="w-full bg-[#1b405b] hover:bg-[#163144] text-white font-bold py-4 rounded-2xl transition-all shadow-lg mt-4">
                Publier
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
