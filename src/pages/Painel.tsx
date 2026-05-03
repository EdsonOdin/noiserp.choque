import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  ref,
  onValue,
  update,
  push,
  set
} from "firebase/database";

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
  const [loading, setLoading] = useState(true);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([];

  const [novoValor, setNovoValor] = useState("");

  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novaPatente, setNovaPatente] = useState("Recruta");
  const [novaPermissao, setNovaPermissao] = useState<"comandante" | "sub-comandante" | "membro">("membro");

  // 🔐 AUTH
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

  // 👤 CRIAR USUÁRIO
  async function criarUsuario() {
    if (!isComandante) {
      return toast({ title: "Acesso negado", variant: "destructive" });
    }

    if (!novoNome || !novoEmail || !novaSenha) {
      return toast({ title: "Preencha tudo", variant: "destructive" });
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        novoEmail,
        novaSenha
      );

      await set(ref(db, "usuarios/" + cred.user.uid), {
        nome: novoNome,
        email: novoEmail,
        patente: novaPatente,
        permissao: novaPermissao,
        status: "Ativo",
      });

      toast({ title: "Usuário criado com sucesso" });

      setNovoNome("");
      setNovoEmail("");
      setNovaSenha("");

    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  // 👮 SUB → SOLICITA
  async function solicitar(usuarioId: string) {
    if (!novoValor) return;

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

  // 👮 SUB → ENCAMINHAR
  async function encaminhar(id: string) {
    await update(ref(db, "solicitacoes/" + id), {
      status: "analise",
    });

    toast({ title: "Enviado ao comandante" });
  }

  // 🧠 APROVAR
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

  // 🧠 ALTERAR PERMISSÃO
  async function alterarPermissao(id: string) {
    const nova = prompt("Nova permissão:");
    if (!nova) return;

    await update(ref(db, "usuarios/" + id), {
      permissao: nova,
    });

    toast({ title: "Permissão atualizada" });
  }

  // 🧠 ALTERAR PATENTE
  async function alterarPatente(id: string) {
    const nova = prompt("Nova patente:");
    if (!nova) return;

    await update(ref(db, "usuarios/" + id), {
      patente: nova,
    });

    toast({ title: "Patente atualizada" });
  }

  if (loading || !user) {
    return <div className="text-center py-20">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24 space-y-8">

      <div>
        <h1 className="text-3xl font-bold uppercase">Painel</h1>
        <p>{user.nome} • {user.permissao}</p>
      </div>

      {/* 🧠 CRIAR USUÁRIO */}
      {isComandante && (
        <div className="border border-border bg-card p-4 rounded space-y-2">
          <h2 className="font-bold">Criar Usuário</h2>

          <Input placeholder="Nome" value={novoNome} onChange={e => setNovoNome(e.target.value)} />
          <Input placeholder="Email" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} />
          <Input placeholder="Senha" type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
          <Input placeholder="Patente" value={novaPatente} onChange={e => setNovaPatente(e.target.value)} />

          {/* ✅ SELECT CORRIGIDO */}
          <select
            className="w-full bg-background text-foreground border border-border rounded px-2 py-2"
            value={novaPermissao}
            onChange={e => setNovaPermissao(e.target.value as any)}
          >
            <option value="membro">Membro</option>
            <option value="sub-comandante">Sub-Comandante</option>
            <option value="comandante">Comandante</option>
          </select>

          <Button onClick={criarUsuario}>Criar</Button>
        </div>
      )}

      {/* 👥 USUÁRIOS */}
      <div className="space-y-2">
        {usuarios.map(u => (
          <div key={u.id} className="border p-4 rounded flex justify-between items-center">

            <div>
              <p className="font-bold">{u.nome}</p>
              <p className="text-sm">{u.patente} • {u.status}</p>
            </div>

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

            {isComandante && (
              <div className="flex gap-2">
                <Button onClick={() => alterarPatente(u.id)}>
                  Patente
                </Button>
                <Button onClick={() => alterarPermissao(u.id)}>
                  Permissão
                </Button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* 📦 SOLICITAÇÕES */}
      <div className="space-y-2">
        <h2 className="font-bold">Solicitações</h2>

        {solicitacoes.map(s => (
          <div key={s.id} className="border p-4 rounded flex justify-between">

            <div>
              <p>{s.tipo} → {s.valor}</p>
              <p className="text-sm">{s.criadoPor} • {s.status}</p>
            </div>

            {isSub && s.status === "pendente" && (
              <Button onClick={() => encaminhar(s.id)}>
                Encaminhar
              </Button>
            )}

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
