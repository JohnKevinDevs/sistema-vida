import { SectionHeader } from "@/components/SectionHeader";
import type { RoutineBlock } from "@/lib/types";

type RoutineSectionProps = {
  blocks: RoutineBlock[];
};

export function RoutineSection({ blocks }: RoutineSectionProps) {
  return (
    <section>
      <SectionHeader
        description="Blocos de rotina e estudos para orientar o ritmo do dia."
        eyebrow="Ritmo"
        title="Rotina e estudos"
      />
      <div className="space-y-3">
        {blocks.map((block) => (
          <article
            className="rounded-md border border-white/10 bg-neutral-900/70 p-4"
            key={block.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-white">
                  {block.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {block.focus}
                </p>
              </div>
              <span className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-neutral-400">
                {block.window}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
