import { NextResponse } from "next/server";
import { deleteConversation, updateConversationTitle } from "@/lib/db";
import type { AssistantErrorCode } from "@/lib/types";

type RenameConversationBody = {
  title?: unknown;
};

type RouteContext = {
  params: {
    conversationId?: string;
  };
};

const MAX_TITLE_LENGTH = 80;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(
  message: string,
  status: number,
  code: AssistantErrorCode = "UNKNOWN_ERROR",
) {
  return NextResponse.json({ code, error: message }, { status });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const conversationId = params.conversationId?.trim();

  if (!conversationId) {
    return jsonError(
      "O conversationId é obrigatório.",
      400,
      "INVALID_REQUEST",
    );
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

  const renameBody = body as RenameConversationBody;

  if (!("title" in renameBody)) {
    return jsonError(
      "O campo title é obrigatório.",
      400,
      "INVALID_REQUEST",
    );
  }

  if (typeof renameBody.title !== "string") {
    return jsonError(
      "O campo title deve ser uma string.",
      400,
      "INVALID_REQUEST",
    );
  }

  const title = renameBody.title.trim();

  if (!title) {
    return jsonError(
      "O título não pode estar vazio.",
      400,
      "INVALID_REQUEST",
    );
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return jsonError(
      `O título deve ter no máximo ${MAX_TITLE_LENGTH} caracteres.`,
      400,
      "INVALID_REQUEST",
    );
  }

  try {
    const conversation = updateConversationTitle(conversationId, title);

    if (!conversation) {
      return jsonError("Conversa não encontrada.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({ conversation });
  } catch {
    return jsonError(
      "Não consegui renomear a conversa agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const conversationId = params.conversationId?.trim();

  if (!conversationId) {
    return jsonError(
      "O conversationId é obrigatório.",
      400,
      "INVALID_REQUEST",
    );
  }

  try {
    const deleted = deleteConversation(conversationId);

    if (!deleted) {
      return jsonError("Conversa não encontrada.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({ conversationId, deleted: true });
  } catch {
    return jsonError(
      "Não consegui excluir a conversa agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}
