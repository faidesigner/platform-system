# FAI Homepage 디자인 개발 패턴

`products/homepage` 작업 시 따르는 규칙과 반복 패턴을 기록합니다.

---

## 1. Breakpoint 규칙

### 표준 breakpoint

| 이름 | 시작 px | Tailwind prefix |
|---|---|---|
| mobile | 390px | (기본) |
| tablet | 768px | `tablet:` |
| laptop | 1280px | `laptop:` |
| desktop | 1440px | `desktop:` |
| desktop-lg | 1920px | `desktop-lg:` |

### Tailwind v4 max-[] 주의사항

Tailwind v4에서 `max-[Npx]`는 `@media (width < N)` — **N 미포함(exclusive)**.

| 의도 | 잘못된 값 | 올바른 값 |
|---|---|---|
| 420px 이하 포함 | `max-[420px]` | `max-[421px]` |
| 960px 이하 포함 | `max-[960px]` | `max-[961px]` |

- CSS `@media (max-width: 420px)`는 inclusive이므로 변경 불필요.
- `dangerouslySetInnerHTML` 내부 CSS 미디어쿼리도 inclusive — 건드리지 않는다.

### 자주 쓰는 커스텀 breakpoint

- `max-[421px]` — 420px 이하 (최소 모바일 텍스트 스케일 다운)
- `max-[769px]` — 768px 이하
- `max-[961px]` — 960px 이하 (태블릿 레이아웃 전환)
- `min-[421px]`, `min-[961px]` — 역방향

---

## 2. 디자인 토큰 규칙

### 토큰 계층 — 사용 범위 엄격 구분

| 계층 | 예시 | 사용 가능 여부 |
|---|---|---|
| 프리미티브 | `--font-size-15`, `--m-text-*`, `--font-lineHeight-*`, `--color-gray-30` | **금지** (내부 참조 전용) |
| Web 시맨틱 | `--w-text-body-size`, `--w-title-L-lineHeight`, `--color-bg-200`, `--color-border-tertiary` | 허용 |
| Tailwind 클래스 | `text-body-ms`, `text-title-l`, `bg-fill-faint` | **권장** |

**자주 범하는 위반 패턴 → 올바른 대체**

```
text-[length:var(--font-size-15)]  →  text-body-ms
text-[length:var(--font-size-14)]  →  text-body-s
text-[13px] leading-[20px]         →  text-body-xs leading-[1.25rem]
--font-size-* / --font-lineHeight-* →  --w-text-*-size / --w-text-*-lineHeight
border-[var(--color-border-tertiary,#E4E6E7)]  →  border-[var(--color-border-tertiary)]
bg-[#EDF2F5]                        →  bg-[var(--color-bg-200)]
```

- hex fallback 제거: `var(--token, #hex)` → `var(--token)` 만 사용.
- hex 하드코딩 `bg-[#ffffff]` 절대 금지.

### Spacing / Padding → Tailwind 대응

| 토큰 | 값 | Tailwind 클래스 |
|---|---|---|
| `--padding-XL` | 24px | `p-xl` / `px-xl` / `py-xl` |
| `--padding-2XL` | 32px | `p-2xl` |
| `--padding-3XL` | 40px | `p-3xl` |
| `--spacing-5XL` | 80px | `gap-5xl` |
| `--size-48` | 48px | `p-[var(--size-48)]` (토큰 직접 참조) |

### Border Radius

| 토큰 | Tailwind |
|---|---|
| `--cornerRadius-M` / `--fai-radius-m` | `rounded-fai-m` |
| `--cornerRadius-S` | `rounded-fai-s` |

### 임의 px 허용 예외

Figma 정밀 명세를 1:1 반영해야 하는 경우 `var(--token, fallback)` 인라인 참조 허용 (토큰 참조이므로 하드코딩 아님).
토큰 스케일 밖 고정 치수는 불가피한 경우 px로 두되, 가능하면 `aspect-ratio`·`container`·flex로 대체.

---

## 3. 반응형 구현 패턴

### 1440px 이상 레이아웃 컨테이너

섹션 배경은 풀 뷰포트, 콘텐츠는 1440px 이내로 제한하는 공통 패턴.

```tsx
{/* 외부 section: 배경만 w-full */}
<section className="w-full bg-fill-faint">
  {/* 내부 래퍼: 콘텐츠 중앙 정렬 */}
  <div className="max-w-[1440px] mx-auto px-[...] py-[...]">
    ...
  </div>
</section>
```

- `section`에 `max-w` 직접 적용 금지 — 배경이 뷰포트 기준으로 유지되지 않음.
- 내부 래퍼에 기존 padding/gap/pt/pb 값 그대로 유지하고 `max-w-[1440px] mx-auto` 추가.
- 적용 섹션: ShowcaseSection, NewsSection, RetailTechLetterSection, AboutHero, AboutManagement 등.

### dangerouslySetInnerHTML style 블록

복잡한 반응형 오버라이드(여러 breakpoint × 여러 속성)가 필요한 경우 사용.
대표 사례: `ProductFeatures.tsx`

```tsx
<style dangerouslySetInnerHTML={{ __html: `
  @media (max-width: 960px) {
    .fai-card-01 { height: 640px !important; }
  }
  @media (max-width: 768px) {
    .fai-card-image-area {
      border-bottom-right-radius: var(--cornerRadius-M, 16px) !important;
    }
  }
`}} />
```

- CSS 미디어쿼리 내 `max-width`는 inclusive — `420px`, `960px` 그대로 사용.
- `!important`는 Tailwind 클래스 우선순위 충돌 방지를 위해 허용.

### 이중 버튼 분기 금지

`max-[421px]:hidden` / `min-[421px]:hidden`으로 동일 역할의 버튼 두 개를 분기하는 패턴 금지.
→ 단일 버튼 + breakpoint별 크기/스타일 변경으로 처리.

### ProgressBar 절대 위치 처리

`ProgressBar`는 내부에 `relative` 클래스가 고정되어 있어, `className`으로 `absolute` 전달 시 충돌.
**→ wrapper div에 절대 좌표를 적용하고, ProgressBar는 그 안에 배치.**

```tsx
<div className="absolute top-[var(--padding-2-xl,32px)] left-[var(--padding-2-xl,32px)] right-[var(--padding-2-xl,32px)]">
  <ProgressBar duration={3500} barClassName="h-[3px]" ... />
</div>
```

- 높이 오버라이드: `barClassName` prop (px 허용, spacing 토큰 불필요).
- 전환 속도와 맞추려면 `duration` prop 사용 (기본값 4000ms).

---

## 4. 아이콘 / SVG 시스템

### 규칙

- 인라인 SVG 금지 → **SVGR import 방식**만 사용.
- 아이콘 컴포넌트 경로: `@fai/ui/components/common/Icon/` — 로컬 복사 금지.
- SVG 내부 색은 `fill="currentColor"` → Tailwind className 또는 CSS로 색상 제어.
- 아이콘 SVG 내부 색은 디자인 에셋 고유값 예외: 그래픽 아이콘은 원본 fill 유지 가능.

### 파일명 규칙

- prefix 없이 의미명만: `bakery.svg`, `instagram-brand.svg` (review-, sns-, social- prefix 금지).
- 용도 구분이 필요한 경우 suffix 사용: `instagram-brand.svg` (브랜드 컬러) vs 단색 아이콘.

### 주요 아이콘 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `BenefitGraphic` | ProductBenefits 섹션 아이콘 |
| `ReviewIcon` | ProductReviews 섹션 카테고리 아이콘 |
| `EffectGraphic` | StoreEffects 섹션 아이콘 |
| `SocialIcon` | 소셜 링크 아이콘 |
| `ArrowUpIcon` | ScrollTopButton |
| `ChevronIcon` | 드롭다운/아코디언 |
| `GlobeIcon` | 언어 선택 |

---

## 5. 다크 모드

- **`<html class="dark">` 한 곳에서만** 적용.
- 컴포넌트 내 `dark:` Tailwind 접두어 **금지**.
- 다크/라이트 분기는 CSS 변수(시맨틱 토큰)가 자동 전환 — 컴포넌트는 토큰만 참조.
- 신규 토큰 필요 시 `globals.css`에 `:root`(light) / `.dark`(dark) 쌍으로 추가.

```css
/* globals.css 패턴 */
:root { --color-filled-basic-fourth: var(--color-gray-30); }
.dark  { --color-filled-basic-fourth: var(--color-gray-800); }
```

---

## 6. i18n 데이터 아키텍처

### locale 코드 규칙

- 항상 `ja` 사용 — `jp` 절대 금지 (ISO 639-1, `/jp/` 라우팅 → 404).
- 로케일: `ko`(기본) / `en` / `ja`.

### site.ts vs messages JSON 분리 기준

| 데이터 종류 | 위치 |
|---|---|
| 이미지 경로, href, 날짜, 태그 | `config/site.ts` |
| title, description, quote (번역 대상) | `messages/ko.json`, `en.json`, `ja.json` |

- 뉴스·리뷰 추가/삭제 시 **두 곳 모두** 수정 필요.

### messages JSON 키 구조

배열은 숫자 문자열 키 객체로 표현:

```json
"quote": {
  "0": { "text": "앞 문장 " },
  "1": { "text": "강조 단어" },
  "2": { "text": " 뒷 문장" }
}
```

- `emphasis: true`는 `site.ts`의 quote 배열에만 존재 (messages JSON에는 없음).
- 뉴스 기사 제거 시 이후 키를 재번호 처리해야 카드 순서 유지.

---

## 7. @fai/ui 컴포넌트 주의사항

### LogoMarquee

- 로고 간격: `gapClassName` prop — 현재 `"gap-5xl"` (80px).

### ProgressBar

- 높이: `barClassName` prop (예: `barClassName="h-[3px]"`).
- 전환 시간: `duration` prop (기본 4000ms — ShowcaseSection에서 3500ms 사용).
- 절대 위치 필요 시 wrapper div 사용 (className으로 absolute 전달 불가).

---

## 8. GA 분석 이벤트 아키텍처

- **`lib/analytics/track.ts` 단일 소스** — `trackEvent()` 함수만 사용.
- SSR no-op 가드 필수: `typeof window === "undefined"` 체크 (정적 export 프리렌더 시 `window` 미존재 크래시 방지).
- `@fai/ui` 컴포넌트는 분석 비종속 — 제네릭 콜백 prop만 받고, GA 이벤트명은 절대 포함하지 않음.
- GA 이벤트명/파라미터는 homepage 브릿지(`NavigationBarBridge` 등)에서만 정의.

```ts
// 올바른 패턴 — homepage 브릿지에서 이벤트 정의
<NavigationBar onCtaClick={() => trackEvent("interest_click", { location: "nav" })} />

// 잘못된 패턴 — @fai/ui 내부에 GA 이벤트명 포함 금지
// (packages/ui에서 trackEvent 호출 금지)
```

---

## 9. React 안정성 / StrictMode 대응

### StrictMode 이중 호출 대응

- `useEffect` cleanup에서 ref를 리셋해 영구 고착 방지:

```tsx
useEffect(() => {
  let mounted = true;
  // ...
  return () => {
    mounted = false;
    animatingRef.current = false; // 리셋 필수
  };
}, []);
```

- `useMotionValueEvent` → `useEffect + scrollYProgress.on("change", cb)` 패턴 권장 (마운트 전 상태 업데이트 경고 방지).

### 스크롤 이벤트 리렌더 방지

스크롤 이벤트에서 상태가 실제로 바뀔 때만 `setState` 호출:

```tsx
// ref로 이전 상태 추적 → 변경 시에만 setState
const visibleRef = useRef(false);
lenis.on("scroll", ({ scroll }) => {
  const next = scroll > 100;
  if (next !== visibleRef.current) {
    visibleRef.current = next;
    setVisible(next);
  }
});
```

- 적용 컴포넌트: `NavigationBar`(`transparentRef`/`shadowRef`), `ScrollTopButton`(`visibleRef`), `HeroSection`(`expandedRef`).

---

## 10. 이미지/미디어 관리

### 경로 규칙

```
public/images/
├── products/
│   ├── vco/           # vision-check-out 이미지
│   ├── unmanned-store/
│   ├── industries/
│   └── review/
├── news/
├── customers/
└── about/

public/videos/
├── home/
└── product/
```

### 파일 네이밍

`{제품약어}-{섹션}-{의미}.{webp|mp4}` (kebab-case)
- 제품약어: `vco`(vision-check-out), `us`(unmanned-store)
- 예: `vco-feature-accuracy.webp`, `us-case-standard-cu.jpg`

### _original 파일

- `*_original.*` 파일은 git에는 포함, `out/` 빌드 출력에서 제외.
- 이미지 교체 시 `site.ts` 경로도 함께 수정.
- webp 권장, 비디오 mp4.

---

## 11. 제품 상세 페이지 (`/products/[slug]`) 규칙

### 적용 범위

- 라우트: `app/[locale]/products/[slug]/page.tsx`
- 현재 제품: `vision-check-out`, `unmanned-store`
- 신규 제품 추가 시 이 패턴을 그대로 따른다.

### 디렉터리 구조

```
components/
├── layout/
│   └── HeroShell.tsx              # Hero 공통 골격 (products/ 아님)
└── sections/
    └── products/                  # /products/[slug] 전용 섹션
        ├── ProductHero.tsx        # video Hero
        ├── ProductFeatures.tsx
        ├── ProductBenefits.tsx
        ├── ProductIndustries.tsx
        ├── ProductReviews.tsx
        ├── StoreHero.tsx          # image Hero
        ├── StoreEffects.tsx
        ├── StoreTypes.tsx
        ├── StoreInteractiveContainer.tsx
        └── StoreCaseStudies.tsx
```

- 섹션 전용 아이콘: `@fai/ui/components/common/Icon/` 수급 (`BenefitGraphic`, `ReviewIcon`).
- 공통부품(`NavigationBar`, `Footer`)은 `@fai/ui`에서 수급 — 이 폴더에 두지 않는다.

### 콘텐츠 SoT

모든 텍스트·이미지 경로·구성 데이터는 `config/site.ts`의 `products[slug]`에만 둔다.

```ts
products: {
  "vision-check-out": {
    slug, label,
    heroType: "video", heroVideo: "/videos/product/vco-hero-bg.mp4", heroImage: "",
    heroSubtitle, heroTitle, ctaLabel,
    featuresTitle, features: [...],
    benefitsTitle, benefits: [...],
    industriesTitle, industriesDescription, industries: [...],
    reviewsTitle, reviews: [...],
    // store 전용 — 빈 값으로 타입 일치
    effectsTitle: "", effectCards: [], effectList: [],
    storeTypes: [], caseStudiesEyebrow: "",
    caseStudies: { standard: [], micro: [] },
  },
  "unmanned-store": {
    heroType: "image", heroVideo: "", heroImage: "/images/products/unmanned-store/store-hero.webp",
    // ...
    caseStudies: { standard: [...], micro: [...] },
  },
}
```

- 컴포넌트는 콘텐츠를 하드코딩하지 않고 props로만 받는다.
- 콘텐츠 변경 시 `site.ts`만 수정, 컴포넌트는 건드리지 않는다.
- 두 제품의 데이터 필드는 동일하게 유지. 한쪽에만 있는 섹션은 빈 값으로 채워 타입 일치.

### Next.js 정적 export 주의사항

- `generateStaticParams`는 반드시 `locale × slug` 전체 조합을 반환해야 함.
  - `slug`만 반환 시 `/ko|en|ja/products/*` 404 발생.

```ts
export async function generateStaticParams() {
  return locales.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}
```

- Turbopack SVGR 설정은 `next.config.ts`의 `turbopack.rules`에 별도 추가 필요 (`webpack()` 설정은 Turbopack에서 무시됨).

### 섹션 컴포넌트 규칙

- 데이터(배열)가 비면 `null` 반환 → 제품별 섹션 노출이 데이터로 제어.
- `page.tsx`는 모든 섹션을 나열, 노출 여부는 컴포넌트의 null 가드에 위임.
- Hero 분기:

```tsx
{product.heroType === "video"
  ? <ProductHero videoSrc={...} ... />
  : <StoreHero  imageSrc={...} ... />}
```

- 공통화는 패턴이 2회 이상 반복 확인 후 진행. 단일 사용 시 선제 추상화 지양.

### 인터랙션 / 클라이언트 컴포넌트

- 탭 전환·캐러셀·뷰포트 재생 등 상태 필요 섹션만 `"use client"`.
- 정적 섹션은 서버 컴포넌트 유지.
- 자동재생 미디어는 뷰포트 진입 시에만 재생(`IntersectionObserver`). `@fai/ui`의 `InViewVideo` 사용.
- `prefers-reduced-motion` 시 `behavior: "smooth"` → `"auto"` 폴백.

### 데이터 누락 대응

- 확인 안 된 값(이미지 경로, 미확정 텍스트)은 추측 금지 → `"MISSING_FROM_DESIGN"` 표기.
- 이미지 `src`는 `image.startsWith("/")` 가드로 렌더 보호.
- 작업 완료 후 "⚠️ 데이터 누락 알림: [섹션]에서 [항목] 확인 필요" 출력.

### 보호 불변식 — 수치 포함

아래는 제품 페이지 작업 중 건드리지 않는다.

**HeroSection 핵심 수치**
- 섹션 높이: `h-[180vh]`
- Lenis Snap 기준 비율: `EXPANDED_STOP = 0.5`
- Snap 설정: proximity 타입, 30% 거리 임계값, 1.4s duration, easeOutExpo
- Dim overlay: `rgba(0,0,0,0.25)`
- NavBar 색상 전환: 확장 애니메이션 90% 시점(540ms)에 전환, `navTimerRef`로 타이머 관리

**ProductFeatures 카드 반응형 수치**
- `>960px`: padding `--padding-3-xl` (40px)
- `≤960px`: height 640px, padding 32px
- `≤768px`: height 435px, 이미지 `aspect-ratio: 420/291`
- `≤420px`: 카드 435px, 이미지 고정 291px

**ShowcaseSection 고정 수치**
- 자동 전환 속도: 3500ms
- 슬라이드 애니메이션: 400ms ease-in-out
- 텍스트 타이틀 min-h: 모바일 112px / 데스크탑 136px
- 패딩: `var(--padding-2-xl, 32px)`, 420px 이하 `var(--padding-XL, 24px)`

**ProductReviews**
- 카드 이미지 `≤960px`: `flex:1 + aspect-ratio: 613/460`

**기타**
- `NavigationBar` opacity crossfade 로직
- `next-intl` locale 라우팅 로직
- 메인(`home`) 섹션 및 공통 컴포넌트
- `lib/localeScroll.ts` 스크롤 복원 로직 (로케일 전환 시 sessionStorage 저장/복원)
