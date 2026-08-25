# fai-homepage

Fainders.AI 홈페이지 프로젝트입니다. `platform-system` monorepo의 `products/homepage`에 위치합니다.

---

## 처음 시작할 때

레포 루트(`platform-system`)에서 실행합니다.

```bash
git clone [레포 주소]
cd platform-system
pnpm install
cd products/homepage
pnpm dev
```

브라우저에서 `http://localhost:3000`으로 확인합니다.

---

## 빌드 & 배포 (정적 export → S3/CloudFront)

이 홈페이지는 **정적 export**(`output: 'export'`)로 빌드되어 S3 정적 호스팅 + CloudFront로 서빙됩니다.
미들웨어/서버런타임 없이 동작합니다.

### 빌드

```bash
# 레포 루트(platform-system)에서
pnpm install
pnpm --filter fai-homepage build
# 산출물: products/homepage/out/  (정적 HTML/에셋 일체)
```

- 로케일: `/ko` `/en` `/jp` (전부 경로 prefix). 루트 `/`는 `public/index.html`이
  브라우저 언어를 감지해 리다이렉트(`ja→jp`, 매칭 없으면 `/ko`).
- 현재 **`/ko`만 검색 색인**, `/en`·`/jp`는 `noindex`(번역 완료 시 해제).
- `out/`에는 `*_original.*`(미디어 원본 백업)이 포함되므로 **배포 시 반드시 제외**한다.

### 배포 (한 줄 스크립트)

빌드·S3 업로드·CloudFront 무효화를 `scripts/deploy.sh` 가 한 번에 처리한다.
설정은 `deploy/<target>.env` 에 있고, **AWS 자격증명은 `aws` CLI가 별도 관리**한다(`aws configure`/SSO).

```bash
cd products/homepage

./scripts/deploy.sh dev    # DEV 프리뷰 (전용 CloudFront, 루트 서빙)
./scripts/deploy.sh prd    # PRD 실서비스 www.fainders.ai (확인 프롬프트 있음)
```

| 타깃 | S3 | CloudFront | 주소 | 비고 |
|---|---|---|---|---|
| **dev** | `s3://www.fainders.ai/homepage_v2` | `E1N1DKK4N6NNIM` | https://d6hs8futv6rcu.cloudfront.net | noindex 주입, prefix 한정(안전) |
| **prd** | `s3://www.fainders.ai` (루트) | `E3GUSL3ADNKGFD` | https://www.fainders.ai | 실서비스 컷오버 — 아래 주의 |

공통: region `ap-northeast-2`, 계정 `406460793488`. `out/`의 `*_original.*`(미디어 원본 백업)은 sync에서 항상 제외된다.
추가 제외 경로는 `deploy/<target>.env` 의 `SYNC_EXCLUDES`(공백 구분)로 지정한다.

#### ⚠️ PRD 배포 전 반드시
- **CloudFront 함수 비호환**: 라이브 dist의 `rewriteForHomepageSSG` 함수는 `/foo/ → /foo.html` 로 재작성한다.
  새 홈페이지는 `dir/index.html` 구조라, `prd.env` 의 `FLAT_HTML=true` 가 flat `<dir>.html` 을 생성해 호환시킨다.
  (정석은 함수를 `/foo/ → /foo/index.html` 로 바꾸는 것.)
- **`DELETE=true`(현재 설정)**: 2026-07-20 컷오버 이후 켜져 있다. 루트에서 `--delete` 는 산출물에 없는
  객체를 지우므로, `prd.env` 를 건드릴 때는 `aws s3 ls s3://www.fainders.ai/` 로 무엇이 지워질지 먼저 확인할 것.
- **`SYNC_EXCLUDES="homepage_v2/*"` 를 지우지 말 것**: dev 프리뷰가 **같은 버킷의 `homepage_v2/` prefix**에 산다.
  제외하지 않으면 PRD 배포마다 프리뷰 500여 개 객체가 통째로 삭제되고 dev 재배포로 수동 복구해야 한다.
  (실제로 2026-08-05 배포 때 그렇게 됐다 — PRD 06:31 → dev 06:34 재배포.)
  `contact-us/`·`document/` 등은 `public/` 에 있어 산출물에 포함되므로 `--delete` 대상이 아니다.
- 미디어 영상 최신화가 필요하면 배포 전에 `node scripts/sync-youtube.mjs` 실행(별도 가이드: `docs/youtube-showcase-sync.md`).

---

## 미디어 최적화

웹용 압축/리사이즈 스크립트. **최적화본은 원래 파일명 유지**, 원본은 `*_original.*`로 백업(멱등).

```bash
cd products/homepage
node scripts/optimize-images.mjs   # public/images: 긴 변 ≤2560px, q80, 포맷 유지 (sharp)
node scripts/optimize-videos.mjs   # public/videos: ≤1080p, H.264 CRF28, 무음 (ffmpeg 필요)
```

- `--dry` 플래그로 처리 대상만 미리 확인 가능.
- 영상 스크립트는 ffmpeg 필요(`brew install ffmpeg`). 재인코딩이 더 커지면 원본을 유지한다.
- `*_original.*` 는 git 백업용이며 **배포에서 제외**된다(위 sync 참고).

---

## 분석 (GA4)

- 측정 ID `G-GCQKJ5TF6R` (기존 라이브 homepage와 동일 속성), `app/[locale]/layout.tsx`에서 `@next/third-parties`의 `GoogleAnalytics`로 주입 → 클라이언트 네비게이션 페이지뷰 자동 추적.
- **버튼 클릭 이벤트**: 3종 커스텀 이벤트를 12개 지점(네비·홈·제품·미디어·푸터·문의, 데스크톱+모바일)에 계측.
  - `interest_click`(관심 고객) / `lead_acquisition_click`(잠재 고객) / `inquiry_complete`(문의 완료)
  - 공통 파라미터: `location`, `label`. gtag 접점은 `lib/analytics/track.ts` 하나(단일 소스).
  - 공용 `@fai/ui`는 분석 비종속(제네릭 콜백 prop) — GA 명칭은 homepage 브릿지에만.
  - ⚠️ 운영: GA4 콘솔에서 `location`/`label` **맞춤 측정기준** 등록 + `lead_acquisition_click`/`inquiry_complete` **주요 이벤트(전환)** 등록 필요(코드 밖).
  - ⚠️ 다른 tid(`G-FZQS63DGEW` 등)가 함께 수집되면 코드가 아니라 GA "연결된 사이트 태그" 설정 — GA4 관리에서 해제.

## SEO / 다국어 (i18n)

- 로케일: `ko`(기본, index) · `en` · `ja`(둘 다 미번역 → `noindex`). **일본어 코드는 `ja`**(ISO 639-1) — 과거 `jp`(국가코드)에서 교정.
- 로케일별 메타데이터(title/description/keywords/OG)는 `config/site.ts`의 `seo` 맵이 단일 소스 → `app/[locale]/layout.tsx` `generateMetadata`가 소비.
- `<html lang>` 로케일별, hreflang(`ko`/`en`/`ja` + `x-default`=ko), OG 이미지 `public/images/og/og-default.jpg`(1200×630).
- 루트(`/`)는 `public/index.html`이 `navigator.languages` 우선순위로 `/ko`·`/en`·`/ja` 리다이렉트(매칭 실패 시 ko).
- ⚠️ `config/site.ts` `seo` 맵의 `// TODO(marketing)`(en/ja 검색제목·키워드, ja OG제목)은 마케팅 확정 카피로 교체 필요.

### 번역 시트 대조 (`scripts/sync-messages.mjs`)

마케팅 번역 시트 `Homepage text source`와 `messages/{ko,en,ja}.json`의 이격을 검출한다.

```bash
node scripts/sync-messages.mjs                       # 시트에서 CSV로 받아 대조 (인증 불필요)
node scripts/sync-messages.mjs --fixture <dir>       # 로컬 CSV로 대조 (오프라인)
node scripts/sync-messages.mjs --save-fixture <dir>  # 받은 CSV를 보관
```

리포트는 `docs/HOM75_diff_<YYYYMMDD>.md`로 저장된다. **messages를 자동 수정하지 않는다** — 시트가 항상 정답이 아니기 때문이다:

- **코드가 확정안**인 항목은 `i18n/sheet-decisions.json`에 근거와 함께 선언되어 `C. 코드 확정안`으로 분류된다. 선언값이 실제 messages와 어긋나면 `i18n/sheetDecisions.test.ts`가 실패한다.
  `loadDecisionSet()`은 `(key, locale)`만 조회 키로 쓰고 `codeValue`는 버린다. 그래서 코드 값이 나중에 바뀌어도 선언은 계속 `DECIDED`를 반환하고, **그때부터 도구가 실제 이격을 조용히 숨긴다.** 그 상태를 막는 게 위 테스트다 — 선언을 추가·수정할 때 `codeValue`를 실제 값과 맞춰라.
- 시트에는 `언어 전환시 미노출` 같은 **지시문 셀**이 섞여 있어 `D. 지시문 셀`로 걸러진다. 그대로 반영하면 화면에 한국어 지시문이 노출된다.
- **ja는 ko의 번역이 아니다.** 일본 시장용 콘텐츠 변형이 포함된다(예: 카메라 대수, 관리시스템 소구).
- ko 원문을 조인 키로 쓰므로, 같은 ko가 여러 키에 걸리면 `B. 중복매칭`으로 표시된다. 확인 없이 반영하면 다른 키의 번역이 잘못 복사된다.

반영 후 `pnpm test`(특히 `i18n/messageConsistency.test.ts`, `i18n/sheetDecisions.test.ts`)를 반드시 통과시킬 것.

## 문의 폼 (Zapier)

- `ContactUsSection` 제출 시 라이브 `contact-us`와 동일한 Zapier 웹훅으로 전송.
- 포맷 고정: `POST` + `Content-Type: application/x-www-form-urlencoded` + body는 `JSON.stringify(payload)`. **`application/json`으로 보내면 Zap 필드 매핑이 비어 들어감**(주의).
- payload 조립은 `lib/contact/payload.ts`(`buildContactPayload`): 관심사 → `solution[]`(vision checkout/standard store/micro store), 세부 항목은 `content` 자동 생성, `utm_*`/`referrer` 캡처.

## 테스트

- **vitest** (`pnpm test`) — jsdom + @testing-library/react.
- 커버리지: 순수 로직(`buildEvent`/`trackEvent`/`buildContactPayload`/`parseUtm`) 단위 + 문의 폼 제출 대표 흐름.
- i18n 가드: `i18n/messageConsistency.test.ts`(ko/en/ja 키 동기 + 오배치 번역 검출), `i18n/sheetDecisions.test.ts`(시트 확정안 선언이 실제 messages와 일치하는지).
- jsdom 공용 폴리필(`scrollIntoView`/`scrollTo`)은 `vitest.setup.ts`.
- ⚠️ `pnpm lint`는 현재 `eslint-config-next` ↔ `@eslint/eslintrc` 순환참조로 깨져 있음(사전 이슈). 커밋 게이트는 `pnpm build && pnpm test`.

---

## Claude Code 작업 규칙

### 시작할 때마다
```
README.md 읽고 시작해줘
```

### 공용 컴포넌트로 올릴 때
```
이 컴포넌트 공용으로 올려줘
```

Claude Code가 자동으로 아래 3단계를 수행합니다:
1. `src/components/` → `packages/ui/components/` 로 이동
2. `packages/ui/index.ts` 에 export 추가
3. homepage import 경로를 `@fai/ui` 로 교체

### 작업 완료 시마다
```
오늘 작업한 내용 요약해서 CHANGELOG.md에 날짜별로 추가해줘
```

---

## 작업 범위

이 프로젝트에서 작업하는 디자이너는 **`products/homepage/` 안에서만** 작업합니다.

| 작업 내용 | 위치 |
|---|---|
| 페이지 레이아웃, 화면 구성 | `src/app/` |
| 컴포넌트 | `src/components/` |
| 사이트 텍스트, 메뉴, 연락처 등 | `src/config/site.ts` |
| 전역 스타일 | `src/app/globals.css` |

---

## 공용 컴포넌트 사용 (`@fai/ui`)

Button, NavigationBar, Header, Footer, HeroSection은 공용 패키지에서 가져옵니다.

```ts
import { Button, NavigationBar, Footer, HeroSection } from '@fai/ui'
```

공용 컴포넌트 소스는 `packages/ui/components/`에 있습니다.
**직접 수정하지 않습니다.** 수정 필요 시 선연에게 요청합니다.

---

## 디자인 토큰 규칙

- 토큰 위치: `platform-system/root/foundation/`
- 그리드 토큰: `platform-system/root/web/tokens/grid.json`
- **금지**: 임의 색상(`#ffffff`), 임의 픽셀값(`w-[13px]`) 하드코딩

---

## Git 브랜치 규칙

| prefix | 용도 | 예시 |
|---|---|---|
| `feat/` | 기능 개발 | `feat/hero-section` |
| `claude-design/` | Claude Design 컴포넌트 | `claude-design/navigation-bar` |
| `fix/` | 버그 수정 | `fix/button-hover` |
| `design/` | 스타일 변경 | `design/typography` |

Next.js 상세 정보 (참고용)
이 프로젝트는 create-next-app으로 생성되었습니다. 폰트는 Vercel의 새로운 폰트 패밀리인 next/font 및 Geist 폰트를 사용하여 자동 최적화 로드됩니다.

더 자세한 Next.js 기능과 API는 Next.js Documentation을 참고하세요.