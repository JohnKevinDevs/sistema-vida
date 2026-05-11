import type { LifeArea } from "@/lib/types";

type LifeAreasSectionProps = {
  areas: LifeArea[];
};

export function LifeAreasSection({ areas }: LifeAreasSectionProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {areas.map((area) => (
        <article
          className="rounded-md border border-white/10 bg-neutral-900/60 p-4"
          key={area.id}
        >
          <p className="text-sm font-medium text-white">{area.label}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            {area.description}
          </p>
        </article>
      ))}
    </section>
  );
}
