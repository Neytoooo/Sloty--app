import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="space-y-4">
                <h1 className="text-9xl font-black text-gray-200">404</h1>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Page introuvable
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500">
                    Désolé, nous ne trouvons pas la page que vous recherchez. Elle a peut-être été déplacée ou supprimée.
                </p>
                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                        <MoveLeft className="mr-2 h-4 w-4" />
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
