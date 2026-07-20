import Link from "next/link";
import { Button } from "../../../../packages/ui/components/Button";
import { CardItem } from "../../../../packages/ui/components/card/CardItem";
import { Label } from "../../../../packages/ui/components/label/Label";

const foundationLinks = [
  { href: "/foundation/color", label: "Color" },
  { href: "/foundation/typography", label: "Typography" },
  { href: "/foundation/spacing", label: "Spacing" },
  { href: "/foundation/effects", label: "Effects" },
  { href: "/foundation/motion", label: "Motion" },
  { href: "/foundation/icons", label: "Icons" },
];

export function Shell({
  active = "overview",
  foundationActive,
  children,
}: {
  active?: "overview" | "foundation" | "components" | "guideline" | "history";
  foundationActive?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-alt text-primary">
      <header className="sticky top-0 z-40 border-b border-border-faint bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-l">
          <Link href="/" className="flex items-center gap-s text-body-s font-semibold">
            <span className="h-6 w-6 rounded-fai-s bg-brand" aria-hidden="true" />
            AI Design Origin
          </Link>
          <div className="hidden w-[320px] rounded-fai-s border border-border-subtle bg-surface px-m py-s text-body-s text-tertiary tablet:block">
            Search AI Design Origin
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 desktop-s:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="border-b border-border-faint bg-surface px-m py-m desktop-s:min-h-[calc(100vh-64px)] desktop-s:border-b-0 desktop-s:border-r">
          <nav className="flex gap-2xs overflow-x-auto desktop-s:grid desktop-s:overflow-visible">
            <NavLink href="/" active={active === "overview"}>Overview</NavLink>
            <NavLink href="/foundation" active={active === "foundation"}>Foundations</NavLink>
            {active === "foundation" ? (
              <div className="hidden border-l border-border-faint pl-m desktop-s:grid">
                {foundationLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-fai-xs px-s py-s text-body-s",
                      foundationActive === item.label.toLowerCase()
                        ? "text-brand-text font-semibold"
                        : "text-tertiary hover:bg-fill-faint hover:text-primary",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
            <NavLink href="/#component" active={active === "components"}>Components</NavLink>
            <NavLink href="/#guideline" active={active === "guideline"}>Guideline</NavLink>
            <NavLink href="/#history" active={active === "history"}>Design history</NavLink>
          </nav>
        </aside>
        <main className="min-w-0 px-l py-5xl desktop-s:px-5xl">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "whitespace-nowrap rounded-fai-s px-m py-s text-body-s transition-colors",
        active ? "bg-brand-subtle text-brand-text font-semibold" : "text-secondary hover:bg-fill-faint",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grid gap-2xl desktop-s:grid-cols-[minmax(0,1fr)_320px]">
      <div className="max-w-[760px]">
        <Label size="M">{eyebrow}</Label>
        <h1 className="mt-l text-display-s font-bold leading-[1.05] tracking-normal text-primary">
          {title}
        </h1>
        <p className="mt-m text-body-l text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function UiCard({
  label,
  title,
  children,
}: {
  label?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <CardItem>
      {label ? <Label size="S">{label}</Label> : null}
      <h3 className="mt-m text-title-s font-bold text-primary">{title}</h3>
      <div className="mt-s text-body-s text-secondary">{children}</div>
    </CardItem>
  );
}

export function RouteButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-fai-s border border-border-subtle bg-surface px-m py-s text-body-xs font-semibold text-primary hover:bg-fill-faint"
    >
      {children}
    </Link>
  );
}
