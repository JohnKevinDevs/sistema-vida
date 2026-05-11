# Sistema JK

Sistema JK v1.0 - Vida e Tarefas.

## Objetivo

MVP local do segundo cérebro pessoal de John Kevin. Nesta fase, o projeto contém a base visual do módulo Vida e Tarefas, tipos conceituais para evolução futura, mocks locais sem persistência, configuração isolada do Gemini, API local do assistente e uma UI mínima de chat refinada.

## Stack

- Next.js 14
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Gemini SDK (`@google/generative-ai`)

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

A API local do assistente fica em `app/api/chat/route.ts` e aceita apenas `POST` com JSON:

```json
{
  "message": "Olá, me ajude a organizar meu dia."
}
```

Exemplo no PowerShell, com o servidor local rodando:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"message":"Olá, me ajude a organizar meu dia."}'
```

Se o Next usar outra porta, ajuste a URL. A chamada real depende de `GEMINI_API_KEY` configurada.

Ainda não existe histórico persistido ou banco de dados.

## Chat local

A UI mínima de chat aparece no dashboard, na área do assistente. Ela envia mensagens para `/api/chat`, mostra a mensagem do usuário imediatamente e exibe a resposta ou um erro amigável.

O histórico fica somente em estado local do React. Ao recarregar a página, a conversa desaparece.

Para testar manualmente:

- Digite uma mensagem no campo do assistente.
- Use `Ctrl+Enter` no Windows/Linux ou `Cmd+Enter` no macOS para enviar.
- Use `Enter` sozinho para quebrar linha.
- Confirme que o botão fica desabilitado com mensagem vazia ou durante o carregamento.
- Sem `GEMINI_API_KEY`, a UI deve mostrar um erro amigável informando que a chave precisa ser configurada.

## Status atual

Fase 1.5 - Refinos de UX do chat e preparação para teste real com Gemini.
