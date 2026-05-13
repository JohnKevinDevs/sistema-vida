import { NextResponse } from "next/server";
import { askAssistant } from "@/lib/assistant";
import {
  createConversation,
  createMessage,
  getConversationById,
  getProjectById,
} from "@/lib/db";
import type { AssistantErrorCode } from "@/lib/types";

type ChatRequestBody = {
  conversationId?: unknown;
  message?: unknown;
  projectId?: unknown;
};

const ASSISTANT_PERSISTED_ERROR_MESSAGE =
  "Não consegui responder agora. Verifique a configuração do Gemini e tente novamente.";

export const runtime = "nodejs";

function jsonError(
  message: string,
  status: number,
  code: AssistantErrorCode = "UNKNOWN_ERROR",
) {
  return NextResponse.json({ code, error: message }, { status });
}

function buildConversationTitle(message: string) {
  const normalizedMessage = message.replace(/\s+/g, " ").trim();

  if (!normalizedMessage) {
    return "Nova conversa";
  }

  return normalizedMessage.slice(0, 60);
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

  const chatBody = body as ChatRequestBody;

  if (!("message" in chatBody)) {
    return jsonError(
      "O campo message é obrigatório.",
      400,
      "INVALID_REQUEST",
    );
  }

  if (typeof chatBody.message !== "string") {
    return jsonError(
      "O campo message deve ser uma string.",
      400,
      "INVALID_REQUEST",
    );
  }

  const message = chatBody.message.trim();

  if (!message) {
    return jsonError(
      "O campo message não pode estar vazio.",
      400,
      "INVALID_REQUEST",
    );
  }

  let conversationId: string | undefined;
  let projectId: string | null = null;

  if ("conversationId" in chatBody) {
    if (typeof chatBody.conversationId !== "string") {
      return jsonError(
        "O campo conversationId deve ser uma string.",
        400,
        "INVALID_REQUEST",
      );
    }

    conversationId = chatBody.conversationId.trim();

    if (!conversationId) {
      return jsonError(
        "O campo conversationId não pode estar vazio.",
        400,
        "INVALID_REQUEST",
      );
    }
  }

  if (!conversationId && "projectId" in chatBody) {
    if (typeof chatBody.projectId !== "string") {
      return jsonError(
        "O campo projectId deve ser uma string.",
        400,
        "INVALID_REQUEST",
      );
    }

    projectId = chatBody.projectId.trim();

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
  }

  const conversation = conversationId
    ? getConversationById(conversationId)
    : createConversation({
        projectId,
        title: buildConversationTitle(message),
      });

  if (!conversation) {
    return jsonError("Conversa não encontrada.", 400, "INVALID_REQUEST");
  }

  createMessage({
    content: message,
    conversationId: conversation.id,
    role: "user",
  });

  const assistantResponse = await askAssistant(message);

  if (assistantResponse.error) {
    const persistedErrorMessage = createMessage({
      content: ASSISTANT_PERSISTED_ERROR_MESSAGE,
      conversationId: conversation.id,
      createdAt: assistantResponse.createdAt,
      role: "assistant",
    });

    return NextResponse.json(
      {
        code: assistantResponse.errorCode ?? "UNKNOWN_ERROR",
        content: persistedErrorMessage.content,
        conversationId: conversation.id,
        createdAt: persistedErrorMessage.createdAt,
        error: assistantResponse.error,
        model: assistantResponse.model,
        projectId: conversation.projectId,
      },
      { status: 500 },
    );
  }

  createMessage({
    content: assistantResponse.content,
    conversationId: conversation.id,
    createdAt: assistantResponse.createdAt,
    role: "assistant",
  });

  return NextResponse.json({
    conversationId: conversation.id,
    content: assistantResponse.content,
    createdAt: assistantResponse.createdAt,
    model: assistantResponse.model,
    projectId: conversation.projectId,
  });
}
