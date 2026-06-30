# 개발 로그 — 홈페이지 정적 export 배포화 + SEO/GA + 미디어 최적화

- **날짜:** 2026-06-30
- **브랜치:** `feat/static-export-deploy` (base `main` @ `d9888a9`)
- **범위:** `products/homepage` 를 정적 export로 배포 가능하게 전환 + SEO/GA + 기존 페이지 보존 + 미디어 최적화
- **상태:** 구현·로컬 빌드·브라우저 QA 완료. **push·S3 배포는 하지 않음.**

---

## 배경 / 의사결정

- 새 홈페이지(`platform-system/products/homepage`, Next 16 / React 19 / Tailwind 4 / next-intl)를
  기존 `static-sites` 레포로 **이식하지 않기로** 결정. 전용 모노레포를 단일 소스(SSOT)로 두고
  여기서 빌드·배포하는 것이 유지보수·drift 측면에서 정방향.
- 배포 모델: 마케팅 사이트이므로 **정적 export → 기존 S3(`www.fainders.ai`)+CloudFront(`E3GUSL3ADNKGFD`) 인프라 계승**.
  (SSR 불요 — 서버 의존 코드 없음 확인됨.)
- i18n URL: `localePrefix: 'always'` (`/ko`·`/en`·`/jp`). 미들웨어 없는 정적 환경에 가장 안전.
- 색인 정책: en/jp가 현재 한국어 콘텐츠(미번역)라 **/ko만 색인, /en·/jp는 noindex**. 번역 완료 시 해제.

---

## 변경 요약 (커밋 순)

1. `4e228d9` **정적 export 전환**
   - `next.config.ts`: `output:'export'`, `images.unoptimized`, `trailingSlash`
   - `i18n/routing.ts`: `localePrefix:'always'`
   - `[locale]/layout.tsx`: `generateStaticParams` + `setRequestLocale`, 전 페이지 `setRequestLocale`
   - **`proxy.ts`(next-intl 미들웨어) 삭제** — export 비호환(이게 핵심 차단 요소였음)
   - `public/index.html`: 루트 언어감지 리다이렉터(`ja→jp`, hreflang, noscript 폴백)
2. `ce5fea4` **SEO + GA4**
   - `app/sitemap.ts`(ko URL만), `app/robots.ts`(playground 차단, en/jp는 crawl 허용해 noindex 읽히게)
   - 로케일별 robots(ko=index / en·jp=noindex), 페이지별 title + ko self-canonical
   - Organization JSON-LD, OG/Twitter 이미지, `config/site.ts` url → `https://www.fainders.ai`
   - `@next/third-parties` GoogleAnalytics (`G-GCQKJ5TF6R`)
3. `8279813` **기존 standalone 페이지 보존** — `contact-bakery-vco.html`, `contact-van-vco.html`,
   네이버 사이트 인증 파일을 `public/`로 이식
4. `b18044e` **이미지 최적화** — `scripts/optimize-images.mjs`(sharp, ≤2560px, q80, 포맷유지, 멱등).
   36개, 131MB → 21MB (-84%). 원본 `*_original.*` 보관
5. `8246653` **영상 최적화** — `scripts/optimize-videos.mjs`(ffmpeg, ≤1080p, H.264 CRF28, 무음, 멱등).
   13개 최적화 + 재인코딩 이득 없는 타임랩스 2개 원본유지. 배포본 207MB → 71MB (-66%)
6. `c94c4ab` **QA 수정** — `case-study-poster.jpg` 404(기존 버그) → 영상 첫 프레임으로 poster 생성
7. `4de8f40` **코드 리뷰 픽스** — index.html canonical/hreflang www 통일, 미디어 스크립트
   실패 시 롤백 가드(데이터 손실 방지), `locale==="ko"`→`routing.defaultLocale`,
   robots host bare hostname, JSON-LD logo SVG→PNG
8. `15dc084` **PNG → webp** — `scripts/convert-png-to-webp.mjs`. 이미지 PNG 25개를 webp로
   변환(그라데이션 lossless·사진 q82, 알파 보존) + `/images/*.png` 참조만 정밀 치환.
   이미지 추가로 15.0MB → 3.75MB (-75%). 원본 `*_original.png` 보존

**배포 미디어 총합: ~343MB → ~86MB (-75%).** (이미지 ~15MB + 영상 ~71MB)
git에는 `*_original` 백업 포함(사용자 선택).

---

## QA 결과 (로컬 `out/` + Playwright)

- 루트 `/` → 로케일 리다이렉트 동작 / `/ko` 홈 이미지 37개 로드, GA 발화, robots·canonical 정상
- `/en` = `noindex`(canonical 없음) / products 상세 = 최적화 영상 4개 재생 준비완료, 이미지 깨짐 0
- `contact-bakery-vco.html` standalone 정상 로드

---

## ⚠️ 주의사항 / 배포 전 체크

- **배포 sync에 `--exclude "*_original*"` 필수** — 안 그러면 미디어 원본 수백 MB가 CDN에 올라감.
- **배포 직전 실제 버킷과 대조** — repo `public`에 없는 라이브 standalone 파일이 버킷에 있을 수 있음.
- canonical/도메인은 `www.fainders.ai` 로 통일됨. apex로 바꾸려면 `config/site.ts` + 인프라 동시 조정.

## 후속 과제 (이번 범위 밖)

- **컨택트 폼 미배선**: `ContactUsSection`이 제출 시 `console.log`만 함(외부 전송 없음 + 개인정보 콘솔 노출).
  구 홈페이지의 Zapier 연동 부재. 폼 배선 시 PII 로그 제거 필요.
- **en/jp 번역**: 본문이 `config/site.ts`에 한국어 하드코딩. 번역 후 next-intl 메시지로 분리 + 색인/hreflang 해제 필요.
- (해결됨) ~~`about-hero.png` 2.9MB~~ → webp 변환으로 0.24MB (커밋 `15dc084`).
