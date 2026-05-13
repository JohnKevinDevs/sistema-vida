# Estado atual do Sistema JK

Documento atualizado apos a Fase 5.1.

## Fases concluidas

- Fase 0.1: setup inicial com Next.js 14, TypeScript, App Router, Tailwind e ESLint.
- Fase 0.2: estrutura visual base do modulo Vida e Tarefas.
- Fase 0.3: tipos reutilizaveis, mocks tipados e estado local leve.
- Fase 0.4: refino estrutural do dashboard.
- Fase 0.5: UX, acessibilidade e microcopy.
- Fase 0.6: modelo conceitual de dados.
- Fase 1.1 a 1.8: Gemini, assistente, API de chat, UI de chat e tratamento estruturado de erros.
- Fase 2.1 a 2.11: SQLite para conversas, historico persistente, listar, selecionar, carregar, renomear e excluir conversas.
- Fase 3.0 a 3.2: refino de produto, polish visual e limpeza da sidebar.
- Fase 4.1: base real de projetos no SQLite.
- Fase 4.2: UI real de projetos na sidebar.
- Fase 4.3: associacao inicial de conversas a projetos.
- Fase 4.4: filtro de conversas por projeto selecionado.
- Fase 4.5: auditoria do modulo Projetos + Conversas.
- Fase 5.1: base real de tarefas no SQLite.

## Funcionalidades prontas

- Chat real com Gemini.
- Tratamento de erros estruturado.
- Conversas persistentes em SQLite.
- Sidebar com conversas reais.
- Criar nova conversa.
- Selecionar conversa.
- Carregar historico salvo.
- Continuar conversa existente.
- Renomear conversa.
- Excluir conversa com confirmacao.
- Persistir erro amigavel do Gemini quando a chamada falha apos salvar mensagem do usuario.
- Projetos reais no SQLite.
- Sidebar com projetos reais.
- Criar, renomear e excluir projetos.
- Selecionar projeto ativo na sidebar.
- Criar nova conversa associada ao projeto ativo.
- Criar conversas globais quando nenhum projeto esta selecionado.
- Filtrar conversas da sidebar pelo projeto ativo.
- Exibir conversas globais quando nenhum projeto esta selecionado.
- Limpar o chat visivel ao trocar entre projeto ativo e visao global.
- Base persistente de tarefas no SQLite.
- Endpoints basicos para criar, listar, atualizar e excluir tarefas.
- Tarefas podem ser globais ou associadas opcionalmente a projetos.

## Estado funcional validado

- Conversas funcionam de ponta a ponta.
- Projetos funcionam de ponta a ponta no SQLite e na sidebar.
- Conversas antigas continuam funcionando com `project_id = null`.
- Conversas novas podem receber `projectId` na primeira mensagem.
- `GET /api/conversations?projectId=ID` retorna conversas de um projeto.
- `GET /api/conversations?scope=global` retorna conversas globais.
- A sidebar mostra conversas do projeto selecionado ou conversas globais sem projeto ativo.
- Excluir projeto preserva conversas associadas e remove a associacao, voltando-as para globais.
- Renomear/excluir conversas e criar/renomear/excluir projetos foram auditados apos o filtro por projeto.
- A tabela `tasks` existe no SQLite com `project_id` opcional.
- `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/[taskId]` e `DELETE /api/tasks/[taskId]` existem e validam entradas basicas.

## O que ainda nao existe

- Mover conversas existentes entre projetos pela UI.
- Visao "todas as conversas" dentro da sidebar.
- Associar conversas antigas a projetos pela UI.
- Tarefas persistentes conectadas a UI.
- Metas persistentes.
- Rotina persistente.
- Revisoes diarias ou semanais persistentes.
- Memoria vetorial.
- Embeddings.
- Busca semantica.
- Autenticacao.
- Deploy.
- Restaurar automaticamente a ultima conversa apos reload.

## Proximo passo recomendado

Fase 5.2: conectar a UI de tarefas aos endpoints reais, mantendo o escopo pequeno e sem mexer em metas ou memoria.
