import { Button } from "../../../packages/ui/components/Button";
import { Label } from "../../../packages/ui/components/label/Label";
import { RouteButton, Shell } from "./components/SystemShell";

export default function OverviewPage() {
  return (
    <Shell active="overview">
      <section className="origin-home-hero">
        <div>
          <Label size="M">Overview</Label>
          <h1>AI Design Origin</h1>
          <p className="origin-lead">안녕하세요. 디자인팀 이선연, 김예슬 입니다.</p>
          <p>
            디자인 시스템이란 디지털 제품에서 기획자, 디자이너, 개발자가 공통으로 사용하는 언어 형태로서
            디자인 원칙과 UX 패턴, UI 컴포넌트에서 나아가 자동화 등을 포함하는 시스템 라이브러리를 뜻합니다.
            우리는 이를 통해 프로덕트 개발 시 효율적이고 일관적인 커뮤니케이션을 기대합니다.
          </p>
        </div>
        <aside className="origin-progress-panel">
          <Label size="M">Progress</Label>
          <div className="origin-progress-list">
            <ProgressItem label="Foundation" value="100%" width="100%" />
            <ProgressItem label="Components" value="42%" width="42%" />
          </div>
        </aside>
      </section>

      <section className="origin-section">
        <div className="origin-section-header">
          <Label size="M">AI Design Origin 사용하기</Label>
          <p>
            AI Design Origin 시스템은 웹 플랫폼을 기준으로 설정되어 있습니다. 모바일, 키오스크, 게이트, VOC는
            기존의 수동화된 FAI 디자인 시스템을 바라보고 있습니다.
          </p>
        </div>
        <div className="origin-overview-grid">
          <OverviewCard label="Foundation" title="Shared token language" href="/foundation">
            컬러, 타이포그래피, 스페이싱, 이펙트, 모션, 아이콘을 Git 기준 토큰으로 펼쳐 보여줍니다.
          </OverviewCard>
          <OverviewCard label="Components" title="Reusable UI">
            컴포넌트는 `@fai/ui` 패키지에 있는 실제 React 컴포넌트를 기준으로 연결하고 확장합니다.
            <div className="origin-card-action">
              <RouteButton href="/components">Open Components</RouteButton>
            </div>
          </OverviewCard>
          <OverviewCard label="Guideline" title="UX rules">
            아직 생성 중인 UX 가이드는 planned 상태로 두고, 이후 자동 생성 흐름을 붙일 수 있게 구성합니다.
          </OverviewCard>
        </div>
      </section>

      <section className="origin-section" id="component">
        <Label size="M">Components from @fai/ui</Label>
        <div className="origin-component-demo">
          <Button tone="primary">Primary button</Button>
          <Button tone="secondary">Secondary button</Button>
          <Button tone="tertiary">Tertiary button</Button>
        </div>
      </section>

      <section className="origin-section" id="guideline">
        <div className="origin-overview-grid">
          <OverviewCard label="planned" title="UX Writing">
            톤, 오류 메시지, 빈 상태, 액션 문구를 정의합니다.
          </OverviewCard>
          <OverviewCard label="planned" title="Accessibility">
            키보드 순서, 대비, ARIA 사용 기준을 문서화합니다.
          </OverviewCard>
          <OverviewCard label="seeded" title="Responsive Layout">
            Grid token과 제품 템플릿 예시를 연결합니다.
          </OverviewCard>
        </div>
      </section>

      <section className="origin-section" id="history">
        <div className="origin-section-header">
          <Label size="M">Design history</Label>
          <p>담당자와 최근 업데이트를 작게 남겨 전체 진행 흐름을 확인할 수 있게 합니다.</p>
        </div>
        <div className="origin-history-grid">
          <div className="origin-history-panel">
            <h3>Foundation owners</h3>
            <dl>
              <div><dt>Color</dt><dd>@이선연 Sunyeon Lee</dd></div>
              <div><dt>Typography</dt><dd>@김예슬 yeseul</dd></div>
              <div><dt>Size</dt><dd>@김예슬 yeseul</dd></div>
              <div><dt>Opacity / BoxShadow / Motion / z-index</dt><dd>@이선연 Sunyeon Lee</dd></div>
            </dl>
          </div>
          <div className="origin-history-panel">
            <h3>Latest update</h3>
            <ol>
              <li><time>2026.07.14</time><span>Added List Component</span></li>
              <li><time>2026.07.13</time><span>Motion Tokens</span></li>
              <li><time>2026.07.11</time><span>Variables Migration</span></li>
            </ol>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function OverviewCard({
  label,
  title,
  href,
  children,
}: {
  label: string;
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="origin-overview-card">
      <Label size="S">{label}</Label>
      <h3>{title}</h3>
      <div className="origin-overview-card-body">{children}</div>
      {href ? (
        <div className="origin-card-action">
          <RouteButton href={href}>Open {label}</RouteButton>
        </div>
      ) : null}
    </article>
  );
}

function ProgressItem({ label, value, width }: { label: string; value: string; width: string }) {
  return (
    <div>
      <div className="mb-xs flex justify-between text-body-s font-semibold">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2xs overflow-hidden rounded-fai-circle bg-fill-soft">
        <div className="h-full rounded-fai-circle bg-brand" style={{ width }} />
      </div>
    </div>
  );
}
