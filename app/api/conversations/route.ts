import { NextResponse } from "next/server";
import {
  getProjectById,
  listConversations,
  listConversationsByProjectId,
  listGlobalConversations,
} from "@/lib/db";
import type { AssistantErrorCode } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(
  message: string,
  status: number,
  code: AssistantErrorCode = "UNKNOWN_ERROR",
) {
  return NextResponse.json({ code, error: message }, { status });
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
        conversations: listConversationsByProjectId(normalizedProjectId),
      });
    }

    if (scope === "global") {
      return NextResponse.json({
        conversations: listGlobalConversations(),
      });
    }

    if (scope !== null) {
      return jsonError("Escopo de conversas inválido.", 400, "INVALID_REQUEST");
    }

    return NextResponse.json({
      conversations: listConversations(),
    });
  } catch {
    return jsonError(
      "Não consegui listar as conversas agora.",
      500,
      "UNKNOWN_ERROR",
    );
  }
}
