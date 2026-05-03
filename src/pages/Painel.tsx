import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, update, push } from "firebase/database";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  patente: string;
  permissao: "comandante" | "sub-comandante" | "membro";
  status: "Ativo" | "Afastado" | "Demitido";
};

type Solicitacao = {
  id: string;
  usuarioId: string;
  tipo: string;
  valor: string;
  status: "pendente" | "analise" | "aprovada" | "recusada";
  criadoPor: string;
};

export default function Painel() {
  const navigate = useNavigate();

  const [user, setUser] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [novoValor, setNovoValor] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH + DADOS
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return navigate("/login");

      onValue(ref(db, "usuarios/" + u.uid), (snap) => {
        if (!snap.exists()) return navigate("/login");

        setUser({ id: u.uid, ...snap.val() });
        setLoading(false);
      });
    });

    return () => unsub();
  }, []);

  // 📦 USUÁRIOS
  useEffect(() => {
    return onValue(ref(db, "usuarios"), (snap) => {
      if (!snap.exists()) return setUsuarios([]);

      const data = snap.val();
      setUsuarios(Object.keys(data).map(id => ({ id, ...data[id] })));
    });
  }, []);

  // 📦 SOLICITAÇÕES
  useEffect(() => {
    return onValue(ref(db, "solicitacoes"), (snap) => {
      if (!snap.exists()) return setSolicitacoes([]);

      const data = snap.val();
      setSolicitacoes(Object.keys(data).map(id => ({ id, ...data[id] })));
    });
  }, []);

  // 🧠 PERMISSÕES
  const isComandante = user?.permissao === "comandante";
  const isSub = user?.permissao === "sub-comandante";
  const isMembro = user?.permissao === "membro";

  // 👮 SUB → CRIA SOLICITAÇÃO
  async function solicitar(usuarioId: string) {
    if (!novoValor) {
      return toast({ title: "Digite um valor", variant: "destructive" });
    }

    await push(ref(db, "solicitacoes"), {
      usuarioId,
      tipo: "patente",
      valor: novoValor,
      status: "pendente",
      criadoPor: user?.nome,
    });

    setNovoValor("");
    toast({ title: "Solicitação criada" });
  }

  // 👮 SUB → ENCAMINHAR
  async function encaminhar(id: string) {
    await update(ref(db, "solicitacoes/" + id), {
      status: "analise",
    });

    toast({ title: "Enviado ao comandante" });
  }

  // 🧠 COMANDANTE → APROVAR
  async function aprovar(s: Solicitacao) {
    await update(ref(db, "usuarios/" + s.usuarioId), {
      patente: s.valor,
    });

    await update(ref(db, "solicitacoes/" + s.id), {
      status: "aprovada",
    });

    toast({ title: "Aprovado" });
  }

  // 🧠 COMANDANTE → RECUSAR
  async function recusar(id: string) {
    await update(ref(db, "solicitacoes/" + id), {
      status: "recusada",
    });

    toast({ title: "Recusado" });
  }

  // 🧠 COMANDANTE → ALTERAR PERMISSÃO
  async function alterarPermissao(id: string) {
    const nova = prompt("Nova permissão (comandante/sub-comandante/membro):");
    if (!nova) return;

    await update(ref(db, "usuarios/" + id), {
      permissao: nova,
    });

    toast({ title: "Permissão atualizada" });
  }

  if (loading || !user) {
    return <div className="text-center py-20">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24 space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Painel</h1>
        <p>{user.nome} • {user.permissao}</p>
      </div>

      {/* 👥 USUÁRIOS */}
      <div className="space-y-2">
        {usuarios.map(u => (
          <div key={u.id} className="border p-4 rounded flex justify-between">

            <div>
              <p className="font-bold">{u.nome}</p>
              <p className="text-sm">{u.patente} • {u.status}</p>
            </div>

            {/* 👮 SUB */}
            {isSub && (
              <div className="flex gap-2">
                <Input
                  placeholder="Nova patente"
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                />
                <Button onClick={() => solicitar(u.id)}>Solicitar</Button>
              </div>
            )}

            {/* 🧠 COMANDANTE */}
            {isComandante && (
              <Button onClick={() => alterarPermissao(u.id)}>
                Alterar Permissão
              </Button>
            )}

          </div>
        ))}
      </div>

      {/* 📦 SOLICITAÇÕES */}
      <div className="space-y-2">
        <h2>Solicitações</h2>

        {solicitacoes.map(s => (
          <div key={s.id} className="border p-4 rounded flex justify-between">

            <div>
              <p>{s.tipo} → {s.valor}</p>
              <p className="text-sm">{s.criadoPor} • {s.status}</p>
            </div>

            {/* 👮 SUB */}
            {isSub && s.status === "pendente" && (
              <Button onClick={() => encaminhar(s.id)}>
                Encaminhar
              </Button>
            )}

            {/* 🧠 COMANDANTE */}
            {isComandante && s.status === "analise" && (
              <div className="flex gap-2">
                <Button onClick={() => aprovar(s)}>Aprovar</Button>
                <Button variant="destructive" onClick={() => recusar(s.id)}>
                  Recusar
                </Button>
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}
