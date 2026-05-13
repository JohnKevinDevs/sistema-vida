# Sistema JK - instrucoes operacionais para Codex

## Visao do projeto

Sistema JK v1 - Vida e Tarefas e uma aplicacao web local de segundo cerebro pessoal para John Kevin.
O foco atual e organizar conversas, projetos, tarefas, rotina, estudos e metas de forma simples, local e evolutiva.

## Stack atual

- Next.js 14 com App Router
- TypeScript
- Tailwind CSS
- ESLint
- Gemini via `@google/generative-ai`
- SQLite local com `better-sqlite3`
- Banco local em `data/sistema-jk.db`

## Regras permanentes

- Antes de alterar qualquer arquivo, executar `git status --short --branch`.
- Se houver alteracoes inesperadas, parar e informar.
- Fazer mudancas pequenas, verificaveis e dentro do escopo solicitado.
- Preservar funcionalidades existentes.
- Nao criar funcionalidades fora do escopo.
- Nao instalar dependencias sem necessidade explicita.
- Nao usar Prisma.
- Nao usar Vercel AI SDK.
- Nao usar `localStorage` sem solicitacao explicita.
- Nao usar Context API sem solicitacao explicita.
- Nao alterar schema SQLite sem justificar e preservar dados existentes.
- Nao alterar `.env.local`, nao ler seu conteudo e nunca exibir segredos.
- Nao commitar `.env.local`.
- Nao commitar `data/*.db` nem `data/*.db-*`.
- Nao commitar `node_modules`, `.next`, logs locais ou backups.

## Banco e dados

- Usar `process.cwd()` para montar caminhos locais.
- O banco deve permanecer em `data/sistema-jk.db`.
- Migracoes SQLite devem ser idempotentes.
- Migracoes devem preservar conversas, mensagens, projetos e dados existentes.
- Nao apagar dados locais sem pedido explicito.

## Validacao padrao

Quando houver alteracao de codigo:

```powershell
npm.cmd run lint
npm.cmd run build
```

Quando houver alteracao visual ou fluxo de UI:

```powershell
npm.cmd run dev
```

Depois validar no navegador, quando aplicavel.

Para etapas apenas de documentacao, lint/build nao sao obrigatorios, mas o Git deve ser checado antes do commit.

## Git

Antes do commit:

```powershell
git status --short
git diff --stat
```

Confirmar que `.env.local`, `data/sistema-jk.db` e arquivos `.db-*` nao aparecem para commit.

Commitar apenas apos validacao passar.
Fazer push automatico apos commit bem-sucedido, quando solicitado pela etapa.

## Formato padrao de resposta final

A resposta final deve conter, quando aplicavel:

1. Resumo do que foi feito
2. Arquivos criados ou alterados
3. Mudancas principais
4. Validacoes executadas
5. Resultado de lint/build/dev
6. Confirmacao de que `.env.local` e `.db` nao foram commitados
7. Problemas encontrados
8. Commit gerado
9. Resultado do push
10. Proximo passo recomendado

Se o usuario pedir um formato especifico, seguir o formato pedido.

## Nunca fazer sem autorizacao explicita

- Criar deploy.
- Criar autenticacao.
- Trocar stack.
- Trocar modelo Gemini sem motivo tecnico claro.
- Criar memoria vetorial ou embeddings.
- Criar tarefas/metas persistentes sem fase dedicada.
- Criar migrations complexas sem explicar o risco.
- Remover ou sobrescrever dados locais.
- Reverter alteracoes do usuario.
