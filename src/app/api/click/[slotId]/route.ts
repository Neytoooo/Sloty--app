import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await params;

  try {
    // 1. Mise à jour réelle en base de données
    const booking = await prisma.booking.update({
      where: { slotId: slotId },
      data: { 
        clicks: { increment: 1 } 
      },
      select: { adLink: true }
    });

    // 2. Redirection avec des headers pour empêcher le cache du navigateur
    const response = NextResponse.redirect(new URL(booking.adLink));
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;

  } catch (error) {
    console.error("Erreur tracking:", error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}