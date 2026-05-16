# Arquitetura do Sistema JK

## Visao geral

O Sistema JK e uma aplicacao Next.js local com UI em React, API routes server-side, Gemini isolado em camada de servico e SQLite local para persistencia.

## Diretorios principais

- `app/`: App Router do Next.js.
- `app/api/`: rotas server-side.
- `components/`: componentes de UI.
- `lib/db.ts`: acesso ao SQLite local.
- `lib/gemini.ts`: cliente Gemini isolado.
- `lib/assistant.ts`: montagem de prompt e chamada ao assistente.
- `lib/system-prompt.ts`: prompt base do assistente.
- `lib/types.ts`: tipos TypeScript compartilhados.
- `data/`: banco local e arquivos de dados ignorados pelo Git.
- `docs/`: documentacao operacional e tecnica.

## Rotas atuais

- `POST /api/chat`: envia mensagem ao assistente e salva conversa/mensagens.
- `GET /api/conversations`: lista conversas.
- `GET /api/conversations/[conversationId]/messages`: lista mensagens de uma conversa.
- `PATCH /api/conversations/[conversationId]`: renomeia conversa.
- `DELETE /api/conversations/[conversationId]`: exclui conversa.
- `GET /api/projects`: lista projetos.
- `POST /api/projects`: cria projeto.
- `PATCH /api/projects/[projectId]`: atualiza projeto.
- `DELETE /api/projects/[projectId]`: exclui projeto.
- `GET /api/tasks`: lista tarefas.
- `POST /api/tasks`: cria tarefa.
- `PATCH /api/tasks/[taskId]`: atualiza tarefa.
- `DELETE /api/tasks/[taskId]`: exclui tarefa.

## Banco atual

Banco SQLite local:

```text
data/sistema-jk.db
```

Tabelas atuais:

- `conversations`
- `messages`
- `projects`
- `tasks`

### `conversations`

Campos principais:

- `id`
- `title`
- `project_id`
- `created_at`
- `updated_at`

`project_id` e opcional. Conversas antigas ou globais usam `null`.

Quando um projeto e excluido, conversas associadas sao preservadas e voltam para `project_id = null`.

### `messages`

Campos principais:

- `id`
- `conversation_id`
- `role`
- `content`
- `created_at`

Mensagens pertencem a conversas. A tabela usa cascade para apagar mensagens quando uma conversa e excluida.

### `projects`

Campos principais:

- `id`
- `name`
- `description`
- `status`
- `created_at`
- `updated_at`

Status aceitos:

- `active`
- `paused`
- `archived`

### `tasks`

Campos principais:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `project_id`
- `due_date`
- `created_at`
- `updated_at`

`project_id` e opcional. Tarefas globais usam `null`.

Quando um projeto e excluido, tarefas associadas sao preservadas e voltam para `project_id = null`.

Filtros de leitura:

- `GET /api/tasks?projectId=ID`: lista tarefas vinculadas ao projeto informado.
- `GET /api/tasks?scope=global`: lista tarefas sem projeto vinculado.
- `GET /api/tasks`: lista todas as tarefas.

Status aceitos:

- `pending`
- `in_progress`
- `done`
- `canceled`

Prioridades aceitas:

- `low`
- `medium`
- `high`

## Regras de banco

- Usar `process.cwd()` para construir o caminho do banco.
- Manter o banco em `data/sistema-jk.db`.
- Usar `better-sqlite3`.
- Ativar `PRAGMA foreign_keys = ON`.
- Usar `CREATE TABLE IF NOT EXISTS`.
- Migracoes devem ser idempotentes.
- Migracoes devem preservar dados existentes.
- Nao commitar arquivos `.db`.
- Nao usar Prisma ou ORM.

## Separacao de responsabilidades

- API routes validam request/response.
- `lib/db.ts` acessa SQLite.
- `lib/gemini.ts` fala com Gemini.
- `lib/assistant.ts` prepara comportamento do assistente.
- Componentes React cuidam de estado local e UI.
- A UI nao deve acessar o banco diretamente.
