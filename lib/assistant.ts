import { generateGeminiResponse, GEMINI_MODEL_NAME } from "@/lib/gemini";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import type {
  AssistantError,
  AssistantErrorCode,
  AssistantRequest,
  AssistantResponse,
} from "@/lib/types";

const assistantErrorMessages: Record<AssistantErrorCode, string> = {
  EMPTY_RESPONSE:
    "Recebi uma resposta vazia da IA. Tente reformular sua mensagem.",
  INVALID_API_KEY:
    "A chave do Gemini parece inválida. Verifique a configuração.",
  INVALID_REQUEST: "A mensagem enviada ao assistente não é válida.",
  MISSING_API_KEY: "A chave do Gemini ainda não está configurada.",
  MODEL_UNAVAILABLE:
    "O modelo de IA não está disponível agora. Tente novamente em instantes.",
  QUOTA_EXCEEDED:
    "A cota do Gemini foi atingida no momento. Tente novamente mais tarde.",
  TEMPORARY_ERROR: "Ocorreu uma instabilidade temporária. Tente novamente.",
  UNKNOWN_ERROR:
    "Não consegui responder agora. Tente novamente em alguns instantes.",
};

export function buildAssistantPrompt(userMessage: string): string {
  const trimmedMessage = userMessage.trim();

  if (!trimmedMessage) {
    throw new Error("A mensagem do usuario nao pode estar vazia.");
  }

  return [
    SYSTEM_PROMPT,
    "",
    "Contexto da versão atual:",
    "- O Sistema JK roda localmente e possui persistência SQLite apenas para conversas e mensagens do chat.",
    "- O sistema ainda não salva tarefas, metas, projetos, memórias ou preferências persistentes.",
    "- Use apenas a mensagem atual do usuário como contexto confiável.",
    "",
    "Mensagem do usuário:",
    trimmedMessage,
    "",
    "Responda com foco em organização prática, em no máximo 5 pontos curtos quando possível. Se precisar de mais contexto, faça uma única pergunta objetiva no final. Se o usuário pedir para salvar algo, explique que ainda não é possível salvar permanentemente e ofereça uma forma clara de estruturar a informação agora.",
  ].join("\n");
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function includesAny(value: string, patterns: string[]) {
  return patterns.some((pattern) => value.includes(pattern));
}

export function normalizeAssistantError(error: unknown): AssistantError {
  const message = getErrorMessage(error);
  const normalizedMessage = message.toLowerCase();

  let code: AssistantErrorCode = "UNKNOWN_ERROR";

  if (
    includesAny(normalizedMessage, [
      "gemini_api_key não foi configurada",
      "gemini_api_key nao foi configurada",
      "api key not found",
    ])
  ) {
    code = "MISSING_API_KEY";
  } else if (
    includesAny(normalizedMessage, [
      "api key not valid",
      "api_key_invalid",
      "invalid api key",
      "permission denied",
      "unauthenticated",
      "401",
      "403",
    ])
  ) {
    code = "INVALID_API_KEY";
  } else if (
    includesAny(normalizedMessage, [
      "quota",
      "too many requests",
      "rate limit",
      "429",
    ])
  ) {
    code = "QUOTA_EXCEEDED";
  } else if (
    includesAny(normalizedMessage, [
      "model not found",
      "model is not found",
      "model unavailable",
      "not found for api version",
      "not supported",
    ])
  ) {
    code = "MODEL_UNAVAILABLE";
  } else if (
    includesAny(normalizedMessage, [
      "resposta vazia",
      "empty response",
      "response was empty",
    ])
  ) {
    code = "EMPTY_RESPONSE";
  } else if (
    includesAny(normalizedMessage, [
      "fetch failed",
      "service unavailable",
      "temporarily unavailable",
      "timeout",
      "deadline",
      "500",
      "502",
      "503",
      "504",
    ])
  ) {
    code = "TEMPORARY_ERROR";
  }

  return {
    code,
    message: assistantErrorMessages[code],
  };
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
    const assistantError = normalizeAssistantError(error);

    return {
      content: "",
      createdAt,
      error: assistantError.message,
      errorCode: assistantError.code,
      model: GEMINI_MODEL_NAME,
    };
  }
}
