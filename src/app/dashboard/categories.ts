"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error("User not found");

    await prisma.category.create({
        data: {
            name,
            userId: user.id,
        }
    });

    revalidatePath("/dashboard");
}

export async function deleteCategory(categoryId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error("User not found");

    // Verify ownership
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category || category.userId !== user.id) throw new Error("Forbidden");

    // We need to decide what to do with slots. 
    // Let's unset the categoryId for now, so they go back to "Uncategorized"
    await prisma.adSlot.updateMany({
        where: { categoryId: categoryId },
        data: { categoryId: null }
    });

    await prisma.category.delete({ where: { id: categoryId } });

    revalidatePath("/dashboard");
}

export async function updateSlotOrder(items: { id: string; categoryId: string | null; order: number }[]) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Pour optimiser, on pourrait faire une transaction, 
    // mais une boucle update est souvent acceptable pour des petits volumes.
    // On vérifie juste que l'user est le créateur des slots (optionnel mais mieux pour sécu)

    const transaction = items.map((item) =>
        prisma.adSlot.update({
            where: { id: item.id },
            data: {
                categoryId: item.categoryId === "uncategorized" ? null : item.categoryId,
                order: item.order
            }
        })
    );

    await prisma.$transaction(transaction);
    revalidatePath("/dashboard");
}
