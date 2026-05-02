import { Calendar, Clock } from "lucide-react";

const dias = [
  { dia: "Segunda", atividade: "Alinhamento", cor: "tactical-blue" },
  { dia: "Terça", atividade: "Patrulha Leve", cor: "tactical-green" },
  { dia: "Quarta", atividade: "Patrulha Ostensiva", cor: "tactical-gold" },
  { dia: "Quinta", atividade: "Treinamento dos Recrutas", cor: "tactical-red" },
  { dia: "Sexta", atividade: "Promoções de Cargo", cor: "tactical-gold" },
  { dia: "Sábado", atividade: "Recrutamento / Integração", cor: "tactical-green" },
  { dia: "Domingo", atividade: "Folga por Escala e Efetivo Reduzido", cor: "tactical-blue" },
];

const corClasses: Record<string, string> = {
  "tactical-blue": "border-l-[hsl(210,50%,40%)] bg-[hsl(210,50%,40%,0.08)]",
  "tactical-green": "border-l-[hsl(120,30%,35%)] bg-[hsl(120,30%,35%,0.08)]",
  "tactical-gold": "border-l-[hsl(45,80%,55%)] bg-[hsl(45,80%,55%,0.08)]",
  "tactical-red": "border-l-[hsl(0,60%,45%)] bg-[hsl(0,60%,45%,0.08)]",
};

export default function Cronograma() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground text-center mb-2">
          Cronograma Semanal
        </h1>
        <p className="text-muted-foreground text-center mb-10 flex items-center justify-center gap-2">
          <Calendar size={18} /> Agenda operacional da unidade
        </p>

        <div className="space-y-3">
          {dias.map((item, i) => (
            <div
              key={i}
              className={`border-l-4 rounded-lg p-4 flex items-center gap-4 animate-fade-in ${corClasses[item.cor] || ""}`}
              style={{
                animationDelay: `${i * 80}ms`,
                borderLeftColor: item.cor === "tactical-blue" ? "hsl(210,50%,40%)" :
                  item.cor === "tactical-green" ? "hsl(120,30%,35%)" :
                  item.cor === "tactical-gold" ? "hsl(45,80%,55%)" : "hsl(0,60%,45%)",
              }}
            >
              <div className="flex-shrink-0 w-24">
                <span className="font-heading text-sm uppercase tracking-wider text-foreground">
                  {item.dia}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {item.atividade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
