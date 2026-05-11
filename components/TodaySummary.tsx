import type { DaySummary, ViewSummary } from "@/lib/types";

type TodaySummaryProps = {
  daySummary: DaySummary;
  selectedView: ViewSummary;
};

export function TodaySummary({
  daySummary,
  selectedView,
}: TodaySummaryProps) {
  return (
    <aside className="rounded-md border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Resumo do dia
      </p>
      <h2 className="mt-3 text-lg font-semibold text-white">
        {daySummary.state}
      </h2>
      <p className="mt-4 text-sm leading-6 text-neutral-300">
        {daySummary.mainFocus}
      </p>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          Recorte ativo
        </p>
        <p className="mt-2 text-sm font-medium text-white">
          {selectedView.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          {selectedView.description}
        </p>
      </div>
    </aside>
  );
}
