"use client";

import React, { useState } from "react";
import { Plus, Euro, X, ChevronDown } from "lucide-react";
import { createAdSlot } from "@/app/dashboard/actions";
import { motion, AnimatePresence } from "framer-motion";

const displayOptions = [
  "Bannière Header", "Bannière Footer", "Encart Latéral (Sidebar)", 
  "Encart Carrousel", "Article Sponsorisé", "Pop-up / Interstitiel",
  "Bannière Email (Haut)", "Encart Texte (Milieu)", "Lien Sponsorisé",
  "Sponsoring Pre-roll", "Sponsoring Mid-roll", "Placement Vidéo"
];

function GlassDropdown({ name, options }: { name: string, options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selected} />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/70 border border-slate-200 hover:border-blue-400 rounded-2xl px-5 py-3 text-slate-900 font-medium cursor-pointer flex justify-between items-center transition-all shadow-sm"
      >
        <span>{selected}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 p-2 bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-1 max-h-64 overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
          >
            {options.map((option) => {
               const isSelected = selected === option;
               return (
                 <div 
                   key={option}
                   onClick={() => { setSelected(option); setIsOpen(false); }}
                   className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                 >
                   {isSelected && (
                     <motion.div 
                       layoutId="glider" 
                       className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-500/80 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-400/50"
                     />
                   )}
                   
                   <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]' : 'bg-slate-700/50 border border-slate-600'}`}>
                     <AnimatePresence>
                       {isSelected && (
                         <motion.span 
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           exit={{ scale: 0 }}
                           className="text-[#0f172a] text-[10px] font-black"
                         >✓</motion.span>
                       )}
                     </AnimatePresence>
                   </div>
                   <span className="relative z-10 font-semibold text-sm">{option}</span>
                 </div>
               )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
            
            <form action={handleSubmit} className="space-y-4">
              {/* 1. Titre */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Titre de l'espace</label>
                <input type="text" name="title" required placeholder="ex: Vidéo YouTube, Newsletter du Lundi..." className="w-full bg-white/70 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-5 py-3 text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none" />
              </div>

              {/* 2. Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Date (Début)</label>
                  <input type="date" name="date" required className="w-full bg-white/70 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-5 py-3 text-slate-900 font-medium transition-all shadow-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Date (Fin - optionnel)</label>
                  <input type="date" name="endDate" className="w-full bg-white/70 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-5 py-3 text-slate-900 font-medium transition-all shadow-sm outline-none" />
                </div>
              </div>

              {/* 3. Lien du site */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Lien de votre site/chaîne</label>
                <input type="url" name="contentLink" placeholder="ex: https://youtube.com/..." className="w-full bg-white/70 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-5 py-3 text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none" />
              </div>

              {/* 4. Emplacement (Select) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Emplacement publicitaire</label>
                <GlassDropdown name="displayType" options={displayOptions} />
              </div>

              {/* 5. Bio / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Description / Bio</label>
                <textarea name="description" rows={3} placeholder="Décrivez cet emplacement publicitaire à vos annonceurs (audience, contexte...)" className="w-full bg-white/70 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-5 py-3 text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-sm outline-none resize-none"></textarea>
              </div>

              {/* 6. Prix */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Prix de vente</label>
                <div className="relative">
                  <input type="number" name="price" placeholder="0" required className="w-full bg-white/70 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-5 py-3 pl-10 text-slate-900 font-bold transition-all shadow-sm outline-none" />
                  <Euro size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">EUR</span>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2">
                Créer l'espace
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
