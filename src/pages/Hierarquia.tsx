import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PATENTES } from "@/lib/store";

import imgComandante from "@/assets/patentes/comandante.png";
import imgSubComandante from "@/assets/patentes/sub-comandante.png";
import imgMajor from "@/assets/patentes/major.png";
import imgCapitao from "@/assets/patentes/capitao.png";
import imgTenente from "@/assets/patentes/tenente.png";
import img1Sargento from "@/assets/patentes/1-sargento.png";
import img2Sargento from "@/assets/patentes/2-sargento.png";
import imgCabo from "@/assets/patentes/cabo.png";
import imgSoldado from "@/assets/patentes/soldado.png";
import imgRecruta from "@/assets/patentes/recruta.png";

const imagensMap: Record<string, string> = {
  Comandante: imgComandante,
  "Sub-Comandante": imgSubComandante,
  Major: imgMajor,
  Capitão: imgCapitao,
  Tenente: imgTenente,
  "1º Sargento": img1Sargento,
  "2º Sargento": img2Sargento,
  Cabo: imgCabo,
  Soldado: imgSoldado,
  Recruta: imgRecruta,
};

const descricoes: Record<string, string> = {
  Comandante: "Autoridade máxima da unidade. Controle total das operações e administração.",
  "Sub-Comandante": "Segundo no comando. Auxilia e substitui o Comandante quando necessário.",
  Major: "Responsável pela coordenação tática e planejamento de operações.",
  Capitão: "Lidera equipes em campo e supervisiona treinamentos avançados.",
  Tenente: "Oficial intermediário responsável por missões específicas.",
  "1º Sargento": "Sargento sênior com responsabilidades de liderança operacional.",
  "2º Sargento": "Auxiliar direto do 1º Sargento em operações de campo.",
  Cabo: "Líder de esquadra com experiência comprovada em operações.",
  Soldado: "Membro ativo com treinamento completo e apto para operações.",
  Recruta: "Membro em fase de treinamento e avaliação inicial.",
};

const INITIAL_SHOW = 5;

export default function Hierarquia() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? PATENTES : PATENTES.slice(0, INITIAL_SHOW);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground text-center mb-2">
          Hierarquia
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Estrutura de comando do Batalhão de Choque
        </p>

        <div className="space-y-3">
          {displayed.map((patente, i) => {
            const img = imagensMap[patente];
            return (
              <div
                key={patente}
                className="flex items-start gap-4 bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-md bg-accent flex items-center justify-center overflow-hidden">
                  <img
                    src={img}
                    alt={`Insígnia ${patente}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-base uppercase tracking-wider text-foreground">
                      {patente}
                    </span>
                    <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded">
                      Nível {PATENTES.length - i}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {descricoes[patente]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/80 text-foreground font-heading uppercase tracking-wider text-sm rounded-md transition-colors border border-border"
          >
            {showAll ? (
              <>
                <ChevronDown className="rotate-180" size={16} /> Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Mostrar mais
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
