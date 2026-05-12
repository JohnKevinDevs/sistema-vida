import { NextResponse } from "next/server";
import { listConversations } from "@/lib/db";
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

export async function GET() {
  try {
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
