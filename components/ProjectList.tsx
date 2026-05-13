"use client";

import { FormEvent, useEffect, useState } from "react";
import type { StoredProject, StoredProjectStatus } from "@/lib/types";

type ProjectsResponse = {
  projects?: StoredProject[];
};

type ProjectMutationResponse = {
  error?: string;
  project?: StoredProject;
};

type DeleteProjectResponse = {
  deleted?: boolean;
  error?: string;
  projectId?: string;
};

type LoadState = "idle" | "loading" | "success" | "error";

const MAX_PROJECT_NAME_LENGTH = 80;

const projectStatusLabels: Record<StoredProjectStatus, string> = {
  active: "Ativo",
  archived: "Arquivado",
  paused: "Pausado",
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

export function ProjectList() {
  const [createDraft, setCreateDraft] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<{
    message: string;
    projectId: string;
  } | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState<
    string | null
  >(null);
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [renameDraft, setRenameDraft] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      setLoadState("loading");

      try {
        const response = await fetch("/api/projects", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = (await response.json()) as ProjectsResponse;

        if (!isMounted) {
          return;
        }

        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setLoadState("success");
      } catch {
        if (!isMounted) {
          return;
        }

        setProjects([]);
        setLoadState("error");
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  function validateProjectName(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "O nome do projeto não pode estar vazio.";
    }

    if (trimmedName.length > MAX_PROJECT_NAME_LENGTH) {
      return `O nome do projeto deve ter no máximo ${MAX_PROJECT_NAME_LENGTH} caracteres.`;
    }

    return null;
  }

  function closeCreateForm() {
    setCreateDraft("");
    setCreateError(null);
    setIsCreateOpen(false);
  }

  function startRename(project: StoredProject) {
    setDeleteError(null);
    setEditingProjectId(project.id);
    setPendingDeleteProjectId(null);
    setRenameDraft(project.name);
    setRenameError(null);
  }

  function cancelRename() {
    setEditingProjectId(null);
    setRenameDraft("");
    setRenameError(null);
  }

  function requestDeleteProject(projectId: string) {
    setDeleteError(null);
    setEditingProjectId(null);
    setPendingDeleteProjectId(projectId);
  }

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateProjectName(createDraft);

    if (validationError) {
      setCreateError(validationError);
      return;
    }

    setCreateError(null);
    setIsCreating(true);

    try {
      const response = await fetch("/api/projects", {
        body: JSON.stringify({ name: createDraft.trim() }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json()) as ProjectMutationResponse;

      if (!response.ok || !data.project) {
        throw new Error(data.error ?? "Não consegui criar o projeto.");
      }

      setProjects((current) => [
        data.project as StoredProject,
        ...current.filter((project) => project.id !== data.project?.id),
      ]);
      closeCreateForm();
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "Não consegui criar o projeto.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRenameSubmit(
    event: FormEvent<HTMLFormElement>,
    projectId: string,
  ) {
    event.preventDefault();

    const validationError = validateProjectName(renameDraft);

    if (validationError) {
      setRenameError(validationError);
      return;
    }

    setRenameError(null);
    setRenamingProjectId(projectId);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        body: JSON.stringify({ name: renameDraft.trim() }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const data = (await response.json()) as ProjectMutationResponse;

      if (!response.ok || !data.project) {
        throw new Error(data.error ?? "Não consegui renomear o projeto.");
      }

      setProjects((current) => [
        data.project as StoredProject,
        ...current.filter((project) => project.id !== data.project?.id),
      ]);
      cancelRename();
    } catch (error) {
      setRenameError(
        error instanceof Error
          ? error.message
          : "Não consegui renomear o projeto.",
      );
    } finally {
      setRenamingProjectId(null);
    }
  }

  async function handleDeleteProject(project: StoredProject) {
    setDeleteError(null);
    setDeletingProjectId(project.id);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as DeleteProjectResponse;

      if (!response.ok || !data.deleted) {
        throw new Error(data.error ?? "Não consegui excluir o projeto.");
      }

      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );

      if (editingProjectId === project.id) {
        cancelRename();
      }

      setPendingDeleteProjectId(null);
    } catch (error) {
      setDeleteError({
        message:
          error instanceof Error
            ? error.message
            : "Não consegui excluir o projeto.",
        projectId: project.id,
      });
    } finally {
      setDeletingProjectId(null);
    }
  }

  return (
    <section aria-labelledby="sidebar-projects-title" className="mt-8">
      <div className="flex items-start justify-between gap-3 px-1">
        <div>
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
            id="sidebar-projects-title"
          >
            Projetos
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Espaços do Sistema JK. Conversas ainda ficam globais.
          </p>
        </div>
        <button
          className="focus-ring shrink-0 rounded-md border border-blue-400/25 bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-100 transition hover:bg-blue-500/15 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
          data-project-create-toggle
          disabled={isCreating}
          onClick={() => {
            setCreateError(null);
            setIsCreateOpen((current) => !current);
          }}
          type="button"
        >
          Novo projeto
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {isCreateOpen ? (
          <form
            className="space-y-2 rounded-md border border-blue-400/20 bg-blue-500/10 p-3"
            onSubmit={handleCreateSubmit}
          >
            <label className="sr-only" htmlFor="new-project-name">
              Nome do novo projeto
            </label>
            <input
              className="focus-ring w-full rounded-md border border-slate-700/80 bg-slate-950/90 px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-600"
              data-project-create-input
              disabled={isCreating}
              id="new-project-name"
              maxLength={MAX_PROJECT_NAME_LENGTH}
              onChange={(event) => setCreateDraft(event.target.value)}
              placeholder="Nome do projeto"
              value={createDraft}
            />
            {createError ? (
              <p className="text-xs leading-5 text-amber-200">
                {createError}
              </p>
            ) : null}
            <div className="flex gap-2">
              <button
                className="focus-ring rounded-md border border-blue-400/30 bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                data-project-create-save
                disabled={isCreating}
                type="submit"
              >
                {isCreating ? "Criando..." : "Criar"}
              </button>
              <button
                className="focus-ring rounded-md border border-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 disabled:cursor-not-allowed disabled:text-slate-500"
                disabled={isCreating}
                onClick={closeCreateForm}
                type="button"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : null}

        {loadState === "loading" && (
          <p className="rounded-md border border-slate-800/80 bg-slate-900/55 px-3 py-3 text-sm leading-6 text-slate-400">
            Carregando projetos...
          </p>
        )}

        {loadState === "error" && (
          <p className="rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-3 text-sm leading-6 text-amber-100">
            Não consegui carregar os projetos agora.
          </p>
        )}

        {loadState === "success" && projects.length === 0 && (
          <p className="rounded-md border border-slate-800/80 bg-slate-900/55 px-3 py-3 text-sm leading-6 text-slate-500">
            Nenhum projeto criado ainda.
          </p>
        )}

        {projects.length > 0 && (
          <ul className="space-y-1.5">
            {projects.map((project) => {
              const isDeleting = project.id === deletingProjectId;
              const isEditing = project.id === editingProjectId;
              const isPendingDelete = project.id === pendingDeleteProjectId;
              const isRenaming = project.id === renamingProjectId;
              const titleInputId = `project-name-${project.id}`;
              const currentDeleteError =
                deleteError?.projectId === project.id
                  ? deleteError.message
                  : null;

              return (
                <li
                  className="rounded-md border border-transparent transition hover:border-slate-800/80 hover:bg-slate-900/60"
                  key={project.id}
                >
                  <div className="flex items-start gap-3 px-3 py-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-800/80 bg-slate-950/50 text-slate-300"
                    >
                      <span className="h-3.5 w-4 rounded-[3px] border border-current border-t-2 opacity-80" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium leading-5 text-slate-100">
                        {project.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {projectStatusLabels[project.status]} ·{" "}
                        {formatUpdatedAt(project.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 pb-2">
                    {isEditing ? (
                      <form
                        className="space-y-2"
                        onSubmit={(event) =>
                          handleRenameSubmit(event, project.id)
                        }
                      >
                        <label className="sr-only" htmlFor={titleInputId}>
                          Novo nome do projeto
                        </label>
                        <input
                          className="focus-ring w-full rounded-md border border-slate-700/80 bg-slate-950/90 px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                          data-project-rename-input={project.id}
                          disabled={isRenaming}
                          id={titleInputId}
                          maxLength={MAX_PROJECT_NAME_LENGTH}
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
                            data-project-rename-save={project.id}
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
                          Excluir este projeto? As conversas ainda não estão
                          vinculadas a projetos nesta versão.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="focus-ring rounded-md border border-red-300/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
                            data-project-delete-confirm={project.id}
                            disabled={isDeleting}
                            onClick={() => {
                              void handleDeleteProject(project);
                            }}
                            type="button"
                          >
                            {isDeleting ? "Excluindo..." : "Confirmar"}
                          </button>
                          <button
                            className="focus-ring rounded-md border border-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800/70 disabled:cursor-not-allowed disabled:text-slate-500"
                            data-project-delete-cancel={project.id}
                            disabled={isDeleting}
                            onClick={() => setPendingDeleteProjectId(null)}
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
                          data-project-rename={project.id}
                          disabled={isDeleting}
                          onClick={() => startRename(project)}
                          type="button"
                        >
                          Renomear
                        </button>
                        <button
                          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-red-200/70 transition hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:text-slate-600"
                          data-project-delete={project.id}
                          disabled={isDeleting}
                          onClick={() => requestDeleteProject(project.id)}
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
