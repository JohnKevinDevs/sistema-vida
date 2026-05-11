import type { AssistantPreview } from "@/lib/types";

type AssistantPreviewCardProps = {
  assistant: AssistantPreview;
};

export function AssistantPreviewCard({
  assistant,
}: AssistantPreviewCardProps) {
  return (
    <section className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
        Area futura
      </p>
      <h2 className="mt-3 text-lg font-semibold text-white">
        {assistant.title}
      </h2>
      <p className="mt-2 text-sm font-medium text-cyan-100">
        {assistant.status}
      </p>
      <p className="mt-4 text-sm leading-6 text-neutral-300">
        {assistant.description}
      </p>
    </section>
  );
}
