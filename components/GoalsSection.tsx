import { SectionHeader } from "@/components/SectionHeader";
import type { Goal } from "@/lib/types";

type GoalsSectionProps = {
  goals: Goal[];
};

export function GoalsSection({ goals }: GoalsSectionProps) {
  return (
    <section>
      <SectionHeader
        description="Metas exibidas como referencia visual, sem persistencia real nesta etapa."
        eyebrow="Direcao"
        title="Metas principais"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {goals.map((goal) => (
          <article
            className="rounded-md border border-white/10 bg-neutral-900/70 p-4"
            key={goal.id}
          >
            <h3 className="text-sm font-medium leading-6 text-white">
              {goal.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              {goal.note}
            </p>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Progresso visual</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-cyan-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
