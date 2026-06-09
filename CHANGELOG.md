# 📑 CHANGELOG

모든 시스템의 변경 사항은 역순(최신순)으로 기록합니다.

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
- `products/homepage/components/sections/products/ProductReviews.tsx` — split 기반 highlight 로직 → QuoteSegment 배열 map 렌더링으로 전면 교체; 아이콘 래퍼 p-[12px] 교정; import 경로 @/assets/icon으로 이전
- `products/homepage/config/site.ts` — heroTitle (VCO) 제거; features 이미지 경로 실제 에셋으로 교체; benefits·industries·reviews 전체 데이터 완비; quote string → QuoteSegment[] 구조 전환
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
