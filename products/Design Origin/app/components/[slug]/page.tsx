import Link from "next/link";
import { notFound } from "next/navigation";
import { Label } from "@fai/ui";
import { ComponentPreview } from "../ComponentPreview";
import { componentCatalog, componentProperties, getComponentBySlug } from "../componentCatalog";
import { DesignCoreHeading } from "../DesignCoreHeading";
import { PageHero, Shell } from "../SystemShell";

export function generateStaticParams() {
  return componentCatalog.map((item) => ({ slug: item.slug }));
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getComponentBySlug(slug);

  if (!item) notFound();

  const properties = componentProperties[item.name] ?? [];
  const requiredProperties = properties.filter((property) => property.required);
  const optionalProperties = properties.filter((property) => !property.required);

  return (
    <Shell active="components" componentActive={item.slug}>
      <nav aria-label="Breadcrumb" className="mb-l flex items-center gap-2xs text-body-s text-secondary">
        <Link href="/components" className="hover:text-primary">Components</Link>
        <span className="text-tertiary">/</span>
        <span className="font-semibold text-primary">{item.name}</span>
      </nav>

      <PageHero eyebrow={item.group} title={item.name} description={item.summary}>
        <div className="origin-component-source">
          <Label size="S">implemented</Label>
          <code>{item.source}</code>
        </div>
      </PageHero>

      <section className="mt-5xl grid gap-5xl">
        <ComponentPreview type={item.preview} />

        <section>
          <DesignCoreHeading
            eyebrow="API"
            title="Properties"
            description="현재 packages/ui 구현에 선언된 공개 입력값입니다."
          />
          <div className="origin-component-properties mt-l">
            <div className="origin-component-properties-title">Props</div>
            {requiredProperties.length > 0 ? (
              <PropertyGroup title="Required" properties={requiredProperties} />
            ) : null}
            {optionalProperties.length > 0 ? (
              <PropertyGroup title="Optional" properties={optionalProperties} />
            ) : null}
          </div>
        </section>

        <section>
          <DesignCoreHeading
            eyebrow="Content"
            title="Behavior"
            description="디자이너와 개발자가 함께 확인하는 사용 규칙입니다."
          />
          <ul className="origin-component-notes mt-l">
            {item.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </section>
      </section>
    </Shell>
  );
}

function PropertyGroup({
  title,
  properties,
}: {
  title: string;
  properties: NonNullable<typeof componentProperties[string]>;
}) {
  return (
    <section className="origin-component-property-group">
      <h3>{title}</h3>
      <dl>
        {properties.map((property) => (
          <div key={property.name} className="origin-component-property-row">
            <dt><code>{property.name}</code></dt>
            <dd className="origin-component-property-type">
              <code>{property.type}</code>
              {property.defaultValue ? <span>(default: {property.defaultValue})</span> : null}
            </dd>
            <dd className="origin-component-property-description">{property.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
