import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slotId: string }> } // Correction ici
) {
  // CORRECTION : On attend les paramètres avant de les utiliser 
  const { slotId } = await params;

  try {
    // 1. Mise à jour réelle en base de données [cite: 100]
    const booking = await prisma.booking.update({
      where: { slotId: slotId },
      data: {
        clicks: { increment: 1 }
      },
      select: { adLink: true }
    });

    // 2. Redirection avec des headers pour empêcher le cache du navigateur [cite: 101, 102]
    const response = NextResponse.redirect(new URL(booking.adLink));
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;

  } catch (error) {
    console.error("Erreur tracking:", error);
    // Redirection vers l'accueil si le lien n'est pas trouvé [cite: 103]
    return NextResponse.redirect(new URL('/', request.url));
  }
}