import { FileText, Mail } from "lucide-react";

export default function Concurso() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-foreground text-center mb-2">
          Concurso
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Processo seletivo do Batalhão de Choque
        </p>

        <div className="bg-card border border-border rounded-lg p-10 text-center">
          <FileText size={48} className="mx-auto mb-6 text-muted-foreground" />
          <h2 className="font-heading text-xl uppercase tracking-wider text-foreground mb-4">
            Processo Seletivo para o CHOQUE!
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Faça seu Processo Seletivo abaixo: <br /> 
            
            <a
  href="https://docs.google.com/forms/d/e/1FAIpQLSfsdwbLsNVQfDDzD6VGz2kZ2vx7wr8FLdjg4op2z68_s6enuQ/viewform?usp=publish-editor"
  className="bg-gray-500 text-white px-4 py-0.5 rounded"
>
  👉 Processo Seletivo 👈
</a>

          
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-md text-muted-foreground text-sm">
            <Mail size={16} />
            Fique atento nos resultados aos comunicados oficiais no Discord!
          </div>
        </div>
      </div>
    </div>
  );
}
