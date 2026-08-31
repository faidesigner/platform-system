# CHANGELOG — QA Wave 1 + SEO 2026 리뉴얼 (2026-08-12 ~ 08-14)

대상 커밋 범위: `73d9d38` → `410604b`(develop) / `40aa416`(main·PRD 배포본)

## 요약

Notion "Homepage QA" 보드의 미종료 25건을 전수 분류하고, 그중 13건을 처리해 PRD까지 배포했다.
SEO는 노션 2026 리뉴얼 명세(08-05)를 전면 반영했다. 티켓 처리 과정에서 드러난 구조적 결함
6건을 함께 제거했다.

---

## 처리한 QA 티켓

| ID | 내용 |
|---|---|
| HOM-60·61·62 | 주소 오타 `0662`→`06628`, footer CCTV 방침 제거, ctaBanner 문구 — **코드는 이미 고쳐져 있었고 PRD 미배포가 원인**이었음 |
| HOM-64 | imageSection 히어로를 로케일별 와이드 컷으로 교체 + 폭 상한 상수 갱신 |
| HOM-67 | 푸터 로케일 대응 — 사업자번호 ja 미노출, 전화·이메일 로케일 분리, 일본 법인 정보 ja 전용 행, en 회사명 통일 |
| HOM-68 | 채용 메뉴 ko 전용 |
| HOM-69 | 니세코 이미지 블러본 교체 + **얼굴 노출 원본 파일 삭제** |
| HOM-72 | 상담 토스트 채널 ko=카카오 / ja=LINE / en=미노출 |
| HOM-74 | SEO 2026 명세 반영 (아래 별도 항목) |
| HOM-76 | 리테일테크레터 구독 CTA ja 숨김 |
| HOM-80 | VCO 도입후기 카드 ja 순서 재배열 |
| HOM-23 | 이미 반영·라이브 상태였음을 실측 확인(코드 변경 없음) |
| (신규) | ja 주소 우편번호 누락 → `〒06628` 추가 |

**Pending 처리**: HOM-70(영상 에셋 대기), HOM-63(HOM-59로 일원화 — 인스타 계정 카테고리 문제라 코드 조치 불가)

---

## 설계 결정과 이유

### 1. `config/locale-policy.ts` — 로케일 정책 단일 선언 지점

HOM-67·68·70·72·76·80이 전부 "특정 로케일에서만 다르게 보여라"였다. 컴포넌트마다
`if (locale === 'ja')`를 넣으면 규칙이 코드 전역에 흩어져 "지금 ja에서 뭐가 보이는가"를
답하려면 파일을 전수 조사해야 한다. 표로 선언하고 로케일 전수 테스트로 고정했다.

**담는 것**: 노출 여부·링크 대상(구조). **담지 않는 것**: 표시 문구·로케일별 실데이터 값
(messages/*.json 담당). `config/site.ts`=구조, `messages`=텍스트라는 기존 분리를 따른다.

주의: 드로어(`TabletDrawerMenu`)는 데스크톱 `navItems`를 재사용하지 않고 자체 렌더한다.
데스크톱만 고치면 드로어에 구멍이 남으므로 `showCareers` prop을 따로 전달한다.

### 2. `config/seo.ts` — SEO 문구 단일 소스

SEO 문구가 `config/site.ts`에 별도 사본으로 존재해 **노션 명세가 갱신돼도 코드가 따라가지
않았다**. 실제로 2026 리뉴얼(08-05) 이후에도 2024/v3.0.0 판 문구를 서빙하고 있었다.
구버전 문구가 되살아나면 실패하는 테스트를 함께 넣었다.

> 피그마 디스크립션에는 "config/site.ts 한 파일에서 다 관리"라고 적혀 있으나, 위 사유로
> 분리하기로 협의했다(노션 SEO 페이지에 코멘트로 기록). `site.ts`에서 re-export 하므로
> 기존 import 경로는 그대로 동작한다.

### 3. `lib/seo.ts`의 `pageMetadata` — canonical·og:url 동시 파생

명세가 "⚠️ 버그"로 지목한 **og:url 전 페이지 루트 고정**과, 명세에 없던 추가 결함
**canonical이 ko에만 부여**(en/ja 하위 페이지가 로케일 루트를 정본으로 가리킴)를 함께 고쳤다.
두 값을 같은 경로에서 파생시켜 구조적으로 어긋날 수 없게 했다.

### 4. 키워드를 JSON-LD로 이전

명세 ③이 keyword stuffing 페널티 회피를 위해 "봇만 읽는 구조화 데이터"로 요구했다.
`<meta name="keywords">`를 제거하고 Organization + WebSite를 `@graph`로 묶어
`WebSite.keywords`에 로케일별 주입(ko 28 / en 34 / ja 56).

### 5. `ProductReview.key` 추가 (HOM-80)

정렬 키로 `icon`을 쓸 수 없었다 — ja 전용 리테일(히비노마) 카드가 `icon: 'cafeteria'`를
재사용해 급식 카드와 구분이 안 된다. 정렬 규칙에 없는 카드는 원래 순서로 뒤에 남겨
신규 카드가 조용히 사라지지 않게 했다.

---

## 함께 제거한 구조적 결함

1. **PRD 배포가 dev 프리뷰를 삭제하고 있었다.** PRD는 버킷 루트에 `--delete`로 sync 하는데
   dev 프리뷰가 같은 버킷 `homepage_v2/`에 산다. 배포마다 537개 객체가 삭제되고 dev 재배포로
   수동 복구해야 했다(08-05에도 PRD 3분 뒤 dev를 다시 올린 흔적). `SYNC_EXCLUDES`로 차단.
2. **죽은 컴포넌트** `packages/ui/components/Footer.tsx` — export되지 않는 레거시인데 옛 주소와
   CCTV 링크를 들고 있어 grep 오진을 유발했다. 삭제.
   (`Header.tsx`는 `base/platform-system-work`의 Design Origin이 실제 사용 중이라 남김)
3. **`customerImages` 이중 복제** — 동일 배열이 `page.tsx`와 `CustomersSection.tsx`에 있었고
   교체 대상도 양쪽에 존재했다. `config/site.ts`로 통합.
4. **외부 데모 mp4 의존** — `ProductHero`의 폴백이 `w3schools.com`의 데모 mp4였다. 제거.
5. **전화·이메일 로케일 무관 하드코딩** — 푸터 `VALUES.tel`/`email`이 고정이라 en·ja에도
   한국 국내 표기가 나갔다. messages로 분리.
6. **파일 삭제 없이 참조만 바꾸면 원본이 계속 공개된다**(HOM-69). 얼굴 노출 사진이
   `www.fainders.ai/images/customers/04-foodCourt-niseko-1.jpg` 로 200 서빙 중이었다.
   `public/`에서 파일을 지워야 `--delete` sync가 S3 객체까지 제거한다.

---

## 추가한 회귀 테스트 (모두 "실패해야 할 때 실패하는지" 실측 확인)

| 파일 | 무엇을 고정하나 |
|---|---|
| `config/locale-policy.test.ts` | 로케일별 노출·링크 정책 전수 |
| `config/seo.test.ts` | 구버전 SEO 문구 잔존, 키워드 규모, canonical=og:url, 페이지별 og:url 상이, OG 1200×630 |
| `config/customerImages.test.ts` | **소스 트리를 훑어 config 밖 하드코딩 탐지** — 배열 재복제 시 실패 |
| `components/sections/home/imageSection-aspect.test.ts` | **webp 헤더를 파싱해 폭 상한 상수와 대조** — 이미지 교체 시 상수 미갱신을 잡음 |
| `components/layout/FooterBridge.test.tsx` | 로케일별 푸터 노출·실데이터, 우편번호, `キル` 표기, CCTV 잔존 |
| `components/__tests__/tablet-drawer-careers.test.tsx` | 드로어 채용 항목(데스크톱과 별도 경로) |
| `components/sections/contact/ContactUsSection.locale.test.tsx` | 상담 채널 로케일 분기 |
| `components/sections/media/RetailTechLetterSection.test.tsx` | 구독 CTA 노출 |

총 147건 GREEN.

---

## 주의사항 / 남은 위험

- **og:image는 임시본**이다. 명세 첨부가 4032×3024 원본 사진(회전)이라 규격 미달이어서
  승인된 홈 히어로 컷을 1200×630으로 크롭해 넣었다. 정식 에셋이 오면
  `public/images/og/og-{ko,en,ja}.jpg` 교체만 하면 된다.
- **HOM-70 영상 경로는 세 로케일 모두 ko 영상을 가리킨다**(`TODO(HOM-70)` 표시). ja/en 자막본이
  들어오면 `config/locale-policy.ts`의 `vcoHeroVideo` 경로만 바꾸면 된다.
- **번역 시트가 코드보다 최신이다**(08-11 vs 08-05). 다음 싱크 전에
  `docs/HOM75_translation-diff_20260818.md`를 먼저 읽을 것 — 기계적 덮어쓰기는 확정안을 되돌린다.
- ESLint는 설정 순환참조로 실행 자체가 실패한다(이 작업 이전부터). `tsc --noEmit`도 테스트
  파일에서 기존 에러 4건이 있다. 프로젝트 게이트는 `pnpm test` + `next build`다.
