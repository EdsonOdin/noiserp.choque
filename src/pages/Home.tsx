import { Shield, Target, Users, Radio } from "lucide-react";
import logoChoque from "@/assets/logo-choque.png";

const features = [
  { icon: Shield, title: "Força Tática", desc: "Unidade de elite preparada para operações de alto risco" },
  { icon: Target, title: "Precisão", desc: "Treinamento constante para máxima eficiência operacional" },
  { icon: Users, title: "Disciplina", desc: "Hierarquia e respeito como base da nossa estrutura" },
  { icon: Radio, title: "Comunicação", desc: "Coordenação tática em tempo real via rádio" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] bg-tactical-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(0_0%_15%/0.3)_0%,transparent_70%)]" />
        <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fade-in">
          <img
            src={logoChoque}
            alt="Logo Batalhão de Choque"
            width={512}
            height={512}
            className="w-40 h-40 md:w-56 md:h-56 object-contain mb-8 drop-shadow-2xl"
          />
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase tracking-widest text-foreground mb-4">
            Batalhão de Choque
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl tracking-wide">
            Força • Disciplina • Autoridade
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="/editais"
              className="px-6 py-3 bg-accent hover:bg-accent/80 text-foreground font-heading uppercase tracking-wider text-sm rounded-md transition-colors border border-border"
            >
              Acessar Editais Abertos
            </a>
             <a
              href="/concurso"
              className="px-6 py-3 border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 font-heading uppercase tracking-wider text-sm rounded-md transition-colors"
            >
              Acessar Concursos Abertos
            </a>
            <a
              href="/regras"
              className="px-6 py-3 border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 font-heading uppercase tracking-wider text-sm rounded-md transition-colors"
            >
              Regras
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 text-center hover:border-muted-foreground/30 transition-colors"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <f.icon className="mx-auto mb-4 text-muted-foreground" size={36} />
              <h3 className="font-heading text-lg uppercase tracking-wider text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Batalhão de Choque — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
