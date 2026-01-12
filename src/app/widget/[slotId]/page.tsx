import { prisma } from "@/lib/prisma";

export default async function WidgetPage({ params }: { params: Promise<{ slotId: string }> }) {
  const { slotId } = await params;

  // On récupère le slot ET son booking associé
  const slot = await prisma.adSlot.findUnique({
    where: { id: slotId },
    include: { booking: true } // Indispensable pour accéder à adImage
  });

  if (!slot) return <div className="text-xs text-slate-400">Annonce non trouvée</div>;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      {/* On vérifie si le slot est réservé ET si le booking contient une image */}
      {slot.isBooked && slot.booking?.adImage ? (
        <a 
          href={slot.booking.adLink} 
          target="_blank" 
          rel="noopener" 
          className="block w-full h-full group relative"
        >
          <img 
            src={slot.booking.adImage} 
            alt="Sponsor" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </a>
      ) : (
        <a 
          href={`${baseUrl}/book/${slot.creatorId}`} 
          target="_blank"
          className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-400 transition-all px-4 no-underline group"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
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