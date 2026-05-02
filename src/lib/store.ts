// Store sincronizado com Firebase Realtime Database.
// Mantém um cache em memória para que a API pública continue síncrona,
// e usa onValue() para manter o cache atualizado em tempo real.

import { db } from "./firebase";
import {
  ref,
  set,
  remove,
  onValue,
  get,
  child,
} from "firebase/database";

export type Patente =
  | "Comandante"
  | "Sub-Comandante"
  | "Major"
  | "Capitão"
  | "Tenente"
  | "1º Sargento"
  | "2º Sargento"
  | "Cabo"
  | "Soldado"
  | "Recruta";

export type StatusMembro = "Ativo" | "Punido" | "Demitido";
export type PermissaoNivel = "comandante" | "sub-comandante" | "membro";

export interface Membro {
  id: string;
  nome: string;
  patente: Patente;
  status: StatusMembro;
  permissao: PermissaoNivel;
  senha: string;
  criadoEm: string;
}

export interface SolicitacaoAlteracao {
  id: string;
  membroId: string;
  solicitadoPor: string;
  campo: string;
  valorAnterior: string;
  valorNovo: string;
  motivo?: string;
  tipo?: "alteracao" | "troca-senha";
  status: "pendente" | "aprovada" | "recusada";
  criadoEm: string;
}

const AUTH_KEY = "choque_auth";

// ----- In-memory cache (kept in sync with Firebase) -----
let membrosCache: Membro[] = [];
let solicitacoesCache: SolicitacaoAlteracao[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => {
    try { cb(); } catch {}
  });
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// ----- Firebase listeners (set up once) -----
let initialized = false;
let initPromise: Promise<void> | null = null;

function attachListeners() {
  onValue(ref(db, "membros"), (snap) => {
    const val = snap.val() || {};
    membrosCache = Object.values(val) as Membro[];
    notify();
  });
  onValue(ref(db, "solicitacoes"), (snap) => {
    const val = snap.val() || {};
    solicitacoesCache = Object.values(val) as SolicitacaoAlteracao[];
    notify();
  });
}

// Returns a promise that resolves once first data load completes
export function initializeStore(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const snap = await get(ref(db));
      const root = snap.val() || {};
      membrosCache = Object.values(root.membros || {}) as Membro[];
      solicitacoesCache = Object.values(root.solicitacoes || {}) as SolicitacaoAlteracao[];

      // Bootstrap default admin if database is empty
      if (membrosCache.length === 0) {
        const admin: Membro = {
          id: crypto.randomUUID(),
          nome: "Comandante Geral",
          patente: "Comandante",
          status: "Ativo",
          permissao: "comandante",
          senha: "admin123",
          criadoEm: new Date().toISOString(),
        };
        await set(ref(db, `membros/${admin.id}`), admin);
        membrosCache = [admin];
      }

      if (!initialized) {
        attachListeners();
        initialized = true;
      }
    } catch (err) {
      console.error("Erro ao inicializar Firebase:", err);
    }
  })();
  return initPromise;
}

// ----- Membros -----
export function getMembros(): Membro[] {
  return membrosCache;
}

export function addMembro(membro: Omit<Membro, "id" | "criadoEm">): Membro {
  const novo: Membro = {
    ...membro,
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
  };
  membrosCache = [...membrosCache, novo];
  set(ref(db, `membros/${novo.id}`), novo).catch((e) =>
    console.error("addMembro:", e)
  );
  notify();
  return novo;
}

export function updateMembro(id: string, updates: Partial<Membro>) {
  membrosCache = membrosCache.map((m) =>
    m.id === id ? { ...m, ...updates } : m
  );
  const updated = membrosCache.find((m) => m.id === id);
  if (updated) {
    set(ref(db, `membros/${id}`), updated).catch((e) =>
      console.error("updateMembro:", e)
    );
  }
  notify();
}

export function deleteMembro(id: string) {
  membrosCache = membrosCache.filter((m) => m.id !== id);
  remove(ref(db, `membros/${id}`)).catch((e) =>
    console.error("deleteMembro:", e)
  );
  notify();
}

// ----- Solicitações -----
export function getSolicitacoes(): SolicitacaoAlteracao[] {
  return solicitacoesCache;
}

export function addSolicitacao(
  sol: Omit<SolicitacaoAlteracao, "id" | "criadoEm" | "status">
) {
  const nova: SolicitacaoAlteracao = {
    ...sol,
    id: crypto.randomUUID(),
    status: "pendente",
    criadoEm: new Date().toISOString(),
  };
  solicitacoesCache = [...solicitacoesCache, nova];
  set(ref(db, `solicitacoes/${nova.id}`), nova).catch((e) =>
    console.error("addSolicitacao:", e)
  );
  notify();
}

export function updateSolicitacao(
  id: string,
  status: "aprovada" | "recusada"
) {
  solicitacoesCache = solicitacoesCache.map((s) =>
    s.id === id ? { ...s, status } : s
  );
  const updated = solicitacoesCache.find((s) => s.id === id);
  if (updated) {
    set(ref(db, `solicitacoes/${id}`), updated).catch((e) =>
      console.error("updateSolicitacao:", e)
    );
    if (status === "aprovada") {
      updateMembro(updated.membroId, {
        [updated.campo]: updated.valorNovo,
      } as any);
    }
  }
  notify();
}

// ----- Auth (sessão local) -----
// ❌ LOGIN ANTIGO DESATIVADO
export function login() {
  console.warn("Login via store desativado. Use Firebase Auth.");
  return null;
}
  
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuthUser(): Membro | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const auth = JSON.parse(raw) as { id: string };
    return membrosCache.find((m) => m.id === auth.id) || null;
  } catch {
    return null;
  }
}

// ----- Migração de dados antigos do localStorage para o Firebase -----
export async function migrarDoLocalStorage(): Promise<{
  membros: number;
  solicitacoes: number;
}> {
  let countM = 0;
  let countS = 0;
  try {
    const m = localStorage.getItem("choque_membros");
    if (m) {
      const arr = JSON.parse(m) as Membro[];
      for (const membro of arr) {
        if (!membrosCache.find((x) => x.id === membro.id)) {
          await set(ref(db, `membros/${membro.id}`), membro);
          countM++;
        }
      }
    }
    const s = localStorage.getItem("choque_solicitacoes");
    if (s) {
      const arr = JSON.parse(s) as SolicitacaoAlteracao[];
      for (const sol of arr) {
        if (!solicitacoesCache.find((x) => x.id === sol.id)) {
          await set(ref(db, `solicitacoes/${sol.id}`), sol);
          countS++;
        }
      }
    }
  } catch (e) {
    console.error("migrarDoLocalStorage:", e);
  }
  return { membros: countM, solicitacoes: countS };
}

export const PATENTES: Patente[] = [
  "Comandante",
  "Sub-Comandante",
  "Major",
  "Capitão",
  "Tenente",
  "1º Sargento",
  "2º Sargento",
  "Cabo",
  "Soldado",
  "Recruta",
];
