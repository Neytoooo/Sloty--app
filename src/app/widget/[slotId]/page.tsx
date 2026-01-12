import { prisma } from "@/lib/prisma";

export default async function WidgetPage({ params }: { params: Promise<{ slotId: string }> }) {
  const { slotId } = await params;

  const slot = await prisma.adSlot.findUnique({
    where: { id: slotId },
    include: { booking: true }
  });

  if (!slot) return <div className="text-xs text-slate-400">Annonce introuvable</div>;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="h-screen w-full overflow-hidden bg-white flex items-center justify-center">
      {slot.isBooked && slot.booking?.adImage ? (
        <a 
          // On passe par l'API pour enregistrer le clic avant la redirection 
          href={`${baseUrl}/api/click/${slot.id}`} 
          target="_blank" 
          rel="noopener" 
          className="block w-full h-full"
        >
          <img 
            src={slot.booking.adImage} 
            alt="Publicité" 
            className="w-full h-full object-cover" 
          />
        </a>
      ) : (
        <a 
          href={`${baseUrl}/book/${slot.creatorId}`}
          target="_blank"
          className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-400 transition-all text-center no-underline px-4"
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Publicité</span>
          <span className="text-sm font-bold text-slate-900 mt-1">Sponsorisez ce contenu</span>
        </a>
      )}
    </div>
  );
}