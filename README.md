# Sistema JK

Sistema JK v1.0 - Vida e Tarefas.

## Objetivo

MVP local do segundo cerebro pessoal de John Kevin. Nesta fase, o projeto contem a base visual do modulo Vida e Tarefas, tipos conceituais para evolucao futura, mocks locais sem persistencia, configuracao isolada do Gemini, API local do assistente e uma UI minima de chat.

## Stack

- Next.js 14
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Gemini SDK (`@google/generative-ai`)

## Instalar dependencias

```bash
npm install
```

## Rodar localmente

```bash
npm run dev
```

Depois, abra `http://localhost:3000`.

## Variaveis de ambiente

Crie ou mantenha um arquivo `.env.local` com as variaveis locais. Esse arquivo nao deve ser commitado.

Use `.env.example` como referencia.

Variavel usada pela configuracao isolada do Gemini:

```bash
GEMINI_API_KEY=sua_chave_do_gemini
```

Sem essa variavel, o projeto ainda consegue executar lint e build. A chave so e exigida quando alguma funcao em `lib/gemini.ts` ou `lib/assistant.ts` for chamada.

## Assistente

A camada local do assistente fica em `lib/assistant.ts`. Ela prepara o prompt final com o `SYSTEM_PROMPT`, chama o cliente Gemini isolado e retorna texto ou erro controlado.

A API local do assistente fica em `app/api/chat/route.ts` e aceita apenas `POST` com JSON:

```json
{
  "message": "Ola, me ajude a organizar meu dia."
}
```

Exemplo no PowerShell, com o servidor local rodando:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"message":"Ola, me ajude a organizar meu dia."}'
```

Se o Next usar outra porta, ajuste a URL. A chamada real depende de `GEMINI_API_KEY` configurada.

Ainda nao existe interface de chat, historico persistido ou banco de dados.

## Chat local

A UI minima de chat aparece no dashboard, na area do assistente. Ela envia mensagens para `/api/chat`, mostra a mensagem do usuario imediatamente e exibe a resposta ou um erro amigavel.

O historico fica somente em estado local do React. Ao recarregar a pagina, a conversa desaparece.

## Status atual

Fase 1.4 - UI minima de chat conectada a API.
