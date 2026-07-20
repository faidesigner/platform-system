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
        <p className="origin-heading-eyebrow">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-title-m font-bold text-primary">{title}</h2>
      {description ? (
        <p className="origin-heading-description">
          {description}
        </p>
      ) : null}
    </header>
  );
}
