# Modelo conceitual de dados

Este documento descreve o modelo conceitual do Sistema JK v1.0 - Vida e Tarefas.

Esta fase nao cria banco de dados, API, migrations, persistencia local, IA ou integracoes externas. Os tipos existem para orientar a evolucao futura do sistema e manter os mocks atuais mais consistentes.

## Convencoes

- IDs sao strings.
- Datas usam string ISO (`ISODateString`).
- Status e prioridades usam union types simples.
- Campos opcionais aparecem apenas quando a entidade pode existir sem aquele dado.
- O modelo evita detalhes de armazenamento para nao antecipar SQLite, API ou migrations.

## Entidades principais

### LifeArea

Representa uma area da vida ou do sistema, como vida, tarefas, metas, projetos, rotina, estudos e revisoes.

Uso previsto:
- organizar tarefas, metas e projetos por contexto;
- permitir filtros futuros;
- manter a UI com linguagem mais clara.

### Task

Representa uma acao ou tarefa.

Campos centrais:
- `id`
- `title`
- `description`
- `status`
- `priority`
- `area`
- `dueDate`
- `createdAt`
- `updatedAt`

Na UI atual, `areaLabel` e `timeWindow` ajudam apenas na apresentacao dos mocks.

### Project

Representa um projeto ativo, planejado, pausado ou concluido.

Campos centrais:
- `id`
- `name`
- `description`
- `status`
- `area`
- `nextAction`
- `createdAt`
- `updatedAt`

O campo `signal` continua como apoio visual para os cards atuais.

### Goal

Representa uma meta.

Campos centrais:
- `id`
- `title`
- `area`
- `status`
- `progress`
- `targetDate`

O campo `note` existe para manter um resumo legivel na UI atual.

### RoutineBlock

Representa um bloco de rotina, estudo ou revisao.

Campos centrais:
- `id`
- `title`
- `window`
- `focus`
- `area`

### Review

Representa uma revisao diaria ou semanal.

Campos centrais:
- `id`
- `type`
- `date`
- `wins`
- `challenges`
- `lessons`
- `nextActions`

Ainda nao ha tela nem persistencia para revisoes.

### Conversation e Message

Representam a estrutura futura de conversa.

`Conversation` guarda o agrupamento:
- `id`
- `title`
- `createdAt`
- `updatedAt`

`Message` guarda cada mensagem:
- `id`
- `conversationId`
- `role`
- `content`
- `createdAt`

Esses tipos nao implementam IA, chat, rota de API ou armazenamento.

### Memory

Representa uma memoria conceitual futura.

Campos centrais:
- `id`
- `content`
- `category`
- `importance`
- `createdAt`

Ainda nao ha memoria persistente, embeddings ou busca vetorial.

### SystemState

Representa um resumo futuro do estado atual do sistema.

Campos centrais:
- `currentFocus`
- `activeProjects`
- `pendingTasks`
- `weeklyPriorities`
- `updatedAt`

Por enquanto, esse tipo e apenas contrato conceitual. A UI atual continua usando estado local leve em React.

## Fora do escopo desta fase

- Banco SQLite.
- Prisma ou migrations.
- API routes.
- Gemini ou qualquer IA.
- Persistencia em arquivo, localStorage ou banco.
- CRUD real.
- Validacao com Zod.
