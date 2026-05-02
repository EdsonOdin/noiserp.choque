## Integração com Firebase Realtime Database

O projeto já tem a configuração do Firebase preparada (você tinha `src/firebase.ts` antes, com as credenciais do projeto `noiserpchoque`). Vamos reativá-la corretamente e migrar o sistema atual (que usa `localStorage`) para o **Firebase Realtime Database**.

### Recomendação importante

O Lovable oferece o **Lovable Cloud** (Supabase) totalmente integrado, sem precisar de conta externa, com autenticação real, RLS (segurança por linha) e e-mails. Para um painel administrativo com senhas, **é a opção mais segura e simples**.

Mas como você pediu Firebase explicitamente, e já existe um projeto Firebase configurado (`noiserpchoque`), seguirei com Firebase Realtime Database.

⚠️ **Aviso de segurança**: as credenciais do Firebase ficam expostas no frontend (é assim que o Firebase Web SDK funciona). A segurança real depende das **Firebase Security Rules** que você configura no console do Firebase. Sem regras adequadas, qualquer pessoa pode ler/escrever no banco.

### O que será feito

**1. Instalar o SDK do Firebase**
- `bun add firebase`

**2. Recriar `src/firebase.ts`**
- Inicializar o app com as credenciais do projeto `noiserpchoque`
- Exportar a instância do Realtime Database (`getDatabase`)

**3. Refatorar `src/lib/store.ts`**

Hoje o store usa `localStorage` para guardar:
- Membros (com nome, senha, permissões, hierarquia, etc.)
- Solicitações de alteração e troca de senha
- Sessão do usuário logado

Vamos substituir por funções que leem/escrevem no Realtime Database em caminhos como:
```
/membros/{id}
/solicitacoes/{id}
```

A sessão do usuário logado **continua no `localStorage`** (é só um identificador local, não dado sensível persistido).

As funções públicas do store (`login`, `addMembro`, `updateMembro`, `addSolicitacao`, etc.) manterão a mesma assinatura para que `Painel.tsx` e `Login.tsx` não precisem de grandes mudanças.

**4. Sincronização em tempo real (opcional, mas recomendado)**
- Usar `onValue` do Firebase nos componentes que listam membros e solicitações, para que mudanças apareçam ao vivo entre dispositivos.

**5. Migração dos dados atuais**
- Adicionar um botão "Importar do localStorage" no Painel (visível só para Comandante) que envia os membros já cadastrados para o Firebase em uma única operação. Assim você não perde quem já está cadastrado.

**6. Configurar Firebase Security Rules** (você faz no console do Firebase)
- Vou te entregar um exemplo de regras mínimas para colar em **Realtime Database → Rules** no console Firebase. Sem isso, o banco fica aberto.

### Arquivos afetados

- `src/firebase.ts` — recriado
- `src/lib/store.ts` — refatorado para usar Firebase
- `src/pages/Painel.tsx` — pequenos ajustes (funções `async`, botão de migração)
- `src/pages/Login.tsx` — `login` vira `async`
- `package.json` — nova dependência `firebase`

### O que você precisa confirmar

1. Manter as credenciais do projeto Firebase `noiserpchoque` que já estavam no código?
2. Quer o botão de migração do `localStorage` atual para o Firebase?
3. Quer que eu já implemente a sincronização em tempo real (`onValue`) ou só leitura única ao abrir cada página?