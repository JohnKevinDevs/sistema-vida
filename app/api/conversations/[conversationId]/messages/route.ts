import { NextResponse } from "next/server";
import { getConversationById, listMessages } from "@/lib/db";
import type { AssistantErrorCode } from "@/lib/types";

type RouteContext = {
  params: {
    conversationId?: string;
  };
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(
  message: string,
  status: number,
  code: AssistantErrorCode = "UNKNOWN_ERROR",
) {
  return NextResponse.json({ code, error: message }, { status });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const conversationId = params.conversationId?.trim();

  if (!conversationId) {
    return jsonError(
      "O conversationId é obrigatório.",
      400,
      "INVALID_REQUEST",
    );
  }

  try {
    const conversation = getConversationById(conversationId);

    if (!conversation) {
      return jsonError("Conversa não encontrada.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({
      conversationId: conversation.id,
      messages: listMessages(conversation.id),
    });
  } catch {
    return jsonError(
      "Não consegui buscar as mensagens agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}
