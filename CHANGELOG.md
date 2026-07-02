# 📑 CHANGELOG

모든 시스템의 변경 사항은 역순(최신순)으로 기록합니다.

## [3.5.0] - 2026-07-01

### ✨ Added

#### GA4 버튼 클릭 이벤트 계측
- 3종 커스텀 이벤트 `interest_click`(관심) / `lead_acquisition_click`(잠재) / `inquiry_complete`(문의완료)를 12개 지점(네비·홈·제품·미디어·푸터·문의, 데스크톱+모바일)에 계측
- 공통 파라미터 `location`/`label`, gtag 접점은 `lib/analytics/track.ts` 단일 소스
- 공용 `@fai/ui`는 분석 비종속(제네릭 콜백 prop), GA 명칭은 homepage 브릿지에만
- dataLayer 실측 검증 10/10 통과

#### 문의 폼 Zapier 전송 연동
- `ContactUsSection` 제출 시 라이브 `contact-us`와 동일한 Zapier 웹훅으로 전송 (`lib/contact/payload.ts`)
- 관심사 → `solution[]`, 세부 항목 → `content` 자동 생성, `utm_*`/`referrer` 캡처
- 포맷: form-urlencoded + JSON.stringify body (Zap 매핑 호환). 실전 전송 5건 200/success 검증

#### 로케일별 SEO 메타데이터
- `config/site.ts` `seo` 맵(ko/en/ja) → title/description/keywords/OG를 `[locale]/layout.tsx`에서 로케일별 생성
- `<html lang>` 로케일별, hreflang(ko/en/ja + x-default=ko), OG 이미지 1200×630

#### 테스트 인프라
- vitest + @testing-library/react + jsdom 도입, 순수 로직·문의 폼 흐름 테스트

### 🔄 Changed

- **일본어 로케일 코드 `jp` → `ja`** (ISO 639-1 준수, 국가코드 오용 교정). `/jp/*` 경로 제거
- 루트 레이아웃을 `app/[locale]/layout.tsx`로 병합(로케일별 `<html lang>`), `app/layout.tsx` 제거
- `@fai/ui` NavigationBar·MegaNavMenu·Menu·Footer·TabletDrawerMenu에 옵셔널 분석 콜백 prop 추가(하위 호환)

### 🐛 Fixed

- `trackEvent` SSR no-op 가드 — 정적 export 프리렌더 시 `window` 미존재 크래시 방지
- `CtaBanner` "도입 문의하기" CTA가 로케일 누락으로 404 → locale-aware 라우팅
- `@fai/ui` Footer SNS 링크에 `target="_blank"`/`rel` 추가(새 탭)
- 죽은 코드 정리: 로컬 `Footer.tsx`·고아 `ScrollTopButton.tsx`·미사용 `siteConfig.fullName` 제거

## [3.4.2] - 2026-06-24

### 🐛 Fixed

#### WhyFaiSection 비디오 좌우 검정 프레임
- `WhyFaiSection` — 호버 시 비디오 좌우 촬영 환경 노출 버그 수정
  - 원인: 비디오(800×694)와 카드(364×320) 비율이 근접해 `object-cover`가 영상 전체 너비를 노출
  - 수정: `scale-[1.15]` 적용 → 좌우 각 7.5% 확대 크롭, 래퍼 `overflow-hidden`으로 클리핑

### 🔄 Changed

#### 회사소개 페이지 섹션 레이아웃
- `AboutHero`, `AboutManagement`, `AboutPartners`, `AboutPeople`, `AboutLogos` — 1440px 이상 뷰포트에서 콘텐츠 중앙 정렬 적용 (`max-w-[1440px] mx-auto`)
- `AboutPeople` 가로 스크롤 컨테이너: 1440px 이상에서 `pl-[calc(((100vw-1440px)/2)+var(--padding-8XL))]`로 시작점 동기화

#### AboutPeople 카드 링크
- `target="_blank"` → 동일 창 이동으로 변경, 뒤로가기 스크롤 위치 복원 (`sessionStorage` + `setTimeout`)

#### 푸터 SNS 링크
- LinkedIn / YouTube / Instagram href를 실제 채널 URL로 업데이트 (`Footer.tsx`, `footer/Footer.tsx` 동시 반영)

#### ContactUsSection 토스트
- 768px 이하: 아이콘 숨김, 텍스트 "카카오톡 채널로 문의하세요"
- 420px 이하: 토스트 제거, 풀너비 버튼만 노출 (dark 토큰 적용)
- 토스트 패딩 768px 이하 한 단계 낮춤

#### AboutManagement CTO 학력
- "서울대학교 전기컴퓨터공학 학사/박사(Ph.D)" → 줄바꿈 적용 (`\n`)

## [3.4.1] - 2026-06-24

### 🔄 Changed

#### 미디어 페이지 섹션 레이아웃
- `ShowcaseSection`, `NewsSection`, `RetailTechLetterSection` — 1440px 이상 뷰포트에서 콘텐츠 중앙 정렬 적용
  - `section`은 `w-full` + 배경색만 유지 (배경 풀 뷰포트)
  - 내부 래퍼 `div`에 `max-w-[1440px] mx-auto` 추가, 기존 패딩/gap/pt/pb 값 그대로 유지

## [3.4.0] - 2026-06-24

### ✨ Added

#### 디자인 토큰 신규
- `products/homepage/app/globals.css` — `--color-icon-optional-brand-primary` 시맨틱 토큰 추가 (light: `--color-green-600`, dark: `--color-green-500`)

### 🔄 Changed

#### 아이콘 폴더 승격 (packages/ui)
- `packages/ui/components/common/Icon/` — `products/homepage/components/common/Icon/` 전체 이동 (ArrowUpIcon, BenefitGraphic, ChevronIcon, EffectGraphic, GlobeIcon, IcArrowRight16, IcRequiredDot, ReviewIcon, SocialIcon 9개 파일)
- import 경로 7개 파일 일괄 교체: `@/components/common/Icon/` → `@fai/ui/components/common/Icon/` (LanguageSwitcher, ShowcaseSection, ScrollTopButton, ContactUsSection, ProductBenefits, ProductReviews, StoreEffects)

#### SVG → SVGR 전환 (인라인 SVG 제거)
- `ReviewIcon.tsx` — 인라인 SVG → `bakery.svg`, `cafeteria.svg`, `resort.svg` SVGR import
- `SocialIcon.tsx` — 인라인 SVG → `linkedin-brand.svg`, `instagram-brand.svg` SVGR import
- `ArrowUpIcon.tsx` — 인라인 SVG → `arrow-up.svg` SVGR import (기본 className `w-[24px] h-[24px]`)
- `ChevronIcon.tsx` — 인라인 SVG → `chevron-down.svg` SVGR import (`open` prop → `rotate-180` className)
- `GlobeIcon.tsx` — 인라인 SVG → `globe.svg` SVGR import
- `IcArrowRight16.tsx` — 인라인 SVG → `ic-arrow-right-16.svg` SVGR import
- `IcRequiredDot.tsx` — 인라인 SVG → `ic-required-dot.svg` SVGR import; `className="text-[var(--color-icon-optional-brand-primary)]"` 컬러 토큰 적용

#### SVG 파일명 정리
- `review-bakery.svg` → `bakery.svg`, `review-cafeteria.svg` → `cafeteria.svg`, `review-resort.svg` → `resort.svg` (review- prefix 제거)
- `sns-instagram.svg` → `instagram.svg`, `sns-linkedin.svg` → `linkedin.svg`, `sns-youtube.svg` → `youtube.svg` (sns- prefix 제거)
- `social-instagram.svg` → `instagram-brand.svg`, `social-linkedin.svg` → `linkedin-brand.svg` (social- prefix 제거, brand 구분 명칭)

#### SVG currentColor 전환
- `root/assets/icon/arrow-up.svg` — `fill="white"` → `fill="currentColor"`
- `root/assets/icon/ic-required-dot.svg` — `fill="var(--fai-bg-brand)"` → `fill="currentColor"`
- `root/assets/icon/bakery.svg`, `cafeteria.svg`, `resort.svg` — 컬러 fills → `fill="currentColor"`
- `root/assets/icon/file.svg`, `window.svg`, `next.svg`, `vercel.svg` — `#666`/`#000`/`#fff` → `fill="currentColor"`

#### Turbopack SVGR 설정
- `products/homepage/next.config.ts` — Turbopack용 `turbopack.rules` 최상위 키 추가 (`*.svg` → `@svgr/webpack` 로더); Webpack `webpack()` 설정은 Turbopack에서 무시되므로 별도 분리

#### StoreEffects import 정정
- `products/homepage/components/sections/products/StoreEffects.tsx` — `EffectIcon` → `EffectGraphic` import 및 타입 캐스팅 교체

#### 문의하기 ContactUsSection 반응형·UX 개선
- **진입 스크롤** — 문의하기 버튼 클릭 후 진입 시 항상 최상단(`lenisRef.current.scrollTo(0, { immediate: true })`)으로 뷰포트 열리도록 `useEffect` 추가
- **완료 스크롤** — 폼 제출 후 완료 화면 전환 시 `sectionRef` 기준 → 절대 최상단(`0`) 스크롤로 수정
- **완료 화면 폰트** — h2: ≤768px `28px/42px`, ≥769px `36px/54px`; p: ≤768px `18px/27px`, ≥769px `20px/30px`
- **완료 화면 패딩** — ≤960px `px-[var(--padding-XL)]`, ≥961px `px-0`

### 🐛 Fixed

#### React 상태 업데이트 에러 해결
- `products/homepage/components/sections/home/AnimatedStat.tsx` — `let mounted = true` 마운트 가드 + cleanup에서 `startedRef.current = false` 리셋 추가 (Strict Mode 이중 호출 대응)
- `products/homepage/components/sections/home/HeroSection.tsx` — `useMotionValueEvent` → `useEffect` + `scrollYProgress.on("change", cb)` 교체 (마운트 전 상태 업데이트 경고 제거)

---

## [3.3.0] - 2026-06-23

### 🐛 Fixed

#### 언어 전환 라우팅
- `packages/ui/components/navigation/LanguageSwitcher.tsx` — `next/navigation` 의존성 제거, `onLocaleChange: (code: string) => void` 콜백 prop 추가. 라우팅 로직을 컴포넌트 외부로 분리해 next-intl 미인식 문제 해결
- `NavigationBarBridge.tsx` — `useRouter` + `usePathname` from `@/i18n/navigation` 추가, `handleLocaleChange`에서 `router.push(pathname, { locale: code })` 호출 → 모바일 언어 전환도 next-intl 라우터 사용
- `products/homepage/components/layout/LanguageSwitcher.tsx` — `handleSelect`에 `if (code === locale) { setOpen(false); return; }` 가드 추가: 현재 언어 재클릭 시 라우팅 이벤트 방지 (모바일은 기존 가드 유지)

---

## [3.2.0] - 2026-06-23

### ✨ Added

#### ShowcaseSection 자동 슬라이드
- `ShowcaseSection.tsx` — `useEffect` + `setTimeout(5000ms)` 기반 자동 전환 타이머 추가: `index` 변경 시 타이머 리셋, 마지막 → 첫 번째 무한 루프, 화살표·프로그레스바 수동 클릭 시에도 타이머 재시작
- `ShowcaseSection.tsx` — `ProgressBar`에 `duration={DURATION}` 전달해 게이지 애니메이션과 자동 전환 시간 동기화

### 🔄 Changed

#### ProgressBar 게이지 애니메이션 (B 방식)
- `packages/ui/components/ProgressBar.tsx` — `i <= activeIndex ? w-full : w-0` 단순 토글 → 3단계 분기로 변경
  - `i < activeIndex`: `w-full` 즉시 완료
  - `i === activeIndex`: `@keyframes fai-progress-fill` CSS 애니메이션으로 0%→100% 서서히 채워짐, `key={fill-${activeIndex}}`로 인덱스 변경 시 애니메이션 재시작 보장
  - `i > activeIndex`: div 미렌더 (빈 상태)
- `duration` prop 추가 (기본값 `4000ms`) — 호출부에서 채워지는 시간 조정 가능

#### next.config.ts
- `images.remotePatterns`에 `{ protocol: "https", hostname: "i.ytimg.com" }` 추가 — YouTube 동적 썸네일 Next.js `<Image>` 안전 로드 허용

---

## [3.1.0] - 2026-06-23

### 🔄 Changed

#### 반응형 타이포그래피
- `HeroSection.tsx`, `ProductHero.tsx`, `HeroShell.tsx`(StoreHero), `AboutHero.tsx` — Hero 섹션 타이틀 폰트 사이즈 통일: ≤768px `text-title-xl`(48px), ≤420px `max-[420px]:text-title-l`(36px), ≥769px 기존 tablet/desktop 위계 유지

#### 반응형 레이아웃
- `HeroSection.tsx` — 비디오 확장 구간 타이틀↔CTA 간격 `gap-l` → `gap-[var(--spacing-2XL,32px)]`
- `ProductHero.tsx` — 동일 간격 `gap-l` → `gap-[var(--spacing-2XL,32px)]` (≤768px)
- `CtaBanner.tsx` — 960이하 단일 컬럼 대응: `tablet:` → `min-[961px]:`, `<br>` ≤768px에서만 표시
- `StoreTypes.tsx` — 1440이상 콘텐츠 중앙 고정 (`desktop:max-w-[1440px] desktop:mx-auto`), ≤960px 카드 높이 상단 540px·하단 320px
- `StoreEffects.tsx` — 내부 컨테이너 좌우 패딩 `min-[961px]:px-[var(--padding-6-xl,100px)]`, ≥1440px 중앙 고정; 카드·아코디언 패딩 `p-xl desktop-s:p-4xl`
- `ProductReviews.tsx` — 1440이상 타이틀 정렬 `desktop:pl-[calc((100vw_-_1440px)_/_2_+_var(--padding-8XL))]` + `desktop:scroll-pl-[...]`
- `ContactUsSection.tsx` — 상단 패딩 `pt-[var(--padding-8-xl,_150px)]` → `pt-6xl`(100px, ≤960px) / `desktop-s:pt-[200px]`(≥961px) 분리
- `AboutManagement.tsx`, `AboutPeople.tsx`, `AboutPartners.tsx` — h2 `max-[420px]:text-title-m` 추가
- `AboutLogos.tsx` — caption `max-[420px]:text-body-s` 추가

#### 디자인 토큰 점검·교체
- `ScrollTopButton.tsx` — `rounded-[999px]` → `rounded-fai-circle`, `right/top-[56px]` → `right/top-4xl`
- `Toast.tsx` — `rounded-[999px]` → `rounded-fai-circle`, titleSection↔버튼 `gap-m` 추가
- `ContactUsSection.tsx` — `rounded-[999px]` → `rounded-fai-circle`, toast 컨텐츠 `gap-m` 추가
- `Tabs.tsx` — `gap-[32px]` → `gap-2xl`, `gap-[8px]` → `gap-s`, `px-[24px]` → `px-xl`
- `StoreCaseStudies.tsx` — `gap-[4px]` → `gap-2xs` (2개소)
- `StoreTypes.tsx` — `gap-[4px]` → `gap-2xs`
- `NewsSection.tsx` — `gap-[12px]` → `gap-ms`
- `Footer.tsx` (legacy) — `gap-[40px]` → `gap-3xl`, `md:py-[56px]` → `md:py-4xl`, `md:px-[150px]` → `md:px-[var(--padding-8XL)]`
- `packages/ui/footer/Footer.tsx` — `py-[56px] px-[150px]` → `py-4xl px-[var(--padding-8XL)]`, `pb-[56px]` → `pb-4xl`

#### 코드 최적화 (기능·구조 변경 없음)
- `EfficiencySection.tsx` — inline style 객체 12개 → 1개로 축소: dead code(`statsWrapperStyle`, `statContainerStyle`) 제거, layout-only style 객체 5개 → className으로 이동, color/typography style 4개 단순화
- `ProductFeatures.tsx` — Card 0·1 동일 JSX 중복 → `CARD_BG` 상수 + `if (i < 2)` 단일 코드 경로로 통합 (~25줄 제거)
- `packages/ui/footer/Footer.tsx` — 데스크톱 row1·row2 동일 렌더링 → `InfoRow` 컴포넌트 추출
- `ContactUsSection.tsx` — Figma Dev Mode 잔여 `data-node-id` 속성 14개 제거

#### ContactUsSection 추가 개선
- toast 768이하 텍스트 → "카카오톡 채널로 간편 문의하세요" (`tablet:hidden`/`hidden tablet:block` 분기)

#### packages/ui/footer 신규 파일
- `packages/ui/components/footer/Footer.tsx`, `footer.css` — 반응형 토글 CSS 기반 Footer 컴포넌트 신규 추가 (>960px 데스크톱 / ≤960px compact 레이아웃 분리; `fai-footer__` BEM 클래스; ScrollTopButton ≤420px 숨김)

---

## [3.0.0] - 2026-06-22

### 🔄 Changed
- `products/homepage/components/sections/products/ProductIndustries.tsx` — 768px 이하 카드 세로 스택, 타이틀/본문 폰트 반응형 축소, 좌우 버튼 768px 이하 숨김
- `products/homepage/components/sections/products/ProductReviews.tsx` — 960px/768px 반응형 CSS 블록 추가 (카드 너비 `min()` 함수 반응형, 768px 이하 세로 배치·이미지 하단 정렬, 폰트 단계 축소)
- `products/homepage/components/sections/products/StoreEffects.tsx` — 상단 3열 카드 768px 이하 세로 전환, 960px/768px 패딩·폰트 반응형 단계 축소, 아코디언 리스트 반응형 패딩 적용
- `products/homepage/components/sections/products/StoreTypes.tsx` — 960px/768px/420px 폰트 단계 축소, 420px 이하 1열 그리드 전환, 카드 높이·패딩 반응형 대응 (`max-[420px]:grid-cols-1`, `max-[420px]:h-[536px]`, `max-[768px]:p-3xl`, `max-[420px]:p-xl`)
- `products/homepage/components/ui/Tabs.tsx` — 960px/768px 탭 폰트·패딩·보더 반응형 축소 (`var(--w-title-S-size)`, `var(--padding-ms)`, `border-b-[3px]`)
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — 상단 패딩 200px, 960px/1280px 좌우 패딩 단계 대응, 420px 이하 타이틀·폼 텍스트 폰트 축소, 토스트 본문 420px 이하 숨김
- `products/homepage/components/sections/media/NewsSection.tsx` — 768px 이하 1열 그리드 전환, 카드 이미지 높이 367px 고정
- `packages/ui/components/NavigationBar.tsx` — active 텍스트 색상 버그 수정, font-bold inner span 이동
- `packages/ui/components/navigation/TabletDrawerMenu.tsx` — 드로어 메뉴 구조 개선
- `packages/ui/components/navigation/LanguageSwitcher.tsx` — 언어 스위처 로직 개선
- `packages/ui/components/ui/Drawer.tsx` — Drawer 컴포넌트 개선
- `packages/ui/index.ts` — export 업데이트

### 🗑️ Removed
- `packages/ui/components/navigation/TabletNavigationBar.tsx` — TabletNavigationBar 컴포넌트 삭제 (통합)

---

## [2.9.0] - 2026-06-22

### ✅ Added
- `packages/ui/components/navigation/MegaMenuPanel.tsx` — MegaNav 패널 컴포넌트 신규 생성
- `packages/ui/components/Scrollbar.tsx` — 공통 Scrollbar 컴포넌트 신규 생성
- `products/homepage/app/[locale]/about/` — About 페이지 신규 생성
- `products/homepage/app/[locale]/contact/` — Contact 페이지 신규 생성
- `products/homepage/app/[locale]/media/` — Media 페이지 신규 생성
- `products/homepage/app/[locale]/playground/` — Playground 페이지 신규 생성
- `products/homepage/assets/icon/ArrowUpIcon.tsx`, `BenefitIcon.tsx`, `ChevronIcon.tsx`, `EffectIcon.tsx`, `GlobeIcon.tsx`, `IcArrowRight16.tsx`, `IcRequiredDot.tsx`, `SocialIcon.tsx` — 아이콘 컴포넌트 다수 신규 생성
- `products/homepage/components/sections/products/StoreCaseStudies.tsx`, `StoreEffects.tsx`, `StoreHero.tsx`, `StoreInteractiveContainer.tsx`, `StoreTypes.tsx` — 스토어 섹션 컴포넌트 신규 생성
- `products/homepage/components/sections/CtaBanner.tsx` — CTA 배너 섹션 신규 생성
- `products/homepage/config/types.ts` — 공통 타입 정의 신규 추가
- `products/homepage/i18n/`, `messages/` — 다국어 라우팅 및 메시지 파일 추가
- `products/homepage/components/ui/` — 공통 UI 컴포넌트 디렉토리 신규 생성

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx` — 네비게이션 바 스크롤 인터랙션 및 상태 로직 개선
- `packages/ui/components/navigation/MegaNavMenu.tsx` — MegaNav 메뉴 구조 및 렌더링 개선
- `packages/ui/components/LineInput.tsx` — LineInput 컴포넌트 전면 리팩토링
- `packages/ui/components/HoverDropdown.tsx` — HoverDropdown 인터랙션 개선
- `packages/ui/components/ui/Drawer.tsx` — Drawer 컴포넌트 개선
- `packages/ui/components/Header.tsx` — Header 컴포넌트 수정
- `packages/ui/components/Footer.tsx` — Footer 컴포넌트 수정
- `packages/ui/index.ts` — 신규 컴포넌트 export 추가
- `packages/ui/package.json` — 패키지 의존성 업데이트
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — Contact 폼 대규모 리팩토링 (레이아웃·유효성 검사·UX 전면 개편)
- `products/homepage/components/sections/products/ProductHero.tsx` — Hero 섹션 레이아웃 및 콘텐츠 개선
- `products/homepage/components/sections/products/ProductBenefits.tsx` — Benefits 섹션 리팩토링
- `products/homepage/components/sections/products/ProductFeatures.tsx` — Features 섹션 구조 정리
- `products/homepage/components/sections/products/ProductIndustries.tsx` — Industries 섹션 개선
- `products/homepage/components/sections/products/ProductReviews.tsx` — Reviews 섹션 리팩토링
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — 제품 상세 페이지 섹션 조립 업데이트
- `products/homepage/assets/icon/ReviewIcon.tsx` — ReviewIcon 컴포넌트 리팩토링
- `products/homepage/config/site.ts` — 사이트 설정 데이터 업데이트
- `products/homepage/tailwind.config.ts` — Tailwind 설정 업데이트

---

## [2.8.0] - 2026-06-20

### ✅ Added
- `products/homepage/components/sections/home/EfficiencySection.tsx` — 홈 Efficiency 섹션 신규 생성 (풀스크린 비디오 배경·scrim·`AnimatedStat` 3단 스탯; 반응형 padding·타이포; `pinDuration` prop)

### 🔄 Changed
- `products/homepage/app/[locale]/page.tsx` — `EfficiencySection` 조립; `HeroSection`에 `clientLogos` 파트너 로고 전달; `CustomersSection` `linkHref`를 VCO 리뷰 앵커(`/products/vision-check-out#product-reviews`)로 연결
- `products/homepage/components/layout/NavigationBarBridge.tsx` — `desktopLangSwitcher`·`mobileLangSwitcher` prop으로 homepage `LanguageSwitcher` 데스크톱/모바일 variant 주입
- `packages/ui/components/NavigationBar.tsx` — 제품 상세(`isProductDetail`) 히어로 구간(100vh) 스크롤 투명 헤더; 미디어(`isMedia`) 페이지 항상 라이트 배경 고정; 초기 `isTransparent`를 `!isHome && !isMedia`로 조정
- `products/homepage/components/sections/products/StoreCaseStudies.tsx` — `cases` 변경 시 `active` 인덱스 `useEffect`로 리셋

---

## [2.7.0] - 2026-06-19

### ✅ Added
- `packages/ui/components/navigation/TabletNavigationBar.tsx` — 태블릿(768–960px) 전용 독립 헤더 컴포넌트 전면 재설계 (`logo`, `isDarkMode`, `renderDrawer` props; 내부 open 상태 관리; 햄버거/X 토글; pathname 변경 시 드로어 자동 닫기; 다크/라이트 모드 배경색 분기)
- `packages/ui/components/navigation/TabletDrawerMenu.tsx` — 태블릿 드로어 메뉴 컴포넌트 신규 생성 (아코디언 드롭다운, 외부 링크, 내부 링크 처리; locale prefix 자동 부착)
- `packages/ui/components/navigation/LanguageSwitcher.tsx` — 태블릿 언어 전환 컴포넌트 신규 생성 (KR/EN/JP 인라인 버튼; `isDarkMode` 다크/라이트 텍스트 컬러 분기; `next/navigation` + `useLocale` 기반 locale 전환)
- `packages/ui/package.json` — `next-intl >=4` peerDependency 추가

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx` — 태블릿 구간 아키텍처 분리: 메인 `<header>` `tablet:hidden min-[961px]:block` 적용, 독립 `TabletNavigationBar` 사이드카 렌더링, 모바일 `Drawer` 단순화 (`GlobalUtilityMenu` 전용)
- `packages/ui/components/Header.tsx` — 태블릿 구간 `TabletNavigationBar` 연결 정리 (신규 인터페이스 대응)
- `packages/ui/index.ts` — `TabletNavigationBar`, `TabletDrawerMenu`, `LanguageSwitcher` export 추가; 구 `TabletNavItem` 타입 제거
- `products/homepage/components/sections/products/StoreEffects.tsx` — `EffectIcon name` prop `as EffectIconKey` 타입 캐스팅으로 빌드 에러 수정
- 드로어(태블릿/모바일) 내부 언어 전환 영역(`langRow`) 제거 — `TabletDrawerMenu`, `GlobalUtilityMenu` 에 `langRow` 미전달

---

## [2.6.0] - 2026-06-19
### ✅ Added
- `packages/ui/components/Scrollbar.tsx` — 스크롤 영역 래퍼 원자 컴포넌트 (`forwardRef`, padding·overflow-auto 토큰 명세)
- `products/homepage/assets/icon/EffectIcon.tsx` — StoreEffects 효과 카드 아이콘 팩토리 (인건비 절감·결제 무인화·원격 운영 가능)
- `products/homepage/assets/icon/GlobeIcon.tsx` — LanguageSwitcher 글로벌 아이콘
- `products/homepage/assets/icon/SocialIcon.tsx` — ShowcaseSection LinkedIn·Instagram 아이콘 팩토리
- `products/homepage/assets/icon/ChevronIcon.tsx` · `ArrowUpIcon.tsx` — 네비·CTA용 화살표 아이콘
- `products/homepage/app/globals.css` — 전역 커스텀 스크롤바 스타일 (`::-webkit-scrollbar`, `scrollbar-color` thin)

### 🔄 Changed
- `packages/ui/components/ui/Drawer.tsx` — 모바일 드로어 본문 `div` → `Scrollbar` 래퍼로 교체
- `packages/ui/index.ts` — `Scrollbar`·`ScrollbarProps` export 추가
- `packages/ui/components/LineInput.tsx` — `forwardRef` 전환; `maxLength`·`onBlur` prop 추가; 피그마 명세 패딩·border·helpText 레이아웃 정밀 교정
- `products/homepage/components/sections/products/ProductBenefits.tsx` — `motion.div` + `scrollFadeInUp` 스프링 진입 애니메이션; `container`·semantic spacing 토큰 (`gap-7xl`, `sticky top-7xl`)
- `products/homepage/components/sections/products/StoreEffects.tsx` — 인라인 SVG → `EffectIcon` 팩토리 연동
- `products/homepage/components/layout/LanguageSwitcher.tsx` — `GlobeIcon` 글로벌 에셋 import
- `products/homepage/components/sections/media/ShowcaseSection.tsx` — `SocialIcon` 팩토리로 SNS 아이콘 통합
- `products/homepage/config/site.ts` — VCO `heroVideo`·benefit 루프 영상 경로 실제 에셋 바인딩; `clientLogos` Orange Planet 추가; unmanned-store 히어로 `store-hero.png`; contact `complete` 블록·`bg-gradation-n.png` 경로
- `packages/ui/components/Footer.tsx` — 대표이사 표기 `함명원ㆍ왕민권`으로 업데이트

---

## [2.5.0] - 2026-06-18
### ✅ Added
- `packages/ui/components/navigation/MegaMenuPanel.tsx` — 메가 메뉴 범용 패널 컴포넌트 신규 생성 (CSS background + 그라데이션 오버레이, `bgStyle` per-item 배경 포지션/사이즈, hover 시 brand primary 컬러 + scale 애니메이션, `MegaMenuItemData` / `MegaMenuPanelProps` 타입 export)
- `products/homepage/components/ui/ProductMegaMenu.tsx` — 제품 메가 메뉴 래퍼 컴포넌트 신규 생성 (locale prefix 처리 후 `MegaMenuPanel` 주입)
- `packages/ui/index.ts` — `MegaMenuPanel`, `MegaMenuItemData`, `MegaMenuPanelProps` export 추가
- `products/homepage/config/site.ts` — `productMenu` 배열 SoT 추가 (VISION CHECK-OUT / UNMANNED STORE; 이미지 경로 + `bgStyle` 포지션 데이터 포함)
- `products/homepage/tailwind.config.ts` — `boxShadow` extend 블록 추가 (XS/S/M/L/XL/XXL → `var(--shadow-*)` 토큰); spacing `ml/5xl/6xl/7xl/8xl/9xl` 토큰 추가

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx`
  - `navItems?: readonly NavItem[]` prop 추가 — 미지정 시 내부 `NAV_ITEMS` 사용, homepage에서 `megaMenuPanel` 주입 가능하도록 오버라이드 지원
  - 우측 액션 div `self-stretch` 추가 → LanguageSwitcher가 헤더 전체 높이를 채워 `top: 100%` = 헤더 하단 정렬 보장
- `packages/ui/components/hover-dropdown/HoverDropdown.tsx`
  - `wrapperClassName?` prop 추가 — 지정 시 기본 `"relative"` 제거, 메가 메뉴 패널의 containing block을 `<header>`(position: fixed)로 상승시킬 때 사용
  - `panelClassName?` prop 추가 — 패널 위치/크기 완전 오버라이드 가능
- `packages/ui/components/navigation/MegaNavMenu.tsx`
  - `NavItem`에 `megaMenuPanel?: ReactNode` 필드 추가
  - `megaMenuPanel` 지정 시 `HoverDropdown` 브랜치로 분기 렌더링 (패널 위치: `top-[calc(100%+var(--spacing-2XS,4px))] left-xl right-xl desktop:left-[150px] desktop:right-[150px]`)
  - 트리거 버튼 active `font-bold` → inner `<span>`으로 이동 (isTransparent context-aware 색상 유지)
- `packages/ui/components/ui/Drawer.tsx` — 관련 스타일 조정
- `products/homepage/components/layout/NavigationBarBridge.tsx` — `NAV_ITEMS` + `ProductMegaMenu` 주입 구조로 재작성; `navItems` prop으로 `NavigationBar`에 전달
- `products/homepage/components/layout/LanguageSwitcher.tsx`
  - 데스크톱 wrapper `self-stretch` 추가 → 헤더 높이 채움
  - 드롭다운 컨테이너 border `0.5px solid var(--color-border-tertiary)` 통일
  - 드롭다운 gap `top: calc(100% + var(--spacing-2XS, 4px))` 적용
- `products/homepage/components/sections/home/HeroSection.tsx`
  - CTA 행 패딩 `px-[150px]` 고정 → `px-l tablet:px-xl desktop:px-[150px]` 반응형으로 변경

---

## [2.4.0] - 2026-06-17
### ✅ Added
- `products/homepage/assets/icon/IcRequiredDot.tsx` — 필수 입력 dot 마커 아이콘 컴포넌트 신규 추출 (8×8, `--fai-bg-brand` CSS 변수 fill, `aria-hidden`)
- `products/homepage/assets/icon/IcArrowRight16.tsx` — CustomersSection 링크 버튼용 오른쪽 화살표 아이콘 (16×16, `currentColor` mask 방식)
- `products/homepage/config/types.ts` — `ContactComplete` 인터페이스 추가 (`title`, `subCopy`, `buttonLabel`, `backgroundAsset`); `ContactConfig`에 `complete: ContactComplete` 필드 추가

### 🔄 Changed
- `products/homepage/components/sections/contact/ContactUsSection.tsx`
  - **완료 화면** — 제출 후 `submitted` 상태 전환, 완료 타이틀·서브카피·`[btn/icoTxt/square/primary/XL]` 버튼 렌더링; `dark` wrapper로 버튼 다크 모드 CSS 변수 강제 해석
  - **배경 이미지 분리** — `!submitted` / `submitted` 조건별 독립 `<Image>` 렌더링 (form: `bg-gradation-n.png`, complete: `bg-gradation-confirm-n.png`)
  - **즉시 스크롤** — `flushSync(setSubmitted(true))` 후 `lenisRef.current.scrollTo(section, { immediate: true })` / `window.scrollTo({ behavior: "instant" })` 분기 처리 (Lenis 인터셉트 우회)
  - **완료 화면 중앙 정렬** — content wrapper 조건부 `h-svh items-center justify-center` 적용
  - **handleContinue** — `setState(EMPTY_STATE)` · `setSubmitted(false)` 제거 → `router.push("/")` 단독 호출 (완료 화면 플래시 제거)
  - **Toast 마크업** — `<Toast>` 컴포넌트 + `window.open` → `<a href target="_blank">` + `<CustomerSupportIcon>` 인라인 구조로 교체; `dark` wrapper 다크 시맨틱 토큰 적용
  - **컬러 토큰 교정** — 임의 hex/RGB → `--color-*` / `--fai-*` CSS 변수 + hex fallback 전면 재정렬 (toast·complete 화면 전체)
  - **leading 토큰 교정** — `leading-[1.5]` 임의값 7곳 → `--font-lineHeight-{14,18,20,36}` 파운데이션 토큰으로 교체
  - **IcRequiredDot 도입** — 인라인 SVG → `@/assets/icon/IcRequiredDot` 컴포넌트 import로 전환
- `products/homepage/config/site.ts` — `contact.backgroundAsset` → `bg-gradation-n.png`; `contact.complete` 데이터 블록 추가 (title·subCopy·buttonLabel·backgroundAsset)

---

## [2.3.0] - 2026-06-17
### ✅ Added
- `packages/ui/components/Checkbox.tsx` — 순수 체크박스 원자 컴포넌트 신규 생성 (unchecked·checked·partial·disabled·error 5가지 상태; SVG mask 방식 체크·부분선택 아이콘; `useId` 기반 mask ID 충돌 방지)

### 🔄 Changed
- `packages/ui/components/CheckboxField.tsx` — peer CSS 방식 → `Checkbox` 원자 컴포넌트 합성 구조로 전면 리팩토링; `disabled`·`error` prop 추가; boxLabel 래퍼 `justify-center` 제거·`px-[var(--padding-none,0)]` 정렬 명세 반영
- `packages/ui/components/LineInput.tsx` — `error`·`helpText`·`disabled` prop 추가; 상태별 border 분기(`border-border-error`/`border-border-disabled`/`focus-within:border-border-brand`); required 점 SVG → span 교체; `fai-*` 오염 토큰 → 올바른 시맨틱 클래스로 전면 정정
- `packages/ui/index.ts` — `Checkbox`·`CheckboxState` export 추가
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — `errors: Record<string, string>` 상태 추가; 제출 시 회사명·성함·이메일 정규식 유효성 검사; 입력 시 해당 필드 에러 실시간 초기화; `LineInput`에 `error`·`helpText` prop 전달
- `products/homepage/config/types.ts` — `ContactField` 인터페이스에 `errorMessage?: string` 필드 추가
- `products/homepage/config/site.ts` — 필수 입력 필드(company·name·email)에 `errorMessage` 값 추가

---

## [2.2.0] - 2026-06-17
### ✅ Added
- `products/homepage/app/[locale]/contact/page.tsx` — 문의하기 라우트 신규 구축 (`ContactUsSection` 조립)
- `products/homepage/components/sections/contact/ContactUsSection.tsx` — 문의 폼 섹션; `siteConfig.contact` SoT 바인딩; 배경 그라데이션 이미지·폼 검증(회사명·성함·이메일); VCO/STORE 관심 항목 체크박스; `IcoTxtButton` submit; 하단 `Toast` 카카오 채널 CTA
- `packages/ui/components/LineInput.tsx` — 라인 스타일 입력 필드 (label·required·error·helpText)
- `packages/ui/components/CheckboxField.tsx` — 문의 관심 항목용 체크박스 필드
- `packages/ui/components/Toast.tsx` — 하단 고정형 CTA Toast (`CustomerSupportIcon` + primary pill 버튼)
- `packages/ui/components/CustomerSupportIcon.tsx` — Toast 전용 40×40 SVG 아이콘
- `products/homepage/config/site.ts` — `contact` SoT 완비 (title·subCopy·form·fields·interests·toast·backgroundAsset); 네비 `문의` → `/contact` 링크
- `products/homepage/config/types.ts` — `ContactConfig`·`ContactField`·`ContactInterestGroup` 등 문의 타입 계약 추가

### 🔄 Changed
- `packages/ui/index.ts` — `LineInput`·`CheckboxField`·`Toast`·`CustomerSupportIcon` export 추가
- `products/homepage/components/sections/home/WhyFaiSection.tsx` — sand 시맨틱 토큰·spacing 토큰 기반 클래스 체계 정리 (`bg-sand-filled-primary/tertiary`, `text-sand-text-*`)

---

## [2.1.0] - 2026-06-16
### ✅ Added
- `products/homepage/components/sections/products/StoreInteractiveContainer.tsx` — StoreTypes·StoreCaseStudies 탭 상태 공유 컨테이너 (`activeTabKey` lift); 탭 전환 시 해당 키의 case study 목록 연동 렌더링
- `products/homepage/config/types.ts` — 제품·홈·미디어·회사소개 SoT 타입 계약 분리 (`ProductConfig`, `caseStudies: Record<string, CaseStudy[]>` 등)

### 🔄 Changed
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — `StoreTypes`·`StoreCaseStudies` 직접 조립 → `StoreInteractiveContainer` 단일 래퍼로 교체
- `products/homepage/components/sections/products/StoreTypes.tsx` — 탭 상태 `activeKey`·`onTabChange` prop 외부화; 카드 배경 `bg-sand-200`·semantic 타이포·spacing 토큰 적용; `objectPosition` per-card 지원
- `products/homepage/config/site.ts` — `caseStudies`를 탭 키(`standard`·`micro`) 기반 `Record<string, CaseStudy[]>` 구조로 전환; unmanned-store 도입 사례 데이터 탭별 분리
- `products/homepage/components/sections/products/ProductFeatures.tsx` — `bg-sand-filled-tertiary`·`rounded-fai-m`·semantic 텍스트 토큰 정리
- `products/homepage/components/sections/products/ProductBenefits.tsx` — `container`·design token 클래스 체계로 inline style 제거
- `products/homepage/components/sections/products/ProductIndustries.tsx` — semantic 타이포·spacing 토큰 정리
- `products/homepage/components/sections/products/ProductHero.tsx` — `heroVideo` 폴백·HeroShell 정렬 레이아웃
- `products/homepage/components/sections/products/ProductReviews.tsx` — 패딩 배분형 full-bleed 슬라이더·`imageObjectPosition`·토큰 클래스 체계
- `products/homepage/assets/icon/ReviewIcon.tsx` — 32×32 mask SVG (bakery·cafeteria·resort) 및 semantic icon 토큰 적용
- `products/homepage/tailwind.config.ts` — container·sand 팔레트 관련 보완

---

## [2.0.0] - 2026-06-15
### ✅ Added
- `packages/ui/components/button/IconButton.tsx` — `secondary` variant 추가 (bg-filled-optional-brand-secondaryBtn, text-text-basic-primary)

### 🔄 Changed
- `packages/ui/components/navigation/MegaNavMenu.tsx` — [채용] 외부 링크 렌더링 전면 리팩토링: `NavItem`에 `ariaLabel?` 필드 추가; regular segment에서 `external` 항목 분리 후 독립 렌더링 (w-[83px] h-3xl, py-s px-ms gap-3xs, 대각선 화살표 SVG); `dark:` prefix로 투명/라이트 모드 텍스트 색상 분기; 드롭다운 트리거 버튼 `cursor-pointer` 추가; `ArrowUpRight` (lucide) → 디자이너 명세 SVG 교체; `Fragment` import 추가
- `packages/ui/components/navigation/GlobalUtilityMenu.tsx` — 모바일 외부 링크([채용]) `aria-label={item.ariaLabel}` 연동; `ArrowUpRight` (lucide) → 디자이너 명세 SVG 교체 (mask ID `_m` 접미사로 충돌 방지)
- `packages/ui/components/NavigationBar.tsx` — NAV_ITEMS 채용 항목에 `ariaLabel: "파인더스에이아이 채용 홈 바로가기(새창)"` 주입
- `products/homepage/components/layout/LanguageSwitcher.tsx` — 데스크톱 트리거 `trigger="click"` → `trigger="hover"` 전환 (Dropdown 내장 hover 딜레이 클로즈 활용); 데스크톱·모바일 버튼 `cursor-pointer` 추가
- `products/homepage/components/sections/media/ShowcaseSection.tsx` — SocialCard `LinkedInIcon`·`InstagramIcon` SVG 추가; SocialCard 레이아웃 재구성 (group/card named group 기반 대각선 스와이프 애니메이션); ProgressBar `<button>` 인터랙티브 구조 리팩토링; YouTube CTA `<a>` 외부링크 래퍼 추가; section gap `gap-3xl` 토큰 교정
- `products/homepage/config/site.ts` — socials href 실제 URL(Instagram·LinkedIn) 주입

---

## [1.9.0] - 2026-06-12
### ✅ Added
- `packages/ui/components/button/IcoTxtButton.tsx` — 아이콘+텍스트 결합 버튼 공통 컴포넌트 신규 생성 (XL/L/M/S 4단계 사이즈, Primary/Secondary variant, Square/Round shape, S+Square 전용 6px radius 예외 규칙, isImpact/isLoading, after: 오버레이 다중 배경 패턴)
- `products/homepage/components/layout/Footer.tsx` — 홈페이지 전용 Footer 신규 생성 (ScrollTopButton 컴포넌트 조립)
- `products/homepage/components/layout/ScrollTopButton.tsx` — Framer Motion 롤링 교체 애니메이션 적용 탑 스크롤 버튼 (motion.div 상태 전파 + ReactNode icon 주입, 스크롤 300px fade-in/out)
- `products/homepage/app/[locale]/playground/page.tsx` — IcoTxtButton 전체 조합(Variant/Size/Shape/Impact/Loading/Disabled) 사용 예시 페이지
- `packages/ui/index.ts` — `IcoTxtButton`, `IcoTxtButtonProps` export 추가

### 🔄 Changed
- `packages/ui/components/button/IconButton.tsx` — 전면 개편: XL/L/M/S 4단계 사이즈 매트릭스(paddingMap/iconSizeMap), after: 가상 오버레이 인터랙션 패턴, 원형 고정(shape morphing 제거), Framer Motion 의존성 제거 → CSS group 기반 롤링 애니메이션, ReactNode icon prop 수용 통로 개방, 인터랙션 색상 CSS 변수 단독 참조(fallback rgba/hex 제거)
- `packages/ui/components/button/IcoTxtButton.tsx` — 인터랙션 색상 CSS 변수 단독 참조 교체(다크 모드 자동 대응)
- `packages/ui/components/ScrollTopButton.tsx` — Framer Motion spring 애니메이션 적용 (scroll visibility 유지)
- `products/homepage/components/sections/about/AboutPeople.tsx` — titleSection과 buttonSection 동일 행(flex justify-between) 나란히 배치로 레이아웃 개편
- `products/homepage/components/sections/products/ProductReviews.tsx` — 타이틀 섹션에 좌우 화살표 버튼 추가 (AboutPeople 구조 통일), `size="L"` 교정
- `packages/ui/components/button/IconButton.tsx` — size prop `"l"|"xl"` → `"L"|"XL"` 대문자 표기 통일; 기존 호출부(AboutPeople, ProductReviews, ScrollTopButton) 일괄 교정

---

## [1.8.0] - 2026-06-11
### ✅ Added
- `.cursorrules` — 3대 아키텍처 규칙 및 3단계 사고 프로토콜 프로젝트 루트 등록
- `products/homepage/app/[locale]/about/page.tsx` — 회사소개 라우트 신규 구축 (AboutHero → AboutPartners → AboutLogos → AboutManagement 순차 조립)
- `products/homepage/components/sections/about/AboutLogos.tsx` — 투자사·정부지원 로고 그리드 섹션 신규 생성
- `products/homepage/components/sections/about/AboutManagement.tsx` — 경영진 소개 섹션 신규 생성 (겹침 레이아웃·NAME_GRADIENT·페이드 마스크)
- `products/homepage/config/site.ts` — `aboutConfig`에 `investors`(investment·government 그룹)·`management`(4인 멤버) SoT 완비

### 🔄 Changed
- `products/homepage/config/site.ts` — `management.members` photo 경로 실제 파일명(`member-{role}-{id}.png`)으로 정정; 홍석범 CTO 학력 `\n` 개행 삽입
- `products/homepage/components/sections/about/AboutManagement.tsx` — 썸네일 `312×280` 규격; `fill` + `relative` 래퍼로 Image 렌더링 안정화; name박스 `top-1/2 -translate-y-1/2` 수직 중앙 정렬; stroke `border-t-[0.5px] border-[var(--color-border-secondary)]` 0.5px 정밀 구분선; `whitespace-pre-line` 개행 렌더링
- `root/foundation/docs/spacing.md` — cornerRadius 전체 스케일 테이블 추가
- `products/homepage/root/foundation/docs/spacing.md` — `fai-` 접두어 Tailwind 예시 정정; cornerRadius `none`·`2xs` 행 추가 및 `xs` rem 값 교정
- `root/foundation/docs/color-semantic.md` / `products/homepage/root/foundation/docs/color-semantic.md` — sand 시맨틱 토큰 섹션 추가
- `root/foundation/docs/color-global.md` / `products/homepage/root/foundation/docs/color-global.md` — sand 팔레트 행 추가

---

## [1.7.0] - 2026-06-10
### ✅ Added
- `products/homepage/components/sections/products/StoreHero.tsx` — 이미지 히어로; `HeroShell` + next/image 풀블리드·그라데이션 오버레이
- `products/homepage/components/sections/products/StoreEffects.tsx` — 효과 카드·리스트 섹션; 인터랙션 아이콘 SVG·탭 전환 UI
- `products/homepage/components/sections/products/StoreTypes.tsx` — 매장 유형 탭·카드 그리드; `@/components/ui/Tabs` 연동
- `products/homepage/components/sections/products/StoreCaseStudies.tsx` — 도입 사례 캐러셀; 브랜드·매장·이미지 바인딩
- `products/homepage/components/layout/HeroShell.tsx` — 제품 히어로 공통 셸 (미디어 슬롯·CTA·locale-aware 링크)
- `products/homepage/components/ui/Tabs.tsx` — StoreTypes용 탭 UI 컴포넌트
- `products/homepage/config/site.ts` — `heroType`·`heroVideo`·`heroImage` 분기; `unmanned-store` effects·storeTypes·caseStudies SoT 완비; storeTypes 카드 이미지 경로 `/images/` 프리픽스 교정

### 🔄 Changed
- `products/homepage/components/ui/Tabs.tsx` — 래퍼 `flex-1` 제거; `justify-center items-center gap-[32px]` 피그마 정렬 명세 적용
- `products/homepage/components/sections/products/StoreTypes.tsx` — 카드 섹션 래퍼 `flex flex-col gap-[40px]`; 섹션 타이틀 `text-[36px] leading-[54px]`; 카드 프레임 `p-[48px] rounded-[16px] bg-[#ECEAE4]`; 일반 카드 `h-[640px]` / 와이드 카드 `h-[430px]`; 오버레이 `rgba(23,25,28,0.50→0.00)`; 타이포 `text-[28px] font-semibold` / `text-[#D2D3D5] text-[18px]` 피그마 전면 동기화
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — `heroType` video/image 분기 (`ProductHero` / `StoreHero`); StoreEffects·StoreTypes·StoreCaseStudies 통합; `unmanned-store` CtaBanner 제외
- `products/homepage/assets/icon/ReviewIcon.tsx` — 32×32 피그마 mask SVG 전면 교체 (bakery·cafeteria·resort); semantic `icon-tag-category` 토큰 적용
- `products/homepage/components/sections/products/ProductHero.tsx` — `MISSING_FROM_DESIGN` 폴백 비디오; HeroShell 명세 정렬 레이아웃
- `products/homepage/components/sections/products/ProductReviews.tsx` — `"use client"`·`sliderRef`; 패딩 배분형 full-bleed 슬라이더 (`pl/pr/scroll-pl` 150px); 디자인 토큰·`bg-surface-alt` 클래스 체계; `imageObjectPosition` 분기
- `products/homepage/components/sections/products/ProductBenefits.tsx` — `container`·semantic 타이포·spacing 토큰으로 inline style 제거
- `products/homepage/components/sections/products/ProductFeatures.tsx` — `bg-sand-filled-tertiary`·`rounded-fai-m`·semantic 텍스트 토큰 적용
- `products/homepage/components/sections/products/ProductIndustries.tsx` — semantic 타이포·spacing 토큰 정리

---

## [1.6.0] - 2026-06-09
### ✅ Added
- `products/homepage/app/[locale]/products/[slug]/page.tsx` — 제품 상세 페이지 신규 구축; ProductHero·ProductFeatures·ProductBenefits·ProductIndustries·ProductReviews 섹션 순차 통합
- `products/homepage/components/sections/products/ProductIndustries.tsx` — 주요 적용 산업 섹션; next/image fill 모드, 그라데이션 오버레이, 모바일 반응형
- `products/homepage/components/sections/products/ProductReviews.tsx` — 고객사 도입 후기 섹션; Peek & Snap 가로 슬라이더, QuoteSegment 배열 기반 강조 렌더링, 모바일 반응형
- `products/homepage/assets/icon/ReviewIcon.tsx` — 리뷰 아이콘 팩토리 컴포넌트 신규 생성 (bakery·cafeteria·resort SVG 완비); 글로벌 에셋 경로로 정착
- `products/homepage/config/site.ts` — `QuoteSegment` 타입 export 추가; VCO reviews 데이터 세그먼트 배열 구조로 전면 개편 (emphasis 필드 기반 강조 문구 분리)

### 🔄 Changed
- `products/homepage/components/sections/products/ProductFeatures.tsx` — 데스크탑 컨테이너 패딩 150px 정합; 카드 0·1·2 텍스트 래퍼 분리(z-10), 배경 이미지 피그마 정밀 수치 반영
- `products/homepage/components/sections/products/ProductBenefits.tsx` — BenefitIcon·InViewVideo 연동; BenefitItem subtitle 타입 교정; 미디어/텍스트 블록 sticky 레이아웃
- `products/homepage/components/sections/products/ProductReviews.tsx` — split 기반 highlight 로직 → QuoteSegment 배열 map 렌더링으로 전면 교체; 아이콘 래퍼 p-[12px] 교정; import 경로 @/assets/icon으로 이전; 후기 이미지 `next/image` `fill`·`object-cover`·`sizes` 최적화 체결; `bg-fill-faint` 플레이스홀더 → 실제 에셋 바인딩; `alt={`${review.store} 전경`}` 접근성 적용
- `products/homepage/config/site.ts` — heroTitle (VCO) 제거; features 이미지 경로 실제 에셋으로 교체; benefits·industries·reviews 전체 데이터 완비; quote string → QuoteSegment[] 구조 전환; reviews `image` 확장자 `.webp` → `.png` (`/products/reviews/vco-review-{bakery,cafeteria,resort}.png`)
- `products/homepage/tailwind.config.ts` — container screens.desktop 1140px→1440px, padding.desktop 9.375rem(150px) 교정

### 🗑️ Removed
- `products/homepage/components/sections/products/icons/ReviewIcon.tsx` — assets/icon/으로 이전 후 삭제

---

## [1.5.0] - 2026-06-08
### ✅ Added
- `packages/ui/components/navigation/GlobalUtilityMenu.tsx` — 글로벌 유틸리티 메뉴 컴포넌트 신규 작성; Dropdown(S)·Menu(M) 래핑 아키텍처, 드롭다운/외부링크/내부링크 분기 렌더링, locale prefix 처리, Drawer onClose 버블링 제어(stopPropagation)
- `products/homepage/public/images/main/imageSection-hero-2.png` — 히어로 섹션 대체 이미지 추가

### 🔄 Changed
- `packages/ui/components/marquee/Marquee.tsx` — CSS 변수(`--marquee-duration`) inline style 방식으로 전환 (Tailwind 동적 클래스 빌드 타임 스캔 이슈 해결); 풀블리드 래퍼에서 `-mx-[50vw]` 제거로 뷰포트 오프셋 버그 수정
- `packages/ui/components/Header.tsx` — 문의하기 CTA 버튼에 디자인 시스템 토큰 적용 (`rounded-fai-s`, `bg-fill-strong`, `px-l`, `py-s`, `text-body-s`, `text-inverse`)
- `packages/ui/components/Button.tsx` — tone/size/shape/impact/loading 옵션 체계 전면 정비; foundation 토큰 기반 스타일링 적용 (`py-m`, `px-xl`, `h-3xl`, `rounded-fai-s/circle` 등)
- `products/homepage/app/[locale]/layout.tsx` — main 영역 상단 패딩 `pt-4xl` 적용

---

## [1.4.0] - 2026-06-05
### 🔄 Changed
- `products/homepage/public/images/` — 디렉토리 구조 정비: `homepage/` → `main/`으로 리네임, `customers/`, `videos/` 디렉토리 신규 생성
- `products/homepage/app/[locale]/page.tsx` — `ImageSection` src를 `/images/main/imageSection-hero.png`로 교체, `priority` 명시; `CUSTOMER_IMAGES` 배열 실제 파일명 + `name` 안정 키로 전면 업데이트
- `products/homepage/components/sections/CustomersSection.tsx` — `CustomerImage` 인터페이스에 `name` 필드 추가; `DEFAULT_IMAGES` 배열을 실제 파일명 및 디자이너 지정 순서(01~07)로 재정렬; `<Image />` 방식을 `fill` → `width={369} height={420}` 고정 치수로 전환(CLS 차단); `key={i}` → `key={image.name}` 안정 키로 교체; 서브카피 문구 업데이트
- `products/homepage/components/sections/CtaBanner.tsx` — `<Image fill>` 기반 멀티 레이어 구조 완성(`-z-20` 배경 / `-z-10` 그라데이션 스크림 / `z-10` 콘텐츠); h2 타이틀에 `flex-1 text-[36px]` 피그마 정밀 수치 반영

### ✅ Added
- `products/homepage/public/images/customers/` — 실제 고객사 이미지 7종 배치 (bakery-hansangmin, bakery-mannamil→mannamil, foodCourt-niseko-1/2, retail-hibinoma/shokunoma/wellstory)
- `products/homepage/public/images/main/` — `imageSection-hero.png`, `cta-banner-gradation.png` 배치
- `products/homepage/public/videos/` — 디렉토리 신규 생성 (`.gitkeep`)

---

## [1.3.0] - 2026-06-05
### ✅ Added
- `products/homepage/components/sections/HeroSection.tsx` — `packages/ui`에서 로컬 이전, `@fai/ui`에서 LogoMarquee import
- `products/homepage/components/sections/ImageSection.tsx` — `packages/ui`에서 로컬 이전; sticky 스크롤 핀(pinDuration 200vh), `object-cover object-bottom`, `h-dvh`
- `products/homepage/components/sections/AnimatedStat.tsx` — 뷰포트 진입 시 숫자 셔플→정착 애니메이션 (IntersectionObserver + rAF, easeOutQuint)
- `products/homepage/components/SmoothScroll.tsx` — Lenis 기반 전역 부드러운 스크롤 (duration 1.6, easeOutExpo)
- `lenis ^1.3.23` 패키지 설치

### 🔄 Changed
- `products/homepage/components/sections/CaseStudySection.tsx` — AnimatedStat 연결; STATS 데이터를 `target/decimals/suffix` 구조로 변경 (3초, 99.7%, 12000건)
- `products/homepage/components/sections/AnimatedStat.tsx` — 셔플 1400ms·정착 1800ms, 범위 ±20%, ~15fps 제한, easeOutQuint으로 스무스하게 조정
- `products/homepage/app/[locale]/layout.tsx` — SmoothScroll로 전체 레이아웃 래핑
- `packages/ui/index.ts` — HeroSection, ImageSection export 제거 (로컬 이전)
- `products/homepage/app/[locale]/page.tsx` — 실제 고객사 이미지 경로 및 `imageSection-hero.png` 적용

### 🗑️ Removed
- `packages/ui/components/HeroSection.tsx` export (products/homepage로 이전)
- `packages/ui/components/sections/ImageSection.tsx` export (products/homepage로 이전)

## [1.2.0] - 2026-06-04
### ✅ Added
- `packages/ui/components/navigation/DesktopMenu.tsx` — HoverDropdown 래핑, `useParams` 기반 locale-aware 링크
- `packages/ui/components/navigation/MobileMenu.tsx` — Drawer 연동, 콘텐츠 렌더링 전담
- `packages/ui/components/ui/HoverDropdown.tsx` — 호버 드롭다운 뼈대 컴포넌트 (trigger 렌더 함수 패턴)
- `packages/ui/components/ui/Drawer.tsx` — 모바일 오버레이 껍데기 컴포넌트

### 🔄 Changed
- `packages/ui/components/NavigationBar.tsx` — DesktopMenu·MobileMenu·Drawer 래핑 아키텍처로 전면 리팩토링; NAV_ITEMS에 `dropdownItems` 필드 추가; contact 버튼에 Button 디자인 시스템 토큰 적용
- `packages/ui/components/Header.tsx` — `@/config/site` 외부 의존 제거, 데이터 인라인으로 전환
- `packages/ui/index.ts` — DesktopMenu·MobileMenu·HoverDropdown·Drawer·NavItem 타입 export 추가

### 🗑️ Removed
- `products/homepage/root/components/` 디렉토리 전체 삭제 (NavigationBar·DesktopMenu·MobileMenu·HoverDropdown·Drawer·Button·Footer·Header·HeroSection)
- 모든 컴포넌트를 `packages/ui/components/`로 완전 이전, 파편화 해소

### 🏛️ Architecture
- 3대 아키텍처 규칙 정착: `packages/ui` = 공통 부품 창고 / `root/` = 글로벌 토큰 통제실 / `products/` = 최종 조립 공장
- `products/homepage/root/`에 디자인 토큰(JSON/CSS)만 잔류

---

## [Unreleased] - 2026-06-04
### 🐛 Fixed
- `next-intl` 미설치로 발생하던 `i18n/request.ts` 타입·모듈 해석 오류 해결 (루트 `npm install`)
- `src/app`과 `app` 중복으로 인한 `@/components/NavigationBarBridge` 빌드 실패 해결

### ✅ Changed
- `LanguageSwitcher`, `NavigationBarBridge`를 `products/homepage/components/`로 정리 (`@/*` alias와 일치)
- `app/[locale]/layout.tsx`에서 `NavigationBar` 대신 `NavigationBarBridge` 사용 (locale 전환 UI 연동)
- 중복 `products/homepage/src/` 디렉터리 제거

## [1.0.0] - 2026-03-31
### ✅ Added
- 디자인 시스템 초기 아키텍처 구축
- `design-system.md` (마스터 가이드) 수립
- `component-template.md` (표준 양식) 수립
- 기본 폴더 구조 생성 (`foundation/`, `components/web/`, `components/tablet/`)

### 🏗️ In Progress
- `foundation/` 내 글로벌 컬러 및 타이포그래피 데이터 입립 예정
- 웹/태블릿 공용 버튼 컴포넌트 설계 중
