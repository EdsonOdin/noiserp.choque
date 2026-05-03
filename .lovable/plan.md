## Objetivo

Reverter `src/pages/Login.tsx` e `src/pages/Painel.tsx` para a forma anterior — o painel completo do Batalhão de Choque com login por nome/senha via `store.ts`, controle por patente, filtros, paginação, sistema de solicitações e botão "Importar" do localStorage.

As versões atuais foram reduzidas a um stub que usa `firebase/auth` (`signInWithEmailAndPassword`, `onAuthStateChanged`), perdendo toda a funcionalidade do painel.

## O que será feito

### 1. `src/pages/Login.tsx`
Restaurar o formulário antigo:
- Inputs de **Nome** e **Senha** (não e-mail).
- Estilização tactical (card escuro, logo, tipografia uppercase) consistente com o resto do site.
- Chamar `initializeStore()` no mount; ao submeter, validar contra `getMembros()` comparando nome+senha; gravar sessão em `localStorage` (`choque_auth`) e redirecionar para `/painel` com `useNavigate`.
- Estado de loading ("Entrando...") e mensagens de erro.
- Remover qualquer import de `firebase/auth`.

### 2. `src/pages/Painel.tsx`
Restaurar o painel completo:
- Guard: se `getAuthUser()` for nulo → `navigate("/login")`.
- Carregar membros e solicitações via `getMembros()` / `getSolicitacoes()` e reagir em tempo real com `subscribe(...)`.
- **Restrições por permissão:**
  - Comandante: CRUD total + aprovar/recusar solicitações + botão **Importar** (chama `migrarDoLocalStorage`).
  - Sub-Comandante: criar solicitações de alteração.
  - Membro: somente leitura.
- Filtros por nome, patente e status + paginação.
- Formulário "Nova Solicitação" para Sub-Comandante.
- Lista de solicitações pendentes com ações para Comandante.

### 3. Manter `src/lib/firebase.ts` e `src/lib/store.ts`
Sem mudanças — o store já sincroniza com Firebase Realtime DB e expõe `subscribe`, `initializeStore`, `migrarDoLocalStorage`. O `getAuth` em `firebase.ts` pode ficar (não atrapalha) ou ser removido; manter por simplicidade.

## Detalhes técnicos

- Login NÃO usará Firebase Auth — autenticação continua sendo comparação local de nome/senha contra os membros no RTDB (modelo anterior).
- Sessão persistida em `localStorage` sob a chave `choque_auth` (`{ id }`), lida por `getAuthUser()`.
- Atualizações em tempo real via callback de `subscribe()` que força re-render (`useState` tick).

## Fora de escopo

- Não migrar para Firebase Auth real nem Lovable Cloud (assunto separado de segurança discutido antes).
- Não alterar outras páginas.
