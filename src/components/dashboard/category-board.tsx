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
}

// --- SORTABLE ITEM COMPONENT ---
function SortableSlot({ slot }: { slot: AdSlot }) {
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
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative bg-slate-800/40 border border-slate-700 p-4 rounded-xl mb-3 flex items-center gap-4 hover:border-slate-500 transition-colors ${slot.isBooked ? "opacity-75" : ""}`}
        >
            {/* Drag Handle */}
            <div {...attributes} {...listeners} className="cursor-grab text-slate-600 hover:text-slate-300 touch-none">
                <GripVertical size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${slot.isBooked ? 'bg-green-500' : 'bg-slate-600'}`} />
                    <h4 className="text-sm font-bold text-white truncate">{slot.title || slot.displayType}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Calendar size={12} />
                    <span>{new Date(slot.date).toLocaleDateString()}</span>
                    {slot.endDate && <span>- {new Date(slot.endDate).toLocaleDateString()}</span>}
                </div>
            </div>

            <div className="text-right">
                <p className="text-sm font-black text-white">{slot.price}€</p>
                <Link href={`/dashboard?slotId=${slot.id}`} className="text-[10px] text-blue-400 hover:underline">
                    Détails
                </Link>
            </div>
        </div>
    );
}

// --- DROPPABLE CATEGORY CONTAINER ---
function CategoryContainer({ category, slots, onDeleteCategory }: { category: Category | "uncategorized", slots: AdSlot[], onDeleteCategory?: (id: string) => void }) {
    const { setNodeRef } = useSortable({
        id: typeof category === "string" ? category : category.id,
        data: { type: "Container", category }
    });

    return (
        <div ref={setNodeRef} className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 w-full md:w-[350px] shrink-0 flex flex-col max-h-[800px]">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                    {typeof category === "string" ? "Non classé" : category.name}
                    <span className="bg-slate-800 text-slate-500 text-xs px-2 py-0.5 rounded-full">{slots.length}</span>
                </h3>
                {typeof category !== "string" && (
                    <button
                        onClick={() => onDeleteCategory && onDeleteCategory(category.id)}
                        className="text-slate-600 hover:text-red-500 transition-colors"
                        title="Supprimer la catégorie"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <SortableContext items={slots.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {slots.map(slot => (
                        <SortableSlot key={slot.id} slot={slot} />
                    ))}
                </SortableContext>
                {slots.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
                        Déposez un créneau ici
                    </div>
                )}
            </div>
        </div>
    );
}


// --- MAIN COMPONENT ---
export default function CategoryBoard({ initialSlots, initialCategories }: Props) {
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
            <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                {/* Create Category Button */}
                {isCreating ? (
                    <form onSubmit={handleCreateCategory} className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                        <input autoFocus name="name" placeholder="Nom..." className="bg-transparent text-white w-32 outline-none text-sm px-2" />
                        <button type="submit" className="text-green-400 hover:text-green-300"><Plus size={18} /></button>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg"
                    >
                        <FolderPlus size={16} />
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
                <div className="flex items-start gap-6 overflow-x-auto pb-10 min-h-[500px]">
                    {/* Uncategorized Column */}
                    <CategoryContainer
                        category="uncategorized"
                        slots={slots.filter(s => !s.categoryId)}
                    />

                    {/* User Categories */}
                    <SortableContext items={categories.map(c => c.id)}>
                        {categories.map(cat => (
                            <CategoryContainer
                                key={cat.id}
                                category={cat}
                                slots={slots.filter(s => s.categoryId === cat.id)}
                                onDeleteCategory={handleDeleteCategory}
                            />
                        ))}
                    </SortableContext>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <SortableSlot slot={slots.find(s => s.id === activeId)!} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
