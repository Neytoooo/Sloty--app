import { handleAssetsUpload } from "./actions";
import Background3D from "@/components/background-3d";
import { CheckCircle2, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ slotId: string; error?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { slotId, error } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-6 text-slate-800">
      <Background3D starsOnly />
      
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-[2rem] shadow-2xl relative z-10">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={32} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2 text-center tracking-tight">
          Paiement réussi !
        </h1>

        <p className="text-slate-500 text-sm text-center mb-8 font-medium">
          Dernière étape : complétez les informations ci-dessous pour activer votre publicité.
        </p>

        {error === 'missing_fields' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 text-sm font-semibold flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <p>Veuillez sélectionner une image et remplir tous les champs.</p>
          </div>
        )}
        
        {error === 'moderation_failed' && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-semibold flex items-start gap-3">
            <span className="text-rose-500 mt-0.5">⚠️</span>
            Votre image a été refusée par la modération (contenu inapproprié). Veuillez en choisir une autre.
          </div>
        )}

        <form action={handleAssetsUpload} className="space-y-6">
          <input type="hidden" name="slotId" value={slotId} />

          <div className="space-y-5 text-left">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 tracking-wider ml-1 mb-2">
                <LinkIcon size={14} />
                Lien de redirection
              </label>
              <input
                name="link"
                type="url"
                required
                className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-400"
                placeholder="https://votre-site.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 tracking-wider ml-1 mb-2">
                <ImageIcon size={14} />
                Visuel (600x200px conseillé)
              </label>
              <div className="relative">
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl outline-none transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-700 file:shadow-sm hover:file:bg-slate-50 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
          >
            <Upload size={18} />
            Publier la campagne
          </button>
        </form>
      </div>
    </div>
  );
}