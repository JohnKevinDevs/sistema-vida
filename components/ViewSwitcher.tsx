import type { LifeView } from "@/lib/types";

type ViewSwitcherProps = {
  activeView: LifeView;
  onChange: (view: LifeView) => void;
  views: LifeView[];
};

export function ViewSwitcher({
  activeView,
  onChange,
  views,
}: ViewSwitcherProps) {
  return (
    <div
      aria-label="Alternar recorte da central"
      className="flex flex-wrap gap-2"
      role="group"
    >
      {views.map((view) => (
        <button
          aria-pressed={activeView === view}
          className={`focus-ring rounded-md border px-3 py-2 text-sm font-medium transition active:scale-[0.98] ${
            activeView === view
              ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
              : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-neutral-100"
          }`}
          key={view}
          onClick={() => onChange(view)}
          type="button"
        >
          {view}
        </button>
      ))}
    </div>
  );
}
