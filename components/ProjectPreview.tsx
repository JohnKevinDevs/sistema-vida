import type { Project } from "@/lib/types";

type ProjectPreviewProps = {
  isSelected: boolean;
  onSelect: () => void;
  project: Project;
};

const signalStyles: Record<Project["signal"], string> = {
  Verde: "bg-emerald-300",
  Amarelo: "bg-amber-300",
  Azul: "bg-cyan-300",
};

export function ProjectPreview({
  isSelected,
  onSelect,
  project,
}: ProjectPreviewProps) {
  return (
    <button
      className={`rounded-md border p-4 text-left transition ${
        isSelected
          ? "border-cyan-300/40 bg-cyan-300/10"
          : "border-white/10 bg-neutral-900/70 hover:border-white/20 hover:bg-white/[0.05]"
      }`}
      onClick={onSelect}
      type="button"
    >
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
          {isSelected ? (
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-cyan-200">
              Em destaque
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}
