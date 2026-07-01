# SEO 구현 + jp→ja 로케일 리네임 설계

- 작성일: 2026-07-01
- 대상: `products/homepage` (Next.js 16 정적 export)
- 기준: Notion SEO 문서(FAI Homepage v3.0) + 사용자 확정 결정 4건
- 상태: 승인됨

## 1. 목적/범위

Notion SEO 스펙을 코드에 반영하고, 잘못된 일본어 로케일 코드 `jp`(국가코드)를 표준 언어코드 `ja`(ISO 639-1)로 일괄 변경한다.

범위: 로케일 리네임, 로케일별 메타데이터(title/description/keywords/OG), `<html lang>`, hreflang, OG 이미지, sitemap/robots 반영, 검증 → `feat/static-export-deploy` 머지 → DEV 배포.
범위 밖: en/ja 본문 번역(별건), 서브페이지(about/media/contact) 카피 로컬라이즈(현행 유지).

## 2. jp → ja 리네임

| 위치 | 변경 |
|---|---|
| `i18n/routing.ts` | `locales: ["ko","en","ja"]` |
| `messages/jp.json` | → `messages/ja.json` (git mv) |
| `app/robots.ts` | `/jp/playground/` → `/ja/playground/` |
| `components/layout/LanguageSwitcher.tsx` | `{ code: 'jp' }` → `{ code: 'ja' }` |
| `public/index.html` | 리다이렉트 맵/hreflang/링크의 `/jp` → `/ja` (이미 `hreflang="ja"`였음) |
| 주석의 `/jp` 표기 | `/ja`로 정정 |

`i18n/request.ts`, `generateStaticParams`는 `routing.locales` 파생이라 자동. 미배포 상태라 외부 링크 영향 없음.

## 3. 로케일별 메타데이터

`config/site.ts`에 로케일별 `seo` 맵 추가(단일 소스):

```ts
export const seo = {
  ko: { title, description, keywords: string[], ogTitle, ogDescription },
  en: { ... },
  ja: { ... },
} satisfies Record<Locale, SeoEntry>;
```

**title**(홈 `<title>` = 검색제목, 서브페이지 템플릿 `%s | Fainders.AI`)
- ko: `파인더스에이아이 | AI 무인 결제 솔루션 | 리테일 무인화 솔루션`
- en: `Fainders.AI | Autonomous Store & Self-Checkout Solution`
- ja: `Fainders.AI | AI無人決済・無人店舗ソリューション`

**description**
- ko: `Fainders.AI는 세상에서 가장 경제적인 AI 무인매장 솔루션을 제공함으로써, 오프라인 리테일의 수익성을 향상시키고자 합니다.`
- en: `Fainders.AI: Offering the Most Economical Vision AI-Powered Autonomous Store Solution to Maximize Profits.`
- ja: `Fainders.AIは世界一経済的な無人店舗ソリューションを提供し、オフラインリテールの収益性向上を図ります。`

**keywords**
- ko: `파인더스에이아이, 무인 결제 솔루션, AI, 키오스크, 무인매장, 리테일, 리테일테크`
- en: `Fainders.AI, autonomous store, AI-powered retail, self-checkout, unmanned store, retail tech`
- ja: `Fainders.AI, 無人店舗, 無人決済, AI, キオスク, リテール, リテールテック`

**ogTitle / ogDescription**: Notion 링크 미리보기 값
- ko: `파인더스에이아이 | 리테일 무인화 솔루션` / (description과 동일)
- en: `Fainders.AI | Autonomous Store Solution` / (description과 동일)
- ja: `Fainders.AI | 無人店舗ソリューション` / (description과 동일)

> ⚠️ 마케팅 검수: en/ja 검색제목·키워드·ja OG제목은 Notion 미기재분을 합리적으로 완성한 값. 코드 주석에 `// TODO(marketing): Notion 미확정, 검수 필요` 표기.

적용 위치: `app/[locale]/layout.tsx`의 `generateMetadata`가 로케일별 title/description/keywords/openGraph/twitter/alternates/robots를 반환. 루트 `app/layout.tsx`는 `metadataBase`·icons·manifest·JSON-LD만 유지(ko 하드코딩 title/description/keywords/OG 제거).

## 4. 다국어 신호

- **`<html lang>`**: 로케일별(`ko`/`en`/`ja`). ⚠️ 이 Next 버전(16.2.7)에서 root layout + `[locale]` 구조에서 lang을 세팅하는 정확한 방법을 `node_modules/next/dist/docs/`로 확인 후 구현(AGENTS.md 지시). 구조 변경(예: `<html>`을 `[locale]/layout`로 이동, root는 pass-through)이 필요하면 정적 export 호환성 유지하며 적용.
- **hreflang alternates**: `alternates.languages = { ko, en, ja }` + `x-default`=ko. 각 로케일 canonical은 self.
- **색인 정책 유지**: ko만 `index`, en/ja는 `noindex`(미번역). 기존 `[locale]/layout` 정책 계승.

## 5. OG 이미지

Notion 지정 bakery(`public/images/customers/01-bakery-mannamil.jpg`) 기반으로 **1200×630 OG 이미지 생성**(sharp, 기존 devDep) → `public/images/og/og-default.jpg`. `openGraph.images`·`twitter.images`를 이 파일로 교체(절대 URL, width/height 명시).

## 6. sitemap/robots

- `sitemap.ts`: `INDEXED_LOCALE="ko"` 유지(변경 없음). 
- `robots.ts`: `/jp/playground/` → `/ja/playground/`.

## 7. 검증 → 통합 → 배포

1. `pnpm build && pnpm test` 통과(정적 export 26+ 페이지, 로케일 경로 `/ko /en /ja`).
2. Playwright 실측: `/ko`,`/en`,`/ja` 각 페이지의 `<html lang>`, `<title>`, `meta description`, `og:*`, `hreflang` 링크가 규격대로인지. 404 없는지.
3. `feat/static-export-deploy`에 `--no-ff` 머지.
4. `./scripts/deploy.sh dev` 로 DEV 배포 → 프리뷰 URL 확인.

## 8. 완료 정의

- `/ja` 라우트 정상, `/jp` 잔존 참조 0.
- ko/en/ja 각 로케일 메타·lang·hreflang 실측 일치.
- build/test 통과, DEV 배포 성공(프리뷰 접속 확인).
