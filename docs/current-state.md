# Estado atual do Sistema JK

Documento atualizado apos a Fase 4.3.

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

## Estado funcional validado

- Conversas funcionam de ponta a ponta.
- Projetos funcionam de ponta a ponta no SQLite e na sidebar.
- Conversas antigas continuam funcionando com `project_id = null`.
- Conversas novas podem receber `projectId` na primeira mensagem.
- A lista de conversas ainda e global.
- O filtro visual de conversas por projeto ainda nao existe.

## O que ainda nao existe

- Filtro ou agrupamento de conversas por projeto na sidebar.
- Associar conversas antigas a projetos pela UI.
- Tarefas persistentes.
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

Fase 4.4: filtrar ou agrupar conversas por projeto na sidebar, mantendo tambem uma visao global.
