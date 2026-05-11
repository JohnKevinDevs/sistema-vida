import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export const GEMINI_MODEL_NAME = "gemini-2.0-flash";

function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY nao foi configurada. Defina essa variavel em .env.local antes de chamar o Gemini.",
    );
  }

  return apiKey;
}

export function getGeminiModel() {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());

  return genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
  });
}

export async function generateGeminiResponse(prompt: string): Promise<string> {
  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt) {
    throw new Error("O prompt enviado ao Gemini nao pode estar vazio.");
  }

  const model = getGeminiModel();
  const result = await model.generateContent(trimmedPrompt);
  const text = result.response.text().trim();

  if (!text) {
    throw new Error("O Gemini retornou uma resposta vazia.");
  }

  return text;
}
