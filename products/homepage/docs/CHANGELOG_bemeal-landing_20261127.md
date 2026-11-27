# /bemeal 페이지 추가 (2026-11-27)

## 무엇
- `https://www.fainders.ai/bemeal` — 비밀베이커리 점주 전용 AI 키오스크 도입 안내 페이지.
- 소스: `public/bemeal/index.html`(받은 `bemeal_index.html` 이름 변경), `public/bemeal/og.jpg`(1200×630, 카카오톡 공유 미리보기).

## 원본에서 바꾼 것 (2줄)
- `og:url` `https://bemeal.fainders.ai/` → `https://www.fainders.ai/bemeal`
- `og:image` `https://bemeal.fainders.ai/og.jpg?v=2` → `https://www.fainders.ai/bemeal/og.jpg?v=2`
- 원본은 `bemeal.fainders.ai` 서브도메인 기준으로 만들어져 있었다. 그 호스트는 없으므로 그대로 두면 미리보기 이미지가 안 뜬다.
- 그 외 본문·스크립트는 손대지 않았다.

## 왜 `bemeal/index.html` 구조인가
- PRD: CF 함수 `rewriteForHomepageSSG` 가 `/bemeal`·`/bemeal/` → `/bemeal.html`. `deploy.sh`(FLAT_HTML) 가 `bemeal/index.html` 을 `bemeal.html` 로 복사한다.
- DEV: S3 website 엔드포인트가 디렉토리 `index.html` 을 서빙한다.
- `public/bemeal.html` 단일 파일로 두면 DEV 에서 `/bemeal` 이 안 열린다.

## 누락 방지 장치
1. `scripts/deploy.sh` `REQUIRED_FILES` 에 `bemeal/index.html`, `bemeal/og.jpg` 등록. PRD 는 `bemeal.html` 도 확인. 없으면 업로드 전에 중단.
2. `tests/bemealLanding.test.ts` — 파일 존재, OG 절대 URL, 다른 호스트 참조 없음, `og:image` 크기 선언 = 실제 1200×630.
3. README "standalone 페이지" 표, `homepage-deploy` 스킬에 기록.

## 의도적으로 안 한 것
- sitemap 미등록: 특정 고객사 점주 대상 페이지라 검색 노출 여부가 정해지지 않았다. robots `noindex` 도 넣지 않았다(원본 유지). 정해지면 둘 중 하나를 넣는다.
- GA·Meta 픽셀 없음: 원본에 측정 태그가 없다. 유입 측정이 필요하면 `contact-*` 랜딩과 같은 GA4(`G-GCQKJ5TF6R`)를 붙이고 `landingTags.test.ts` 에 추가한다.
