import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, push, set, remove } from "firebase/database";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type Membro = {
  id: string;
  nome: string;
  patente: string;
  status: string;
};

export default function Painel() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 VERIFICA LOGIN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/login");
      } else {
        setUser(u);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📦 CARREGA MEMBROS EM TEMPO REAL
  useEffect(() => {
    const membrosRef = ref(db, "membros");

    const unsubscribe = onValue(membrosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const lista = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));

        setMembros(lista);
      } else {
        setMembros([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ➕ ADICIONAR MEMBRO
  async function adicionarMembro() {
    if (!novoNome) {
      toast({ title: "Digite um nome", variant: "destructive" });
      return;
    }

    await push(ref(db, "membros"), {
      nome: novoNome,
      patente: "Recruta",
      status: "Ativo",
      criadoEm: Date.now(),
    });

    setNovoNome("");
    toast({ title: "Membro adicionado" });
  }

  // 🗑️ REMOVER
  async function removerMembro(id: string) {
    await remove(ref(db, "membros/" + id));
    toast({ title: "Removido" });
  }

  // ✏️ EDITAR (SIMPLES)
  async function editarMembro(m: Membro) {
    const novoNome = prompt("Novo nome:", m.nome);
    if (!novoNome) return;

    await set(ref(db, "membros/" + m.id), {
      ...m,
      nome: novoNome,
    });

    toast({ title: "Atualizado" });
  }

  if (loading) {
    return <div className="text-center py-20">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24 space-y-6">
      <h1 className="text-3xl font-bold">Painel</h1>

      <p className="text-sm text-muted-foreground">
        Logado como: {user?.email}
      </p>

      {/* ➕ NOVO MEMBRO */}
      <div className="bg-card border p-4 rounded space-y-2">
        <Label>Nome</Label>
        <Input
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        <Button onClick={adicionarMembro}>Adicionar</Button>
      </div>

      {/* 📋 LISTA */}
      <div className="space-y-2">
        {membros.map((m) => (
          <div
            key={m.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-bold">{m.nome}</p>
              <p className="text-sm text-muted-foreground">
                {m.patente} • {m.status}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => editarMembro(m)}>
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removerMembro(m.id)}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}

        {membros.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhum membro cadastrado
          </p>
        )}
      </div>
    </div>
  );
}
