"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { StoredTask } from "@/lib/types";

type TasksResponse = {
  tasks?: StoredTask[];
};

type TaskMutationResponse = {
  error?: string;
  task?: StoredTask;
};

type DeleteTaskResponse = {
  deleted?: boolean;
  error?: string;
  taskId?: string;
};

type LoadState = "idle" | "loading" | "success" | "error";

type TaskListProps = {
  activeProjectId: string | null;
};

const MAX_TASK_TITLE_LENGTH = 120;

const priorityLabels: Record<StoredTask["priority"], string> = {
  high: "Alta",
  low: "Baixa",
  medium: "Média",
};

function getTaskListUrl(activeProjectId: string | null) {
  if (activeProjectId) {
    return `/api/tasks?projectId=${encodeURIComponent(activeProjectId)}`;
  }

  return "/api/tasks?scope=global";
}

export function TaskList({ activeProjectId }: TaskListProps) {
  const [createDraft, setCreateDraft] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<StoredTask[]>([]);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "done").length,
    [tasks],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      setLoadState("loading");
      setMutationError(null);

      try {
        const response = await fetch(getTaskListUrl(activeProjectId), {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const data = (await response.json()) as TasksResponse;

        if (!isMounted) {
          return;
        }

        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        setLoadState("success");
      } catch {
        if (!isMounted) {
          return;
        }

        setTasks([]);
        setLoadState("error");
      }
    }

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [activeProjectId]);

  function validateTitle(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return "Digite um título para a tarefa.";
    }

    if (trimmedTitle.length > MAX_TASK_TITLE_LENGTH) {
      return `O título deve ter no máximo ${MAX_TASK_TITLE_LENGTH} caracteres.`;
    }

    return null;
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateTitle(createDraft);

    if (validationError) {
      setCreateError(validationError);
      return;
    }

    setCreateError(null);
    setMutationError(null);
    setIsCreating(true);

    try {
      const response = await fetch("/api/tasks", {
        body: JSON.stringify({
          priority: "medium",
          projectId: activeProjectId,
          title: createDraft.trim(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json()) as TaskMutationResponse;

      if (!response.ok || !data.task) {
        throw new Error(data.error ?? "Não consegui criar a tarefa.");
      }

      setTasks((current) => [
        data.task as StoredTask,
        ...current.filter((task) => task.id !== data.task?.id),
      ]);
      setCreateDraft("");
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Não consegui criar a tarefa.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleTask(task: StoredTask) {
    const nextStatus = task.status === "done" ? "pending" : "done";

    setMutationError(null);
    setUpdatingTaskId(task.id);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        body: JSON.stringify({ status: nextStatus }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const data = (await response.json()) as TaskMutationResponse;

      if (!response.ok || !data.task) {
        throw new Error(data.error ?? "Não consegui atualizar a tarefa.");
      }

      setTasks((current) =>
        current.map((item) =>
          item.id === data.task?.id ? (data.task as StoredTask) : item,
        ),
      );
    } catch (error) {
      setMutationError(
        error instanceof Error
          ? error.message
          : "Não consegui atualizar a tarefa.",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(task: StoredTask) {
    setMutationError(null);
    setDeletingTaskId(task.id);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as DeleteTaskResponse;

      if (!response.ok || !data.deleted) {
        throw new Error(data.error ?? "Não consegui excluir a tarefa.");
      }

      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (error) {
      setMutationError(
        error instanceof Error ? error.message : "Não consegui excluir a tarefa.",
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {activeProjectId ? "Tarefas do projeto" : "Tarefas globais"}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {activeProjectId
              ? "Próximas ações ligadas ao projeto selecionado."
              : "Prioridades sem projeto vinculado."}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-slate-800/80 px-2 py-0.5 text-xs text-slate-500">
          {completedTasks}/{tasks.length}
        </span>
      </div>

      <form className="mt-3 flex gap-2" onSubmit={handleCreateTask}>
        <label className="sr-only" htmlFor="new-task-title">
          Nova tarefa
        </label>
        <input
          className="focus-ring min-w-0 flex-1 rounded-md border border-slate-800/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
          data-task-create-input
          disabled={isCreating}
          id="new-task-title"
          maxLength={MAX_TASK_TITLE_LENGTH}
          onChange={(event) => setCreateDraft(event.target.value)}
          placeholder="Adicionar tarefa"
          value={createDraft}
        />
        <button
          className="focus-ring rounded-md border border-blue-400/30 bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
          data-task-create-submit
          disabled={isCreating || createDraft.trim().length === 0}
          type="submit"
        >
          {isCreating ? "Criando..." : "Criar"}
        </button>
      </form>

      {createError ? (
        <p className="mt-2 rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">
          {createError}
        </p>
      ) : null}

      {mutationError ? (
        <p className="mt-2 rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">
          {mutationError}
        </p>
      ) : null}

      <div className="mt-3 space-y-2">
        {loadState === "loading" ? (
          <p className="rounded-md border border-slate-800/80 bg-slate-950/45 px-3.5 py-3 text-sm leading-6 text-slate-400">
            Carregando tarefas...
          </p>
        ) : null}

        {loadState === "error" ? (
          <p className="rounded-md border border-amber-300/20 bg-amber-300/10 px-3.5 py-3 text-sm leading-6 text-amber-100">
            Não consegui carregar as tarefas agora.
          </p>
        ) : null}

        {loadState === "success" && tasks.length === 0 ? (
          <p className="rounded-md border border-slate-800/80 bg-slate-950/45 px-3.5 py-3 text-sm leading-6 text-slate-500">
            Nenhuma tarefa criada neste contexto ainda.
          </p>
        ) : null}

        {tasks.map((task) => {
          const isDone = task.status === "done";
          const isUpdating = updatingTaskId === task.id;
          const isDeleting = deletingTaskId === task.id;

          return (
            <article
              className={`rounded-md border px-3.5 py-3 transition ${
                isDone
                  ? "border-emerald-300/20 bg-emerald-300/10"
                  : "border-slate-800/80 bg-slate-950/45"
              }`}
              data-task-id={task.id}
              key={task.id}
            >
              <div className="flex items-start gap-3">
                <button
                  aria-label={
                    isDone
                      ? `Voltar tarefa para pendente: ${task.title}`
                      : `Marcar tarefa como concluída: ${task.title}`
                  }
                  aria-pressed={isDone}
                  className={`focus-ring mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] transition ${
                    isDone
                      ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
                      : "border-slate-700 bg-slate-950 text-transparent hover:border-blue-400/40"
                  }`}
                  data-task-toggle={task.id}
                  disabled={isUpdating || isDeleting}
                  onClick={() => {
                    void handleToggleTask(task);
                  }}
                  type="button"
                >
                  ✓
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium leading-5 ${
                      isDone ? "text-slate-400 line-through" : "text-white"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Prioridade {priorityLabels[task.priority]}
                    {task.dueDate ? ` · ${task.dueDate}` : ""}
                  </p>
                </div>

                <button
                  className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-red-200/70 transition hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:text-slate-600"
                  data-task-delete={task.id}
                  disabled={isUpdating || isDeleting}
                  onClick={() => {
                    void handleDeleteTask(task);
                  }}
                  type="button"
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
