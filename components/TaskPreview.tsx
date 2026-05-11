import type { TaskPreviewItem } from "@/data/vida";

type TaskPreviewProps = {
  task: TaskPreviewItem;
};

const statusStyles: Record<TaskPreviewItem["status"], string> = {
  Prioridade: "bg-cyan-300/10 text-cyan-200 ring-cyan-300/20",
  "Em andamento": "bg-emerald-300/10 text-emerald-200 ring-emerald-300/20",
  Planejado: "bg-amber-300/10 text-amber-200 ring-amber-300/20",
};

export function TaskPreview({ task }: TaskPreviewProps) {
  return (
    <article className="rounded-md border border-white/10 bg-neutral-900/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium leading-6 text-white">
            {task.title}
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            {task.area} · {task.time}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[task.status]}`}
        >
          {task.status}
        </span>
      </div>
    </article>
  );
}
