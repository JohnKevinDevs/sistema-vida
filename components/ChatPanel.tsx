"use client";

import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import type {
  AssistantErrorCode,
  AssistantPreview,
  LocalChatMessage,
  Message,
} from "@/lib/types";

type ChatPanelProps = {
  activeConversationId: string | null;
  activeProjectId: string | null;
  assistant: AssistantPreview;
  className?: string;
  resetKey: number;
  onConversationChange: (conversationId: string) => void;
  onConversationCreated: (conversationId: string) => void;
};

type ChatApiResponse = {
  code?: AssistantErrorCode;
  conversationId?: string;
  content?: string;
  createdAt?: string;
  error?: string;
  model?: string;
  projectId?: string | null;
};

type ConversationMessagesResponse = {
  code?: AssistantErrorCode;
  error?: string;
  messages?: Message[];
};

type HistoryLoadState = "idle" | "loading" | "success" | "error";

const persistedAssistantErrorMessage =
  "Não consegui responder agora. Verifique a configuração do Gemini e tente novamente.";

const chatErrorMessages: Record<AssistantErrorCode, string> = {
  EMPTY_RESPONSE:
    "Recebi uma resposta vazia da IA. Tente reformular sua mensagem.",
  INVALID_API_KEY:
    "A chave do Gemini parece inválida. Verifique a configuração.",
  INVALID_REQUEST: "A mensagem enviada ao assistente não é válida.",
  MISSING_API_KEY: "A chave do Gemini ainda não está configurada.",
  MODEL_UNAVAILABLE:
    "O modelo de IA não está disponível agora. Tente novamente em instantes.",
  QUOTA_EXCEEDED:
    "A cota do Gemini foi atingida no momento. Tente novamente mais tarde.",
  TEMPORARY_ERROR: "Ocorreu uma instabilidade temporária. Tente novamente.",
  UNKNOWN_ERROR:
    "Não consegui responder agora. Tente novamente em alguns instantes.",
};

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

function getChatErrorMessage(data?: ChatApiResponse) {
  if (data?.code) {
    return chatErrorMessages[data.code];
  }

  return chatErrorMessages.UNKNOWN_ERROR;
}

function mapStoredMessage(message: Message): LocalChatMessage | null {
  if (message.role !== "user" && message.role !== "assistant") {
    return null;
  }

  return {
    content: message.content,
    createdAt: message.createdAt,
    id: message.id,
    role: message.role,
    status:
      message.role === "assistant" &&
      message.content === persistedAssistantErrorMessage
        ? "error"
        : "sent",
  };
}

function isLocalChatMessage(
  message: LocalChatMessage | null,
): message is LocalChatMessage {
  return Boolean(message);
}

export function ChatPanel({
  activeConversationId,
  activeProjectId,
  assistant,
  className = "",
  resetKey,
  onConversationChange,
  onConversationCreated,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [historyLoadState, setHistoryLoadState] =
    useState<HistoryLoadState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);

  const trimmedInput = input.trim();
  const isHistoryLoading = historyLoadState === "loading";
  const canSubmit = Boolean(trimmedInput) && !isLoading && !isHistoryLoading;

  useEffect(() => {
    setInput("");
    setHistoryLoadState("idle");
    setMessages([]);
  }, [resetKey]);

  useEffect(() => {
    let isMounted = true;

    async function loadConversationMessages(conversationId: string) {
      setHistoryLoadState("loading");
      setMessages([]);

      try {
        const response = await fetch(
          `/api/conversations/${encodeURIComponent(conversationId)}/messages`,
          { cache: "no-store" },
        );
        const data = (await response.json()) as ConversationMessagesResponse;

        if (!response.ok || data.error || !Array.isArray(data.messages)) {
          throw new Error("Failed to load conversation messages");
        }

        if (!isMounted) {
          return;
        }

        setMessages(
          data.messages.map(mapStoredMessage).filter(isLocalChatMessage),
        );
        setHistoryLoadState("success");
      } catch {
        if (!isMounted) {
          return;
        }

        setMessages([]);
        setHistoryLoadState("error");
      }
    }

    if (!activeConversationId) {
      setHistoryLoadState("idle");
      setMessages([]);
      return () => {
        isMounted = false;
      };
    }

    loadConversationMessages(activeConversationId);

    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  async function sendMessage() {
    const message = input.trim();

    if (!message || isLoading || isHistoryLoading) {
      return;
    }

    setInput("");
    setIsLoading(true);
    setMessages((current) => [...current, createMessage("user", message)]);

    try {
      const requestBody = activeConversationId
        ? { conversationId: activeConversationId, message }
        : activeProjectId
          ? { message, projectId: activeProjectId }
          : { message };
      const response = await fetch("/api/chat", {
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok || data.error || !data.content) {
        if (data.conversationId) {
          if (activeConversationId) {
            onConversationChange(data.conversationId);
          } else {
            onConversationCreated(data.conversationId);
          }
        }

        setMessages((current) => [
          ...current,
          createMessage(
            "assistant",
            data.content ?? getChatErrorMessage(data),
            "error",
          ),
        ]);
        return;
      }

      if (data.conversationId) {
        if (activeConversationId) {
          onConversationChange(data.conversationId);
        } else {
          onConversationCreated(data.conversationId);
        }
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.content ?? ""),
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          chatErrorMessages.TEMPORARY_ERROR,
          "error",
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <section
      className={`surface-panel flex min-h-[620px] flex-col rounded-lg border p-4 shadow-2xl shadow-black/30 sm:p-5 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">
            Assistente
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {assistant.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {assistant.description}
          </p>
        </div>
        <div className="rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
          {activeConversationId ? "Conversa ativa" : "Nova conversa"}
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1"
      >
        {isHistoryLoading ? (
          <div
            className="rounded-md border border-blue-400/20 bg-blue-500/10 p-4"
            role="status"
          >
            <p className="flex items-center gap-2 text-sm leading-6 text-slate-300">
              <span
                aria-hidden="true"
                className="h-2 w-2 animate-pulse rounded-full bg-blue-300"
              />
              Carregando histórico da conversa...
            </p>
          </div>
        ) : historyLoadState === "error" ? (
          <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-4">
            <p className="text-sm leading-6 text-amber-100">
              Não consegui carregar esta conversa agora. Tente selecionar outra
              conversa ou envie uma nova mensagem.
            </p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        ) : (
          <div className="rounded-md border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-sm leading-6 text-slate-400">
              {activeConversationId
                ? "Esta conversa ainda não tem mensagens salvas."
                : "Comece pelo que está na sua cabeça agora: uma prioridade, uma dúvida ou uma ideia solta."}
            </p>
          </div>
        )}
        {isLoading ? (
          <div
            className="rounded-md border border-blue-400/20 bg-blue-500/10 p-4"
            role="status"
          >
            <p className="flex items-center gap-2 text-sm leading-6 text-slate-300">
              <span
                aria-hidden="true"
                className="h-2 w-2 animate-pulse rounded-full bg-blue-300"
              />
              Organizando uma resposta para você...
            </p>
          </div>
        ) : null}
      </div>

      <form
        className="mt-5 space-y-3 border-t border-slate-800/80 pt-5"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
            htmlFor="assistant-message"
          >
            Mensagem para o assistente
          </label>
          <p className="mt-1 text-xs leading-5 text-slate-500" id="chat-hint">
            Use Enter para quebrar linha. Use Ctrl+Enter ou Cmd+Enter para
            enviar.
          </p>
          <textarea
            aria-describedby="chat-hint"
            className="focus-ring mt-2 min-h-28 w-full resize-none rounded-md border border-slate-700/80 bg-slate-950/80 px-3.5 py-3 text-sm leading-6 text-slate-100 placeholder:text-slate-600 transition hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading || isHistoryLoading}
            id="assistant-message"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Ex: me ajude a organizar meus próximos focos."
            value={input}
          />
        </div>
        <button
          aria-label="Enviar mensagem para o assistente"
          className="focus-ring w-full rounded-md border border-blue-400/30 bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:border-blue-300/50 hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500 disabled:shadow-none"
          disabled={!canSubmit}
          type="submit"
        >
          {isLoading ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
    </section>
  );
}
