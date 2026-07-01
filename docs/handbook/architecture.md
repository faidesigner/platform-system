# Homepage 아키텍처 개요

`products/homepage` — Next.js 16(App Router) 기반 **정적 export** 마케팅 사이트. S3 + CloudFront로 서빙.

## 렌더링 / 배포
- **정적 export**(`output: export`, `trailingSlash: true`) → `out/`에 정적 HTML/에셋 생성. 서버 런타임 없음.
- 로케일 라우팅: next-intl, `localePrefix: "always"` → `/ko` `/en` `/ja`. 미들웨어 없음(정적). 루트 `/`는 `public/index.html`이 `navigator.languages`로 클라이언트 리다이렉트.
- 배포: `scripts/deploy.sh <dev|prd>` (자세히는 `homepage-deploy` 스킬 / `products/homepage/README.md`).

## 콘텐츠 데이터 모델 (중요)
- **`config/site.ts`** = 구조·에셋: 이미지/비디오 경로, 아이콘, 색상변수(토큰), 링크 href, 배열의 구조. **텍스트 카피는 두지 않는다**(고유명사/실데이터 제외).
- **`messages/{ko,en,ja}.json`** = 모든 UI 카피의 단일 소스. 컴포넌트가 next-intl로 읽는다.
- 중첩 객체 배열은 `config[i]`(구조) + `messages`의 인덱스 키(텍스트)를 컴포넌트/`page.tsx`에서 병합.
- 외부 동기 콘텐츠: `config/youtube-showcase.json`(YouTube RSS), `config/retail-tech-letter.json`(Stibee) — 주기적 재생성이라 정적 번역 불가(미디어 페이지 en/ja에 한국어 잔존, 알려진 공백).

## 공용 UI 패키지 `@fai/ui` (`packages/ui`)
- 디자인 시스템(버튼/네비/푸터/메뉴 등). **분석·i18n 비결합** 원칙: `trackEvent`/GA 명칭·`next-intl` import를 두지 않는다.
- 앱별 텍스트·콜백은 **optional prop으로 주입** → homepage 브릿지(`NavigationBarBridge`, `FooterBridge`)에서 번역·GA를 연결.
- 예외: `LanguageSwitcher`는 로케일 특성상 next-intl `useLocale` 사용(설계상 허용).

## i18n
- 로케일 `ko`(기본·index) / `en` / `ja`(**ISO 639-1**, `jp` 아님). en·ja는 미번역/부분번역 동안 정책적으로 처리.
- 서버=`getTranslations`, 클라=`useTranslations`. 자세히는 `homepage-i18n` 스킬 / `i18n-copy-guide.md`.

## 분석 (GA4)
- 측정 ID `G-GCQKJ5TF6R`, `@next/third-parties`로 페이지뷰 자동 추적.
- 클릭 이벤트 3종(`interest_click`/`lead_acquisition_click`/`inquiry_complete`) + 파라미터 `location`/`label`. gtag 접점은 `lib/analytics/track.ts` 하나.
- GA4 콘솔에서 맞춤 측정기준(location/label) + 주요 이벤트(전환) 등록은 별도 운영 작업.

## 문의 폼 (Zapier)
- `ContactUsSection` 제출 시 Zapier 웹훅(`lib/contact/payload.ts`)으로 전송. 포맷: `form-urlencoded` + `JSON.stringify(body)`(application/json 금지). payload `content`는 영업팀용 한국어 유지.

## SEO
- 로케일별 메타데이터(`config/site.ts`의 `seo` 맵 → `[locale]/layout` generateMetadata), `<html lang>`, hreflang(ko/en/ja + x-default), OG 이미지 1200×630(`public/images/og/og-default.jpg`).
- 정책: ko index, en/ja는 번역 완성도에 따라. (현재 코드 index:true — 릴리스 시 재확인)

## 스크롤 (SmoothScroll + lenis)
- `SmoothScroll`가 lenis 부드러운 스크롤 + **라우트 전환 스크롤 매니저**(해시 있으면 해당 섹션, 없으면 최상단; 언어 전환은 로케일 비종속 usePathname 기준이라 위치 보존).
