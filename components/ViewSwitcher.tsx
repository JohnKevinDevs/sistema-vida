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
      aria-label="Alternar contexto da central"
      className="inline-flex w-full rounded-lg border border-slate-800/80 bg-slate-950/70 p-1 shadow-inner shadow-black/30 sm:w-auto"
      role="group"
    >
      {views.map((view) => (
        <button
          aria-pressed={activeView === view}
          className={`focus-ring min-w-0 flex-1 rounded-md px-4 py-2 text-sm font-medium transition sm:min-w-24 sm:flex-none ${
            activeView === view
              ? "bg-blue-600 text-white shadow-sm shadow-blue-950/30"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
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
