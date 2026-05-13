# Sistema JK

Sistema JK v1.0 - Vida e Tarefas.

## Objetivo

MVP local do segundo cérebro pessoal de John Kevin. Nesta fase, o projeto contém a base visual do módulo Vida e Tarefas, chat real com Gemini, histórico persistente em SQLite local e uma interface mais simples organizada em Dia, Semana e Metas.

## Stack

- Next.js 14
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Gemini SDK (`@google/generative-ai`)
- SQLite local com `better-sqlite3`

## Instalar dependências

```bash
npm install
```

## Rodar localmente

```bash
npm run dev
```

Depois, abra `http://localhost:3000`.

## Variáveis de ambiente

Crie ou mantenha um arquivo `.env.local` com as variáveis locais. Esse arquivo não deve ser commitado.

Use `.env.example` como referência.

Variável usada pela configuração isolada do Gemini:

```bash
GEMINI_API_KEY=sua_chave_do_gemini
```

Sem essa variável, o projeto ainda consegue executar lint e build. A chave só é exigida quando alguma função em `lib/gemini.ts` ou `lib/assistant.ts` for chamada.

## Assistente

A camada local do assistente fica em `lib/assistant.ts`. Ela prepara o prompt final com o `SYSTEM_PROMPT`, chama o cliente Gemini isolado e retorna texto ou erro controlado.

Modelo Gemini configurado nesta fase: `gemini-2.5-flash`.

O comportamento esperado do assistente nesta fase:

- responder em PT-BR;
- ser direto e prático;
- ajudar com tarefas, rotina, estudos, projetos e próximas ações;
- não dizer que salvou, registrou ou lembrou algo permanentemente;
- não fingir memória persistente, histórico salvo ou banco de dados;
- pedir no máximo uma pergunta de clarificação quando faltar contexto importante;
- priorizar respostas curtas, normalmente com 3 a 5 ações claras.

A API local do assistente fica em `app/api/chat/route.ts` e aceita apenas `POST` com JSON:

```json
{
  "message": "Olá, me ajude a organizar meu dia."
}
```

Ela também aceita `conversationId` para continuar salvando mensagens em uma conversa existente:

```json
{
  "conversationId": "id-da-conversa",
  "message": "Agora transforme isso em uma checklist."
}
```

Exemplo no PowerShell, com o servidor local rodando:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"message":"Olá, me ajude a organizar meu dia."}'
```

Se o Next usar outra porta, ajuste a URL. A chamada real depende de `GEMINI_API_KEY` configurada.

A resposta de sucesso inclui `conversationId`, que identifica a conversa salva no SQLite local.

## Banco local

A base SQLite inicial fica em:

```text
data/sistema-jk.db
```

O acesso ao banco está isolado em `lib/db.ts`. Nesta fase, ele cria as tabelas:

- `conversations`
- `messages`
- `projects`

Funções disponíveis:

- `initializeDatabase()`
- `createConversation({ title?, projectId? })`
- `listConversations()`
- `getConversationById(id)`
- `updateConversationTitle(id, title)`
- `deleteConversation(id)`
- `listMessages(conversationId)`
- `createMessage(input)`
- `createProject(input)`
- `listProjects()`
- `getProjectById(id)`
- `updateProject(id, input)`
- `deleteProject(id)`

A API `/api/chat` salva a conversa, a mensagem do usuário e a resposta do assistente no SQLite local. A UI guarda o `conversationId` apenas em estado local durante a sessão atual, então mensagens seguintes continuam a mesma conversa enquanto a página não for recarregada. Ao selecionar uma conversa na sidebar, o histórico salvo é carregado no chat.

Arquivos `.db` e derivados locais, como `data/*.db` e `data/*.db-*`, estão protegidos no `.gitignore` e não devem ser commitados.

Endpoints do módulo de conversas:

- `GET /api/conversations`: lista todas as conversas salvas, ordenadas por atualização mais recente.
- `GET /api/conversations?scope=global`: lista apenas conversas sem projeto vinculado.
- `GET /api/conversations?projectId=ID`: lista apenas conversas vinculadas ao projeto informado.
- `GET /api/conversations/[conversationId]/messages`: retorna as mensagens de uma conversa, em ordem cronológica.
- `PATCH /api/conversations/[conversationId]`: renomeia uma conversa salva.
- `DELETE /api/conversations/[conversationId]`: exclui uma conversa salva e suas mensagens.

Endpoints iniciais de projetos:

- `GET /api/projects`: lista projetos salvos, ordenados por atualização mais recente.
- `POST /api/projects`: cria um projeto com `name`, `description` opcional e `status` opcional.
- `PATCH /api/projects/[projectId]`: atualiza `name`, `description` ou `status`.
- `DELETE /api/projects/[projectId]`: exclui um projeto salvo.

A partir da Fase 4.2, a sidebar usa esses projetos reais para criar, listar, renomear e excluir espaços do Sistema JK.

Na Fase 4.3, conversas passaram a aceitar `projectId` opcional. A migração adiciona a coluna `project_id` em `conversations` de forma idempotente, preservando conversas e mensagens antigas com `project_id = null`. Para reduzir risco de perda de dados no SQLite local, a FK formal ainda não é recriada na tabela; a integridade é validada pela aplicação ao criar novas conversas, e excluir um projeto remove a associação das conversas sem apagar o histórico.

Na Fase 4.4, `GET /api/conversations` passou a aceitar filtros simples. A sidebar usa `?projectId=ID` quando existe um projeto ativo e `?scope=global` quando nenhum projeto está selecionado. Assim, projetos mostram apenas suas conversas associadas, enquanto a visão global mostra apenas conversas sem projeto.

Na Fase 4.5, o módulo de projetos e conversas foi auditado. O fluxo validado cobre projetos reais, conversas globais, conversas associadas, filtro por projeto, renomear/excluir conversas, criar/renomear/excluir projetos e exclusão de projeto com conversas associadas. A auditoria também ajustou a troca de contexto: ao selecionar ou limpar um projeto, o chat visível volta para o estado de nova conversa, evitando continuar acidentalmente uma conversa de outro contexto.

Status válidos para projetos persistidos:

- `active`
- `paused`
- `archived`

Formato de listagem de conversas:

```json
{
  "conversations": [
    {
      "id": "id-da-conversa",
      "projectId": "id-do-projeto-ou-null",
      "title": "Título da conversa",
      "createdAt": "2026-05-11T22:00:00.000Z",
      "updatedAt": "2026-05-11T22:05:00.000Z"
    }
  ]
}
```

Formato de mensagens:

```json
{
  "conversationId": "id-da-conversa",
  "messages": [
    {
      "id": "id-da-mensagem",
      "conversationId": "id-da-conversa",
      "role": "user",
      "content": "Me ajude a organizar meu dia.",
      "createdAt": "2026-05-11T22:00:00.000Z"
    }
  ]
}
```

Se a conversa não existir, a API retorna erro controlado:

```json
{
  "error": "Conversa não encontrada.",
  "code": "INVALID_REQUEST"
}
```

Para renomear uma conversa, envie:

```json
{
  "title": "Planejamento do dia"
}
```

A API remove espaços no começo e no fim, rejeita título vazio e limita o título a 80 caracteres.

Para excluir uma conversa, envie `DELETE` para `/api/conversations/[conversationId]`. A remoção usa o cascade do SQLite para apagar também as mensagens da conversa:

```json
{
  "deleted": true,
  "conversationId": "id-da-conversa"
}
```

Em caso de falha controlada, a API retorna JSON com mensagem amigável e código:

```json
{
  "error": "A cota do Gemini foi atingida no momento. Tente novamente mais tarde.",
  "code": "QUOTA_EXCEEDED"
}
```

Na Fase 2.8, quando a mensagem do usuário já foi salva e o Gemini falha, a API também salva uma mensagem amigável do assistente na mesma conversa:

```text
Não consegui responder agora. Verifique a configuração do Gemini e tente novamente.
```

Esse registro mantém o histórico consistente no SQLite, permite que a conversa recém-criada apareça na sidebar mesmo em erro e não expõe detalhes técnicos sensíveis.

Códigos principais:

- `MISSING_API_KEY`: a chave do Gemini não foi configurada.
- `INVALID_API_KEY`: a chave parece inválida ou sem permissão.
- `QUOTA_EXCEEDED`: a cota ou limite de taxa foi atingido.
- `MODEL_UNAVAILABLE`: o modelo configurado não está disponível.
- `EMPTY_RESPONSE`: o Gemini retornou uma resposta vazia.
- `TEMPORARY_ERROR`: houve instabilidade temporária ou falha de rede.
- `UNKNOWN_ERROR`: falha não classificada.
- `INVALID_REQUEST`: o payload enviado para a API é inválido.

## Chat local

A UI mínima de chat aparece no dashboard, na área do assistente. Ela envia mensagens para `/api/chat`, mostra a mensagem do usuário imediatamente e exibe a resposta ou um erro amigável.

O histórico visual fica em estado local do React. Ao recarregar a página, a última conversa ainda não é restaurada automaticamente.

A sidebar busca conversas no client usando o contexto atual: `GET /api/conversations?projectId=ID` para projeto selecionado ou `GET /api/conversations?scope=global` para conversas globais. Ao selecionar uma conversa, o chat usa `GET /api/conversations/[conversationId]/messages` para carregar as mensagens salvas e continua enviando novas mensagens no mesmo `conversationId`.

O botão `Nova conversa` limpa apenas o chat visível, remove a seleção atual e prepara a próxima mensagem para criar uma nova conversa no SQLite. Conversas antigas não são apagadas.

Se o Gemini falhar durante uma nova conversa ou conversa existente, o app mantém a conversa ativa, registra uma resposta amigável do assistente e preserva o código estruturado da falha para a UI.

Cada conversa na sidebar pode ser renomeada pela ação `Renomear`. A edição é inline, mantém a conversa selecionada quando aplicável e atualiza a lista local após salvar.

Cada conversa também pode ser excluída pela ação `Excluir`. A UI pede confirmação inline antes de remover; se a conversa excluída estiver ativa, o chat é limpo e a seleção volta para o estado de nova conversa.

Na Fase 2.11, o fluxo completo de conversas foi auditado: criar, continuar, listar, selecionar, carregar histórico, renomear, excluir, tratar payload inválido e manter erros amigáveis do Gemini persistidos sem quebrar a UI.

Na Fase 3.0, a interface foi refinada para reduzir poluição visual. A sidebar ficou mais próxima de uma central de conversas, com cabeçalho simples, botão `Nova conversa`, lista compacta de projetos e conversas reais salvas. A área principal passou a mostrar apenas um contexto por vez:

- `Dia`: foco principal, três prioridades e próximo passo.
- `Semana`: projetos em andamento, projeto em foco e ritmo da semana.
- `Metas`: metas principais com progresso simples.

O chat ganhou mais espaço e passou a ser a área de maior protagonismo da tela, mantendo o mesmo fluxo técnico de conversa, histórico, renomear, excluir e persistência local.

Na Fase 3.1, a UI recebeu um polish visual mais forte: paleta escura com azul profundo como acento, superfícies mais consistentes, melhor hierarquia tipográfica, espaçamentos mais confortáveis, botões e estados ativos mais refinados, mensagens do chat mais legíveis e microcopy revisada em PT-BR.

Na Fase 3.2, a sidebar foi limpa para deixar a interface com mais cara de produto final. Metadados técnicos como versão local, SQLite, Gemini e fase atual saíram da UI principal e ficaram apenas documentados aqui. A seção `Conversas` manteve a lista real, seleção, renomear e excluir. A seção `Projetos` ficou mais discreta e conceitual, preparando a futura lógica de pastas/containers sem criar CRUD falso de projetos.

Na Fase 4.1, foi criada a base real de projetos no SQLite. O banco passou a ter a tabela `projects`, funções de acesso em `lib/db.ts` e endpoints básicos para criar, listar, atualizar e excluir projetos.

Na Fase 4.2, a seção `Projetos` da sidebar passou a buscar projetos reais em `GET /api/projects`. A UI permite criar, renomear e excluir projetos com estado local simples, loading, erro e estado vazio. As conversas continuam globais e ainda não são filtradas nem movidas para dentro de projetos.

Na Fase 4.3, a sidebar passou a permitir selecionar um projeto ativo. Ao iniciar uma nova conversa com um projeto selecionado, a API salva essa conversa com `projectId`. Conversas antigas e conversas criadas sem projeto continuam globais. A lista de conversas ainda permanece global nesta fase.

Na Fase 4.4, a lista de conversas da sidebar passou a respeitar o projeto selecionado. Com um projeto ativo, aparecem apenas conversas vinculadas a ele. Sem projeto ativo, aparecem apenas conversas globais (`project_id = null`). A rota `GET /api/conversations` ainda continua disponível sem filtro para retornar todas as conversas quando necessário.

Na Fase 4.5, o fluxo Projetos + Conversas foi auditado com dados temporários e validação no SQLite. A troca entre projeto selecionado e visão global limpa a conversa visível para manter o próximo envio coerente com o contexto atual.

Para testar manualmente:

- Digite uma mensagem no campo do assistente.
- Use `Ctrl+Enter` no Windows/Linux ou `Cmd+Enter` no macOS para enviar.
- Use `Enter` sozinho para quebrar linha.
- Confirme que o botão fica desabilitado com mensagem vazia ou durante o carregamento.
- Depois da primeira resposta, confirme que a UI indica uma conversa local ativa na sessão.
- Confirme que a sidebar mostra conversas do projeto ativo ou conversas globais quando nenhum projeto estiver selecionado.
- Na seção `Projetos`, crie um projeto, selecione, renomeie e exclua para validar a persistência local.
- Com um projeto selecionado, clique em `Nova conversa` e envie uma mensagem para validar a associação inicial.
- Alterne entre projeto selecionado e visão global e confirme que a lista de conversas muda de contexto.
- Clique em uma conversa salva e confirme que ela fica destacada e que as mensagens aparecem no chat.
- Use `Renomear` em uma conversa e confirme que o novo título aparece na sidebar.
- Use `Excluir` em uma conversa e confirme que ela sai da sidebar apenas após confirmação.
- Clique em `Nova conversa` e confirme que o chat volta ao estado inicial e a seleção antiga sai da sidebar.
- Sem `GEMINI_API_KEY`, a UI deve mostrar um erro amigável informando que a chave precisa ser configurada.

Também é possível testar a API diretamente:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"message":"Me ajude a organizar meu dia em 3 passos."}'
```

Para continuar uma conversa salva, use o `conversationId` retornado:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"conversationId":"COLE_O_ID_AQUI","message":"Agora transforme isso em uma checklist."}'
```

Para criar uma conversa associada a um projeto, envie `projectId` apenas na primeira mensagem:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"projectId":"COLE_O_ID_DO_PROJETO","message":"Me ajude a organizar este projeto."}'
```

Se `conversationId` for enviado, ele tem prioridade e a conversa existente continua no projeto em que já estava.

Para listar conversas de um projeto:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/conversations?projectId=COLE_O_ID_DO_PROJETO" -Method GET
```

Para listar conversas globais:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/conversations?scope=global" -Method GET
```

Payload inválido:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{}'
```

Para teste real com Gemini, configure manualmente `GEMINI_API_KEY` em `.env.local`, reinicie o servidor local e envie mensagens como:

- `Tenho escola, CEAP e curso hoje. Me ajude a organizar minhas prioridades.`
- `Estou com várias ideias para a FluxON e o Sistema JK. Me ajude a transformar isso em próximos passos.`
- `Me faça uma revisão rápida do meu dia.`
- `Salve que amanhã tenho uma reunião importante.`

No pedido para salvar algo, o assistente deve explicar que ainda não consegue salvar permanentemente nesta versão e pode apenas ajudar a estruturar a informação naquele momento.

## Status atual

Fase 4.5 - auditoria do módulo Projetos + Conversas.
