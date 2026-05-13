import { NextResponse } from "next/server";
import { deleteTask, getProjectById, updateTask } from "@/lib/db";
import type {
  AssistantErrorCode,
  StoredTaskStatus,
  TaskPriority,
  UpdateTaskInput,
} from "@/lib/types";

type UpdateTaskBody = {
  description?: unknown;
  dueDate?: unknown;
  priority?: unknown;
  projectId?: unknown;
  status?: unknown;
  title?: unknown;
};

type RouteContext = {
  params: {
    taskId?: string;
  };
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

function hasOwnField(source: object, field: keyof UpdateTaskBody) {
  return Object.prototype.hasOwnProperty.call(source, field);
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

export async function PATCH(request: Request, { params }: RouteContext) {
  const taskId = params.taskId?.trim();

  if (!taskId) {
    return jsonError("O taskId é obrigatório.", 400, "INVALID_REQUEST");
  }

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

  const taskBody = body as UpdateTaskBody;
  const hasTitle = hasOwnField(taskBody, "title");
  const hasDescription = hasOwnField(taskBody, "description");
  const hasStatus = hasOwnField(taskBody, "status");
  const hasPriority = hasOwnField(taskBody, "priority");
  const hasProjectId = hasOwnField(taskBody, "projectId");
  const hasDueDate = hasOwnField(taskBody, "dueDate");

  if (
    !hasTitle &&
    !hasDescription &&
    !hasStatus &&
    !hasPriority &&
    !hasProjectId &&
    !hasDueDate
  ) {
    return jsonError(
      "Informe title, description, status, priority, projectId ou dueDate para atualizar a tarefa.",
      400,
      "INVALID_REQUEST",
    );
  }

  const updateInput: UpdateTaskInput = {};

  if (hasTitle) {
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

    updateInput.title = title;
  }

  if (hasDescription) {
    const description = normalizeOptionalString(taskBody.description);

    if (description === null && taskBody.description !== null) {
      return jsonError(
        "O campo description deve ser uma string.",
        400,
        "INVALID_REQUEST",
      );
    }

    updateInput.description = description;
  }

  if (hasDueDate) {
    const dueDate = normalizeOptionalString(taskBody.dueDate);

    if (dueDate === null && taskBody.dueDate !== null) {
      return jsonError(
        "O campo dueDate deve ser uma string.",
        400,
        "INVALID_REQUEST",
      );
    }

    updateInput.dueDate = dueDate;
  }

  if (hasStatus) {
    if (!isStoredTaskStatus(taskBody.status)) {
      return jsonError(
        "O campo status deve ser pending, in_progress, done ou canceled.",
        400,
        "INVALID_REQUEST",
      );
    }

    updateInput.status = taskBody.status;
  }

  if (hasPriority) {
    if (!isTaskPriority(taskBody.priority)) {
      return jsonError(
        "O campo priority deve ser low, medium ou high.",
        400,
        "INVALID_REQUEST",
      );
    }

    updateInput.priority = taskBody.priority;
  }

  if (hasProjectId) {
    if (taskBody.projectId === null) {
      updateInput.projectId = null;
    } else if (typeof taskBody.projectId === "string") {
      const projectId = taskBody.projectId.trim();

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

      updateInput.projectId = projectId;
    } else {
      return jsonError(
        "O campo projectId deve ser uma string ou null.",
        400,
        "INVALID_REQUEST",
      );
    }
  }

  try {
    const task = updateTask(taskId, updateInput);

    if (!task) {
      return jsonError("Tarefa não encontrada.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({ task });
  } catch {
    return jsonError(
      "Não consegui atualizar a tarefa agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const taskId = params.taskId?.trim();

  if (!taskId) {
    return jsonError("O taskId é obrigatório.", 400, "INVALID_REQUEST");
  }

  try {
    const deleted = deleteTask(taskId);

    if (!deleted) {
      return jsonError("Tarefa não encontrada.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({ deleted: true, taskId });
  } catch {
    return jsonError(
      "Não consegui excluir a tarefa agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}
