import type { Task } from "@/lib/types";

type TaskPreviewProps = {
  isDone: boolean;
  onToggle: () => void;
  task: Task;
};

const statusStyles: Record<Task["status"], string> = {
  Prioridade: "bg-cyan-300/10 text-cyan-200 ring-cyan-300/20",
  "Em andamento": "bg-emerald-300/10 text-emerald-200 ring-emerald-300/20",
  Planejado: "bg-amber-300/10 text-amber-200 ring-amber-300/20",
};

export function TaskPreview({ isDone, onToggle, task }: TaskPreviewProps) {
  const buttonLabel = isDone
    ? `Desmarcar tarefa: ${task.title}`
    : `Marcar tarefa como concluida: ${task.title}`;

  return (
    <article
      className={`rounded-md border p-4 transition ${
        isDone
          ? "border-emerald-300/20 bg-emerald-300/10"
          : "border-white/10 bg-neutral-900/70"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`text-sm font-medium leading-6 ${
              isDone ? "text-neutral-400 line-through" : "text-white"
            }`}
          >
            {task.title}
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            {task.area} / {task.time}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[task.status]}`}
          >
            {task.status}
          </span>
          <button
            aria-label={buttonLabel}
            className={`focus-ring rounded-md border px-2.5 py-1 text-xs font-medium transition active:scale-[0.98] ${
              isDone
                ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-100"
                : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20 hover:bg-white/[0.06]"
            }`}
            onClick={onToggle}
            type="button"
          >
            {isDone ? "Feita" : "Marcar"}
          </button>
        </div>
      </div>
    </article>
  );
}
