"use client";

import React, { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Trash2, Calendar, MoreHorizontal, FolderPlus } from "lucide-react";
import { createCategory, deleteCategory, updateSlotOrder } from "@/app/dashboard/categories";
import { deleteAdSlot } from "@/app/dashboard/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- TYPES ---
interface AdSlot {
    id: string;
    date: Date;
    endDate?: Date | null;
    price: number;
    displayType: string;
    title?: string | null;
    isBooked: boolean;
    categoryId?: string | null;
    order: number;
    booking?: any;
}

interface Category {
    id: string;
    name: string;
}

interface Props {
    initialSlots: AdSlot[];
    initialCategories: Category[];
    shareUrl: string;
}

// --- SORTABLE ITEM COMPONENT ---
function SortableSlot({ slot, shareUrl }: { slot: AdSlot, shareUrl: string }) {
    const [copied, setCopied] = useState(false);
    const [showEmbed, setShowEmbed] = useState(false);
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: slot.id, data: { type: "Slot", slot } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const baseUrl = shareUrl.replace(/\/book\/.*/, '');
    const embedCode = `<iframe src="${baseUrl}/widget/${slot.id}" width="100%" height="150" frameborder="0" style="border-radius:12px;overflow:hidden;"></iframe>`;

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative bg-white border border-slate-200 p-4 rounded-xl mb-3 flex flex-col gap-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all ${slot.isBooked ? "opacity-60 bg-slate-50" : ""}`}
        >
            <div className="flex items-center gap-4 w-full">
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-slate-500 touch-none shrink-0">
                    <GripVertical size={20} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${slot.isBooked ? 'bg-emerald-400' : 'bg-blue-500'}`} />
                        <h4 className="text-sm font-bold text-slate-800 truncate">{slot.title || slot.displayType}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{new Date(slot.date).toLocaleDateString()}</span>
                        {slot.endDate && <span>- {new Date(slot.endDate).toLocaleDateString()}</span>}
                    </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                    <p className="text-sm font-black text-slate-800">{slot.price} €</p>
                    <div className="flex gap-1.5">
                        <Link href={`/dashboard?slotId=${slot.id}`} className="text-[10px] font-bold text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-600 px-2 py-1 rounded-md transition-colors">
                            Stats
                        </Link>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEmbed(!showEmbed); }}
                            className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors border ${showEmbed ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'}`}
                        >
                            Intégrer
                        </button>
                    </div>
                </div>
            </div>

            {/* Embed Section */}
            {showEmbed && (
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2 w-full" onClick={e => e.stopPropagation()}>
                    <p className="text-xs font-semibold text-slate-500">Collez ce code sur votre site :</p>
                    <div className="flex gap-2 items-center">
                        <input 
                            readOnly 
                            value={embedCode}
                            className="flex-1 text-[10px] font-mono p-2 bg-white border border-slate-200 rounded text-slate-500 focus:outline-none"
                        />
                        <button 
                            onClick={handleCopy}
                            className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                        >
                            {copied ? 'Copié !' : 'Copier'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- DROPPABLE CATEGORY CONTAINER ---
function CategoryContainer({ category, slots, shareUrl, onDeleteCategory }: { category: Category | "uncategorized", slots: AdSlot[], shareUrl: string, onDeleteCategory?: (id: string) => void }) {
    const { setNodeRef } = useSortable({
        id: typeof category === "string" ? category : category.id,
        data: { type: "Container", category }
    });

    return (
        <div ref={setNodeRef} className="bg-slate-100/80 border border-slate-200 shadow-sm rounded-3xl p-5 w-full md:w-[350px] shrink-0 flex flex-col max-h-[800px]">
            <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-bold text-slate-800 flex items-center gap-3 text-lg">
                    {typeof category === "string" ? "Non classé" : category.name}
                    <span className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">{slots.length}</span>
                </h3>
                {typeof category !== "string" && (
                    <button
                        onClick={() => onDeleteCategory && onDeleteCategory(category.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all"
                        title="Supprimer la catégorie"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <SortableContext items={slots.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {slots.map(slot => (
                        <SortableSlot key={slot.id} slot={slot} shareUrl={shareUrl} />
                    ))}
                </SortableContext>
                {slots.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-xl text-slate-400 text-sm font-semibold">
                        Déposez un créneau ici
                    </div>
                )}
            </div>
        </div>
    );
}


// --- MAIN COMPONENT ---
export default function CategoryBoard({ initialSlots, initialCategories, shareUrl }: Props) {
    const [slots, setSlots] = useState<AdSlot[]>(initialSlots);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Sync initial state if server updates
    useEffect(() => {
        setSlots(initialSlots);
        setCategories(initialCategories);
    }, [initialSlots, initialCategories]);

    // Actions
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        if (!name) return;

        // Optimistic update
        const tempId = "temp-" + Date.now();
        setCategories([...categories, { id: tempId, name }]);
        setIsCreating(false);

        await createCategory(name);
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Supprimer cette catégorie ? Les créneaux retourneront dans 'Non Classé'.")) return;
        setCategories(categories.filter(c => c.id !== id));
        await deleteCategory(id);
    };

    // Drag Handlers
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveSlot = active.data.current?.type === "Slot";
        const isOverSlot = over.data.current?.type === "Slot";
        const isOverContainer = over.data.current?.type === "Container";

        if (!isActiveSlot) return;

        // Moving Slot over another Slot
        if (isActiveSlot && isOverSlot) {
            setSlots((slots) => {
                const activeIndex = slots.findIndex((s) => s.id === activeId);
                const overIndex = slots.findIndex((s) => s.id === overId);

                if (slots[activeIndex].categoryId !== slots[overIndex].categoryId) {
                    slots[activeIndex].categoryId = slots[overIndex].categoryId;
                }

                return arrayMove(slots, activeIndex, overIndex);
            });
        }

        // Moving Slot over a Container (empty or not)
        if (isActiveSlot && isOverContainer) {
            setSlots((slots) => {
                const activeIndex = slots.findIndex((s) => s.id === activeId);
                const overCategoryId = over.id === "uncategorized" ? null : over.id;

                if (slots[activeIndex].categoryId !== overCategoryId) {
                    slots[activeIndex].categoryId = overCategoryId as string | null; // Cast for TS
                }
                return slots; // No reorder yet, treated in DragEnd
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeIndex = slots.findIndex((s) => s.id === activeId);
        const overIndex = slots.findIndex((s) => s.id === overId);

        let newSlots = [...slots];

        if (activeId !== overId && over.data.current?.type === "Slot") {
            newSlots = arrayMove(slots, activeIndex, overIndex);
            setSlots(newSlots);
        }

        // Save new order to server
        // We send payload containing all slot IDs, their new order index, and their categoryId
        const updates = newSlots.map((slot, index) => ({
            id: slot.id,
            order: index,
            categoryId: slot.categoryId || "uncategorized"
        }));

        await updateSlotOrder(updates);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2 pl-2">
                {/* Create Category Button */}
                {isCreating ? (
                    <form onSubmit={handleCreateCategory} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                        <input autoFocus name="name" placeholder="Nom de la collection..." className="bg-transparent text-slate-800 w-48 outline-none text-sm px-2 placeholder:text-slate-400 font-medium" />
                        <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 p-1.5 rounded-md shadow-sm transition-colors"><Plus size={16} /></button>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm border border-slate-200"
                    >
                        <FolderPlus size={16} className="text-slate-400" />
                        Nouvelle collection
                    </button>
                )}
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex items-start gap-8 overflow-x-auto pb-10 min-h-[500px]">
                    {/* Uncategorized Column */}
                    <CategoryContainer
                        category="uncategorized"
                        slots={slots.filter(s => !s.categoryId)}
                        shareUrl={shareUrl}
                    />

                    {/* User Categories */}
                    <SortableContext items={categories.map(c => c.id)}>
                        {categories.map(cat => (
                            <CategoryContainer
                                key={cat.id}
                                category={cat}
                                slots={slots.filter(s => s.categoryId === cat.id)}
                                shareUrl={shareUrl}
                                onDeleteCategory={handleDeleteCategory}
                            />
                        ))}
                    </SortableContext>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <SortableSlot slot={slots.find(s => s.id === activeId)!} shareUrl={shareUrl} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
