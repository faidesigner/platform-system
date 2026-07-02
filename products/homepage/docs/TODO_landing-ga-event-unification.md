# [다음 작업] 랜딩 페이지 GA 이벤트 체계 통일

- 상태: **보류(Deferred)** — 2026-07-01 결정. 급하지 않음.
- 결정: 지금은 통일하지 않고 다음 작업으로 남김. van `form_id` 추가만 선반영(커밋 `1ae73c7`).

## 배경 (왜 필요한가)
메인 홈페이지(Next 앱)와 독립 랜딩 페이지가 **같은 GA4 속성**(`G-GCQKJ5TF6R`)을 쓰는데 **이벤트 체계가 다르다.** 그래서 GA4에서 전환/리포트가 두 갈래로 쪼개진다.

| 서피스 | 이벤트 | 파라미터 |
|---|---|---|
| 메인 (`ContactUsSection`, `lib/analytics`) | `interest_click` / `lead_acquisition_click` / `inquiry_complete` | `location`, `label` |
| `public/contact-bakery-vco.html` | `form_submitted` / `kakao_inquiry_click` | `form_id:'bakery_vco'`, `source`, `medium`, `campaign` |
| `public/contact-van-vco.html` | `form_submitted` / `kakao_inquiry_click` | `form_id:'van_vco'`, `source`, `medium`, `campaign` |

→ 현재는 GA 콘솔에서 `inquiry_complete`와 `form_submitted`를 **각각** 주요 이벤트로 등록해야 커버된다(방법 A). 통일하면 콘솔 작업이 단순해진다.

## 제안 변경 (통일안)
랜딩 2페이지의 gtag 이벤트를 메인과 동일한 이름/파라미터로 정비:
- `form_submitted` → **`inquiry_complete`**
  - `location: 'landing_bakery'` (bakery) / `'landing_van'` (van), `label: '문의하기'`
  - 기존 `form_id` / `source` / `medium` / `campaign`는 파라미터로 유지(출처 분석용)
- `kakao_inquiry_click` → **`inquiry_complete`**
  - `location: 'landing_bakery_kakao'` / `'landing_van_kakao'`, `label: '빠른 상담하기'`
  - (메인 사이트가 카카오를 `inquiry_complete`/`location:'contact_kakao'`로 잡는 것과 정합)

**대상 파일**
- `products/homepage/public/contact-bakery-vco.html` (gtag event 2곳)
- `products/homepage/public/contact-van-vco.html` (gtag event 2곳)

**주의**
- 정적 HTML이라 빌드 불필요, 단 **재배포**(`./scripts/deploy.sh dev|prd`)해야 반영.
- 이벤트명 변경 시점 이전/이후 데이터가 GA에서 나뉘므로, 전환하는 날짜를 리포트에 메모.

## 통일 후 GA4 콘솔 작업(간소화)
- **주요 이벤트**: `inquiry_complete`, `lead_acquisition_click` (2개면 끝, `form_submitted`/`kakao_inquiry_click` 등록 불필요)
- **맞춤 측정기준(이벤트 범위)**: `location`, `label` (+ 랜딩 출처 보려면 `form_id`/`source`/`medium`/`campaign`)
- "이벤트 만들기(파생 이벤트)" **불필요**

## 통일 안 할 경우(현행 유지 시) GA 콘솔 작업
- 주요 이벤트: `inquiry_complete`, `lead_acquisition_click`, `form_submitted` (+선택 `kakao_inquiry_click`)
- 맞춤 측정기준: `location`, `label`, `form_id`, `source`, `medium`, `campaign`

## 관련 미결 항목 (참고)
- GA4 콘솔: `location`/`label` 맞춤 측정기준 등록 + 주요 이벤트(전환) 등록 — 소급 적용 안 됨.
- `G-FZQS63DGEW`가 함께 수집됨 → 코드 아님. GA4 "연결된 사이트 태그" 설정 해제 필요.
- `config/site.ts` `seo` 맵의 `// TODO(marketing)`(en/ja 카피) 확정 교체.
- 참고 문서: `products/homepage/docs/CHANGELOG_ga-seo-contact_20260701.md`
