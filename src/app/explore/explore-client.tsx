"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink, Calendar, Tag, ChevronRight, Users, Link2, Search, SlidersHorizontal } from 'lucide-react';
import styles from './explore.module.css';

export default function ExploreFilterClient({ slots }: { slots: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minTraffic, setMinTraffic] = useState<number | ''>('');
  const [minBacklinks, setMinBacklinks] = useState<number | ''>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Extract all unique tags/categories
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    slots.forEach(s => {
      if (s.category?.name) tags.add(s.category.name);
      if (s.displayType) tags.add(s.displayType);
    });
    return Array.from(tags).sort();
  }, [slots]);

  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      // Text Search
      if (searchTerm && !slot.title?.toLowerCase().includes(searchTerm.toLowerCase()) && !slot.creator.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Price
      if (maxPrice !== '' && slot.price > maxPrice) return false;
      // Traffic
      if (minTraffic !== '' && slot.stats.numericTraffic < minTraffic) return false;
      // Backlinks
      if (minBacklinks !== '' && slot.stats.numericBacklinks < minBacklinks) return false;
      // Tags
      if (selectedTag !== '' && slot.category?.name !== selectedTag && slot.displayType !== selectedTag) return false;
      
      return true;
    });
  }, [slots, searchTerm, maxPrice, minTraffic, minBacklinks, selectedTag]);

  return (
    <div className="w-full">
      {/* Top Bar: Stats & Toggle Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-slate-500 font-semibold bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm">
          {filteredSlots.length} résultat{filteredSlots.length > 1 ? 's' : ''}
        </div>
        <button 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-sm text-sm font-bold transition-all ${
            isFiltersOpen 
              ? 'bg-slate-900 text-white border-slate-900' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isFiltersOpen ? 'Masquer les filtres' : 'Filtrer les résultats'}
        </button>
      </div>

      {/* Filters Section (Animated: Grows from right) */}
      <div 
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isFiltersOpen ? 'grid-rows-[1fr] opacity-100 mb-10' : 'grid-rows-[0fr] opacity-0 mb-0'
        }`}
      >
        <div className="overflow-hidden">
          <div 
            className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top-right ${
              isFiltersOpen ? 'scale-100 translate-x-0' : 'scale-95 translate-x-12 opacity-0'
            }`}
          >
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Ex: Newsletter Tech..." 
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-48">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Catégorie / Tag</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer transition-all"
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                >
                  <option value="">Toutes</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-36">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prix max (€)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 500" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>

              <div className="w-full md:w-40">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trafic min.</label>
                <input 
                  type="number" 
                  placeholder="Ex: 10000" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={minTraffic}
                  onChange={e => setMinTraffic(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>

              <div className="w-full md:w-40">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Backlinks min.</label>
                <input 
                  type="number" 
                  placeholder="Ex: 100" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={minBacklinks}
                  onChange={e => setMinBacklinks(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Slots */}
      {filteredSlots.length === 0 ? (
        <div className="text-center text-slate-500 py-20 bg-white rounded-2xl border border-slate-200 max-w-6xl mx-auto">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun résultat</h3>
          <p>Essayez de modifier vos filtres pour voir plus de créneaux.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSlots.map((slot) => (
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
                    <span>{new Date(slot.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span><strong className="text-slate-700">{slot.stats.traffic}</strong></span>
                  </div>
                  {!slot.stats.isYoutube && (
                    <div className={styles.detailItem}>
                      <Link2 className="w-4 h-4 text-purple-500" />
                      <span><strong className="text-slate-700">{slot.stats.backlinks}</strong> backlinks</span>
                    </div>
                  )}
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
    </div>
  );
}
