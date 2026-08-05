# Meta 픽셀 설치 — 베이커리 랜딩 (2026-08-05)

- 요청: Slack `#prj_homepage` 2026-08-04 김진영 ([스레드](https://faindersai.slack.com/archives/C07K3SZU612/p1785812373798869))
- 픽셀 ID: `1050256220905747`
- 대상: `products/homepage/public/contact-bakery-vco.html` **1개 페이지 한정**
- 배포: PRD `main @ eb7ecd3` (2026-08-05 03:50 UTC) / develop 반영 `9b5c313`

## 배경
Meta 광고관리자에는 픽셀이 등록돼 있었으나 랜딩 페이지에 코드가 없어 방문자 데이터가 수집되지 않았다. 광고 성과 측정이 불가능한 상태.

## 변경 내용

| 항목 | 위치 | 결정 이유 |
|---|---|---|
| 기본 코드(PageView) | GA 스니펫 직후 `<head>` 인라인 | 외부 스크립트로 분리하면 로드 지연분만큼 초기 PageView 유실 위험 |
| `<noscript>` 폴백 | `<body>` 직후 | HTML 스펙상 head 내 `noscript`는 `link`/`style`/`meta`만 허용. `img`를 넣으면 파서가 head를 강제 종료해 이후 파싱 순서가 의도와 달라진다 |
| `fbq('track','Lead')` | Zapier 전송 **성공 콜백** (GA `form_submitted`와 동일 지점) | 폼이 페이지 이동 없이 `thankView` 토글 구조라 thank-you page가 없다. `catch`/감사화면 전환부에 두면 **전송 실패 리드까지 광고 전환으로 집계**된다 |

## 설치 전 확인 사항
- **중복 픽셀 없음**: 레포 전역 `fbq`/`fbevents`/GTM 컨테이너 0건, 설치 전 라이브 응답도 GA(`G-GCQKJ5TF6R`) 단독.
- **van 랜딩 미설치**: `contact-van-vco.html`은 요청 범위 밖. 테스트로 미설치 상태를 고정했다.

## 검증 (Playwright, 실제 네트워크 요청 기준)

| 환경 | PageView | Lead |
|---|---|---|
| 로컬 정적 빌드 | `facebook.com/tr?id=1050256220905747&ev=PageView` → 200 | `&ev=Lead` → 200 |
| PRD (`www.fainders.ai`) | 동일, `domain=www.fainders.ai` → 200 | 동일 → 200 |

Lead 검증 시 `window.fetch`를 스텁해 **Zapier 호출만 차단**했다(영업팀에 테스트 리드 미발생, 차단 1건 확인). 픽셀 발화 경로는 실제 코드 그대로 실행됐다.

## 회귀 방지 — `tests/landingTags.test.ts`
정적 랜딩 HTML은 컴포넌트 테스트 범위 밖이라 파일 재생성·덮어쓰기 시 측정 태그가 조용히 유실될 수 있다(GA 태그도 동일 위험). 다음을 문자열로 고정:

- GA4 측정 ID / `form_submitted` 존재 (bakery·van 양쪽)
- 픽셀 ID / `PageView` / `Lead` 존재
- **Lead 발화 위치**가 `form_submitted` 뒤 & `catch` 앞 (시점이 옮겨지면 실패)
- `noscript`가 `</head>` 뒤에 위치
- `fbq('init')` 중복 0건
- van 랜딩에 `fbq(` 미존재

> 테스트 파일을 `public/`에 두면 배포 산출물 `out/`으로 복사돼 외부 노출되므로 `tests/`에 배치했다.

## 남은 조치 (코드 밖)

1. **개인정보 고지 — 마케팅·법무 확인 필요 (우선)**
   Meta 픽셀은 GA와 달리 **행태정보를 광고 목적으로 제3자(Meta)에 전송**한다. 현재 랜딩 동의 UI는 `"개인정보 수집·이용에 동의합니다."` 체크박스 하나뿐이고 **개인정보처리방침 링크조차 없다.** 제3자 제공·맞춤형 광고 목적은 미고지 상태.
   → ① 랜딩에 처리방침 링크 추가, ② 방침에 행태정보(광고 픽셀) 수집 항목·거부 방법 반영.
2. **Meta 이벤트 관리자 확인**: 요청자 측에서 Pixel Helper / 테스트 이벤트로 최종 확인.
3. **van 랜딩 확대 시**: 픽셀까지 복붙되면 3번째 랜딩에서 또 반복된다. 그 시점에 GA·UTM·픽셀 스니펫을 공용 스크립트로 분리하고, 위 테스트의 van 케이스를 픽셀 검증으로 승격할 것. (관련: `docs/TODO_landing-ga-event-unification.md`)
4. **GA 부수 관측**: 랜딩에서 `tid=G-FZQS63DGEW`로도 수집된다(코드 아님 — GA4 "연결된 사이트 태그"). 기존 TODO와 동일 이슈.
