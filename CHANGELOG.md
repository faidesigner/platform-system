# 📑 CHANGELOG

모든 시스템의 변경 사항은 역순(최신순)으로 기록합니다.

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
