# Estado atual do Sistema JK

Documento atualizado apos a Fase 5.6.

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
- Fase 5.2: UI de tarefas reais conectada ao SQLite.
- Fase 5.3: auditoria do modulo de tarefas reais.
- Fase 5.4: edicao simples de titulo de tarefa.
- Fase 5.5: auditoria da edicao de tarefas.
- Auditoria Geral do Sistema JK v1: chat, conversas, projetos, tarefas, UI, endpoints, SQLite e docs operacionais revisados em conjunto.
- Fase 5.6: filtros visuais simples de tarefas.

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
- UI do contexto Dia lista tarefas reais.
- Criar, concluir, voltar para pendente e excluir tarefas pela UI.
- Editar titulo de tarefa pela UI.
- Filtrar tarefas visualmente entre todas, pendentes e concluidas.
- Tarefas da UI respeitam projeto ativo ou visao global.

## Estado funcional validado

- Conversas funcionam de ponta a ponta.
- Projetos funcionam de ponta a ponta no SQLite e na sidebar.
- Conversas antigas continuam funcionando com `project_id = null`.
- Conversas novas podem receber `projectId` na primeira mensagem.
- `GET /api/conversations?projectId=ID` retorna conversas de um projeto.
- `GET /api/conversations?scope=global` retorna conversas globais.
- A sidebar mostra conversas do projeto selecionado ou conversas globais sem projeto ativo.
- Excluir projeto preserva conversas e tarefas associadas e remove a associacao, voltando-as para globais.
- Renomear/excluir conversas e criar/renomear/excluir projetos foram auditados apos o filtro por projeto.
- A tabela `tasks` existe no SQLite com `project_id` opcional.
- `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/[taskId]` e `DELETE /api/tasks/[taskId]` existem e validam entradas basicas.
- `GET /api/tasks?projectId=ID` retorna tarefas de um projeto.
- `GET /api/tasks?scope=global` retorna tarefas globais.
- O bloco de tarefas no contexto Dia usa dados reais do SQLite em vez dos mocks.
- Criar tarefa global, criar tarefa de projeto, concluir, voltar para pendente, excluir e alternar contexto foram auditados.
- A UI de tarefas nao mistura tarefas globais com tarefas do projeto ativo.
- Erros de titulo vazio e `projectId` inexistente retornam erro controlado.
- A edicao simples de titulo usa `PATCH /api/tasks/[taskId]` e mantem a tarefa no mesmo contexto.
- A edicao de titulo foi auditada em tarefas globais e tarefas de projeto.
- O limite de 120 caracteres no backend foi validado.
- A auditoria geral validou chat, projetos, conversas globais, conversas por projeto, tarefas globais, tarefas por projeto, troca de contexto, endpoints principais e docs operacionais.
- Os filtros de tarefas sao apenas client-side e usam os dados ja carregados por `/api/tasks`, sem novo endpoint ou alteracao de schema.

## O que ainda nao existe

- Mover conversas existentes entre projetos pela UI.
- Visao "todas as conversas" dentro da sidebar.
- Associar conversas antigas a projetos pela UI.
- Edicao completa de tarefas pela UI, incluindo descricao, prioridade ou data.
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

Fase 5.7: auditar os filtros visuais de tarefas e confirmar regressao de projetos e conversas.
