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

type DeleteConversationResponse = {
  conversationId?: string;
  deleted?: boolean;
  error?: string;
};

type LoadState = "idle" | "loading" | "success" | "error";

type ConversationListProps = {
  activeConversationId: string | null;
  refreshKey: number;
  onDeleteConversation: (conversationId: string) => void;
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
  onDeleteConversation,
  onSelectConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [deleteError, setDeleteError] = useState<{
    conversationId: string;
    message: string;
  } | null>(null);
  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [pendingDeleteConversationId, setPendingDeleteConversationId] =
    useState<string | null>(null);
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

        setConversations(
          Array.isArray(data.conversations) ? data.conversations : [],
        );
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
    setDeleteError(null);
    setPendingDeleteConversationId(null);
    setRenameDraft(conversation.title);
    setRenameError(null);
  }

  function cancelRename() {
    setEditingConversationId(null);
    setRenameDraft("");
    setRenameError(null);
  }

  function requestDeleteConversation(conversationId: string) {
    setDeleteError(null);
    setEditingConversationId(null);
    setPendingDeleteConversationId(conversationId);
  }

  async function handleDeleteConversation(conversation: Conversation) {
    setDeleteError(null);
    setDeletingConversationId(conversation.id);

    try {
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as DeleteConversationResponse;

      if (!response.ok || !data.deleted) {
        throw new Error(data.error ?? "Não consegui excluir a conversa.");
      }

      setConversations((current) =>
        current.filter((item) => item.id !== conversation.id),
      );

      if (editingConversationId === conversation.id) {
        cancelRename();
      }

      onDeleteConversation(conversation.id);
      setPendingDeleteConversationId(null);
    } catch (error) {
      setDeleteError({
        conversationId: conversation.id,
        message:
          error instanceof Error
            ? error.message
            : "Não consegui excluir a conversa.",
      });
    } finally {
      setDeletingConversationId(null);
    }
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
    <section aria-labelledby="saved-conversations-title" className="mt-8">
      <div className="px-1">
        <h2
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
          id="saved-conversations-title"
        >
          Conversas
        </h2>
      </div>

      <div className="mt-3">
        {loadState === "loading" && (
          <p className="rounded-md border border-slate-800/80 bg-slate-900/55 px-3 py-3 text-sm leading-6 text-slate-400">
            Carregando conversas...
          </p>
        )}

        {loadState === "error" && (
          <p className="rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-3 text-sm leading-6 text-amber-100">
            Não consegui carregar as conversas agora.
          </p>
        )}

        {loadState === "success" && conversations.length === 0 && (
          <p className="rounded-md border border-slate-800/80 bg-slate-900/55 px-3 py-3 text-sm leading-6 text-slate-500">
            Nenhuma conversa salva ainda.
          </p>
        )}

        {conversations.length > 0 && (
          <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1 lg:max-h-[44vh]">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              const isEditing = conversation.id === editingConversationId;
              const isRenaming = conversation.id === renamingConversationId;
              const isDeleting = conversation.id === deletingConversationId;
              const isPendingDelete =
                conversation.id === pendingDeleteConversationId;
              const titleInputId = `conversation-title-${conversation.id}`;
              const currentDeleteError =
                deleteError?.conversationId === conversation.id
                  ? deleteError.message
                  : null;

              return (
                <li
                  className={`rounded-md border transition ${
                    isActive
                      ? "border-blue-400/30 bg-blue-500/10 shadow-sm shadow-blue-950/20"
                      : "border-transparent bg-transparent hover:border-slate-800/80 hover:bg-slate-900/60"
                  }`}
                  key={conversation.id}
                >
                  <button
                    aria-label={`Carregar conversa: ${conversation.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className="focus-ring w-full rounded-md px-3 py-2.5 text-left"
                    data-conversation-id={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    type="button"
                  >
                    <span className="line-clamp-1 text-sm font-medium leading-5 text-slate-100">
                      {conversation.title}
                    </span>
                    <span
                      className={`mt-1 block text-xs ${
                        isActive ? "text-blue-200/80" : "text-slate-500"
                      }`}
                    >
                      {formatUpdatedAt(conversation.updatedAt)}
                    </span>
                  </button>

                  <div className="px-3 pb-2">
                    {isEditing ? (
                      <form
                        className="space-y-2"
                        onSubmit={(event) =>
                          handleRenameSubmit(event, conversation.id)
                        }
                      >
                        <label className="sr-only" htmlFor={titleInputId}>
                          Novo título da conversa
                        </label>
                        <input
                          className="focus-ring w-full rounded-md border border-slate-700/80 bg-slate-950/90 px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                          data-conversation-rename-input={conversation.id}
                          disabled={isRenaming}
                          id={titleInputId}
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
                            className="focus-ring rounded-md border border-blue-400/30 bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-100 transition hover:bg-blue-500/15 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
                            data-conversation-rename-save={conversation.id}
                            disabled={isRenaming}
                            type="submit"
                          >
                            {isRenaming ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            className="focus-ring rounded-md border border-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 disabled:cursor-not-allowed disabled:text-slate-500"
                            disabled={isRenaming}
                            onClick={cancelRename}
                            type="button"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : isPendingDelete ? (
                      <div className="space-y-2 rounded-md border border-red-300/15 bg-red-500/10 p-2.5">
                        <p className="text-xs leading-5 text-red-100">
                          Excluir esta conversa? Essa ação não pode ser
                          desfeita.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="focus-ring rounded-md border border-red-300/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
                            data-conversation-delete-confirm={conversation.id}
                            disabled={isDeleting}
                            onClick={() => {
                              void handleDeleteConversation(conversation);
                            }}
                            type="button"
                          >
                            {isDeleting ? "Excluindo..." : "Confirmar"}
                          </button>
                          <button
                            className="focus-ring rounded-md border border-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 disabled:cursor-not-allowed disabled:text-slate-500"
                            data-conversation-delete-cancel={conversation.id}
                            disabled={isDeleting}
                            onClick={() => setPendingDeleteConversationId(null)}
                            type="button"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-800/80 hover:text-slate-100 disabled:cursor-not-allowed disabled:text-slate-600"
                          data-conversation-rename={conversation.id}
                          disabled={isDeleting}
                          onClick={() => startRename(conversation)}
                          type="button"
                        >
                          Renomear
                        </button>
                        <button
                          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-red-200/70 transition hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:text-slate-600"
                          data-conversation-delete={conversation.id}
                          disabled={isDeleting}
                          onClick={() =>
                            requestDeleteConversation(conversation.id)
                          }
                          type="button"
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                    {currentDeleteError ? (
                      <p className="mt-2 rounded-md border border-amber-300/20 bg-amber-300/10 px-2 py-1.5 text-xs leading-5 text-amber-100">
                        {currentDeleteError}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
