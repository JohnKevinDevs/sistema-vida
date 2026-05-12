"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Conversation } from "@/lib/types";

type ConversationsResponse = {
  conversations?: Conversation[];
};

type RenameConversationResponse = {
  conversation?: Conversation;
  error?: string;
};

type LoadState = "idle" | "loading" | "success" | "error";

type ConversationListProps = {
  activeConversationId: string | null;
  refreshKey: number;
  onSelectConversation: (conversationId: string) => void;
};

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

export function ConversationList({
  activeConversationId,
  refreshKey,
  onSelectConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [renameDraft, setRenameDraft] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renamingConversationId, setRenamingConversationId] = useState<
    string | null
  >(null);

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
  }, [refreshKey]);

  function startRename(conversation: Conversation) {
    setEditingConversationId(conversation.id);
    setRenameDraft(conversation.title);
    setRenameError(null);
  }

  function cancelRename() {
    setEditingConversationId(null);
    setRenameDraft("");
    setRenameError(null);
  }

  async function handleRenameSubmit(
    event: FormEvent<HTMLFormElement>,
    conversationId: string,
  ) {
    event.preventDefault();

    const title = renameDraft.trim();

    if (!title) {
      setRenameError("O título não pode estar vazio.");
      return;
    }

    if (title.length > 80) {
      setRenameError("O título deve ter no máximo 80 caracteres.");
      return;
    }

    setRenameError(null);
    setRenamingConversationId(conversationId);

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        body: JSON.stringify({ title }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const data = (await response.json()) as RenameConversationResponse;

      if (!response.ok || !data.conversation) {
        throw new Error(data.error ?? "Não consegui renomear a conversa.");
      }

      setConversations((current) => [
        data.conversation as Conversation,
        ...current.filter(
          (conversation) => conversation.id !== data.conversation?.id,
        ),
      ]);
      cancelRename();
    } catch (error) {
      setRenameError(
        error instanceof Error
          ? error.message
          : "Não consegui renomear a conversa.",
      );
    } finally {
      setRenamingConversationId(null);
    }
  }

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
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              const isEditing = conversation.id === editingConversationId;
              const isRenaming =
                conversation.id === renamingConversationId;

              return (
                <li
                  className={`rounded-md border transition ${
                    isActive
                      ? "border-cyan-300/40 bg-cyan-300/15"
                      : "border-white/10 bg-neutral-900/70"
                  }`}
                  key={conversation.id}
                >
                  <button
                    aria-label={`Carregar conversa: ${conversation.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className="focus-ring w-full rounded-t-md px-3 py-2 text-left transition hover:bg-white/[0.06]"
                    data-conversation-id={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    type="button"
                  >
                    <span className="line-clamp-2 text-sm font-medium leading-5 text-neutral-100">
                      {conversation.title}
                    </span>
                    <span className="mt-1 block text-xs text-neutral-500">
                      Atualizada em {formatUpdatedAt(conversation.updatedAt)}
                    </span>
                    {isActive ? (
                      <span className="mt-2 inline-flex rounded-full border border-cyan-300/30 px-2 py-0.5 text-[11px] font-medium text-cyan-100">
                        Selecionada
                      </span>
                    ) : null}
                  </button>

                  <div className="border-t border-white/10 px-3 py-2">
                    {isEditing ? (
                      <form
                        className="space-y-2"
                        onSubmit={(event) =>
                          handleRenameSubmit(event, conversation.id)
                        }
                      >
                        <label className="sr-only" htmlFor="conversation-title">
                          Novo título da conversa
                        </label>
                        <input
                          className="focus-ring w-full rounded-md border border-white/10 bg-neutral-950/80 px-2 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600"
                          data-conversation-rename-input={conversation.id}
                          disabled={isRenaming}
                          id="conversation-title"
                          maxLength={80}
                          onChange={(event) =>
                            setRenameDraft(event.target.value)
                          }
                          value={renameDraft}
                        />
                        {renameError ? (
                          <p className="text-xs leading-5 text-amber-200">
                            {renameError}
                          </p>
                        ) : null}
                        <div className="flex gap-2">
                          <button
                            className="focus-ring rounded-md border border-cyan-300/30 px-2 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-neutral-500"
                            data-conversation-rename-save={conversation.id}
                            disabled={isRenaming}
                            type="submit"
                          >
                            {isRenaming ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            className="focus-ring rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-neutral-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:text-neutral-500"
                            disabled={isRenaming}
                            onClick={cancelRename}
                            type="button"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-neutral-400 transition hover:bg-white/[0.06] hover:text-neutral-100"
                        data-conversation-rename={conversation.id}
                        onClick={() => startRename(conversation)}
                        type="button"
                      >
                        Renomear
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {loadState === "success" && conversations.length > 0 && (
          <p className="mt-3 text-xs leading-5 text-neutral-500">
            Selecione uma conversa para carregar o histórico no chat.
          </p>
        )}
      </div>
    </section>
  );
}
