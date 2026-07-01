---
name: homepage-deploy
description: Use when deploying the FAI homepage (products/homepage static export) to the DEV preview or PRD (www.fainders.ai) — building, S3 upload, CloudFront invalidation, and the env-specific quirks.
---

# Homepage 배포 (정적 export → S3/CloudFront)

## 개요
`products/homepage`는 Next.js **정적 export**(`out/`)를 S3에 올리고 CloudFront를 무효화해 배포한다. 한 줄 스크립트 `scripts/deploy.sh <target>`가 빌드·업로드·무효화를 처리한다. 설정은 `deploy/<target>.env`, AWS 자격증명은 `aws` CLI(SSO/`aws configure`)가 별도 관리(계정 `406460793488`, region `ap-northeast-2`).

## 명령
```bash
cd products/homepage
pnpm build && pnpm test        # 사전 게이트 (⚠️ pnpm lint 는 사전 깨짐 — 건너뜀)
./scripts/deploy.sh dev        # DEV 프리뷰 (전용 CloudFront, 루트 서빙)
./scripts/deploy.sh prd        # PRD 실서비스 (확인 프롬프트 있음)
```

## 타깃별 차이 (핵심 함정)
| | DEV (`dev.env`) | PRD (`prd.env`) |
|---|---|---|
| S3 | `s3://www.fainders.ai/homepage_v2` (분리 prefix) | 라이브 루트 |
| CloudFront | 전용 `E1N1DKK4N6NNIM` (프리뷰) | 실서비스 배포 |
| URL | https://d6hs8futv6rcu.cloudfront.net | https://www.fainders.ai |
| `NOINDEX` | **true — 전 페이지 noindex 주입** | false (실 색인 정책 적용) |
| `FLAT_HTML` | false | **true** (`dir/index.html` → flat `<dir>.html` 생성) |
| `DELETE` | true (homepage_v2 prefix 한정, 안전) | 확인 후 |

## 반드시 유의
- **DEV 프리뷰는 전 페이지 noindex**다. 그래서 로케일별 색인 정책(ko=index / en·ja=noindex)은 **PRD에서만** 실제 확인 가능.
- `out/`의 `*_original.*`(미디어 원본 백업)은 sync에서 **항상 제외**된다.
- 정책 PDF는 `public/document/*.pdf`로 **자체 호스팅**됨(상대경로) → 배포에 포함되는지 `out/document/` 확인.
- Mac(ARM) 로컬 빌드 산출물을 그대로 올린다 — 서버 빌드 아님.

## 배포 후 검증
- 프리뷰/실 URL의 `/ko` `/en` `/ja` 진입 확인(404 없음).
- 푸터 정책 링크(개인정보/CCTV PDF) 열림.
- GA: DevTools `window.dataLayer`에서 클릭 이벤트 발화.
- (PRD) `/en` `/ja` `<meta robots>`가 정책대로인지, `sitemap.xml`에 3로케일 포함.

## PRD 배포 전 체크리스트
1. `pnpm build && pnpm test` 통과, `out/` 로케일 3종·PDF 포함 확인.
2. `deploy/prd.env`의 `FLAT_HTML=true` 확인(신규 홈은 `dir/index.html` 구조).
3. en/ja 색인 전환 의도 확인(현재 코드 `index:true`) — 미번역 콘텐츠(YouTube/Stibee 외부동기) SEO 리스크 검토.
4. `aws sts get-caller-identity`로 올바른 계정(`406460793488`) 확인.
5. `./scripts/deploy.sh prd` → 확인 프롬프트 승인.

## 상세
`products/homepage/README.md`의 "빌드 & 배포" 섹션 + `deploy/{dev,prd}.env` 주석 참조.
