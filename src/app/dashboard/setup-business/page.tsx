import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Building2, ShieldCheck } from "lucide-react";

export default async function SetupBusiness() {
  async function handleVerify(formData: FormData) {
    "use server";
    const { userId } = await auth();
    if (!userId) return;

    const businessName = formData.get("businessName") as string;
    const siret = formData.get("siret") as string;

    if (businessName && siret.length >= 9) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { 
          businessVerified: true,
          businessName: businessName,
          siret: siret,
        },
      });
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl text-center">
        
        {/* Icône plus visible */}
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100">
          <Building2 className="text-blue-600" size={32} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Identité Pro</h1>
        <p className="text-slate-500 text-base mb-10 leading-relaxed">
          Renseignez vos informations professionnelles pour activer votre compte vendeur.
        </p>

        <form action={handleVerify} className="space-y-6 text-left">
          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">
              Nom de la société
            </label>
            <input 
              name="businessName" 
              type="text" 
              required 
              className="w-full mt-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="Ex: Mon Entreprise SAS"
            />
          </div>
          
          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">
              N° SIRET / ID Fiscal
            </label>
            <input 
              name="siret" 
              type="text" 
              required 
              className="w-full mt-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="123 456 789 00012"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <ShieldCheck size={18} className="text-blue-500 flex-shrink-0" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Données sécurisées et vérifiées
            </p>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
            Activer mon compte
          </button>
        </form>
      </div>
    </div>
  );
}