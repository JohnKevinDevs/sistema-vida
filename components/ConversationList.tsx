"use client";

import { useEffect, useState } from "react";
import type { Conversation } from "@/lib/types";

type ConversationsResponse = {
  conversations?: Conversation[];
};

type LoadState = "idle" | "loading" | "success" | "error";

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Atualização recente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");

  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      setLoadState("loading");

      try {
        const response = await fetch("/api/conversations", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load conversations");
        }

        const data = (await response.json()) as ConversationsResponse;

        if (!isMounted) {
          return;
        }

        setConversations(Array.isArray(data.conversations) ? data.conversations : []);
        setLoadState("success");
      } catch {
        if (!isMounted) {
          return;
        }

        setConversations([]);
        setLoadState("error");
      }
    }

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      aria-labelledby="saved-conversations-title"
      className="mt-6 rounded-md border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Conversas
          </p>
          <h2
            className="mt-2 text-sm font-semibold text-neutral-100"
            id="saved-conversations-title"
          >
            Salvas localmente
          </h2>
        </div>
        <span className="rounded-full border border-cyan-400/20 px-2 py-1 text-[11px] font-medium text-cyan-200">
          SQLite
        </span>
      </div>

      <div className="mt-4">
        {loadState === "loading" && (
          <p className="text-sm leading-6 text-neutral-400">
            Carregando conversas...
          </p>
        )}

        {loadState === "error" && (
          <p className="text-sm leading-6 text-amber-200">
            Não consegui carregar as conversas agora.
          </p>
        )}

        {loadState === "success" && conversations.length === 0 && (
          <p className="text-sm leading-6 text-neutral-400">
            Nenhuma conversa salva ainda.
          </p>
        )}

        {conversations.length > 0 && (
          <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {conversations.map((conversation) => (
              <li
                className="rounded-md border border-white/10 bg-neutral-900/70 px-3 py-2"
                key={conversation.id}
              >
                <p className="line-clamp-2 text-sm font-medium leading-5 text-neutral-100">
                  {conversation.title}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Atualizada em {formatUpdatedAt(conversation.updatedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {loadState === "success" && conversations.length > 0 && (
          <p className="mt-3 text-xs leading-5 text-neutral-500">
            Carregar histórico ficará para a próxima etapa.
          </p>
        )}
      </div>
    </section>
  );
}
