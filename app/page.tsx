import Link from "next/link";
import { FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">InDOC</span>
          </div>
          <nav>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                Acessar Sistema
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Gestão Inteligente de <span className="text-blue-600">Documentos</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Plataforma segura para submissão, análise e armazenamento de documentos corporativos.
              Controle total sobre quem vê e aprova seus arquivos.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
             <Link href="/login">
              <Button className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Começar Agora
              </Button>
             </Link>
             <Button variant="outline" className="h-12 px-8 text-lg rounded-full border-gray-300 hover:bg-gray-50 text-gray-700">
               Saiba Mais
             </Button>
          </div>

          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Segurança Avançada</h3>
              <p className="text-gray-600">Controle de acesso granular e proteção de dados sensíveis.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Organização Centralizada</h3>
              <p className="text-gray-600">Todos os seus documentos em um único lugar, fáceis de encontrar.</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Auditoria Completa</h3>
              <p className="text-gray-600">Rastreabilidade total de quem acessou ou modificou arquivos.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} InDOC. Todos os direitos reservados.
      </footer>
    </div>
  );
}
