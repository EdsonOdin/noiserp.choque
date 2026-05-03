import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  initializeStore,
  subscribe,
  getAuthUser,
  getMembros,
  getSolicitacoes,
  addMembro,
  updateMembro,
  deleteMembro,
  addSolicitacao,
  updateSolicitacao,
  migrarDoLocalStorage,
  PATENTES,
  type Membro,
  type Patente,
  type StatusMembro,
  type PermissaoNivel,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Check, X, Upload, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS: StatusMembro[] = ["Ativo", "Punido", "Demitido"];
const PERMISSOES: PermissaoNivel[] = ["comandante", "sub-comandante", "membro"];
const PAGE_SIZE = 10;

export default function Painel() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  // filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroPatente, setFiltroPatente] = useState<string>("todas");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [page, setPage] = useState(1);

  // novo membro
  const [novo, setNovo] = useState<Omit<Membro, "id" | "criadoEm">>({
    nome: "",
    patente: "Recruta",
    status: "Ativo",
    permissao: "membro",
    senha: "",
  });

  // edição inline
  const [editando, setEditando] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Membro>>({});

  // solicitação (sub-comandante)
  const [solMembroId, setSolMembroId] = useState("");
  const [solCampo, setSolCampo] = useState<string>("patente");
  const [solValor, setSolValor] = useState("");
  const [solMotivo, setSolMotivo] = useState("");

  useEffect(() => {
    initializeStore().then(() => setReady(true));
    const unsub = subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const user = getAuthUser();

  useEffect(() => {
    if (ready && !user) navigate("/login");
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
        Carregando painel...
      </div>
    );
  }

  const isComandante = user.permissao === "comandante";
  const isSub = user.permissao === "sub-comandante";
  const podeEditar = isComandante;

  const membros = getMembros();
  const solicitacoes = getSolicitacoes();
  const pendentes = solicitacoes.filter((s) => s.status === "pendente");

  const filtrados = useMemo(() => {
    return membros.filter((m) => {
      if (filtroNome && !m.nome.toLowerCase().includes(filtroNome.toLowerCase())) return false;
      if (filtroPatente !== "todas" && m.patente !== filtroPatente) return false;
      if (filtroStatus !== "todos" && m.status !== filtroStatus) return false;
      return true;
    });
  }, [membros, filtroNome, filtroPatente, filtroStatus]);

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const visiveis = filtrados.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  function handleAddMembro() {
    if (!novo.nome || !novo.senha) {
      toast({ title: "Nome e senha são obrigatórios", variant: "destructive" });
      return;
    }
    addMembro(novo);
    setNovo({ nome: "", patente: "Recruta", status: "Ativo", permissao: "membro", senha: "" });
    toast({ title: "Membro adicionado" });
  }

  function startEdit(m: Membro) {
    setEditando(m.id);
    setEditData({ nome: m.nome, patente: m.patente, status: m.status, permissao: m.permissao });
  }

  function saveEdit(id: string) {
    updateMembro(id, editData);
    setEditando(null);
    setEditData({});
    toast({ title: "Membro atualizado" });
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este membro?")) return;
    deleteMembro(id);
    toast({ title: "Membro excluído" });
  }

  function handleNovaSolicitacao() {
    const membro = membros.find((m) => m.id === solMembroId);
    if (!membro || !solValor) {
      toast({ title: "Preencha membro, campo e novo valor", variant: "destructive" });
      return;
    }
    addSolicitacao({
      membroId: solMembroId,
      solicitadoPor: user.nome,
      campo: solCampo,
      valorAnterior: String((membro as any)[solCampo] ?? ""),
      valorNovo: solValor,
      motivo: solMotivo,
      tipo: "alteracao",
    });
    setSolValor("");
    setSolMotivo("");
    toast({ title: "Solicitação enviada" });
  }

  async function handleImportar() {
    const res = await migrarDoLocalStorage();
    toast({
      title: "Importação concluída",
      description: `Membros: ${res.membros} • Solicitações: ${res.solicitacoes}`,
    });
  }

  return (
    <div className="container mx-auto px-4 py-24 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl uppercase tracking-widest">Painel</h1>
          <p className="text-sm text-muted-foreground">
            Sessão: <span className="text-foreground">{user.nome}</span> · {user.permissao}
          </p>
        </div>
        {isComandante && (
          <Button variant="outline" onClick={handleImportar} className="uppercase tracking-wider">
            <Upload size={16} className="mr-2" /> Importar
          </Button>
        )}
      </div>

      {/* Filtros */}
      <section className="grid gap-4 md:grid-cols-4 bg-card border border-border rounded-lg p-4">
        <div>
          <Label className="text-xs uppercase tracking-wider">Nome</Label>
          <Input value={filtroNome} onChange={(e) => { setFiltroNome(e.target.value); setPage(1); }} />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider">Patente</Label>
          <Select value={filtroPatente} onValueChange={(v) => { setFiltroPatente(v); setPage(1); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {PATENTES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider">Status</Label>
          <Select value={filtroStatus} onValueChange={(v) => { setFiltroStatus(v); setPage(1); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end text-sm text-muted-foreground">
          {filtrados.length} resultado(s)
        </div>
      </section>

      {/* Adicionar membro (comandante) */}
      {podeEditar && (
        <section className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-heading uppercase tracking-wider text-sm">Novo Membro</h2>
          <div className="grid gap-3 md:grid-cols-5">
            <Input placeholder="Nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
            <Select value={novo.patente} onValueChange={(v) => setNovo({ ...novo, patente: v as Patente })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PATENTES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={novo.status} onValueChange={(v) => setNovo({ ...novo, status: v as StatusMembro })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={novo.permissao} onValueChange={(v) => setNovo({ ...novo, permissao: v as PermissaoNivel })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERMISSOES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Senha" type="text" value={novo.senha} onChange={(e) => setNovo({ ...novo, senha: e.target.value })} />
          </div>
          <Button onClick={handleAddMembro} className="uppercase tracking-wider">
            <Plus size={16} className="mr-2" /> Adicionar
          </Button>
        </section>
      )}

      {/* Tabela */}
      <section className="bg-card border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Patente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Permissão</TableHead>
              {podeEditar && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiveis.map((m) => {
              const editing = editando === m.id;
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    {editing ? (
                      <Input value={editData.nome ?? ""} onChange={(e) => setEditData({ ...editData, nome: e.target.value })} />
                    ) : m.nome}
                  </TableCell>
                  <TableCell>
                    {editing ? (
                      <Select value={editData.patente as string} onValueChange={(v) => setEditData({ ...editData, patente: v as Patente })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PATENTES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : m.patente}
                  </TableCell>
                  <TableCell>
                    {editing ? (
                      <Select value={editData.status as string} onValueChange={(v) => setEditData({ ...editData, status: v as StatusMembro })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : m.status}
                  </TableCell>
                  <TableCell>
                    {editing ? (
                      <Select value={editData.permissao as string} onValueChange={(v) => setEditData({ ...editData, permissao: v as PermissaoNivel })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PERMISSOES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : m.permissao}
                  </TableCell>
                  {podeEditar && (
                    <TableCell className="text-right space-x-1">
                      {editing ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => saveEdit(m.id)}><Check size={16} /></Button>
                          <Button size="sm" variant="ghost" onClick={() => { setEditando(null); setEditData({}); }}><X size={16} /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => startEdit(m)}><Edit size={16} /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(m.id)}><Trash2 size={16} /></Button>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {visiveis.length === 0 && (
              <TableRow>
                <TableCell colSpan={podeEditar ? 5 : 4} className="text-center text-muted-foreground py-8">
                  Nenhum membro encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* Paginação */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" disabled={pageSafe <= 1} onClick={() => setPage(pageSafe - 1)}>
          <ChevronLeft size={16} />
        </Button>
        <span className="text-sm text-muted-foreground">
          {pageSafe} / {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={pageSafe >= totalPages} onClick={() => setPage(pageSafe + 1)}>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Nova solicitação (sub-comandante) */}
      {isSub && (
        <section className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-heading uppercase tracking-wider text-sm">Nova Solicitação</h2>
          <div className="grid gap-3 md:grid-cols-4">
            <Select value={solMembroId} onValueChange={setSolMembroId}>
              <SelectTrigger><SelectValue placeholder="Membro" /></SelectTrigger>
              <SelectContent>
                {membros.map((m) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={solCampo} onValueChange={setSolCampo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="patente">Patente</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Novo valor" value={solValor} onChange={(e) => setSolValor(e.target.value)} />
            <Input placeholder="Motivo" value={solMotivo} onChange={(e) => setSolMotivo(e.target.value)} />
          </div>
          <Button onClick={handleNovaSolicitacao} className="uppercase tracking-wider">Enviar</Button>
        </section>
      )}

      {/* Solicitações pendentes */}
      {(isComandante || isSub) && (
        <section className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-heading uppercase tracking-wider text-sm">
            Solicitações Pendentes ({pendentes.length})
          </h2>
          {pendentes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma solicitação pendente.</p>
          ) : (
            <div className="space-y-2">
              {pendentes.map((s) => {
                const membro = membros.find((m) => m.id === s.membroId);
                return (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 border border-border rounded p-3">
                    <div className="text-sm">
                      <div><strong>{membro?.nome ?? "?"}</strong> · {s.campo}</div>
                      <div className="text-muted-foreground">
                        {s.valorAnterior} → {s.valorNovo}
                        {s.motivo ? ` · ${s.motivo}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">por {s.solicitadoPor}</div>
                    </div>
                    {isComandante && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateSolicitacao(s.id, "aprovada")}>
                          <Check size={14} className="mr-1" /> Aprovar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateSolicitacao(s.id, "recusada")}>
                          <X size={14} className="mr-1" /> Recusar
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
