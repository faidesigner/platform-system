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

### 배포 대상 (static-sites 인프라 계승)

| 항목 | 값 |
|---|---|
| S3 버킷 | `s3://www.fainders.ai` (region `ap-northeast-2`, 계정 `406460793488`) |
| CloudFront | distribution `E3GUSL3ADNKGFD` |
| 정식 도메인 | `https://www.fainders.ai` (apex `fainders.ai` 아님 — canonical 일치 필수) |

### 배포 절차 (복붙 실행 가능)

```bash
cd products/homepage

# 0) [필수] 배포 직전 버킷 대조 — repo에 없는 라이브 standalone 파일 누락 방지
aws s3 ls s3://www.fainders.ai/ | grep -iE '\.html$' 
# 위 목록 중 out/ 루트에 없는 파일이 있으면 그대로 둘지 확인 후 진행

# 1) 해시 에셋(불변) — 장기 캐시, _original·HTML류 제외
aws s3 sync out/ s3://www.fainders.ai \
  --exclude "*_original*" --exclude "*.html" --exclude "*.txt" --exclude "*.xml" \
  --cache-control "public,max-age=31536000,immutable"

# 2) HTML/sitemap/robots(가변) — no-cache + stale 삭제, _original 제외
aws s3 sync out/ s3://www.fainders.ai \
  --exclude "*_original*" \
  --cache-control "public,max-age=0,must-revalidate" --delete

# 3) CloudFront 무효화
aws cloudfront create-invalidation --distribution-id E3GUSL3ADNKGFD --paths "/*"
```

> ⚠️ `--exclude "*_original*"` 를 빼먹으면 미디어 원본(수백 MB)이 그대로 CDN에 올라간다.
> ⚠️ `--delete` 는 2단계에만 둔다. standalone 페이지(`contact-*.html`, 네이버 인증 파일)는
> `out/`에 포함돼 있으므로 삭제되지 않는다(0번 대조에서 재확인).

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

- 측정 ID `G-GCQKJ5TF6R` (기존 라이브 homepage와 동일 속성), `app/layout.tsx`에서 주입.
- `@next/third-parties`의 `GoogleAnalytics`로 클라이언트 네비게이션 페이지뷰까지 자동 추적.

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