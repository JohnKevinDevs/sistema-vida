import type { DashboardStat } from "@/lib/types";

type DashboardCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: DashboardStat["tone"];
};

const toneStyles: Record<DashboardCardProps["tone"], string> = {
  cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  emerald: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
};

export function DashboardCard({
  label,
  value,
  detail,
  tone,
}: DashboardCardProps) {
  return (
    <article className="rounded-md border border-white/10 bg-white/[0.04] p-5">
      <div
        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${toneStyles[tone]}`}
      >
        {label}
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-normal text-white">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-neutral-400">{detail}</p>
    </article>
  );
}
