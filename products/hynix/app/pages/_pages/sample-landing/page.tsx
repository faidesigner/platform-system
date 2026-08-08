// @fai/ui 배럴(index.ts) 대신 직접 경로로 import.
// 이유: 배럴을 당기면 TabletDrawerMenu 가 homepage 전용 '@/config/site' 를
// 참조해 hynix 빌드가 깨진다 (CONFLICTS.md 기록). 필요한 것만 콕 집어 가져온다.
import { Button } from "@fai/ui/components/button/Button";
import { Label } from "@fai/ui/components/label/Label";

/**
 * 샘플 랜딩 — 상위 공용 컴포넌트(@fai/ui)를 실제로 연결한 예시.
 */
export default function SampleLanding() {
  return (
    <div
      data-brand="hynix"
      className="flex flex-col items-center gap-6 bg-white px-6 py-20 text-center"
    >
      <Label shape="round" size="M">
        SK hynix
      </Label>

      <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-neutral-900">
        완성된 UI를 그대로,
        <br />
        개발까지 매끄럽게.
      </h2>

      <p className="max-w-md text-base leading-relaxed text-neutral-500">
        디자인 시스템의 상위 컴포넌트를 재사용해 만든 페이지입니다.
        아래 버튼은 @fai/ui 의 Button 을 그대로 사용합니다.
      </p>

      <div className="mt-2 flex gap-3">
        <Button tone="primary" size="l" label="시작하기" />
        <Button tone="secondary" size="l" label="문서 보기" />
      </div>
    </div>
  );
}

/** 개발자에게 복사로 전달되는 원본 소스 */
export const code = `import { Button } from "@fai/ui/components/button/Button";
import { Label } from "@fai/ui/components/label/Label";

export default function SampleLanding() {
  return (
    <div data-brand="hynix" className="flex flex-col items-center gap-6 bg-white px-6 py-20 text-center">
      <Label shape="round" size="M">SK hynix</Label>

      <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-neutral-900">
        완성된 UI를 그대로,<br />개발까지 매끄럽게.
      </h2>

      <p className="max-w-md text-base leading-relaxed text-neutral-500">
        디자인 시스템의 상위 컴포넌트를 재사용해 만든 페이지입니다.
      </p>

      <div className="mt-2 flex gap-3">
        <Button tone="primary" size="l" label="시작하기" />
        <Button tone="secondary" size="l" label="문서 보기" />
      </div>
    </div>
  );
}
`;
