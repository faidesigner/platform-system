export function DesignCoreHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-border-faint pb-m">
      {eyebrow ? (
        <p className="mb-xs text-caption-m font-semibold uppercase tracking-[0.08em] text-tertiary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-title-m font-bold text-primary">{title}</h2>
      {description ? (
        <p className="mt-s max-w-[760px] text-body-s text-secondary">
          {description}
        </p>
      ) : null}
    </header>
  );
}
