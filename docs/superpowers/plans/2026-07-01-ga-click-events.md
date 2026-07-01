# GA 클릭 이벤트 태그 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Notion GA 문서가 정의한 12개 클릭 지점에 3종 커스텀 이벤트(interest_click / lead_acquisition_click / inquiry_complete)를 발화한다.

**Architecture:** GA 로직은 homepage `lib/analytics`에 집중(gtag 접점은 `track.ts` 하나). homepage 소유 버튼은 핸들러에서 `trackEvent()` 직접 호출, 공용 `@fai/ui`(NavigationBar/Footer) 내부 접점은 분석 비종속 콜백 prop을 추가해 브릿지에서 연결한다.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript, `@next/third-parties/google` (`sendGAEvent`), vitest + @testing-library/react + jsdom (신규).

## Global Constraints

- GA4 측정 ID: `G-GCQKJ5TF6R` (기존 layout에 이미 주입됨, 변경 금지)
- 이벤트명 3종 고정: `interest_click`, `lead_acquisition_click`, `inquiry_complete`
- 공통 파라미터: `location`(enum), `label`(string)
- `location` 허용값: `nav`, `home_hero`, `home_customers`, `home_cta_banner`, `product_hero`, `product_cta_banner`, `media_showcase`, `footer`, `contact_form`, `contact_kakao`
- `@fai/ui`에 추가하는 prop은 모두 optional(하위 호환) · 분석 비종속(GA 명칭 금지)
- 네비 "채용"은 계측 제외(Notion "채용 제외")
- `trackEvent`는 SSR/GA 미로드 시 no-op

---

## File Structure

- Create: `products/homepage/lib/analytics/events.ts` — 이벤트명·location enum·타입·`buildEvent()` 순수 함수
- Create: `products/homepage/lib/analytics/track.ts` — `trackEvent()` (sendGAEvent 래퍼)
- Create: `products/homepage/lib/analytics/events.test.ts`, `track.test.ts`
- Create: `products/homepage/vitest.config.ts`, `products/homepage/vitest.setup.ts`
- Create: `products/homepage/components/layout/FooterBridge.tsx` — Footer 클라이언트 래퍼(onSocialClick 주입)
- Modify: homepage 버튼 컴포넌트 6종(CtaBanner, HeroSection, CustomersSection, ShowcaseSection, ProductHero, HeroShell), ContactUsSection, NavigationBarBridge, `app/[locale]/layout.tsx`, `package.json`
- Modify: `packages/ui/components/NavigationBar.tsx`, `packages/ui/components/navigation/MegaNavMenu.tsx`, `packages/ui/components/footer/Footer.tsx`, `packages/ui/index.ts`(타입 export 필요 시)
- Delete: `products/homepage/components/layout/Footer.tsx` (죽은 코드 — 확인 후)

---

## Task 1: 분석 코어 + vitest 세팅

**Files:**
- Create: `products/homepage/vitest.config.ts`, `products/homepage/vitest.setup.ts`
- Create: `products/homepage/lib/analytics/events.ts`, `products/homepage/lib/analytics/events.test.ts`
- Create: `products/homepage/lib/analytics/track.ts`, `products/homepage/lib/analytics/track.test.ts`
- Modify: `products/homepage/package.json` (devDeps + `test` 스크립트)

**Interfaces:**
- Produces:
  - `type GaLocation = 'nav' | 'home_hero' | 'home_customers' | 'home_cta_banner' | 'product_hero' | 'product_cta_banner' | 'media_showcase' | 'footer' | 'contact_form' | 'contact_kakao'`
  - `type GaEventName = 'interest_click' | 'lead_acquisition_click' | 'inquiry_complete'`
  - `interface GaParams { location: GaLocation; label: string }`
  - `buildEvent(name: GaEventName, params: GaParams): { name: GaEventName; params: GaParams }`
  - `trackEvent(name: GaEventName, params: GaParams): void`

- [ ] **Step 1: devDeps + test 스크립트 추가**

`products/homepage/package.json`의 `scripts`에 `"test": "vitest run"`, `"test:watch": "vitest"` 추가. devDependencies에 추가:

```
vitest@^2  @testing-library/react@^16  @testing-library/jest-dom@^6  jsdom@^25  @vitejs/plugin-react@^4
```

Run: `cd products/homepage && pnpm install`

- [ ] **Step 2: vitest 설정 파일 작성**

`products/homepage/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

`products/homepage/vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: events 실패 테스트 작성**

`products/homepage/lib/analytics/events.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildEvent } from "./events";

describe("buildEvent", () => {
  it("이벤트명과 파라미터를 그대로 payload로 조립한다", () => {
    expect(
      buildEvent("lead_acquisition_click", { location: "home_cta_banner", label: "도입 문의하기" }),
    ).toEqual({
      name: "lead_acquisition_click",
      params: { location: "home_cta_banner", label: "도입 문의하기" },
    });
  });

  it("interest_click도 동일 규격으로 조립한다", () => {
    expect(buildEvent("interest_click", { location: "nav", label: "제품" })).toEqual({
      name: "interest_click",
      params: { location: "nav", label: "제품" },
    });
  });
});
```

- [ ] **Step 4: 테스트 실패 확인**

Run: `cd products/homepage && pnpm test events`
Expected: FAIL — `buildEvent` not exported / module not found

- [ ] **Step 5: events.ts 구현**

`products/homepage/lib/analytics/events.ts`:

```ts
export type GaLocation =
  | "nav"
  | "home_hero"
  | "home_customers"
  | "home_cta_banner"
  | "product_hero"
  | "product_cta_banner"
  | "media_showcase"
  | "footer"
  | "contact_form"
  | "contact_kakao";

export type GaEventName =
  | "interest_click"
  | "lead_acquisition_click"
  | "inquiry_complete";

export interface GaParams {
  location: GaLocation;
  label: string;
}

/** GA로 보낼 payload를 조립하는 순수 함수(사이드이펙트 없음). */
export function buildEvent(name: GaEventName, params: GaParams) {
  return { name, params };
}
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `cd products/homepage && pnpm test events`
Expected: PASS (2)

- [ ] **Step 7: track 실패 테스트 작성**

`products/homepage/lib/analytics/track.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({ sendGAEvent: (...a: unknown[]) => sendGAEvent(...a) }));

import { trackEvent } from "./track";

describe("trackEvent", () => {
  beforeEach(() => sendGAEvent.mockClear());

  it("sendGAEvent를 'event', 이벤트명, 파라미터 순으로 호출한다", () => {
    trackEvent("inquiry_complete", { location: "contact_form", label: "문의하기" });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "inquiry_complete", {
      location: "contact_form",
      label: "문의하기",
    });
  });
});
```

- [ ] **Step 8: 테스트 실패 확인**

Run: `cd products/homepage && pnpm test track`
Expected: FAIL — `trackEvent` not exported

- [ ] **Step 9: track.ts 구현**

`products/homepage/lib/analytics/track.ts`:

```ts
import { sendGAEvent } from "@next/third-parties/google";
import { buildEvent, type GaEventName, type GaParams } from "./events";

/**
 * GA4 커스텀 이벤트 발화. gtag/dataLayer에 접근하는 유일한 지점.
 * sendGAEvent 내부에서 dataLayer 미존재 시 안전 처리되므로 별도 가드 불필요.
 */
export function trackEvent(name: GaEventName, params: GaParams): void {
  const { name: eventName, params: eventParams } = buildEvent(name, params);
  sendGAEvent("event", eventName, eventParams);
}
```

- [ ] **Step 10: 테스트 통과 확인**

Run: `cd products/homepage && pnpm test`
Expected: PASS (3)

- [ ] **Step 11: 커밋**

```bash
git add products/homepage/lib/analytics products/homepage/vitest.config.ts products/homepage/vitest.setup.ts products/homepage/package.json products/homepage/pnpm-lock.yaml
git commit -m "feat(ga): analytics core (buildEvent/trackEvent) + vitest 세팅"
```

---

## Task 2: homepage 소유 lead/interest 버튼 계측

**Files:**
- Modify: `products/homepage/components/sections/CtaBanner.tsx`
- Modify: `products/homepage/components/sections/home/HeroSection.tsx:108-112`
- Modify: `products/homepage/components/sections/home/CustomersSection.tsx:54-66`
- Modify: `products/homepage/components/sections/media/ShowcaseSection.tsx` (youtube CTA `~148`, SocialCard `~178`)
- Modify: `products/homepage/components/sections/products/ProductHero.tsx:97`
- Modify: `products/homepage/components/layout/HeroShell.tsx:36-42`

**Interfaces:**
- Consumes: `trackEvent`, `GaLocation` (Task 1)

- [ ] **Step 1: CtaBanner에 location prop + lead 이벤트**

`CtaBanner.tsx` — import 추가, prop 추가, 두 IcoTxtButton onClick 수정:

```tsx
import { trackEvent } from "@/lib/analytics/track";
import type { GaLocation } from "@/lib/analytics/events";

export function CtaBanner({ location = "home_cta_banner" }: { location?: Extract<GaLocation, "home_cta_banner" | "product_cta_banner"> }) {
  const router = useRouter();
  const handleCta = () => {
    trackEvent("lead_acquisition_click", { location, label: "도입 문의하기" });
    router.push("/contact");
  };
  // ... 두 IcoTxtButton 모두 onClick={handleCta}
}
```

제품 페이지에서 CtaBanner를 렌더하는 곳(제품 [slug] 페이지 하단)에서 `<CtaBanner location="product_cta_banner" />`로 호출하도록 수정. (홈은 기본값 사용)

- [ ] **Step 2: HeroSection [자세히 알아보기] interest**

`HeroSection.tsx` 108-112. `<Link>`는 유지하고 버튼에 onClick 부착:

```tsx
<IcoTxtButton
  variant="secondary" size="L" shape="round" className="shrink-0"
  onClick={() => trackEvent("interest_click", { location: "home_hero", label: "자세히 알아보기" })}
>
  자세히 알아보기
</IcoTxtButton>
```

파일 상단에 `import { trackEvent } from "@/lib/analytics/track";` 추가.

- [ ] **Step 3: CustomersSection [실제 도입 후기 더보기] interest**

`CustomersSection.tsx`는 서버/클라 확인 후('use client' 이미 있음) `<Link href={linkHref} ...>`에 onClick 추가:

```tsx
onClick={() => trackEvent("interest_click", { location: "home_customers", label: linkLabel })}
```

상단 import 추가.

- [ ] **Step 4: ShowcaseSection youtube CTA + 소셜 카드 interest**

youtube CTA(`~142` `<a href={current.href}>`)에 onClick:

```tsx
onClick={() => trackEvent("interest_click", { location: "media_showcase", label: youtube.ctaLabel })}
```

SocialCard(`~178` `<a href={social.href}>`)에 onClick:

```tsx
onClick={() => trackEvent("interest_click", { location: "media_showcase", label: social.label })}
```

상단 import 추가.

- [ ] **Step 5: ProductHero CTA lead**

`ProductHero.tsx:97` onClick 수정:

```tsx
onClick={() => {
  trackEvent("lead_acquisition_click", { location: "product_hero", label: ctaLabel });
  router.push(lhref("/contact"));
}}
```

- [ ] **Step 6: HeroShell CTA lead (StoreHero 경유 제품 hero)**

`HeroShell.tsx`는 현재 `<a href={lhref("/contact")}>`로 CTA 렌더. 'use client'가 아니면 클라 전환 필요. anchor에 onClick 추가:

```tsx
onClick={() => trackEvent("lead_acquisition_click", { location: "product_hero", label: ctaLabel })}
```

`HeroShell`이 서버 컴포넌트면 파일 상단에 `"use client";` 추가 후 import.

- [ ] **Step 7: 타입체크·빌드**

Run: `cd products/homepage && pnpm lint && pnpm build`
Expected: 통과 (정적 export out/ 생성)

- [ ] **Step 8: 커밋**

```bash
git add products/homepage/components products/homepage/app
git commit -m "feat(ga): homepage CTA/interest 버튼 클릭 이벤트 계측"
```

---

## Task 3: 문의 완료 이벤트 (제출 성공 + 카카오)

**Files:**
- Modify: `products/homepage/components/sections/contact/ContactUsSection.tsx`
- Test: `products/homepage/components/sections/contact/ContactUsSection.test.tsx`

**Interfaces:**
- Consumes: `trackEvent` (Task 1)

- [ ] **Step 1: 실패 테스트 작성 (제출 성공 시 발화 / 검증 실패 시 미발화)**

`ContactUsSection.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const trackEvent = vi.fn();
vi.mock("@/lib/analytics/track", () => ({ trackEvent: (...a: unknown[]) => trackEvent(...a) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { ContactUsSection } from "./ContactUsSection";

describe("ContactUsSection inquiry_complete", () => {
  beforeEach(() => trackEvent.mockClear());

  it("검증 실패(빈 폼)면 발화하지 않는다", () => {
    render(<ContactUsSection />);
    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("필수값 입력 후 제출하면 inquiry_complete를 발화한다", () => {
    render(<ContactUsSection />);
    fireEvent.change(screen.getByPlaceholderText("회사명"), { target: { value: "FAI" } });
    fireEvent.change(screen.getByPlaceholderText("성함"), { target: { value: "함명원" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));
    expect(trackEvent).toHaveBeenCalledWith("inquiry_complete", { location: "contact_form", label: "문의하기" });
  });
});
```

> 참고: placeholder/label 문자열은 `siteConfig.contact.fields`와 일치. lenis/Image 등 부수 의존이 jsdom에서 문제되면 `vi.mock`으로 처리.

- [ ] **Step 2: 테스트 실패 확인**

Run: `cd products/homepage && pnpm test ContactUsSection`
Expected: FAIL — 두 번째 테스트에서 trackEvent 미호출

- [ ] **Step 3: 구현 — 성공 지점에 발화 추가**

`ContactUsSection.tsx` `handleSubmit` 내, 검증 통과 후 `setSubmitted(true)` 직전:

```tsx
trackEvent("inquiry_complete", { location: "contact_form", label: "문의하기" });
flushSync(() => { setSubmitted(true); });
```

상단 `import { trackEvent } from "@/lib/analytics/track";` 추가.

- [ ] **Step 4: 카카오 [빠른 상담하기] 발화**

토스트의 카카오 버튼(`contact.toast.kakaoUrl`로 이동하는 곳)에 onClick 추가:

```tsx
onClick={() => trackEvent("inquiry_complete", { location: "contact_kakao", label: "빠른 상담하기" })}
```

(기존 이동 로직은 유지 — window.open/href 그대로)

- [ ] **Step 5: 테스트 통과 확인**

Run: `cd products/homepage && pnpm test ContactUsSection`
Expected: PASS (2)

- [ ] **Step 6: 커밋**

```bash
git add products/homepage/components/sections/contact
git commit -m "feat(ga): 문의 완료 이벤트(제출 성공/카카오 상담)"
```

---

## Task 4: `@fai/ui` 콜백 prop + 브릿지 (네비·푸터)

**Files:**
- Modify: `packages/ui/components/NavigationBar.tsx` (props + 문의하기 버튼 + MegaNavMenu 전달)
- Modify: `packages/ui/components/navigation/MegaNavMenu.tsx` (onItemClick 부착)
- Modify: `packages/ui/components/footer/Footer.tsx` (onSocialClick)
- Create: `products/homepage/components/layout/FooterBridge.tsx`
- Modify: `products/homepage/components/layout/NavigationBarBridge.tsx`
- Modify: `products/homepage/app/[locale]/layout.tsx` (Footer → FooterBridge)
- Delete: `products/homepage/components/layout/Footer.tsx` (죽은 코드 확인 후)

**Interfaces:**
- Consumes: `trackEvent` (Task 1)
- Produces (@fai/ui 신규 optional props):
  - `NavigationBar`: `onItemClick?(item: NavItem): void`, `onContactClick?(): void`
  - `MegaNavMenu`(props): `onItemClick?(item: NavItem): void`
  - `Footer`: `onSocialClick?(label: string): void`

- [ ] **Step 1: NavigationBar props 추가 + 전달**

`NavigationBarProps`에 추가:

```ts
onItemClick?: (item: NavItem) => void;
onContactClick?: () => void;
```

문의하기 버튼(`~229`) onClick 수정 — 기존 라우팅 유지하며 콜백 선호출:

```tsx
onClick={() => { onContactClick?.(); router.push(lhref("/contact")); }}
```

MegaNavMenu 렌더 지점에 `onItemClick={onItemClick}` 전달.

- [ ] **Step 2: MegaNavMenu onItemClick 부착**

`MegaNavMenuProps`에 `onItemClick?: (item: NavItem) => void;` 추가. 최상위 nav 항목(라벨 Link / 드롭다운 트리거 "제품")의 클릭 핸들러에서 `onItemClick?.(item)` 호출. 외부 링크("채용", `item.external`)는 호출하지 않는다.

- [ ] **Step 3: Footer onSocialClick 부착**

`Footer`를 `export default function Footer({ onSocialClick }: { onSocialClick?: (label: string) => void } = {})` 로 변경. `SnsButtons`가 콜백을 받아 각 SNS anchor에 `onClick={() => onSocialClick?.(sns.label)}` 부착.

- [ ] **Step 4: @fai/ui 빌드/타입 확인**

Run: `cd packages/ui && pnpm build` (또는 루트 타입체크)
Expected: 통과, 기존 사용처 무영향(props optional)

- [ ] **Step 5: NavigationBarBridge에서 trackEvent 연결**

`NavigationBarBridge.tsx`:

```tsx
import { trackEvent } from "@/lib/analytics/track";
// ...
<NavigationBar
  navItems={NAV_ITEMS}
  onItemClick={(item) => trackEvent("interest_click", { location: "nav", label: item.label })}
  onContactClick={() => trackEvent("lead_acquisition_click", { location: "nav", label: "문의하기" })}
  desktopLangSwitcher={...}
  mobileLangSwitcher={...}
/>
```

- [ ] **Step 6: FooterBridge 생성 + layout 교체**

`products/homepage/components/layout/FooterBridge.tsx`:

```tsx
"use client";
import { Footer } from "@fai/ui";
import { trackEvent } from "@/lib/analytics/track";

export default function FooterBridge() {
  return <Footer onSocialClick={(label) => trackEvent("interest_click", { location: "footer", label })} />;
}
```

`app/[locale]/layout.tsx`: `import { Footer } from "@fai/ui";` 제거하고 `import FooterBridge from "@/components/layout/FooterBridge";`, `<Footer />` → `<FooterBridge />`.

- [ ] **Step 7: 죽은 Footer 확인 후 제거**

Run: `cd /Users/ham/workspace/platform-system && grep -rn "layout/Footer\"" products/homepage --include=*.tsx | grep -v FooterBridge`
사용처가 없으면 `git rm products/homepage/components/layout/Footer.tsx`. (`ScrollTopButton` 등 다른 참조 없는지 함께 확인)

- [ ] **Step 8: lint·build**

Run: `cd products/homepage && pnpm lint && pnpm build`
Expected: 통과

- [ ] **Step 9: 커밋**

```bash
git add packages/ui products/homepage
git commit -m "feat(ga): 네비/푸터 클릭 이벤트(@fai/ui 콜백 prop + 브릿지) + 죽은 Footer 제거"
```

---

## Task 5: 실측 검증 (dataLayer)

**Files:** (수정 없음 — 검증만)

- [ ] **Step 1: dev 서버 + Playwright로 dataLayer push 확인**

`pnpm dev` 후 Playwright로 각 대표 지점 클릭 → `window.dataLayer`에서 3종 이벤트 + `location`/`label` 확인. 최소 확인 목록: nav 제품(interest/nav), nav 문의하기(lead/nav), 홈 자세히 알아보기(interest/home_hero), 홈 도입 문의하기(lead/home_cta_banner), 제품 도입 문의하기(lead/product_hero|product_cta_banner), 미디어 더 알아보기(interest/media_showcase), 푸터 SNS(interest/footer), 문의 제출 성공(inquiry_complete/contact_form), 카카오(inquiry_complete/contact_kakao).

- [ ] **Step 2: 전체 테스트·빌드 최종 확인**

Run: `cd products/homepage && pnpm test && pnpm lint && pnpm build`
Expected: 전부 통과

---

## Self-Review

- **Spec coverage:** 이벤트 스키마(§2)=Task1, 매핑 12개(§3)=Task2/3/4, 아키텍처(§4)=Task1(코어)+Task4(@fai/ui 경계), 테스트(§5)=Task1/3, 부수정리(§6 죽은 Footer)=Task4 Step7, 검증(§7)=Task5. 누락 없음.
- **Placeholder scan:** 코드 블록 실물 제공. UI 편집은 정확한 파일·라인 명시.
- **Type consistency:** `GaLocation`/`GaEventName`/`GaParams`/`buildEvent`/`trackEvent` 명칭 Task 전반 일치. `onItemClick`/`onContactClick`/`onSocialClick` 명칭 Task4 내 일치.
