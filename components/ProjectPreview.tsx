import type { ProjectPreviewItem } from "@/data/vida";

type ProjectPreviewProps = {
  project: ProjectPreviewItem;
};

const signalStyles: Record<ProjectPreviewItem["signal"], string> = {
  Verde: "bg-emerald-300",
  Amarelo: "bg-amber-300",
  Azul: "bg-cyan-300",
};

export function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <article className="rounded-md border border-white/10 bg-neutral-900/70 p-4">
      <div className="flex items-start gap-3">
        <span
          className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${signalStyles[project.signal]}`}
        />
        <div className="min-w-0">
          <h3 className="text-sm font-medium leading-6 text-white">
            {project.name}
          </h3>
          <p className="text-xs text-neutral-500">{project.status}</p>
          <p className="mt-3 text-sm leading-6 text-neutral-300">
            {project.nextStep}
          </p>
        </div>
      </div>
    </article>
  );
}
