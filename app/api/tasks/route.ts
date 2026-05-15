import { NextResponse } from "next/server";
import {
  createTask,
  getProjectById,
  listGlobalTasks,
  listTasks,
  listTasksByProjectId,
} from "@/lib/db";
import type {
  AssistantErrorCode,
  StoredTaskStatus,
  TaskPriority,
} from "@/lib/types";

type CreateTaskBody = {
  description?: unknown;
  dueDate?: unknown;
  priority?: unknown;
  projectId?: unknown;
  status?: unknown;
  title?: unknown;
};

const MAX_TASK_TITLE_LENGTH = 120;
const VALID_TASK_STATUSES = new Set<StoredTaskStatus>([
  "pending",
  "in_progress",
  "done",
  "canceled",
]);
const VALID_TASK_PRIORITIES = new Set<TaskPriority>([
  "low",
  "medium",
  "high",
]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(
  message: string,
  status: number,
  code: AssistantErrorCode = "UNKNOWN_ERROR",
) {
  return NextResponse.json({ code, error: message }, { status });
}

function isStoredTaskStatus(value: unknown): value is StoredTaskStatus {
  return (
    typeof value === "string" &&
    VALID_TASK_STATUSES.has(value as StoredTaskStatus)
  );
}

function isTaskPriority(value: unknown): value is TaskPriority {
  return (
    typeof value === "string" &&
    VALID_TASK_PRIORITIES.has(value as TaskPriority)
  );
}

function normalizeOptionalString(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  return value;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const scope = searchParams.get("scope");

    if (projectId !== null) {
      const normalizedProjectId = projectId.trim();

      if (!normalizedProjectId) {
        return jsonError(
          "O campo projectId não pode estar vazio.",
          400,
          "INVALID_REQUEST",
        );
      }

      const project = getProjectById(normalizedProjectId);

      if (!project) {
        return jsonError("Projeto não encontrado.", 400, "INVALID_REQUEST");
      }

      return NextResponse.json({
        tasks: listTasksByProjectId(normalizedProjectId),
      });
    }

    if (scope === "global") {
      return NextResponse.json({
        tasks: listGlobalTasks(),
      });
    }

    if (scope !== null) {
      return jsonError("Escopo de tarefas inválido.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({
      tasks: listTasks(),
    });
  } catch {
    return jsonError(
      "Não consegui listar as tarefas agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError(
      "O corpo da requisição deve ser um JSON válido.",
      400,
      "INVALID_REQUEST",
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError(
      "O corpo da requisição deve ser um objeto JSON.",
      400,
      "INVALID_REQUEST",
    );
  }

  const taskBody = body as CreateTaskBody;

  if (!("title" in taskBody)) {
    return jsonError("O campo title é obrigatório.", 400, "INVALID_REQUEST");
  }

  if (typeof taskBody.title !== "string") {
    return jsonError(
      "O campo title deve ser uma string.",
      400,
      "INVALID_REQUEST",
    );
  }

  const title = taskBody.title.trim();

  if (!title) {
    return jsonError(
      "O título da tarefa não pode estar vazio.",
      400,
      "INVALID_REQUEST",
    );
  }

  if (title.length > MAX_TASK_TITLE_LENGTH) {
    return jsonError(
      `O título da tarefa deve ter no máximo ${MAX_TASK_TITLE_LENGTH} caracteres.`,
      400,
      "INVALID_REQUEST",
    );
  }

  const description = normalizeOptionalString(taskBody.description);

  if (description === null && taskBody.description !== null) {
    return jsonError(
      "O campo description deve ser uma string.",
      400,
      "INVALID_REQUEST",
    );
  }

  const dueDate = normalizeOptionalString(taskBody.dueDate);

  if (dueDate === null && taskBody.dueDate !== null) {
    return jsonError(
      "O campo dueDate deve ser uma string.",
      400,
      "INVALID_REQUEST",
    );
  }

  let status: StoredTaskStatus | undefined;

  if ("status" in taskBody) {
    if (!isStoredTaskStatus(taskBody.status)) {
      return jsonError(
        "O campo status deve ser pending, in_progress, done ou canceled.",
        400,
        "INVALID_REQUEST",
      );
    }

    status = taskBody.status;
  }

  let priority: TaskPriority | undefined;

  if ("priority" in taskBody) {
    if (!isTaskPriority(taskBody.priority)) {
      return jsonError(
        "O campo priority deve ser low, medium ou high.",
        400,
        "INVALID_REQUEST",
      );
    }

    priority = taskBody.priority;
  }

  let projectId: string | null | undefined;

  if ("projectId" in taskBody) {
    if (taskBody.projectId === null) {
      projectId = null;
    } else if (typeof taskBody.projectId === "string") {
      projectId = taskBody.projectId.trim();

      if (!projectId) {
        return jsonError(
          "O campo projectId não pode estar vazio.",
          400,
          "INVALID_REQUEST",
        );
      }

      const project = getProjectById(projectId);

      if (!project) {
        return jsonError("Projeto não encontrado.", 400, "INVALID_REQUEST");
      }
    } else {
      return jsonError(
        "O campo projectId deve ser uma string ou null.",
        400,
        "INVALID_REQUEST",
      );
    }
  }

  try {
    const task = createTask({
      description,
      dueDate,
      priority,
      projectId,
      status,
      title,
    });

    return NextResponse.json({ task });
  } catch {
    return jsonError(
      "Não consegui criar a tarefa agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}
