import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, update, push } from "firebase/database";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  status: string;
  criadoPor: string;
};

export default function Painel() {
  const navigate = useNavigate();

  const [user, setUser] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);

  const [novoValor, setNovoValor] = useState("");

  // 🔐 AUTENTICAÇÃO + DADOS DO USUÁRIO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }

      const snapshot = await onValue(ref(db, "usuarios/" + u.uid), (snap) => {
        if (!snap.exists()) {
          navigate("/login");
          return;
        }

        setUser({
          id: u.uid,
          ...snap.val(),
        });

        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  // 📦 USUÁRIOS EM TEMPO REAL
  useEffect(() => {
    const usuariosRef = ref(db, "usuarios");

    const unsubscribe = onValue(usuariosRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.val();

      const lista = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));

      setUsuarios(lista);
    });

    return () => unsubscribe();
  }, []);

  // 📦 SOLICITAÇÕES
  useEffect(() => {
    const refSol = ref(db, "solicitacoes");

    const unsubscribe = onValue(refSol, (snap) => {
      if (!snap.exists()) {
        setSolicitacoes([]);
        return;
      }

      const data = snap.val();

      const lista = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));

      setSolicitacoes(lista);
    });

    return () => unsubscribe();
  }, []);

  // 🧠 PERMISSÕES
  const isComandante = user?.permissao === "comandante";
  const isSub = user?.permissao === "sub-comandante";

  // 📝 CRIAR SOLICITAÇÃO (MEMBRO)
  async function solicitarAlteracao(usuarioId: string) {
    if (!novoValor) {
      toast({ title: "Digite um valor", variant: "destructive" });
      return;
    }

    await push(ref(db, "solicitacoes"), {
      usuarioId,
      tipo: "patente",
      valor: novoValor,
      status: "pendente",
      criadoPor: user?.nome,
    });

    setNovoValor("");

    toast({ title: "Solicitação enviada" });
  }

  // ✅ APROVAR (COMANDANTE)
  async function aprovar(s: Solicitacao) {
    await update(ref(db, "usuarios/" + s.usuarioId), {
      patente: s.valor,
    });

    await update(ref(db, "solicitacoes/" + s.id), {
      status: "aprovada",
    });

    toast({ title: "Aprovado" });
  }

  // ❌ RECUSAR
  async function recusar(id: string) {
    await update(ref(db, "solicitacoes/" + id), {
      status: "recusada",
    });

    toast({ title: "Recusado" });
  }

  if (loading || !user) {
    return <div className="text-center py-20">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold uppercase">Painel</h1>
        <p className="text-sm text-muted-foreground">
          {user.nome} • {user.permissao}
        </p>
      </div>

      {/* 📋 USUÁRIOS */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Usuários</h2>

        {usuarios.map((u) => (
          <div key={u.id} className="border p-4 rounded flex justify-between">

            <div>
              <p className="font-bold">{u.nome}</p>
              <p className="text-sm text-muted-foreground">
                {u.patente} • {u.status}
              </p>
            </div>

            {/* 👇 MEMBRO */}
            {!isComandante && (
              <div className="flex gap-2">
                <Input
                  placeholder="Nova patente"
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                />
                <Button onClick={() => solicitarAlteracao(u.id)}>
                  Solicitar
                </Button>
              </div>
            )}

            {/* 👇 COMANDANTE */}
            {isComandante && (
              <div className="text-green-500 text-sm">
                Controle total
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 📦 SOLICITAÇÕES */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Solicitações</h2>

        {solicitacoes.map((s) => (
          <div key={s.id} className="border p-4 rounded flex justify-between">

            <div>
              <p>{s.tipo} → {s.valor}</p>
              <p className="text-sm text-muted-foreground">
                {s.criadoPor} • {s.status}
              </p>
            </div>

            {isComandante && s.status === "pendente" && (
              <div className="flex gap-2">
                <Button onClick={() => aprovar(s)}>Aprovar</Button>
                <Button variant="destructive" onClick={() => recusar(s.id)}>
                  Recusar
                </Button>
              </div>
            )}
          </div>
        ))}

        {solicitacoes.length === 0 && (
          <p className="text-muted-foreground">Nenhuma solicitação</p>
        )}
      </div>

    </div>
  );
}
