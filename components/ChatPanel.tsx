"use client";

import { FormEvent, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import type { AssistantPreview, LocalChatMessage } from "@/lib/types";

type ChatPanelProps = {
  assistant: AssistantPreview;
};

type ChatApiResponse = {
  content?: string;
  createdAt?: string;
  error?: string;
  model?: string;
};

const friendlyErrorMessage =
  "Nao consegui responder agora. Verifique se a chave do Gemini esta configurada e tente novamente.";

function createMessage(
  role: LocalChatMessage["role"],
  content: string,
  status: LocalChatMessage["status"] = "sent",
): LocalChatMessage {
  const createdAt = new Date().toISOString();

  return {
    content,
    createdAt,
    id: `${role}-${createdAt}-${Math.random().toString(36).slice(2)}`,
    role,
    status,
  };
}

export function ChatPanel({ assistant }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    setInput("");
    setIsLoading(true);
    setMessages((current) => [...current, createMessage("user", message)]);

    try {
      const response = await fetch("/api/chat", {
        body: JSON.stringify({ message }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok || data.error || !data.content) {
        throw new Error(data.error ?? "Resposta invalida da API do assistente.");
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.content ?? ""),
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        createMessage("assistant", friendlyErrorMessage, "error"),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
        Assistente
      </p>
      <h2 className="mt-3 text-lg font-semibold text-white">
        {assistant.title}
      </h2>
      <p className="mt-2 text-sm font-medium text-cyan-100">
        {assistant.status}
      </p>
      <p className="mt-4 text-sm leading-6 text-neutral-300">
        {assistant.description}
      </p>

      <div
        aria-live="polite"
        className="mt-5 max-h-80 space-y-3 overflow-y-auto pr-1"
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        ) : (
          <div className="rounded-md border border-white/10 bg-neutral-950/40 p-3">
            <p className="text-sm leading-6 text-neutral-400">
              Envie uma pergunta curta para organizar o dia, uma rotina, um
              estudo ou um projeto. Nada fica salvo ao recarregar.
            </p>
          </div>
        )}
        {isLoading ? (
          <div className="rounded-md border border-white/10 bg-neutral-900/80 p-3">
            <p className="text-sm leading-6 text-neutral-300">
              Pensando em uma resposta...
            </p>
          </div>
        ) : null}
      </div>

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label
            className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500"
            htmlFor="assistant-message"
          >
            Mensagem para o assistente
          </label>
          <textarea
            className="focus-ring mt-2 min-h-24 w-full resize-none rounded-md border border-white/10 bg-neutral-950/70 px-3 py-2 text-sm leading-6 text-neutral-100 placeholder:text-neutral-600"
            disabled={isLoading}
            id="assistant-message"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ex: me ajude a organizar meus proximos focos."
            value={input}
          />
        </div>
        <button
          className="focus-ring w-full rounded-md border border-cyan-300/30 bg-cyan-300/15 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-neutral-500"
          disabled={isLoading || !input.trim()}
          type="submit"
        >
          {isLoading ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
    </section>
  );
}
