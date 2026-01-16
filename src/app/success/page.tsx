import { handleAssetsUpload } from "./actions";

// On définit l'interface pour les paramètres de l'URL (Next.js 15)
interface SuccessPageProps {
  searchParams: Promise<{ slotId: string; error?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  // CORRECTIF : On doit "unwrapper" searchParams avant de l'utiliser
  const { slotId, error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-200">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-6 text-center">
          Paiement réussi ! 🚀
        </h1>

        {error === 'moderation_failed' && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200 text-sm font-semibold">
            ⚠️ Votre image a été refusée par la modération (contenu inapproprié). Veuillez en choisir une autre.
          </div>
        )}
        <p className="text-slate-400 text-sm text-center mb-8">
          Complétez les informations ci-dessous pour activer votre publicité sur le site.
        </p>

        <form action={handleAssetsUpload} className="space-y-6">
          {/* On passe l'ID du slot pour que l'action sache quoi mettre à jour */}
          <input type="hidden" name="slotId" value={slotId} />

          <div className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Lien de redirection (Destination)
              </label>
              <input
                name="link"
                type="url"
                required
                className="w-full mt-2 p-4 bg-slate-800 border border-slate-700 text-white rounded-2xl outline-none focus:border-blue-500 transition-all"
                placeholder="https://votre-site.com"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Image publicitaire (600x200px conseillé)
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                required
                className="w-full mt-2 p-4 bg-slate-800 border border-slate-700 text-slate-400 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Publier maintenant
          </button>
        </form>
      </div>
    </div>
  );
}