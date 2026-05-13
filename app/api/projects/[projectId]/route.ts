import { NextResponse } from "next/server";
import { deleteProject, updateProject } from "@/lib/db";
import type {
  AssistantErrorCode,
  StoredProjectStatus,
  UpdateProjectInput,
} from "@/lib/types";

type UpdateProjectBody = {
  description?: unknown;
  name?: unknown;
  status?: unknown;
};

type RouteContext = {
  params: {
    projectId?: string;
  };
};

const MAX_PROJECT_NAME_LENGTH = 80;
const VALID_PROJECT_STATUSES = new Set<StoredProjectStatus>([
  "active",
  "paused",
  "archived",
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

function isStoredProjectStatus(value: unknown): value is StoredProjectStatus {
  return (
    typeof value === "string" &&
    VALID_PROJECT_STATUSES.has(value as StoredProjectStatus)
  );
}

function hasOwnField(source: object, field: keyof UpdateProjectBody) {
  return Object.prototype.hasOwnProperty.call(source, field);
}

function normalizeDescription(value: unknown) {
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
  const projectId = params.projectId?.trim();

  if (!projectId) {
    return jsonError("O projectId é obrigatório.", 400, "INVALID_REQUEST");
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

  const projectBody = body as UpdateProjectBody;
  const hasName = hasOwnField(projectBody, "name");
  const hasDescription = hasOwnField(projectBody, "description");
  const hasStatus = hasOwnField(projectBody, "status");

  if (!hasName && !hasDescription && !hasStatus) {
    return jsonError(
      "Informe name, description ou status para atualizar o projeto.",
      400,
      "INVALID_REQUEST",
    );
  }

  const updateInput: UpdateProjectInput = {};

  if (hasName) {
    if (typeof projectBody.name !== "string") {
      return jsonError(
        "O campo name deve ser uma string.",
        400,
        "INVALID_REQUEST",
      );
    }

    const name = projectBody.name.trim();

    if (!name) {
      return jsonError(
        "O nome do projeto não pode estar vazio.",
        400,
        "INVALID_REQUEST",
      );
    }

    if (name.length > MAX_PROJECT_NAME_LENGTH) {
      return jsonError(
        `O nome do projeto deve ter no máximo ${MAX_PROJECT_NAME_LENGTH} caracteres.`,
        400,
        "INVALID_REQUEST",
      );
    }

    updateInput.name = name;
  }

  if (hasDescription) {
    const description = normalizeDescription(projectBody.description);

    if (description === null && projectBody.description !== null) {
      return jsonError(
        "O campo description deve ser uma string.",
        400,
        "INVALID_REQUEST",
      );
    }

    updateInput.description = description;
  }

  if (hasStatus) {
    if (!isStoredProjectStatus(projectBody.status)) {
      return jsonError(
        "O campo status deve ser active, paused ou archived.",
        400,
        "INVALID_REQUEST",
      );
    }

    updateInput.status = projectBody.status;
  }

  try {
    const project = updateProject(projectId, updateInput);

    if (!project) {
      return jsonError("Projeto não encontrado.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({ project });
  } catch {
    return jsonError(
      "Não consegui atualizar o projeto agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const projectId = params.projectId?.trim();

  if (!projectId) {
    return jsonError("O projectId é obrigatório.", 400, "INVALID_REQUEST");
  }

  try {
    const deleted = deleteProject(projectId);

    if (!deleted) {
      return jsonError("Projeto não encontrado.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({ deleted: true, projectId });
  } catch {
    return jsonError(
      "Não consegui excluir o projeto agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}
