import { FileText, Mail } from "lucide-react";

export default function Editais() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">

        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground text-center mb-2">
          Editais
        </h1>

        <p className="text-muted-foreground text-center mb-10">
          Editais de Processos Seletivos para o CHOQUE⚡
        </p>

        {/* 🔹 EDITAL 1 */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 text-center">
          <FileText size={40} className="mx-auto mb-4 text-muted-foreground" />

          <h2 className="font-heading text-lg uppercase tracking-wider mb-3">
            Edital 01 - Processo Seletivo CHOQUE Nº 01/2026
          </h2>

          <button
            onClick={() => window.open("/edital.pdf", "_blank")}
            className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800 transition"
          >
            📄 Acessar Edital
          </button>
        </div>

        {/* 🔹 EDITAL 2 */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 text-center">
          <FileText size={40} className="mx-auto mb-4 text-muted-foreground" />

          <h2 className="font-heading text-lg uppercase tracking-wider mb-3">
            Edital 02 - BREVE!
          </h2>

          <span className="bg-gray-600 text-white px-4 py-2 rounded inline-block">
            EM BREVE
          </span>
        </div>

        {/* 🔹 EDITAL 3 */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 text-center">
          <FileText size={40} className="mx-auto mb-4 text-muted-foreground" />

          <h2 className="font-heading text-lg uppercase tracking-wider mb-3">
            Edital 03 - BREVE!
          </h2>

          <span className="bg-gray-600 text-white px-4 py-2 rounded inline-block">
            EM BREVE!
          </span>
        </div>

        {/* 📡 AVISO FINAL */}
        <div className="bg-card border border-border rounded-lg p-6 text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground text-sm">
            <Mail size={16} />
            Fique atento aos comunicados oficiais no Discord!
          </div>
        </div>

      </div>
    </div>
  );
}
