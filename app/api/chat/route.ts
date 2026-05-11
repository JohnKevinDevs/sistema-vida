import { NextResponse } from "next/server";
import { askAssistant } from "@/lib/assistant";

type ChatRequestBody = {
  message?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("O corpo da requisicao deve ser um JSON valido.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("O corpo da requisicao deve ser um objeto JSON.", 400);
  }

  const chatBody = body as ChatRequestBody;

  if (!("message" in chatBody)) {
    return jsonError("O campo message e obrigatorio.", 400);
  }

  if (typeof chatBody.message !== "string") {
    return jsonError("O campo message deve ser uma string.", 400);
  }

  const message = chatBody.message.trim();

  if (!message) {
    return jsonError("O campo message nao pode estar vazio.", 400);
  }

  const assistantResponse = await askAssistant(message);

  if (assistantResponse.error) {
    return jsonError(assistantResponse.error, 500);
  }

  return NextResponse.json({
    content: assistantResponse.content,
    createdAt: assistantResponse.createdAt,
    model: assistantResponse.model,
  });
}
