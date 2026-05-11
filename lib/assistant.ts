import { generateGeminiResponse, GEMINI_MODEL_NAME } from "@/lib/gemini";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import type { AssistantRequest, AssistantResponse } from "@/lib/types";

export function buildAssistantPrompt(userMessage: string): string {
  const trimmedMessage = userMessage.trim();

  if (!trimmedMessage) {
    throw new Error("A mensagem do usuario nao pode estar vazia.");
  }

  return [
    SYSTEM_PROMPT,
    "",
    "Mensagem do usuario:",
    trimmedMessage,
    "",
    "Responda considerando apenas o contexto informado nesta mensagem e as regras do Sistema JK.",
  ].join("\n");
}

export async function askAssistant(
  userMessageOrRequest: string | AssistantRequest,
): Promise<AssistantResponse> {
  const userMessage =
    typeof userMessageOrRequest === "string"
      ? userMessageOrRequest
      : userMessageOrRequest.userMessage;
  const createdAt = new Date().toISOString();

  try {
    const prompt = buildAssistantPrompt(userMessage);
    const content = await generateGeminiResponse(prompt);

    return {
      content,
      createdAt,
      model: GEMINI_MODEL_NAME,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel gerar uma resposta do assistente.";

    return {
      content: "",
      createdAt,
      error: message,
      model: GEMINI_MODEL_NAME,
    };
  }
}
