import type { LocalChatMessage } from "@/lib/types";

type ChatMessageProps = {
  message: LocalChatMessage;
};

const roleLabels: Record<LocalChatMessage["role"], string> = {
  assistant: "Sistema JK",
  user: "Você",
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.status === "error";

  return (
    <article
      aria-label={`Mensagem de ${roleLabels[message.role]}`}
      className={`max-w-[92%] rounded-md border px-4 py-3 shadow-sm ${
        isUser
          ? "ml-auto border-blue-400/25 bg-blue-600/16"
          : isError
            ? "mr-auto border-amber-300/25 bg-amber-300/10"
            : "mr-auto border-slate-700/80 bg-slate-950/55"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
            isUser ? "text-blue-200" : "text-slate-500"
          }`}
        >
          {roleLabels[message.role]}
        </p>
        {isError ? (
          <span className="text-xs font-medium text-amber-200">
            Atenção necessária
          </span>
        ) : null}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-100">
        {message.content}
      </p>
    </article>
  );
}
