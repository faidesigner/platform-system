# 베이커리 랜딩 본문 교체(v0.5) + 일본 법인 대표자 변경 (2026-11-19)

## 베이커리 랜딩 (`public/contact-bakery-vco.html`)

요청은 Slack `[유니온/오케이포스] 광고 배너 및 랜딩페이지 건` 스레드(2026-11-19 변유림 님)입니다. 11월 20일 광고 배포 전에 본문을 새 시안으로 바꾸고, CTA(문의 폼)는 기존대로 둡니다.

- 본문을 「VCO 베이커리 랜딩페이지 (1000px) 3차」(최윤정 님, 2026-11-18)로 교체했습니다. 시안 크기는 1000×14813 입니다.
- 시안을 배경색이 바뀌는 섹션 경계에서 8장으로 잘랐습니다. 경계는 0 / 1957 / 3680 / 5363 / 8238 / 9304 / 11291 / 12874 / 14813 입니다.
- `<div class="slides">` 블록 밖(head, 측정 태그, CTA 폼, 고정 버튼, 스크립트)은 바이트 단위로 이전과 같습니다.

### 구조 변경: 이미지를 HTML 밖으로

이전에는 7장이 HTML 안에 base64 로 들어 있어 HTML 하나가 529KB 였습니다. `loading="lazy"` 가 붙어 있었지만 이미지가 HTML 과 함께 전부 내려오므로 아무 효과가 없었습니다.

- 이미지를 `public/images/landing/bakery-v05/01~08.webp` 로 분리했습니다. HTML 은 19.7KB, 첫 장은 54KB, 8장 합계 505KB 입니다.
- 첫 장만 `eager` + `fetchpriority="high"`, 나머지는 `lazy` 입니다. `width`/`height` 를 넣어 로딩 중 레이아웃이 밀리지 않습니다.
- 다음에 시안이 바뀌면 같은 폴더를 덮어쓰지 말고 새 폴더(`bakery-v06` 등)로 만듭니다. 파일명이 같으면 브라우저·CloudFront 캐시에 옛 이미지가 남습니다.

### 이미지 다시 만드는 법

```bash
# 시안 PNG(폭 1000)를 섹션 경계에서 자른 뒤
cwebp -q 86 -m 6 -sharp_yuv s01.png -o public/images/landing/bakery-v05/01.webp
```

섹션 높이가 달라지면 `tests/bakeryLandingSlides.test.ts` 의 `DESIGN_SECTION_HEIGHTS` 와 HTML 의 `height` 를 함께 고칩니다.

### 검증

| 항목 | 결과 |
|---|---|
| 섹션 사이 간격 (390 / 500 / 1440px) | 전부 0px |
| 본문과 CTA 사이 간격 | 0px |
| 가로 넘침 | 없음 |
| 시안 대비 색 차이 (500px × 2배율 = 시안과 같은 1000px) | 섹션별 평균 1.2~2.9 / 255 |
| 데스크톱 본문 폭 | 560px (기존 CSS 그대로) |

`tests/bakeryLandingSlides.test.ts` 가 장수·치수·실제 파일 크기·lazy 설정·inline 금지·CTA 유지를 고정합니다. 실기 확인은 오너가 직접 합니다.

### 하단 고정 버튼 여백 (같은 날 후속 수정)

「우리 매장도 가능한지 확인하기」 고정 버튼이 화면 바닥에 붙어 있었습니다. `.sticky-cta` 의 padding 이 `12px 20px env(safe-area-inset-bottom,0px)` 라서, 아래 여백이 safe-area 값뿐이었고 홈 인디케이터가 없는 환경에서는 0 이 됐습니다. 본문 교체와 무관하게 이전부터 있던 문제입니다.

`12px 20px calc(12px + env(safe-area-inset-bottom,0px))` 로 고쳤습니다. safe-area 가 0 이면 위·아래가 12px 로 같고, 홈 인디케이터가 있으면 그 높이만큼 더 띄웁니다.

| 항목 (390px · 1440px 동일) | 수정 전 | 수정 후 |
|---|---|---|
| 버튼 위 여백 | 12px | 12px |
| 버튼 아래 여백 | 0px | 12px |
| 고정 바 높이 | 63px | 75px |

iOS Safari 처럼 safe-area 가 실제로 잡히는 기기에서는 아래 여백이 12px + 홈 인디케이터 높이로 보입니다. 헤드리스 Chrome 에서는 safe-area 가 0 이라 이 경우는 실기로만 확인할 수 있습니다.

### van 랜딩 하단 고정 바 safe-area (같은 날 후속 수정)

`public/contact-van-vco.html` 의 하단 바는 아래 여백이 16px 고정이고 `viewport-fit=cover` 가 없었습니다. iPhone 에서 Safari 툴바가 접히거나 인앱 브라우저로 열리면 홈 인디케이터(바닥에서 8~13px)가 그 16px 안에 들어와 버튼과 거의 붙습니다. 베이커리와 같은 방식으로 맞췄습니다.

- viewport 에 `viewport-fit=cover` 추가
- `.bottom-bar` 아래 여백을 `calc(16px + env(safe-area-inset-bottom, 0px))` 로 변경
- 푸터 여백도 같은 만큼 늘림(`calc(90px + env(...))`)
- cover 를 켜면 가로 모드에서 본문이 노치 밑으로 들어가므로, body 좌우에 `env(safe-area-inset-left/right)` 를 줘서 이전과 같은 모습을 유지

| 조건 (390×844) | 수정 전 버튼 아래 여백 | 수정 후 |
|---|---|---|
| 인디케이터 없음 (safe-area 0) | 16px | 16px |
| 인디케이터 있음 (safe-area 34px, Chrome 에뮬레이션) | 16px | 50px |

같은 34px 조건에서 베이커리 랜딩은 46px 입니다(12 + 34). Chrome 에뮬레이션은 `viewport-fit` 와 무관하게 env 값을 주므로 실제 Safari·인앱 브라우저 동작은 실기로 확인해야 합니다. 규칙은 `tests/landingSafeArea.test.ts` 가 고정합니다.

## 일본 법인 대표자

ja footer 의 일본 법인 블록(`messages/ja.json` → `footer.japanEntity.ceoValue`)을 `王旻權（Minkwon Wang）` 으로 바꿨습니다. 직함 라벨 `代表取締役` 는 그대로입니다.

About 페이지 인터뷰 카드에는 이전 대표자가 「CEO / Fainders.AI JAPAN」 으로 남아 있습니다(ko·en·ja 공통, `config/site.ts` 의 `id: "lee"`). 인터뷰 콘텐츠라 이번 요청 범위에 넣지 않았고, 유지할지는 결정이 필요합니다.
