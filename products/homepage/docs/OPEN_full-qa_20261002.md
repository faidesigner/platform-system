# OPEN — 홈페이지 전체 QA 결과 (2026-10-01~02, PRD `96cc075`)

## 범위
- 대상: **PRD www.fainders.ai** 실물 (main `96cc075`)
- 페이지 31개: 정식 18개(ko/en/ja × 홈·about·contact·media·VCO·무인매장) + 루트, `/xx/products/`, `/xx/playground/`, 문의 랜딩 2개, `privacy-cookie` 3개, 없는 주소(404)
- 엔진 2개: **WebKit**(iOS Safari 엔진), **실제 Chrome**(`channel: 'chrome'` — Playwright 기본 Chromium은 H.264 재생 불가)
- 화면 2개: 데스크톱 1440, iPhone 15(393)
- 자동 점검 124건 + 전체 페이지 스크린샷 124장 육안 검수(언어별 subagent 4개) + 인터랙션 점검(언어 전환·메뉴·footer·모달·폼·탭·캐러셀·영상, 조합당 약 300건)

## 정상 확인 (문제 없음)
- 깨진 이미지 0 / 영상 오류 0 / 모바일 가로 넘침 0 / 번역 키 노출 0 / JS 에러 0
- 링크 56개 전부 200 (외부 포함. LinkedIn 999는 봇 차단 응답)
- 언어 전환 36회: 같은 페이지 유지, `<html lang>`·본문 언어 전환, 스크롤 위치 유지, 연타 정상
- 내비게이션·햄버거 메뉴(스크롤 잠금 해제 포함)·로고·footer 링크·처리방침 개정 모달·맞춤형 광고 설정 정상
- 문의 폼 빈 값 제출 시 로케일별 오류 문구 정상 (실제 제출은 차단하고 시험)
- 탭·케이스 스터디·후기·showcase 캐러셀·뉴스 더보기 정상
- 영상: 홈 5개 + VCO 4개 × 3개 언어 재생 정상, VCO 히어로 기기별 분기 정상
- 기존 배포 게이트(번역 키, 루트 리다이렉트, 모바일 넘침, 쿠키 조항 위치) 통과
- 번역 키 집합 차이(ja 전용 일본 법인 footer·후기, ja 이메일 숨김)는 의도된 것 — `messageConsistency.test.ts`가 허용

## 발견 항목

### 높음
| # | 항목 | 위치 | 확인 |
|---|---|---|---|
| H1 | **없는 주소 → S3 `AccessDenied` XML 노출**. `404.html`은 있지만 CloudFront 오류 응답 설정 0건(PRD `E3GUSL3ADNKGFD`, dev `E1N1DKK4N6NNIM`) | CloudFront | curl·AWS CLI로 확인 |
| H2 | **베이커리 랜딩 "전화 문의" 번호 오류** `tel:+8202-0241-0049` — +82 뒤 0이 남은 잘못된 형식이고, 회사 번호(02-6191-0049)와도 다름 | `public/contact-bakery-vco.html:185` | 직접 확인. **올바른 번호 확인 필요** |
| H3 | **en 오역**: 무인매장 "In-Store Customer Analytics" 설명 "Cameras track customers" — ko·ja는 "고객이 고른 **상품**을 추적". 사람 추적으로 읽혀 개인정보 측면에서 오해 소지 | `messages/en.json` `products.unmannedStore.effectList.2.description` | 직접 확인. 번역 시트도 함께 수정해야 함 |

### 중간
| # | 항목 | 위치 |
|---|---|---|
| M1 | **한국어 단어 중간 줄바꿈** ("솔 / 루션", "레스 / 토랑", footer "511타 / 워") — 코드 전체에 `word-break: keep-all` 0건. ko 전역 CSS 한 줄로 해결 가능 | 전역 CSS |
| M2 | 미디어 모바일: YouTube 캐러셀 진행 바가 썸네일 문구 위에 겹침 | `/xx/media/` 모바일 |
| M3 | en 문의 폼 모바일: 동의 안내 박스 내어쓰기 때문에 "Information collected" 값이 한 줄에 한 단어씩 약 10줄 | `/en/contact/` 모바일 |
| M4 | en 문구: VCO "Easier to use than self-checkout"(VCO 자체가 셀프 계산대), 문의 폼 "[Required]" 바로 아래 "Consent is optional" 모순 | `messages/en.json:73`, `:702` |
| M5 | about 데스크톱: 경영진 2열 경력 텍스트가 콘텐츠 영역 오른쪽 끝(1290px)을 넘음 — ko 약 24px, en 약 60px, ja 약 100px | `/xx/about/` 데스크톱 |
| M6 | ja 문의 폼 모바일: 「特殊施設（スタジアム・イベント会場・」 끝 `・`가 카드 경계에 걸림 | `/ja/contact/` 모바일 |
| M7 | ja about: 경영진 카드에서 사진이 이름을 덮음(「Myungwon Ham」 잘림) — ko에서도 같은지 확인 필요 | `/ja/about/` |
| M8 | 무인매장 케이스 스터디: 녹색 제목·날짜가 매장 사진 위에 직접 올라가 대비가 약함("'23.10" 거의 안 보임) | 전 언어 |
| M9 | `/xx/playground/`(내부 컴포넌트 모음) PRD 공개 — robots.txt는 막지만 페이지는 `index, follow`, 제목이 홈과 같음, en·ja에도 한국어 라벨 | `app/[locale]/playground/` |
| M10 | 문의 랜딩 2개의 동의 체크박스에 수집 항목·목적·보유 기간·거부권 안내가 없음(개인정보보호법 제15조) — 법무 판단 필요 | `public/contact-*-vco.html` |

### 낮음
- 미디어 모바일 첫 뉴스 썸네일이 정사각형으로 잘려 로고가 "ainders.A"로 보임
- 홈 Why FAI 카드 영상이 hover 때만 보여서, 터치 기기에서는 빈 카드로 보임(디자인 판단)
- ja 줄바꿈: 「サポ / ート」, 「目指 / す」, 「ソリューショ / ン」, footer 「2 / 階」 등 단어 중간에서 끊김 / ja footer 두 법인 표의 열 정렬이 서로 다름 / CTA 배너 「、」 뒤 공백 중복
- en: about 투자사·정부 로고가 한글판, "Serve global market leaders" 어색함, 미디어 날짜 형식 혼용(2026-03-18 / 2026. 6. 25), 무인매장 모바일 탭 라벨 2줄, 줄바꿈 "7-/Eleven" 등
- ko: 문의 폼 `개인정보 수집・이용`에 일본어 가운뎃점(U+30FB) — `messages/ko.json:691`, 한국어 표준은 `·`(U+00B7) / 뉴스 본문 "파인더즈AI재팬" 표기(기사 인용 여부 확인)
- 접근성: en·ja 페이지에 한국어 aria-label 하드코딩(`ProductReviews.tsx:45-46`, `StoreCaseStudies.tsx:73,124`, `LanguageSwitcher.tsx:205`, `packages/ui NavigationBar.tsx:284,344`, `MegaNavMenu`, `ScrollTopButton`) / `/contact/`에 `<main>` 2개 중첩 / 홈 히어로 CTA가 `<a>` 안 `<button>`
- privacy-cookie 모바일 ko 안내문 "거 / 부)입니다." 줄바꿈
- 베이커리 랜딩 감사 화면 카카오 링크만 `http://` / van 랜딩 HTML 4.86MB(이미지 base64 내장)
- 미디어 모바일 YouTube 썸네일 maxres 404 콘솔 로그(의도된 fallback, 화면 정상)
- 데스크톱 언어 선택이 hover로만 열림 — 961px 이상 터치 기기(iPad 가로) 미검증
- 폰 가로 화면에서 VCO 히어로 제목이 위로 넘쳐 로고와 겹침(2026-10-01 발견)

## 결함 아님 (캡처 한계·의도된 동작)
- Chrome 모바일 긴 페이지 캡처가 약 16,000px 이후 반복 — 브라우저 캡처 한계, WebKit으로 검증
- 홈 히어로 영상이 스크롤하면 제목을 덮음 — 스크롤 확대 연출(정지 상태에서는 제목 정상, 두 엔진 확인)
- sticky 구간 큰 여백, 모바일 footer 로고·SNS 숨김(≤420px), 캐러셀 다음 카드 일부 노출
- `/xx/products/` → VCO 이동은 클라이언트 리다이렉트로 정상
- 영상·사진 속 한국어 키오스크 화면(촬영물)

## 확인하면 되는 것
- H2: 베이커리 랜딩에서 실제로 받을 전화번호
- H3·M4: en 문구 수정안(번역 시트 담당자와 함께)
- M9: playground를 PRD 빌드에서 뺄지
- M10: 랜딩 동의 문구를 법무 기준에 맞출지
- 실기기: privacy-cookie 모바일 리다이렉트(iOS·Android), iPad 가로 언어 선택

## 산출물 (scratchpad, 저장소 밖)
- 자동 점검: `scratchpad/qa/result-{webkit,chrome}.json`, 스크린샷 `scratchpad/qa/shots/`
- 육안 검수 조각 이미지: `scratchpad/qa/review-{ko,en,ja,misc}/`
- 인터랙션: `scratchpad/qa-interact/`, 스크립트 `scratchpad/wk/qa-sweep.mjs`, `qi-*.mjs`
