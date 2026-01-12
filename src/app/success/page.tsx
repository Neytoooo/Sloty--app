import { handleAssetsUpload } from "./actions";

export default function SuccessPage({ searchParams }: { searchParams: { slotId: string } }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
      <form action={handleAssetsUpload} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Envoyez vos visuels</h1>
        
        {/* Champ caché pour savoir quel slot mettre à jour */}
        <input type="hidden" name="slotId" value={searchParams.slotId} />

        <div className="space-y-4">
          <input 
            name="adLink" 
            type="url" 
            placeholder="Lien de redirection (https://...)" 
            className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700"
            required 
          />
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Image de la pub (600x200px)</label>
            <input 
              name="adImage" 
              type="file" 
              accept="image/*"
              className="text-sm"
              required 
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold">
            Valider l'affichage sur le site
          </button>
        </div>
      </form>
    </div>
  );
}