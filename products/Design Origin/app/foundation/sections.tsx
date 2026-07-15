import Link from "next/link";
import type { CSSProperties } from "react";
import { Label } from "../../../../packages/ui/components/label/Label";
import colorBrand from "../../../../root/foundation/color-brand.json";
import colorGlobal from "../../../../root/foundation/color-global.json";
import colorSemantic from "../../../../root/foundation/color-semantic.json";
import effectsTokens from "../../../../root/foundation/effects.json";
import iconsTokens from "../../../../root/foundation/icons.json";
import motionTokens from "../../../../root/foundation/motion.json";
import opacityTokens from "../../../../root/foundation/opacity.json";
import spacingTokens from "../../../../root/foundation/spacing.json";
import typographyTokens from "../../../../root/foundation/typography.json";
import typographyWebTokens from "../../../../root/foundation/typography-w.json";
import { DesignCoreHeading } from "../components/DesignCoreHeading";
import { PageHero, RouteButton, Shell, UiCard } from "../components/SystemShell";

export const sections = [
  {
    slug: "color",
    title: "Color Global, Semantic, Brand",
    summary: "원시 팔레트는 직접 UI에 쓰지 않고 semantic 또는 brand token을 통해 참조합니다.",
    docs: ["color-global.md", "color-semantic.md", "color-brand.md"],
    examples: ["--color-green-500", "--color-text-basic-primary", "[data-brand='fainders.ai']"],
    rules: [
      "Primitive color는 직접 UI에 사용하지 않습니다.",
      "UI에는 semantic color를 우선 사용합니다.",
      "브랜드 컬러는 data-brand 속성으로 override합니다.",
    ],
    tables: [
      {
        title: "Global palette examples",
        columns: ["Token", "Value", "Usage"],
        rows: [
          ["--color-green-500", "#39db1f", "FAI brand, positive emphasis"],
          ["--color-blue-500", "#2388f6", "Info, link, data highlight"],
          ["--color-gray-900", "#1f2023", "Primary text"],
          ["--color-sand-50", "#f6f6f1", "Warm surface"],
        ],
      },
      {
        title: "Semantic color examples",
        columns: ["Token", "Reference", "Usage"],
        rows: [
          ["--color-bg-100", "{color.white}", "Page background"],
          ["--color-text-basic-primary", "{color.gray.900}", "Main text"],
          ["--color-border-secondary", "{color.gray.100}", "Subtle divider"],
          ["--color-filled-optional-brand-primary", "{color.green.500}", "Brand fill"],
        ],
      },
    ],
  },
  {
    slug: "typography",
    title: "Primitive and Web type scale",
    summary: "원시 폰트 값은 직접 UI에 쓰지 않고 Web UI에서는 typography-w.json 토큰을 사용합니다.",
    docs: ["typography.md", "typography-w.md"],
    examples: ["--w-display-S-size", "--w-title-M-lineHeight", "--w-text-S-letterSpacing"],
    rules: [
      "Primitive typography는 토큰 정의용이며 UI에는 직접 사용하지 않습니다.",
      "Web UI의 모든 텍스트 스타일은 w- prefix token을 사용합니다.",
      "KO가 기본값이며 EN, JP는 필요한 항목만 override합니다.",
    ],
    tables: [
      {
        title: "Primitive font tokens",
        columns: ["Token", "Value", "Usage"],
        rows: [
          ["--font-family-pretendard", "Pretendard Variable", "KO / EN base font"],
          ["--font-family-m-plus-2", "M PLUS 2 Variable", "JP font"],
          ["--font-weight-400", "400", "Regular"],
          ["--font-weight-700", "700", "Bold"],
        ],
      },
      {
        title: "Web type scale",
        columns: ["Category", "Scale", "Usage"],
        rows: [
          ["display", "L / M / S", "Hero and large editorial text"],
          ["title", "XL / L / M / S", "Page and section headings"],
          ["text", "XL / L / M / S / XS", "Body, label, description"],
          ["caption", "L / M / S", "Meta and helper text"],
        ],
      },
      {
        title: "Token examples",
        columns: ["Token", "Meaning", "Usage"],
        rows: [
          ["--w-display-S-size", "Display S font size", "Large page heading"],
          ["--w-title-M-lineHeight", "Title M line height", "Section heading"],
          ["--w-text-S-letterSpacing", "Text S letter spacing", "Compact labels"],
        ],
      },
    ],
  },
  {
    slug: "spacing",
    title: "Size, padding, spacing, corner radius",
    summary: "간격과 모서리는 임의 px 값 대신 정의된 토큰만 사용합니다.",
    docs: ["spacing.md"],
    examples: ["--padding-S", "--spacing-L", "--cornerRadius-M"],
    rules: [
      "size token은 원시값이며 UI에 직접 쓰지 않습니다.",
      "컴포넌트 내부 여백은 padding token을 사용합니다.",
      "컴포넌트 외부 간격은 spacing token을 사용합니다.",
      "모서리 값은 cornerRadius token으로 통일합니다.",
    ],
    tables: [
      {
        title: "Size scale examples",
        columns: ["Token", "rem", "px"],
        rows: [
          ["--size-4", "0.25rem", "4px"],
          ["--size-8", "0.5rem", "8px"],
          ["--size-16", "1rem", "16px"],
          ["--size-24", "1.5rem", "24px"],
          ["--size-40", "2.5rem", "40px"],
        ],
      },
      {
        title: "MW aliases",
        columns: ["Token", "Reference", "Usage"],
        rows: [
          ["--padding-S", "{size.8}", "Small component padding"],
          ["--padding-M", "{size.16}", "Default component padding"],
          ["--spacing-L", "{size.20}", "Section inner gap"],
          ["--cornerRadius-M", "{size.16}", "Card and panel radius"],
        ],
      },
    ],
  },
  {
    slug: "effects",
    title: "Opacity and shadow elevation",
    summary: "opacity는 상태 표현에, shadow는 elevation 계층 표현에만 사용합니다.",
    docs: ["opacity.md", "effects.md"],
    examples: ["--opacity-8", "--opacity-74", "--shadow-M"],
    rules: [
      "Opacity 값은 임의 숫자를 사용하지 않습니다.",
      "disabled token은 비활성화 요소에만 사용합니다.",
      "Shadow는 elevation 표현에만 사용하며 장식 목적의 강한 그림자는 지양합니다.",
    ],
    tables: [
      {
        title: "Opacity scale",
        columns: ["Token", "Value", "Usage"],
        rows: [
          ["--opacity-8", "0.08", "Hover overlay"],
          ["--opacity-16", "0.16", "Focus overlay"],
          ["--opacity-20", "0.20", "Pressed overlay"],
          ["--opacity-74", "0.74", "Strong scrim"],
        ],
      },
      {
        title: "Shadow scale",
        columns: ["Token", "Usage", "Layer"],
        rows: [
          ["--shadow-XS", "Inputs, chips", "Subtle"],
          ["--shadow-S", "Dropdown, tooltip", "Floating"],
          ["--shadow-M", "Card, panel", "Raised"],
          ["--shadow-XL", "Modal, side sheet", "Overlay"],
        ],
      },
    ],
  },
  {
    slug: "motion",
    title: "Duration and easing scale",
    summary: "작은 상태 변화는 fast, 패널과 콘텐츠 확장은 medium, 페이지 수준 전환은 slow 계열을 사용합니다.",
    docs: ["motion.md"],
    examples: ["--duration-fast", "--duration-medium", "--ease-standard"],
    rules: [
      "애니메이션과 트랜지션은 duration/easing token만 사용합니다.",
      "Hover처럼 자주 발생하는 상호작용은 fast 계열만 사용합니다.",
      "OS의 reduced motion 설정을 존중합니다.",
      "애니메이션이 사용자의 다음 행동을 막지 않도록 합니다.",
    ],
    tables: [
      {
        title: "Duration scale",
        columns: ["Token", "Value", "Usage"],
        rows: [
          ["--duration-fast-min", "130ms", "Tiny state change"],
          ["--duration-fast", "175ms", "Button, toggle feedback"],
          ["--duration-medium", "410ms", "Panel open, content expand"],
          ["--duration-slow", "975ms", "Page-level transition"],
        ],
      },
      {
        title: "Easing",
        columns: ["Token", "Value", "Usage"],
        rows: [
          ["--ease-standard", "cubic-bezier(0.24, 1, 0.4, 1)", "Default UI transition"],
        ],
      },
    ],
  },
  {
    slug: "icons",
    title: "Semantic icon names",
    summary: "사용처에서는 SVG 파일명보다 역할 이름을 우선합니다.",
    docs: ["icons.md"],
    examples: ["search", "externalLink", "microphone"],
    rules: [
      "컴포넌트에서는 가능한 한 semantic icon name을 사용합니다.",
      "아이콘 구현체는 교체될 수 있으므로 파일명보다 역할 이름을 우선합니다.",
      "장식 목적 아이콘도 접근성 텍스트와 상태 전달 여부를 함께 검토합니다.",
    ],
    tables: [
      {
        title: "Semantic icon names",
        columns: ["Name", "Usage", "Example"],
        rows: [
          ["close", "닫기, 다이얼로그 해제", "<Icon name=\"close\" />"],
          ["chevronDown", "드롭다운, 펼침/접힘", "<Icon name=\"chevronDown\" />"],
          ["search", "검색", "<Icon name=\"search\" />"],
          ["externalLink", "새 창 링크", "<Icon name=\"externalLink\" />"],
          ["microphone", "음성 입력, 오디오 녹음", "<Icon name=\"microphone\" />"],
        ],
      },
    ],
  },
] as const;

export type FoundationSlug = (typeof sections)[number]["slug"];

export function FoundationOverviewPage() {
  return (
    <Shell active="foundation">
      <PageHero
        eyebrow="Foundations"
        title="Build from shared tokens"
        description="Foundation은 컬러, 타이포그래피, 간격, 모션, 아이콘처럼 모든 UI가 공통으로 참조하는 가장 낮은 단계의 시스템 언어입니다."
      />
      <section className="mt-5xl grid gap-l tablet:grid-cols-3">
        {sections.map((section, index) => (
          <UiCard key={section.slug} label={`0${index + 1}`} title={section.title}>
            <p>{section.summary}</p>
            <div className="mt-m">
              <RouteButton href={`/foundation/${section.slug}`}>Open {section.slug}</RouteButton>
            </div>
          </UiCard>
        ))}
      </section>
    </Shell>
  );
}

export function FoundationSectionPage({ slug }: { slug: FoundationSlug }) {
  const section = sections.find((item) => item.slug === slug);

  if (!section) return null;

  return (
    <Shell active="foundation" foundationActive={slug}>
      <Breadcrumb
        items={[
          { label: "Foundations", href: "/foundation" },
          { label: section.slug },
        ]}
      />
      <PageHero
        eyebrow="Foundation section"
        title={section.title}
        description={section.summary}
      />
      <section className="mt-5xl grid gap-5xl">
        <section id="overview">
          <DesignCoreHeading
            eyebrow="Design Core"
            title="overview"
            description="기본 개요입니다. MD의 목적과 사용 범위를 먼저 읽을 수 있게 정리합니다."
          />
          <div className="mt-l max-w-[840px] text-body text-secondary">
            <p>{section.summary}</p>
            <p className="mt-s">
              이 페이지는 Git의 Foundation 문서와 토큰 JSON을 기준으로, 실제 작업자가 확인해야 할 규칙과 값을 펼쳐서 보여줍니다.
            </p>
            <div className="mt-m grid gap-s">
              {section.docs.map((doc) => (
                <code key={doc} className="rounded-fai-xs bg-fill-faint px-s py-xs text-body-xs">
                  root/foundation/docs/{doc}
                </code>
              ))}
            </div>
          </div>
        </section>

        <section id="rule">
          <DesignCoreHeading
            eyebrow="Design Core"
            title="rule"
            description="규칙입니다. 작업자가 실제 컴포넌트나 토큰을 사용할 때 지켜야 하는 기준을 적습니다."
          />
          <ul className="mt-l grid gap-s">
            {section.rules.map((rule) => (
              <li key={rule} className="rounded-fai-s border border-border-faint bg-surface px-m py-s text-body-s text-secondary">
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section id="tocken">
          <DesignCoreHeading
            eyebrow="Design Core"
            title="tocken"
            description="실제 값입니다. 토큰 값이 있는 경우 표로 펼쳐서 보여줍니다."
          />
          {slug === "color" ? (
            <ColorTokenCatalog />
          ) : getTokenDatasets(slug).length > 0 ? (
            <FoundationTokenCatalog slug={slug} />
          ) : (
            <div className="mt-l grid gap-xl">
              {section.tables.map((table) => (
                <TokenTable key={table.title} title={table.title} columns={table.columns} rows={table.rows} />
              ))}
            </div>
          )}
        </section>
      </section>
    </Shell>
  );
}

function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-l flex items-center gap-2xs text-body-s text-secondary">
      {items.map((item, index) => (
        <span key={item.label} className="inline-flex items-center gap-2xs">
          {index > 0 ? <span className="text-tertiary">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-primary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function TokenTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <section>
      <Label size="M">{title}</Label>
      <div className="mt-m overflow-x-auto rounded-fai-s border border-border-faint bg-surface">
        <table className="w-full min-w-[680px] border-collapse text-left text-body-s">
          <thead className="bg-fill-faint text-secondary">
            <tr>
              {columns.map((column) => (
                <th key={column} className="border-b border-border-faint px-m py-s font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className="border-b border-border-faint px-m py-s text-secondary last:border-b-0">
                    {index === 0 ? <code className="rounded-fai-xs bg-fill-faint px-xs py-2xs text-body-xs text-primary">{cell}</code> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type TokenRow = {
  token: string;
  value: string;
  resolved: string;
};

type UnknownTokenTree = Record<string, unknown>;
type TokenDataset = {
  title: string;
  rows: TokenRow[];
};

const globalTokenRows = flattenTokenTree("--color", colorGlobal as UnknownTokenTree).map((row) => ({
  ...row,
  resolved: row.value,
}));

const semanticTokenRows = flattenTokenTree("--color", colorSemantic as UnknownTokenTree).map(resolveTokenRow);
const brandTokenRows = flattenTokenTree("--brand", colorBrand as UnknownTokenTree).map(resolveTokenRow);

const typographyTokenRows = [
  ...flattenTokenTree("--font", typographyTokens as UnknownTokenTree),
  ...flattenTokenTree("--w", typographyWebTokens as UnknownTokenTree).map(resolveTypographyRow),
];

const spacingTokenRows = flattenRootTokenTree(spacingTokens as UnknownTokenTree).map(resolveSpacingRow);

const effectsTokenRows = [
  ...flattenTokenTree("--opacity", opacityTokens as UnknownTokenTree),
  ...flattenTokenTree("--shadow", effectsTokens as UnknownTokenTree),
];

const motionTokenRows = flattenRootTokenTree(motionTokens as UnknownTokenTree);
const iconTokenRows = flattenRootTokenTree(iconsTokens as UnknownTokenTree);

const tokenDatasets: Partial<Record<FoundationSlug, TokenDataset[]>> = {
  typography: [
    { title: "Primitive typography", rows: flattenTokenTree("--font", typographyTokens as UnknownTokenTree) },
    { title: "Web typography scale", rows: flattenTokenTree("--w", typographyWebTokens as UnknownTokenTree).map(resolveTypographyRow) },
  ],
  spacing: [
    { title: "Size, padding, spacing, corner radius", rows: spacingTokenRows },
  ],
  effects: [
    { title: "Opacity", rows: flattenTokenTree("--opacity", opacityTokens as UnknownTokenTree) },
    { title: "Shadow", rows: flattenTokenTree("--shadow", effectsTokens as UnknownTokenTree) },
  ],
  motion: [
    { title: "Duration and easing", rows: motionTokenRows },
  ],
  icons: [
    { title: "Semantic icon usage", rows: iconTokenRows },
  ],
};

function ColorTokenCatalog() {
  const globalGroups = groupRowsByFamily(globalTokenRows);
  const semanticGroups = groupRowsByFamily(semanticTokenRows);
  const brandGroups = groupRowsByFamily(brandTokenRows);
  const totalCount = globalTokenRows.length + semanticTokenRows.length + brandTokenRows.length;

  return (
    <div className="mt-m grid gap-xl">
      <section className="rounded-fai-s border border-border-faint bg-surface px-l py-l">
        <div className="flex flex-wrap items-end justify-between gap-m">
          <div>
            <Label size="M">Color token inventory</Label>
            <p className="mt-xs max-w-[720px] text-body-s text-secondary">
              Git의 `root/foundation` 컬러 JSON에서 읽은 전체 토큰입니다. reference 값은 실제 색상으로 한 번 더 풀어서 보여줍니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-xs text-center text-body-xs text-secondary">
            <CountPill label="global" value={globalTokenRows.length} />
            <CountPill label="semantic" value={semanticTokenRows.length} />
            <CountPill label="brand" value={brandTokenRows.length} />
          </div>
        </div>
        <p className="mt-m text-body-xs text-tertiary">Total {totalCount} color tokens</p>
      </section>

      <ColorGroupList title="Global palette" groups={globalGroups} />
      <ColorGroupList title="Semantic colors" groups={semanticGroups} compact />
      <ColorGroupList title="Brand overrides" groups={brandGroups} compact />
    </div>
  );
}

function FoundationTokenCatalog({ slug }: { slug: FoundationSlug }) {
  const datasets = getTokenDatasets(slug);
  const allRows = datasets.flatMap((dataset) => dataset.rows);

  return (
    <div className="mt-l grid gap-xl">
      <section className="rounded-fai-s border border-border-faint bg-surface px-l py-l">
        <div className="flex flex-wrap items-end justify-between gap-m">
          <div>
            <Label size="M">Token inventory</Label>
            <p className="mt-xs max-w-[720px] text-body-s text-secondary">
              Git의 `root/foundation` JSON에서 읽은 전체 토큰입니다. reference 값은 가능한 경우 실제 값으로 풀어서 함께 보여줍니다.
            </p>
          </div>
          <CountPill label="tokens" value={allRows.length} />
        </div>
      </section>

      {datasets.map((dataset) => (
        <section key={dataset.title}>
          <Label size="M">{dataset.title}</Label>
          <div className="mt-m grid gap-m">
            {groupRowsByFamily(dataset.rows).map(([group, rows]) => (
              <section key={group} className="rounded-fai-s border border-border-faint bg-surface p-m">
                <div className="mb-m flex items-center justify-between gap-m">
                  <h3 className="text-title-xs font-semibold text-primary">{group}</h3>
                  <span className="text-body-xs text-tertiary">{rows.length} tokens</span>
                </div>
                <div className="grid gap-xs">
                  {rows.map((row) => (
                    <GenericTokenRow key={row.token} row={row} slug={slug} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GenericTokenRow({ row, slug }: { row: TokenRow; slug: FoundationSlug }) {
  return (
    <div className="grid gap-s rounded-fai-xs border border-border-faint p-s tablet:grid-cols-[minmax(220px,0.8fr)_minmax(180px,0.7fr)_1fr] tablet:items-center">
      <code className="min-w-0 truncate text-body-xs text-primary">{row.token}</code>
      <div className="grid gap-2xs text-body-xs text-secondary">
        <span className="min-w-0 truncate">value: {row.value}</span>
        {row.resolved !== row.value ? <span className="min-w-0 truncate">resolved: {row.resolved}</span> : null}
      </div>
      <TokenPreview row={row} slug={slug} />
    </div>
  );
}

function TokenPreview({ row, slug }: { row: TokenRow; slug: FoundationSlug }) {
  if (slug === "typography") {
    const size = row.token.includes("-size") ? row.resolved : row.token.includes("-display-") ? "2rem" : row.token.includes("-title-") ? "1.5rem" : "0.875rem";
    return (
      <div className="min-w-0 rounded-fai-xs bg-fill-faint px-s py-xs">
        <span className="block truncate font-semibold text-primary" style={{ fontSize: clampPreviewSize(size), lineHeight: 1.35 }}>
          Typography sample
        </span>
      </div>
    );
  }

  if (slug === "spacing" && isLengthValue(row.resolved)) {
    return (
      <div className="flex items-center gap-s">
        <div className="h-4 rounded-fai-xs bg-brand" style={{ width: `min(${lengthToPx(row.resolved)}px, 180px)` }} />
        <span className="text-body-xs text-tertiary">{row.resolved}</span>
      </div>
    );
  }

  if (slug === "effects" && row.token.startsWith("--shadow")) {
    return <div className="h-10 rounded-fai-xs bg-surface" style={{ boxShadow: row.resolved }} />;
  }

  if (slug === "effects" && row.token.startsWith("--opacity")) {
    return (
      <div className="h-8 overflow-hidden rounded-fai-xs bg-fill-faint">
        <div className="h-full bg-primary" style={{ opacity: Number(row.resolved) }} />
      </div>
    );
  }

  if (slug === "motion") {
    return <div className="text-body-xs text-tertiary">{row.token.includes("duration") ? "Timing token" : "Easing token"}</div>;
  }

  if (slug === "icons") {
    return <div className="text-body-xs text-tertiary">{row.resolved}</div>;
  }

  return <span className="text-body-xs text-tertiary">Token value</span>;
}

function CountPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[92px] rounded-fai-xs border border-border-faint bg-fill-faint px-s py-xs">
      <strong className="block text-body text-primary">{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ColorGroupList({
  title,
  groups,
  compact = false,
}: {
  title: string;
  groups: Array<[string, TokenRow[]]>;
  compact?: boolean;
}) {
  return (
    <section>
      <Label size="M">{title}</Label>
      <div className="mt-m grid gap-m">
        {groups.map(([group, rows]) => (
          <section key={group} className="rounded-fai-s border border-border-faint bg-surface p-m">
            <div className="mb-m flex items-center justify-between gap-m">
              <h3 className="text-title-xs font-semibold text-primary">{group}</h3>
              <span className="text-body-xs text-tertiary">{rows.length} tokens</span>
            </div>
            <div className={compact ? "grid gap-xs" : "grid gap-s tablet:grid-cols-2 desktop:grid-cols-3"}>
              {rows.map((row) => (
                <ColorTokenCard key={row.token} row={row} compact={compact} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function ColorTokenCard({ row, compact }: { row: TokenRow; compact: boolean }) {
  const color = isRenderableColor(row.resolved) ? row.resolved : "#ffffff";
  const isTransparent = isTransparentColor(row.resolved);

  return (
    <div className={compact ? "grid grid-cols-[44px_1fr] gap-s rounded-fai-xs border border-border-faint p-xs" : "rounded-fai-xs border border-border-faint p-s"}>
      <div
        className="h-10 w-10 rounded-fai-xs border border-border-faint"
        style={{
          background: isTransparent
            ? `linear-gradient(45deg, #d2d3d5 25%, transparent 25%), linear-gradient(-45deg, #d2d3d5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d2d3d5 75%), linear-gradient(-45deg, transparent 75%, #d2d3d5 75%), ${color}`
            : color,
          backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
          backgroundSize: isTransparent ? "12px 12px" : undefined,
        } satisfies CSSProperties}
        aria-label={`${row.token} preview`}
      />
      <div className="min-w-0">
        <code className="block truncate text-body-xs text-primary">{row.token}</code>
        <div className="mt-2xs grid gap-2xs text-body-xs text-secondary">
          <span className="truncate">value: {row.value}</span>
          {row.resolved !== row.value ? <span className="truncate">resolved: {row.resolved}</span> : null}
        </div>
      </div>
    </div>
  );
}

function flattenTokenTree(prefix: string, tree: UnknownTokenTree): TokenRow[] {
  const rows: TokenRow[] = [];

  function walk(path: string[], value: unknown) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      rows.push({
        token: [prefix, ...path].join("-"),
        value: String(value),
        resolved: String(value),
      });
      return;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value as UnknownTokenTree).forEach(([key, child]) => walk([...path, normalizeTokenKey(key)], child));
    }
  }

  walk([], tree);
  return rows;
}

function flattenRootTokenTree(tree: UnknownTokenTree): TokenRow[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flattenTokenTree(`--${normalizeTokenKey(key)}`, value as UnknownTokenTree);
    }

    return flattenTokenTree("--token", { [key]: value });
  });
}

function resolveTokenRow(row: TokenRow): TokenRow {
  return {
    ...row,
    resolved: resolveColorReference(row.value),
  };
}

function resolveColorReference(value: string): string {
  const match = value.match(/^\{color\.([^}]+)\}$/);
  if (!match) return value;

  const resolved = match[1].split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as UnknownTokenTree)[key];
    }
    return undefined;
  }, colorGlobal as UnknownTokenTree);

  return typeof resolved === "string" ? resolved : value;
}

function resolveTypographyRow(row: TokenRow): TokenRow {
  return {
    ...row,
    resolved: resolveReference(row.value, typographyTokens as UnknownTokenTree, "font"),
  };
}

function resolveSpacingRow(row: TokenRow): TokenRow {
  return {
    ...row,
    resolved: resolveReference(row.value, spacingTokens as UnknownTokenTree),
  };
}

function resolveReference(value: string, source: UnknownTokenTree, namespace?: string): string {
  const match = value.match(/^\{([^}]+)\}$/);
  if (!match) return value;

  const parts = match[1].split(".").filter(Boolean);
  const resolvedParts = namespace && parts[0] === namespace ? parts.slice(1) : parts;
  const resolved = resolvedParts.reduce<unknown>((current, key) => {
    const candidates = [key, key.toLowerCase(), key.charAt(0).toLowerCase() + key.slice(1)];
    if (current && typeof current === "object") {
      for (const candidate of candidates) {
        if (candidate in current) return (current as UnknownTokenTree)[candidate];
      }
    }
    return undefined;
  }, source);

  return typeof resolved === "string" || typeof resolved === "number" ? String(resolved) : value;
}

function getTokenDatasets(slug: FoundationSlug) {
  return tokenDatasets[slug] ?? [];
}

function groupRowsByFamily(rows: TokenRow[]): Array<[string, TokenRow[]]> {
  const groups = new Map<string, TokenRow[]>();

  rows.forEach((row) => {
    const key = row.token.split("-").slice(0, 3).join("-");
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });

  return Array.from(groups.entries());
}

function normalizeTokenKey(key: string) {
  return key.replace(/[().]/g, "-").replace(/-+/g, "-");
}

function isRenderableColor(value: string) {
  return /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
}

function isTransparentColor(value: string) {
  return /^#([0-9a-f]{8})$/i.test(value) && value.slice(7, 9).toLowerCase() !== "ff";
}

function isLengthValue(value: string) {
  return /^-?\d*\.?\d+(rem|px)$/i.test(value);
}

function lengthToPx(value: string) {
  if (value.endsWith("rem")) return Number.parseFloat(value) * 16;
  return Number.parseFloat(value);
}

function clampPreviewSize(value: string) {
  if (!isLengthValue(value)) return "0.875rem";
  const px = Math.max(12, Math.min(lengthToPx(value), 34));
  return `${px}px`;
}
