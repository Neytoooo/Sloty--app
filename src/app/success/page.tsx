import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// On utilise le nom correct suggéré par l'erreur : handleAssetsUpload
import { handleAssetsUpload } from "./actions"; 

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ slotId: string }>;
}) {
  // CORRECTIF 1 : On attend (await) les paramètres asynchrones de Next.js 15
  const { slotId } = await searchParams;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-6 text-center">
          Dernière étape ! 🚀
        </h1>
        <p className="text-slate-400 text-sm text-center mb-8">
          Ajoutez votre lien et votre visuel pour activer la publicité sur le site.
        </p>

        <form action={handleAssetsUpload} className="space-y-6">
          {/* CORRECTIF 2 : On utilise la valeur extraite de l'await */}
          <input type="hidden" name="slotId" value={slotId} />

          <div className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Lien de redirection
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
                Image publicitaire
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
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          >
            Publier maintenant
          </button>
        </form>
      </div>
    </div>
  );
}