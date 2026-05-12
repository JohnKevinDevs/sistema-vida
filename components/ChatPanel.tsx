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
  assistant: AssistantPreview;
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
  assistant,
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
      <p className="mt-3 text-xs font-medium text-cyan-100/80">
        {activeConversationId
          ? "Conversa salva carregada nesta sessão"
          : "Nova conversa será criada no primeiro envio"}
      </p>

      <div
        aria-live="polite"
        className="mt-5 max-h-80 space-y-3 overflow-y-auto pr-1"
      >
        {isHistoryLoading ? (
          <div
            className="rounded-md border border-cyan-300/20 bg-neutral-900/80 p-3"
            role="status"
          >
            <p className="flex items-center gap-2 text-sm leading-6 text-neutral-300">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-cyan-200"
              />
              Carregando histórico da conversa...
            </p>
          </div>
        ) : historyLoadState === "error" ? (
          <div className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3">
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
          <div className="rounded-md border border-white/10 bg-neutral-950/40 p-3">
            <p className="text-sm leading-6 text-neutral-400">
              {activeConversationId
                ? "Esta conversa ainda não tem mensagens salvas."
                : "Envie uma pergunta curta para organizar o dia, uma rotina, um estudo ou um projeto. Nada é restaurado automaticamente ao recarregar."}
            </p>
          </div>
        )}
        {isLoading ? (
          <div
            className="rounded-md border border-cyan-300/20 bg-neutral-900/80 p-3"
            role="status"
          >
            <p className="flex items-center gap-2 text-sm leading-6 text-neutral-300">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-cyan-200"
              />
              Organizando uma resposta para você...
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
          <p className="mt-1 text-xs leading-5 text-neutral-500" id="chat-hint">
            Use Enter para quebrar linha. Use Ctrl+Enter ou Cmd+Enter para
            enviar.
          </p>
          <textarea
            aria-describedby="chat-hint"
            className="focus-ring mt-2 min-h-24 w-full resize-none rounded-md border border-white/10 bg-neutral-950/70 px-3 py-2 text-sm leading-6 text-neutral-100 placeholder:text-neutral-600"
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
          className="focus-ring w-full rounded-md border border-cyan-300/30 bg-cyan-300/15 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-neutral-500"
          disabled={!canSubmit}
          type="submit"
        >
          {isLoading ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
    </section>
  );
}
