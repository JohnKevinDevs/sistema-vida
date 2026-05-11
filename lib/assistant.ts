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
    "Contexto da versão atual:",
    "- O Sistema JK roda localmente e ainda não possui persistência real.",
    "- O chat não salva histórico, tarefas, memórias ou dados após recarregar a página.",
    "- Use apenas a mensagem atual do usuário como contexto confiável.",
    "",
    "Mensagem do usuário:",
    trimmedMessage,
    "",
    "Responda com foco em organização prática, em no máximo 5 pontos curtos quando possível. Se precisar de mais contexto, faça uma única pergunta objetiva no final. Se o usuário pedir para salvar algo, explique que ainda não é possível salvar permanentemente e ofereça uma forma clara de estruturar a informação agora.",
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
        : "Não foi possível gerar uma resposta do assistente.";

    return {
      content: "",
      createdAt,
      error: message,
      model: GEMINI_MODEL_NAME,
    };
  }
}
