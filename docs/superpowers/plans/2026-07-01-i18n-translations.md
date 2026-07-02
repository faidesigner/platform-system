# i18n 전면 번역 Implementation Plan

> 워크트리 `platform-system-i18n` / 브랜치 `feat/i18n-translations` (base b195517). 페이즈별 SDD.

**Goal:** 사이트 전 카피를 next-intl 메시지(ko/en/ja)로 이전하고 전 컴포넌트를 번역 키로 재배선, 3개 언어로 실제 렌더되게 만든다.

**Architecture:** 카피는 `messages/{ko,en,ja}.json` 단일 소스, 컴포넌트는 `useTranslations`(클라)/`getTranslations`(서버)로 소비. `config/site.ts`는 이미지/URL/구조 데이터만 유지. `@fai/ui`는 next-intl 비결합 — 텍스트는 props로 주입.

## Global Constraints
- 로케일: ko/en/ja (ja = ISO 639-1). 기본 ko.
- 번역: ko 원문 유지, en/ja는 초벌(마케팅 검수 대상 → `docs/TODO_i18n-marketing-review.md`에 누적 기록).
- **번역 금지 대상**: 고유명사(Fainders.AI, FAI, VCO, VISION CHECK-OUT, WALK-THROUGH, STANDARD/MICRO STORE), 고객사·투자사·인명, URL, 이미지 경로, 이메일/전화/사업자번호.
- 중첩 객체 배열: 구조·에셋은 config 유지, 텍스트만 messages로(인덱스/id 키). 컴포넌트가 config+키 결합.
- `@fai/ui` 컴포넌트의 카피는 **optional props로 주입**(하드코딩 금지, next-intl import 금지). homepage 브릿지가 번역 문자열 전달.
- 게이트: `pnpm build && pnpm test` (lint 금지 — 사전 깨짐). 페이즈마다 `/ko /en /ja` 렌더 확인.
- 키 네임스페이스: `common / nav / footer / home / products / about / media / contact`.

## 키 규칙 예시
- 단순: `common.cta.contact` = "문의하기"
- 중첩: `home.hero.title`, `home.customers.moreLink`
- 배열 텍스트: `products.vco.features.0.title` / `.0.description` (config features[]의 인덱스와 1:1)
- 리치/멀티라인: `\n` 유지, 강조 세그먼트는 컴포넌트에서 처리(현행 quote 구조 유지하되 텍스트만 키화)

---

## Phase 1: common + nav + footer
**범위:** 공용 버튼/라벨, 네비 라벨, 푸터(회사정보·정책·SNS 라벨).
- 대상: `components/layout/NavigationBarBridge.tsx`(NAV_ITEMS 라벨), `@fai/ui` `Footer`(회사정보/정책 라벨 → props), homepage `FooterBridge`, 공용 CTA 문구(여러 섹션 공유: 문의하기/도입 문의하기/자세히 알아보기/더보기/빠른 상담하기 등).
- `@fai/ui Footer`: `labels`(회사명/대표이사/전화/주소/사업자등록번호/이메일 라벨, 정책 링크 텍스트, SNS aria) optional props 추가. 값(전화번호·주소 등 실데이터)은 번역 안 함, **라벨만** 번역.
- messages에 `common`, `nav`, `footer` 채우고 배선.
- 게이트 + `/ko /en /ja` 네비·푸터 번역 렌더 확인. 커밋.

## Phase 2: home
`components/sections/home/*` + `CtaBanner` + `page.tsx`. hero(리테일의 미래/한발 먼저…, No Staff No Problem 등), WhyFai 카드, Customers, ImageSection, Efficiency, CtaBanner 카피 → `home.*`. config의 홈 관련 텍스트 이전.

## Phase 3: products (최대)
`config/site.ts` products(vco/unmanned-store)의 features/benefits/industries/reviews/effects/storeTypes/caseStudies 텍스트 → `products.vco.*`/`products.unmannedStore.*`. `ProductHero/StoreHero/ProductFeatures/ProductBenefits/ProductIndustries/ProductReviews/StoreEffects/StoreTypes/StoreCaseStudies` 배선. 구조/이미지/비디오 경로는 config 유지.

## Phase 4: about
`aboutConfig`(hero/partners/investors/management/people) 텍스트 → `about.*`. 인명·학력·경력 중 고유명사 유지, 서술 카피만 번역. About 섹션 컴포넌트 배선.

## Phase 5: media
`siteConfig.media`(news items 제목/설명), `mediaShowcase`, `retailTechLetter` 카피 → `media.*`. 뉴스 기사 제목은 원문(한국어 기사)이라 번역 정책 확인 필요 — 기사 title/desc는 원문 유지, UI 라벨(더보기/더 알아보기/구독하기 등)만 번역. (뉴스 항목 번역 여부는 Phase 5 착수 시 확정)

## Phase 6: contact
`siteConfig.contact`(title/subCopy/form fields·placeholders·errorMessages/interests labels/toast/complete) → `contact.*`. `ContactUsSection` 배선. Zapier payload의 `content` 자동생성 라벨도 로케일 반영 검토(단 solution 문자열은 Zap 계약이라 불변).

---

## 각 페이즈 완료 정의
- 해당 섹션 하드코딩 한국어 0(주석 제외), messages ko/en/ja 3벌 동기(키 누락 0).
- `pnpm build && pnpm test` 통과, `/ko /en /ja`에서 해당 섹션이 각 언어로 렌더.
- en/ja 초벌 번역 → `docs/TODO_i18n-marketing-review.md`에 검수 대상 누적.

## 최종
- 전 페이즈 후 키 누락/미번역 스캔, en/ja `noindex` 해제 여부 결정(번역 품질 확인 후), 최종 리뷰 → `feat/static-export-deploy` 머지 결정.
