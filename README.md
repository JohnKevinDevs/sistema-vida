# Sistema JK

Sistema JK v1.0 - Vida e Tarefas.

## Objetivo

MVP local do segundo cérebro pessoal de John Kevin. Nesta fase, o projeto contém a base visual do módulo Vida e Tarefas, tipos conceituais para evolução futura, mocks locais sem persistência, configuração isolada do Gemini, API local do assistente e uma UI mínima de chat conectada ao Gemini.

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

O acesso ao banco está isolado em `lib/db.ts`. Nesta fase, ele cria apenas as tabelas:

- `conversations`
- `messages`

Funções disponíveis:

- `initializeDatabase()`
- `createConversation(title?)`
- `listConversations()`
- `getConversationById(id)`
- `listMessages(conversationId)`
- `createMessage(input)`

A API `/api/chat` salva a conversa, a mensagem do usuário e a resposta do assistente no SQLite local. A UI guarda o `conversationId` apenas em estado local durante a sessão atual, então mensagens seguintes continuam a mesma conversa enquanto a página não for recarregada. A UI ainda não carrega histórico salvo; o histórico visual continua apenas em estado local do React.

Arquivos `.db` e derivados locais, como `data/*.db` e `data/*.db-*`, estão protegidos no `.gitignore` e não devem ser commitados.

Em caso de falha controlada, a API retorna JSON com mensagem amigável e código:

```json
{
  "error": "A cota do Gemini foi atingida no momento. Tente novamente mais tarde.",
  "code": "QUOTA_EXCEEDED"
}
```

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

O histórico visual fica somente em estado local do React. Ao recarregar a página, a conversa desaparece da tela por enquanto.

Para testar manualmente:

- Digite uma mensagem no campo do assistente.
- Use `Ctrl+Enter` no Windows/Linux ou `Cmd+Enter` no macOS para enviar.
- Use `Enter` sozinho para quebrar linha.
- Confirme que o botão fica desabilitado com mensagem vazia ou durante o carregamento.
- Depois da primeira resposta, confirme que a UI indica uma conversa local ativa na sessão.
- Sem `GEMINI_API_KEY`, a UI deve mostrar um erro amigável informando que a chave precisa ser configurada.

Também é possível testar a API diretamente:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"message":"Me ajude a organizar meu dia em 3 passos."}'
```

Para continuar uma conversa salva, use o `conversationId` retornado:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"conversationId":"COLE_O_ID_AQUI","message":"Agora transforme isso em uma checklist."}'
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

Fase 2.3 - UI do chat conectada ao conversationId ativo.
