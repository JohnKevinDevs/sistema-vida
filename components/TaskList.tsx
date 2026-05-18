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
type TaskPriority = StoredTask["priority"];
type TaskStatusFilter = "all" | "pending" | "done";

type TaskListProps = {
  activeProjectId: string | null;
};

const MAX_TASK_TITLE_LENGTH = 120;
const taskFilterOptions: Array<{
  label: string;
  value: TaskStatusFilter;
}> = [
  { label: "Todas", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Concluídas", value: "done" },
];

const priorityLabels: Record<StoredTask["priority"], string> = {
  high: "Alta",
  low: "Baixa",
  medium: "Média",
};

const taskPriorityOptions: Array<{
  label: string;
  value: TaskPriority;
}> = [
  { label: "Baixa", value: "low" },
  { label: "Média", value: "medium" },
  { label: "Alta", value: "high" },
];

const priorityToneClasses: Record<TaskPriority, string> = {
  high: "border-blue-300/35 bg-blue-500/15 text-blue-100",
  low: "border-slate-800/80 bg-slate-950/40 text-slate-500",
  medium: "border-slate-700/80 bg-slate-900/70 text-slate-300",
};

const prioritySortRank: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function getTaskListUrl(activeProjectId: string | null) {
  if (activeProjectId) {
    return `/api/tasks?projectId=${encodeURIComponent(activeProjectId)}`;
  }

  return "/api/tasks?scope=global";
}

function getEmptyFilterMessage(taskFilter: TaskStatusFilter) {
  if (taskFilter === "done") {
    return "Nenhuma tarefa concluída neste contexto.";
  }

  if (taskFilter === "pending") {
    return "Nenhuma tarefa pendente neste contexto.";
  }

  return "Nenhuma tarefa neste filtro.";
}

function getTaskCreatedTime(task: StoredTask) {
  const timestamp = Date.parse(task.createdAt);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortTasksForDisplay(tasks: StoredTask[]) {
  return [...tasks].sort((firstTask, secondTask) => {
    const firstIsDone = firstTask.status === "done";
    const secondIsDone = secondTask.status === "done";

    if (firstIsDone !== secondIsDone) {
      return firstIsDone ? 1 : -1;
    }

    if (!firstIsDone && !secondIsDone) {
      const priorityDifference =
        prioritySortRank[firstTask.priority] -
        prioritySortRank[secondTask.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }
    }

    return getTaskCreatedTime(secondTask) - getTaskCreatedTime(firstTask);
  });
}

export function TaskList({ activeProjectId }: TaskListProps) {
  const [createDraft, setCreateDraft] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPriority, setCreatePriority] = useState<TaskPriority>("medium");
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [isCreating, setIsCreating] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskStatusFilter>("all");
  const [tasks, setTasks] = useState<StoredTask[]>([]);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status !== "done").length,
    [tasks],
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "done").length,
    [tasks],
  );
  const sortedTasks = useMemo(() => sortTasksForDisplay(tasks), [tasks]);
  const filteredTasks = useMemo(() => {
    if (taskFilter === "done") {
      return sortedTasks.filter((task) => task.status === "done");
    }

    if (taskFilter === "pending") {
      return sortedTasks.filter((task) => task.status !== "done");
    }

    return sortedTasks;
  }, [sortedTasks, taskFilter]);

  const taskFilterCounts: Record<TaskStatusFilter, number> = {
    all: tasks.length,
    done: completedTasks,
    pending: pendingTasks,
  };

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      setLoadState("loading");
      setMutationError(null);
      setEditingTaskId(null);
      setEditDraft("");
      setEditError(null);

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

  function startEditTask(task: StoredTask) {
    setEditDraft(task.title);
    setEditError(null);
    setEditPriority(task.priority);
    setEditingTaskId(task.id);
    setMutationError(null);
  }

  function cancelEditTask() {
    setEditingTaskId(null);
    setEditDraft("");
    setEditError(null);
    setEditPriority("medium");
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
          priority: createPriority,
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
      setCreatePriority("medium");
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Não consegui criar a tarefa.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleEditTask(
    event: FormEvent<HTMLFormElement>,
    task: StoredTask,
  ) {
    event.preventDefault();

    const validationError = validateTitle(editDraft);

    if (validationError) {
      setEditError(validationError);
      return;
    }

    const title = editDraft.trim();

    if (title === task.title && editPriority === task.priority) {
      cancelEditTask();
      return;
    }

    setEditError(null);
    setMutationError(null);
    setSavingTaskId(task.id);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        body: JSON.stringify({ priority: editPriority, title }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const data = (await response.json()) as TaskMutationResponse;

      if (!response.ok || !data.task) {
        throw new Error(data.error ?? "Não consegui editar a tarefa.");
      }

      setTasks((current) =>
        current.map((item) =>
          item.id === data.task?.id ? (data.task as StoredTask) : item,
        ),
      );
      cancelEditTask();
    } catch (error) {
      setEditError(
        error instanceof Error ? error.message : "Não consegui editar a tarefa.",
      );
    } finally {
      setSavingTaskId(null);
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

      if (editingTaskId === task.id) {
        cancelEditTask();
      }
    } catch (error) {
      setMutationError(
        error instanceof Error ? error.message : "Não consegui excluir a tarefa.",
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {activeProjectId ? "Tarefas do projeto" : "Tarefas globais"}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {activeProjectId
              ? "Próximas ações ligadas ao projeto selecionado."
              : "Tarefas sem projeto vinculado."}
          </p>
        </div>
        {tasks.length > 0 ? (
          <span className="w-fit shrink-0 rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-100/80">
            {completedTasks}/{tasks.length} feitas
          </span>
        ) : null}
      </div>

      <form className="space-y-2" onSubmit={handleCreateTask}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="new-task-title">
            Nova tarefa
          </label>
          <input
            className="focus-ring min-w-0 flex-1 rounded-md border border-slate-800/80 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition hover:border-slate-700"
            data-task-create-input
            disabled={isCreating}
            id="new-task-title"
            maxLength={MAX_TASK_TITLE_LENGTH}
            onChange={(event) => setCreateDraft(event.target.value)}
            placeholder="Adicionar tarefa do dia"
            value={createDraft}
          />
          <label className="sr-only" htmlFor="new-task-priority">
            Prioridade da nova tarefa
          </label>
          <select
            className="focus-ring rounded-md border border-slate-800/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-200 transition hover:border-slate-700 sm:w-32"
            data-task-create-priority
            disabled={isCreating}
            id="new-task-priority"
            onChange={(event) =>
              setCreatePriority(event.target.value as TaskPriority)
            }
            value={createPriority}
          >
            {taskPriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className="focus-ring rounded-md border border-blue-400/30 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-950/20 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500 disabled:shadow-none"
            data-task-create-submit
            disabled={isCreating || createDraft.trim().length === 0}
            type="submit"
          >
            {isCreating ? "Criando..." : "Criar"}
          </button>
        </div>
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

      {tasks.length > 0 ? (
        <div
          aria-label="Filtrar tarefas por status"
          className="grid grid-cols-3 gap-1 rounded-lg border border-slate-800/80 bg-slate-950/60 p-1 shadow-inner shadow-black/20"
          role="group"
        >
          {taskFilterOptions.map((option) => {
            const isActive = option.value === taskFilter;

            return (
              <button
                aria-pressed={isActive}
                className={`focus-ring rounded-md px-2.5 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-950/30"
                    : "text-slate-500 hover:bg-slate-900/90 hover:text-slate-100"
                }`}
                data-task-filter={option.value}
                key={option.value}
                onClick={() => setTaskFilter(option.value)}
                type="button"
              >
                {option.label}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-blue-400/20 text-blue-50"
                      : "bg-slate-900 text-slate-500"
                  }`}
                >
                  {taskFilterCounts[option.value]}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="space-y-2.5">
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
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/45 px-4 py-4">
            <p className="text-sm font-medium text-slate-300">
              Nenhuma tarefa criada ainda.
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Adicione uma tarefa simples para deixar o próximo passo visível.
            </p>
          </div>
        ) : null}

        {loadState === "success" && tasks.length > 0 && filteredTasks.length === 0 ? (
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/45 px-4 py-4">
            <p className="text-sm font-medium text-slate-300">
              {getEmptyFilterMessage(taskFilter)}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Troque o filtro ou crie uma nova tarefa para este contexto.
            </p>
          </div>
        ) : null}

        {filteredTasks.map((task) => {
          const isDone = task.status === "done";
          const isEditing = editingTaskId === task.id;
          const isSaving = savingTaskId === task.id;
          const isUpdating = updatingTaskId === task.id;
          const isDeleting = deletingTaskId === task.id;
          const titleInputId = `task-title-${task.id}`;

          return (
            <article
              className={`rounded-lg border px-3.5 py-3.5 transition ${
                isDone
                  ? "border-slate-800/60 bg-slate-950/40 opacity-60"
                  : "border-slate-800/80 bg-slate-950/45 hover:border-blue-400/20 hover:bg-slate-950/70"
              }`}
              data-task-id={task.id}
              key={task.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <button
                  aria-label={
                    isDone
                      ? `Voltar tarefa para pendente: ${task.title}`
                      : `Marcar tarefa como concluída: ${task.title}`
                  }
                  aria-pressed={isDone}
                  className={`focus-ring mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs transition ${
                    isDone
                      ? "border-blue-400/30 bg-blue-500/10 text-blue-200/80"
                      : "border-slate-700 bg-slate-950 text-transparent hover:border-blue-400/50 hover:bg-blue-500/10"
                  }`}
                  data-task-toggle={task.id}
                  disabled={isUpdating || isDeleting || isSaving}
                  onClick={() => {
                    void handleToggleTask(task);
                  }}
                  type="button"
                >
                  {isDone ? "✓" : "•"}
                </button>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <form
                      className="space-y-2"
                      onSubmit={(event) => {
                        void handleEditTask(event, task);
                      }}
                    >
                      <label className="sr-only" htmlFor={titleInputId}>
                        Editar título da tarefa
                      </label>
                      <input
                        className="focus-ring w-full rounded-md border border-slate-700/80 bg-slate-950/90 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600"
                        data-task-edit-input={task.id}
                        disabled={isSaving}
                        id={titleInputId}
                        maxLength={MAX_TASK_TITLE_LENGTH}
                        onChange={(event) => setEditDraft(event.target.value)}
                        value={editDraft}
                      />
                      <label
                        className="sr-only"
                        htmlFor={`task-priority-${task.id}`}
                      >
                        Editar prioridade da tarefa
                      </label>
                      <select
                        className="focus-ring w-full rounded-md border border-slate-700/80 bg-slate-950/90 px-3 py-2.5 text-sm text-slate-100"
                        data-task-edit-priority={task.id}
                        disabled={isSaving}
                        id={`task-priority-${task.id}`}
                        onChange={(event) =>
                          setEditPriority(event.target.value as TaskPriority)
                        }
                        value={editPriority}
                      >
                        {taskPriorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {editError ? (
                        <p className="text-xs leading-5 text-amber-200">
                          {editError}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="focus-ring rounded-md border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-100 transition hover:bg-blue-500/15 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
                          data-task-edit-save={task.id}
                          disabled={isSaving}
                          type="submit"
                        >
                          {isSaving ? "Salvando..." : "Salvar"}
                        </button>
                        <button
                          className="focus-ring rounded-md border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 disabled:cursor-not-allowed disabled:text-slate-500"
                          disabled={isSaving}
                          onClick={cancelEditTask}
                          type="button"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p
                        className={`text-sm font-medium leading-5 ${
                          isDone ? "text-slate-400 line-through" : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full border border-slate-800/80 px-2 py-0.5">
                          {isDone ? "Concluída" : "Pendente"}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 ${priorityToneClasses[task.priority]}`}
                        >
                          Prioridade {priorityLabels[task.priority]}
                        </span>
                        {task.dueDate ? <span>{task.dueDate}</span> : null}
                      </div>
                    </>
                  )}
                </div>

                {!isEditing ? (
                  <div className="flex shrink-0 flex-wrap gap-1.5 sm:justify-end">
                    <button
                      className="focus-ring rounded-md border border-transparent px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-800/80 hover:bg-slate-800/80 hover:text-slate-100 disabled:cursor-not-allowed disabled:text-slate-600"
                      data-task-edit={task.id}
                      disabled={isUpdating || isDeleting}
                      onClick={() => startEditTask(task)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="focus-ring rounded-md border border-transparent px-2.5 py-1.5 text-xs font-medium text-red-200/70 transition hover:border-red-300/15 hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:text-slate-600"
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
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
