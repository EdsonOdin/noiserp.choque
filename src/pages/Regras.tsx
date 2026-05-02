import { AlertTriangle, CheckCircle, Ban, Briefcase, ArrowUpCircle } from "lucide-react";

const regras = [
  {
    icon: ArrowUpCircle,
    titulo: "Respeito à Hierarquia",
    descricao:
      "Todo membro deve respeitar a cadeia de comando. Ordens de superiores devem ser acatadas sem questionamento em campo. Divergências devem ser tratadas pelos canais apropriados.",
  },
  {
    icon: CheckCircle,
    titulo: "Uso Obrigatório de Comunicação via Rádio",
    descricao:
      "Toda comunicação operacional deve ser realizada exclusivamente via rádio. Manter o canal limpo e utilizar códigos de comunicação padrão da unidade.",
  },
  {
    icon: Ban,
    titulo: "Proibição de Abuso de Poder",
    descricao:
      "É estritamente proibido o uso excessivo de força ou autoridade. Qualquer violação resultará em punição disciplinar imediata, podendo levar à demissão.",
  },
  {
    icon: Briefcase,
    titulo: "Conduta Profissional",
    descricao:
      "Manter postura profissional em todas as situações. Uso adequado do uniforme, linguagem apropriada e comportamento exemplar são obrigatórios.",
  },
  {
    icon: AlertTriangle,
    titulo: "Cumprimento de Ordens Superiores",
    descricao:
      "Ordens emitidas por oficiais superiores devem ser cumpridas integralmente. O não cumprimento pode acarretar em advertência, punição ou rebaixamento de patente.",
  },
];

export default function Regras() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground text-center mb-2">
          Regras
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Código de conduta do Batalhão de Choque
        </p>

        <div className="space-y-4">
          {regras.map((regra, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-5 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <regra.icon size={22} className="text-muted-foreground flex-shrink-0" />
                <h3 className="font-heading text-base uppercase tracking-wider text-foreground">
                  {regra.titulo}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed pl-9">
                {regra.descricao}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-card border border-border rounded-lg p-5 text-center">
          <p className="text-muted-foreground text-sm italic">
            "O descumprimento de qualquer regra está sujeito a punições disciplinares conforme determinação do Comandante."
          </p>
        </div>
      </div>
    </div>
  );
}
