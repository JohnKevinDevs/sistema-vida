import type { LocalChatMessage } from "@/lib/types";

type ChatMessageProps = {
  message: LocalChatMessage;
};

const roleLabels: Record<LocalChatMessage["role"], string> = {
  assistant: "Sistema JK",
  user: "Voce",
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`rounded-md border p-3 ${
        isUser
          ? "border-cyan-300/20 bg-cyan-300/10"
          : "border-white/10 bg-neutral-900/80"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {roleLabels[message.role]}
        </p>
        {message.status === "error" ? (
          <span className="text-xs font-medium text-amber-200">Erro</span>
        ) : null}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-100">
        {message.content}
      </p>
    </article>
  );
}
