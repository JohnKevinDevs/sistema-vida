type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-lg font-semibold tracking-normal text-white">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-neutral-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
