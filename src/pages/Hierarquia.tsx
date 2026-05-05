import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

// NOVA ORDEM HIERÁRQUICA
const PATENTES = [
  "Diretor Geral",
  "Diretor",
  "Comandante Geral",
  "Comandante",
  "Sub Comandante",
  "Corregedor Geral",
  "Corregedoria",
  "Supervisor",
  "Coordenador",
  "Coronel",
  "Tenente Coronel",
  "Major",
  "Capitão",
  "1º Tenente",
  "2° Tenente",
  "Aspirante",
  "Sub Tenente",
  "1º Sargento",
  "2º Sargento",
  "3º Sargento",
  "Cabo",
  "Soldado",
  "Aluno",
];

const imagensMap: Record<string, string> = {
  "Diretor Geral": imgComandante,
  Diretor: imgComandante,
  "Comandante Geral": imgComandante,
  Comandante: imgComandante,
  "Sub Comandante": imgSubComandante,
  "Corregedor Geral": imgMajor,
  Corregedoria: imgMajor,
  Supervisor: imgCapitao,
  Coordenador: imgTenente,
  Coronel: imgMajor,
  "Tenente Coronel": imgMajor,
  Major: imgMajor,
  Capitão: imgCapitao,
  "1º Tenente": imgTenente,
  "2° Tenente": imgTenente,
  Aspirante: imgTenente,
  "Sub Tenente": img1Sargento,
  "1º Sargento": img1Sargento,
  "2º Sargento": img2Sargento,
  "3º Sargento": img2Sargento,
  Cabo: imgCabo,
  Soldado: imgSoldado,
  Aluno: imgRecruta,
};

const descricoes: Record<string, string> = {
  "Diretor Geral": "Autoridade máxima da organização.",
  Diretor: "Responsável pela gestão estratégica.",
  "Comandante Geral": "Comando geral das operações.",
  Comandante: "Responsável direto pelas unidades.",
  "Sub Comandante": "Auxilia o comando principal.",
  "Corregedor Geral": "Fiscaliza condutas e disciplina.",
  Corregedoria: "Setor responsável por investigações internas.",
  Supervisor: "Supervisiona operações e equipes.",
  Coordenador: "Coordena setores específicos.",
  Coronel: "Alta liderança operacional.",
  "Tenente Coronel": "Subcomando estratégico.",
  Major: "Coordenação tática.",
  Capitão: "Liderança em campo.",
  "1º Tenente": "Execução de missões.",
  "2° Tenente": "Auxílio em operações.",
  Aspirante: "Oficial em formação.",
  "Sub Tenente": "Ligação entre oficiais e praças.",
  "1º Sargento": "Liderança operacional sênior.",
  "2º Sargento": "Apoio ao comando de equipe.",
  "3º Sargento": "Execução e apoio tático.",
  Cabo: "Comando de pequenas equipes.",
  Soldado: "Operacional ativo.",
  Aluno: "Em fase de formação.",
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

            const sizes = Array(25).fill("w-9"); // padronizei tamanho pra não quebrar layout
            const sizeClass = sizes[i] || "w-9";

            return (
              <div
                key={patente}
                className="flex items-center gap-4 bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-shrink-0 w-14 flex items-center justify-center">
                  <img
                    src={img}
                    alt={`Insígnia ${patente}`}
                    className={`${sizeClass} h-auto object-contain`}
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
