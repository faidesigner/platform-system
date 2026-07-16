import Link from "next/link";
import { Label } from "@fai/ui";
import { componentCatalog } from "./componentCatalog";
import { PageHero, Shell, UiCard } from "./SystemShell";

const groups = Array.from(new Set(componentCatalog.map((item) => item.group)));

export default function ComponentsPage() {
  return (
    <Shell active="components">
      <PageHero
        eyebrow="Components"
        title="Build from packages/ui"
        description="Components는 packages/ui에 구현된 실제 React 컴포넌트를 기준으로 정리합니다. 각 컴포넌트명이 이 페이지의 카테고리 제목입니다."
      />

      <section className="mt-5xl grid gap-l tablet:grid-cols-3">
        {groups.map((group) => {
          const items = componentCatalog.filter((item) => item.group === group);
          return (
            <UiCard key={group} label={`${items.length} components`} title={group}>
              <p>{items.map((item) => item.name).join(", ")}</p>
            </UiCard>
          );
        })}
      </section>

      <section className="mt-5xl grid gap-l tablet:grid-cols-2 desktop-s:grid-cols-3">
        {componentCatalog.map((item) => (
          <Link key={item.name} href={`/components/${item.slug}`} className="origin-component-index-link">
            <UiCard label={item.group} title={item.name}>
              <p>{item.summary}</p>
              <div className="origin-component-index-meta">
                <Label size="S">implemented</Label>
                <span>Open component</span>
              </div>
            </UiCard>
          </Link>
        ))}
      </section>
    </Shell>
  );
}
