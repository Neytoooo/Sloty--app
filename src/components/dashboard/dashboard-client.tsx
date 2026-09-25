"use client";

import React, { useState } from 'react';
import { 
  Euro, 
  MousePointer2, 
  ExternalLink, 
  Plus, 
  TrendingUp, 
  Users,
  X,
  GripHorizontal
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import RevenueChart from "@/components/dashboard/revenue-chart";
import WalletCard from "@/components/dashboard/wallet-card";
// We don't drag the board here to keep things simple, but we could. We'll leave the board outside the drag context or make it a widget.

type WidgetData = {
  id: string;
  type: 'kpi' | 'chart' | 'wallet';
  title: string;
  isHidden: boolean;
};

const initialWidgets: WidgetData[] = [
  { id: 'kpi-views', type: 'kpi', title: 'Vues totales', isHidden: false },
  { id: 'kpi-visitors', type: 'kpi', title: 'Visiteurs Uniques', isHidden: false },
  { id: 'kpi-clicks', type: 'kpi', title: 'Clics sortants', isHidden: false },
  { id: 'kpi-sales', type: 'kpi', title: 'Créneaux Vendus', isHidden: false },
  { id: 'chart-revenue', type: 'chart', title: 'Revenus Totaux', isHidden: false },
  { id: 'wallet-card', type: 'wallet', title: 'Comptes Connectés', isHidden: false },
];

function SortableWidget({ 
  widget, 
  stats,
  chartData, 
  onHide 
}: { 
  widget: WidgetData; 
  stats: any;
  chartData: any;
  onHide: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  // Widget rendering logic
  let content = null;
  let colSpan = 'col-span-1';

  if (widget.id === 'kpi-views') {
    content = (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-500">{widget.title}</h3>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><MousePointer2 size={16} /></div>
        </div>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black text-slate-900">{formatNumber(stats.totalViews || 0)}</span>
          {stats.totalViews > 0 && <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md mb-1"><TrendingUp size={12} className="mr-1"/> 15.5%</span>}
        </div>
        <p className="text-xs font-medium text-slate-400">Basé sur vos clics</p>
      </>
    );
  } else if (widget.id === 'kpi-visitors') {
    content = (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-500">{widget.title}</h3>
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Users size={16} /></div>
        </div>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black text-slate-900">{formatNumber(stats.totalVisitors || 0)}</span>
          {stats.totalVisitors > 0 && <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md mb-1"><TrendingUp size={12} className="mr-1"/> 8.4%</span>}
        </div>
        <p className="text-xs font-medium text-slate-400">Estimé selon vos ventes</p>
      </>
    );
  } else if (widget.id === 'kpi-clicks') {
    content = (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-500">{widget.title}</h3>
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><ExternalLink size={16} /></div>
        </div>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black text-slate-900">{formatNumber(stats.displayClicks || 0)}</span>
          {stats.displayClicks > 0 && <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md mb-1"><TrendingUp size={12} className="mr-1"/> 12.5%</span>}
        </div>
        <p className="text-xs font-medium text-slate-400">Depuis vos campagnes</p>
      </>
    );
  } else if (widget.id === 'kpi-sales') {
    content = (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-500">{widget.title}</h3>
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Euro size={16} /></div>
        </div>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black text-slate-900">{formatNumber(stats.bookedSlotsCount || 0)}</span>
          {stats.bookedSlotsCount > 0 && <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md mb-1"><TrendingUp size={12} className="mr-1"/> Nouveaux</span>}
        </div>
        <p className="text-xs font-medium text-slate-400">Commandes reçues</p>
      </>
    );
  } else if (widget.id === 'chart-revenue') {
    colSpan = 'col-span-1 md:col-span-2 lg:col-span-2';
    content = (
      <>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{widget.title}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(stats.displayRevenue || 0)}</span>
              {stats.displayRevenue > 0 && (
                <span className="flex items-center text-sm font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <TrendingUp size={14} className="mr-1"/> +24.4%
                </span>
              )}
            </div>
          </div>
        </div>
        <RevenueChart data={chartData} />
      </>
    );
  } else if (widget.id === 'wallet-card') {
    colSpan = 'col-span-1 md:col-span-2 lg:col-span-2';
    content = (
      <>
        <h2 className="text-lg font-bold text-slate-900 self-start mb-6 w-full">{widget.title}</h2>
        <div className="scale-90 origin-top transform transition-transform hover:scale-95 duration-500 w-full flex justify-center">
          <WalletCard balance={stats.displayRevenue || 0} />
        </div>
      </>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group relative min-h-[160px] ${colSpan}`}
    >
      {/* Hover overlay actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-20">
        <button 
          {...attributes} 
          {...listeners}
          className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 cursor-grab active:cursor-grabbing"
          title="Déplacer le widget"
        >
          <GripHorizontal size={16} />
        </button>
        <button 
          onClick={() => onHide(widget.id)}
          className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
          title="Masquer le widget"
        >
          <X size={16} />
        </button>
      </div>
      
      {content}
    </div>
  );
}

export default function DashboardClient({ slots }: { slots: any[] }) {
  const [widgets, setWidgets] = useState<WidgetData[]>(initialWidgets);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState<'30days' | '7days' | 'all'>('all');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(current => 
      current.map(w => w.id === id ? { ...w, isHidden: !w.isHidden } : w)
    );
  };

  const resetWidgets = () => {
    setWidgets(initialWidgets);
  };

  const visibleWidgets = widgets.filter(w => !w.isHidden);
  const hiddenWidgets = widgets.filter(w => w.isHidden);

  // --- Dynamic Stats Computation ---
  const filteredSlots = slots.filter(slot => {
    if (dateRange === 'all') return true;
    
    // We use the booking date if available, otherwise the slot creation date
    // Note: since slots don't have createdAt in the schema currently, we fallback to slot.date
    const itemDate = slot.booking ? new Date(slot.booking.createdAt) : new Date(slot.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (dateRange === '30days') return diffDays <= 30;
    if (dateRange === '7days') return diffDays <= 7;
    return true;
  });

  const displayRevenue = filteredSlots.reduce((acc, s) => acc + (s.booking?.amountPaid || 0), 0);
  const displayClicks = filteredSlots.reduce((acc, s) => acc + (s.booking?.clicks || 0), 0);
  const bookedSlotsCount = filteredSlots.filter(s => s.isBooked).length;
  const totalViews = displayClicks * 3.5; // Mocking views based on clicks for now, as we don't have it in schema
  const totalVisitors = Math.round(totalViews * 0.4);

  const stats = {
    displayRevenue,
    displayClicks,
    bookedSlotsCount,
    totalViews,
    totalVisitors
  };

  // Build chart data
  const chartData = filteredSlots
    .filter(s => s.booking)
    .sort((a, b) => new Date(a.booking.createdAt).getTime() - new Date(b.booking.createdAt).getTime())
    .map(s => ({
      date: new Date(s.booking.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      amount: s.booking.amountPaid
    }));

  // If no data for the chart, provide a zero-flat line
  const finalChartData = chartData.length > 0 ? chartData : [
    { date: 'J-7', amount: 0 },
    { date: 'J-6', amount: 0 },
    { date: 'J-5', amount: 0 },
    { date: 'Aujourd\'hui', amount: 0 }
  ];
  // ---------------------------------

  const dateRangeLabels = {
    'all': 'Toutes les données',
    '30days': '30 derniers jours',
    '7days': '7 derniers jours'
  };

  return (
    <div className="mb-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Tableau de bord
        </h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
            <span className="text-slate-400">📅</span>
            <span>{dateRangeLabels[dateRange]}</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <span>{dateRangeLabels[dateRange]}</span>
              <span className="text-slate-400">▼</span>
            </button>
            
            {isDateMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                <button onClick={() => { setDateRange('7days'); setIsDateMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">7 derniers jours</button>
                <button onClick={() => { setDateRange('30days'); setIsDateMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">30 derniers jours</button>
                <button onClick={() => { setDateRange('all'); setIsDateMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Toutes les données</button>
              </div>
            )}
          </div>

          <button 
            onClick={resetWidgets}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            Réinitialiser
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <Plus size={16} className="text-slate-400" />
              Ajouter un widget
              {hiddenWidgets.length > 0 && (
                <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md text-xs font-bold ml-1">
                  {hiddenWidgets.length}
                </span>
              )}
            </button>
            
            {/* Add Widget Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-2">Widgets disponibles</h4>
                {hiddenWidgets.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-slate-500">Tous les widgets sont déjà affichés.</div>
                ) : (
                  hiddenWidgets.map(widget => (
                    <button
                      key={widget.id}
                      onClick={() => { toggleWidgetVisibility(widget.id); setIsMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                    >
                      {widget.title}
                      <Plus size={14} className="text-blue-500" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          
          <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-white cursor-pointer hover:bg-blue-700 transition-colors">
            <span className="text-white">⬇️</span>
            Exporter
          </button>
        </div>
      </div>

      {/* Sortable Grid */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SortableContext 
            items={visibleWidgets.map(w => w.id)}
            strategy={rectSortingStrategy}
          >
            {visibleWidgets.map(widget => (
              <SortableWidget 
                key={widget.id} 
                widget={widget} 
                stats={stats}
                chartData={finalChartData} 
                onHide={toggleWidgetVisibility} 
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
