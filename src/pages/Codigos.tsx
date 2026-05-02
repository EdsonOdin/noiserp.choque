import { Radio, ShieldAlert } from "lucide-react";

const codigosQ = [
  { codigo: "QAP", significado: "Estou na escuta / Está na escuta?" },
  { codigo: "QRX", significado: "Aguarde um momento" },
  { codigo: "QSL", significado: "Entendido / Confirmado" },
  { codigo: "QTA", significado: "Cancele a última mensagem" },
  { codigo: "QTH", significado: "Localização atual" },
  { codigo: "QTR", significado: "Hora certa" },
  { codigo: "QRU", significado: "Tem algo para mim? / Alguma novidade?" },
  { codigo: "QSO", significado: "Comunicação direta entre duas partes" },
  { codigo: "QSP", significado: "Retransmitir mensagem" },
  { codigo: "QRR", significado: "Emergência / Situação de perigo" },
  { codigo: "QTI", significado: "Direção do deslocamento" },
  { codigo: "QTC", significado: "Tenho mensagem para transmitir" },
];

const codigosOperacionais = [
  { codigo: "Código 0", significado: "Sem alteração / Brevidade", cor: "border-muted-foreground/40" },
  { codigo: "Código 1", significado: "Solicitação de apoio da ROCAM", cor: "border-primary/60" },
  { codigo: "Código 2", significado: "Brevidade", cor: "border-yellow-500/60" },
  { codigo: "Código 3", significado: "Brevidade Total — Policial ferido", cor: "border-destructive/60" },
];

export default function Codigos() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Radio className="mx-auto mb-4 text-muted-foreground" size={40} />
          <h1 className="font-heading text-3xl md:text-5xl uppercase tracking-widest text-foreground mb-2">
            Códigos
          </h1>
          <p className="text-muted-foreground tracking-wide">
            Códigos de comunicação utilizados pelo Batalhão de Choque
          </p>
        </div>

        {/* Códigos Operacionais */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="text-muted-foreground" size={22} />
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">
              Códigos Operacionais
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {codigosOperacionais.map((c) => (
              <div
                key={c.codigo}
                className={`bg-card border-l-4 ${c.cor} border border-border rounded-lg p-5 hover:bg-accent/30 transition-colors`}
              >
                <span className="font-heading text-lg uppercase tracking-wider text-foreground block mb-1">
                  {c.codigo}
                </span>
                <span className="text-muted-foreground text-sm">{c.significado}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Códigos Q */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Radio className="text-muted-foreground" size={22} />
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">
              Códigos Q — Comunicação via Rádio
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {codigosQ.map((c) => (
              <div
                key={c.codigo}
                className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors"
              >
                <span className="font-heading text-base uppercase tracking-wider text-foreground block mb-1">
                  {c.codigo}
                </span>
                <span className="text-muted-foreground text-sm">{c.significado}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
