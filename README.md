# Sistema JK

Sistema JK v1.0 - Vida e Tarefas.

## Objetivo

MVP local do segundo cerebro pessoal de John Kevin. Nesta fase, o projeto contem a base visual do modulo Vida e Tarefas, tipos conceituais para evolucao futura, mocks locais sem persistencia, configuracao isolada do Gemini e uma camada local de servico do assistente.

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

Ainda nao existe rota de API, interface de chat, historico persistido ou banco de dados.

## Status atual

Fase 1.2 - Camada de servico local do assistente.
