import { NextResponse } from "next/server";
import { askAssistant } from "@/lib/assistant";
import type { AssistantErrorCode } from "@/lib/types";

type ChatRequestBody = {
  message?: unknown;
};

function jsonError(
  message: string,
  status: number,
  code: AssistantErrorCode = "UNKNOWN_ERROR",
) {
  return NextResponse.json({ code, error: message }, { status });
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

  const assistantResponse = await askAssistant(message);

  if (assistantResponse.error) {
    return jsonError(
      assistantResponse.error,
      500,
      assistantResponse.errorCode ?? "UNKNOWN_ERROR",
    );
  }

  return NextResponse.json({
    content: assistantResponse.content,
    createdAt: assistantResponse.createdAt,
    model: assistantResponse.model,
  });
}
