import type { ComponentType } from "react";

/** 갤러리에 등록되는 완성 페이지 1건 */
export interface HandoffPage {
  /** URL slug (kebab-case) */
  slug: string;
  /** 인덱스에 표시될 번호 ("01", "02" ...) */
  no: string;
  /** 페이지 한글 제목 */
  title: string;
  /** 한 줄 설명 */
  description?: string;
  /** 상태 */
  status?: "draft" | "review" | "final";
  /** 실제 렌더될 완성 페이지 컴포넌트 */
  Component: ComponentType;
  /** 개발자에게 복사로 넘길 원본 소스코드 (문자열) */
  code: string;
}

// ── 등록된 페이지들 ───────────────────────────────────────────
// 새 페이지를 만들면 여기 배열에만 추가하면 인덱스에 자동 반영된다.
import SampleLanding, { code as sampleLandingCode } from "./pages/_pages/sample-landing/page";

export const PAGES: HandoffPage[] = [
  {
    slug: "sample-landing",
    no: "01",
    title: "샘플 랜딩 (스타터)",
    description: "@fai/ui 상위 컴포넌트를 실제로 연결한 예시 페이지",
    status: "draft",
    Component: SampleLanding,
    code: sampleLandingCode,
  },
];

export const getPage = (slug: string) => PAGES.find((p) => p.slug === slug);
