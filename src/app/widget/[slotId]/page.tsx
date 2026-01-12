import { prisma } from "@/lib/prisma";

export default async function WidgetPage({ params }: { params: Promise<{ slotId: string }> }) {
  const { slotId } = await params;

  const slot = await prisma.adSlot.findUnique({
    where: { id: slotId },
    include: { booking: true }
  });

  if (!slot) return <div className="text-xs text-slate-400">Annonce non trouvée</div>;

  // URL de base pour éviter les liens cassés
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const bookingUrl = `${baseUrl}/book/${slot.creatorId}`;

  return (
    // h-screen pour forcer le widget à prendre toute la hauteur de l'iframe
    <div className="h-screen w-full overflow-hidden bg-white">
      {slot.isBooked && slot.booking ? (
        <a href={slot.booking.adLink} target="_blank" rel="noopener" className="block w-full h-full">
          <img 
            src={slot.booking.adImage} 
            alt="Sponsor" 
            className="w-full h-full object-cover" 
          />
        </a>
      ) : (
        <a 
          href={bookingUrl} 
          target="_blank"
          className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-400 transition-all px-4 no-underline group"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">
            Espace Disponible
          </span>
          <span className="text-sm font-bold text-slate-900 mt-1">
            Votre pub ici ({slot.price}€)
          </span>
        </a>
      )}
    </div>
  );
}