import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/db";
import type { AssistantErrorCode, StoredProjectStatus } from "@/lib/types";

type CreateProjectBody = {
  description?: unknown;
  name?: unknown;
  status?: unknown;
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

export async function GET() {
  try {
    return NextResponse.json({
      projects: listProjects(),
    });
  } catch {
    return jsonError(
      "Não consegui listar os projetos agora.",
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

  const projectBody = body as CreateProjectBody;

  if (!("name" in projectBody)) {
    return jsonError("O campo name é obrigatório.", 400, "INVALID_REQUEST");
  }

  if (typeof projectBody.name !== "string") {
    return jsonError("O campo name deve ser uma string.", 400, "INVALID_REQUEST");
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

  const description = normalizeDescription(projectBody.description);

  if (description === null && projectBody.description !== null) {
    return jsonError(
      "O campo description deve ser uma string.",
      400,
      "INVALID_REQUEST",
    );
  }

  let status: StoredProjectStatus | undefined;

  if ("status" in projectBody) {
    if (!isStoredProjectStatus(projectBody.status)) {
      return jsonError(
        "O campo status deve ser active, paused ou archived.",
        400,
        "INVALID_REQUEST",
      );
    }

    status = projectBody.status;
  }

  try {
    const project = createProject({ description, name, status });

    return NextResponse.json({ project });
  } catch {
    return jsonError(
      "Não consegui criar o projeto agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}
