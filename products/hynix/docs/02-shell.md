# 02 · AppShell (3영역 골격 상수)

> 어드민 정렬을 지배하는 것은 12컬럼 그리드가 아니라 **사이드바 + 헤더 + 콘텐츠** 3영역 골격이다.
> 아래 값을 `src/constants/layout.ts` 상수로 고정하면 전 화면이 자동 정렬된다.
> **개별 화면에서 수치를 다시 고정하지 말고 대칭·정렬만 맞춘다.** px 하드코딩 금지.
>
> **업데이트(hynix 파일럿 반영):** SCR-41(메뉴 관리)·SCR-41-상세(단품 등록) 구현으로 아래 값이 파일럿에서 확정됨. 컴포넌트는 `products/hynix/app/components/ui/`에서 먼저 만들고 검증 후 공용 `packages/ui`로 승격한다.

---

## 1. 레이아웃 상수 (파일럿 확정값)

| 항목 | 값 | Tailwind/토큰 | 비고 |
|---|---|---|---|
| 사이드바 폭 (펼침) | **264** | `w-[264px]` | 로고+유저배지+nav. pad 24, gap 20 |
| 사이드바 폭 (접힘) | **72** | `w-[72px]` | 아이콘만, pad 24/14 |
| nav-list-item 폭 | 216 | — | 사이드바 내부 아이템 |
| 헤더(breadcrumb) 패딩 | 24 24 12 | `pt-XL px-XL pb-MS` | page_header 영역 |
| 콘텐츠 패딩 (데스크톱) | 24 | `p-XL` | spacing `XL` |
| 콘텐츠 패딩 (모바일) | 16 | `p-M` | spacing `M` |
| 섹션 콘텐츠 최대폭 | **944** | `max-w-[944px]` | 폼 섹션 우측 콘텐츠 (넘침 방지 `min-w-0` 병행) |
| 섹션 제목 폭 | 160 | `w-[160px]` | 좌측 고정 (기본 정보/영양·알레르기/노출 정보) |

> **초기 문서값(240/56)에서 변경:** hynix 사이드바는 로고+유저배지+3그룹 메뉴를 담아 264px로 확정. 접힘은 72px.

```ts
// src/constants/layout.ts (hynix 파일럿 확정)
export const LAYOUT = {
  sidebar:          264,
  sidebarCollapsed: 72,
  navItem:          216,
  contentPad:       24,   // 모바일 16
  sectionMaxWidth:  944,
  sectionTitle:     160,
} as const;
```

---

## 2. spacing scale (골격 내부)

AppShell·화면 내부 간격은 **6단계 안에서** 해결한다.

`4 · 8 · 12 · 16 · 24 · 32` = `2XS · S · MS · M · XL · 2XL`

- 컴포넌트 사이 기본 간격: `gap-M`(16)
- 촘촘한 그룹(라벨-입력): `gap-S`(8)
- 필드 사이(폼): `gap-XL`(24)
- 섹션 사이: `gap-XL`(24)
- 라벨-힌트: `gap-2XS`(2~4)

---

## 3. 폼 화면 그리드 (파일럿 확정 패턴)

폼 화면 정렬 규칙 (SCR-41-상세 기준):

| 항목 | 값 |
|---|---|
| 섹션 = [제목 160 고정] + [콘텐츠 flex, max 944] | 좌우 2단 |
| 필드 2단 배치 | `flex gap-24 flex-wrap` (좁으면 세로 쌓임) |
| 3열 인풋(영/중/일문, 대/중/소분류) | `grid auto-fit minmax(160px,1fr)` |
| 영양 6칸 | `grid auto-fit minmax(180px,1fr)` |
| 알레르기 다열 | `grid auto-fit minmax(96px,1fr)` |

**핵심 규칙 — 인풋 넘침 방지:**
- 모든 flex 자식 컨테이너에 `min-width:0`
- Input/Select 컴포넌트 래퍼는 `min-width:0; width:100%` 내장 (컴포넌트 레벨에서 보장 — 화면에서 재처리 불필요)
- 고정 px 폭(`width:400` 등) 대신 `flex:1 + min-w-0 + max-w` 사용
- 좁아지면 다열 그리드는 `auto-fit`으로 자동 줄바꿈

---

## 4. 반응형 (grid.json 기준)

| 이름 | 폭 | 컬럼 | gutter | 컨테이너 패딩 | 최대 콘텐츠 |
|---|---|---|---|---|---|
| mobile | 390 | 4 | 16 | 20 | 100% |
| tablet | 768 | 8 | 20 | 24 | 720 |
| laptop | 1280 | 8 | 20 | 24 | 1120 |
| **desktop** | 1440 | 12 | 24 | 32 | 1200 |
| desktopLarge | 1920 | 12 | 24 | 40 | 1440 |

어드민 기본 타깃: **desktop(1440)**. 단 콘텐츠 패딩은 §1 값(24)을 우선.

**hynix 파일럿 반응형 방침:** 폼·목록 모두 `auto-fit` 그리드 + `flex-wrap`으로 좁은 폭에서 자동 재배치되게 구현(§3). 사이드바가 264px를 점유하므로 콘텐츠 실폭이 좁아질 때 인풋 잘림이 나기 쉬움 → §3의 넘침 방지 규칙 필수.

---

## 5. 3영역 구조 (골격)

```
┌─────────────────────────────────────────────┐
│  page_header (breadcrumb, px-24 pt-24 pb-12) │  ← 브레드크럼 · (우측 유틸)
├──────────┬──────────────────────────────────┤
│ Sidebar  │  Content (p-XL / 모바일 p-M)       │
│ (w-264   │                                    │
│  /72)    │   [화면별 콘텐츠, 섹션 max-944]     │
│          │                                    │
│ 로고     │                                    │
│ 유저배지 │                                    │
│ nav-list │                                    │
└──────────┴──────────────────────────────────┘
```

- 모든 페이지는 **AppShell(Sidebar + page_header + Content)** 안에 렌더.
- Sidebar는 `app/components/ui/sidebar/Sidebar.tsx` (파일럿, 승격 대기).
- Sidebar는 `position: sticky; top: 0; height: 100vh`로 스크롤 고정.

---

## 6. 메뉴 구조 (hynix 확정)

사이드바는 데이터(`NavGroup[]`)로 구성. 3그룹 구조:

```
[그룹 1 · 제목 없음]
  - 실시간 대시보드
  - 운영 대시보드
  - 시스템 설정

[그룹 2 · 현장 운영]
  - 식수권한 ▸ 식수 내역 / 식수 권한 관리 / QR
  - 현장     ▸ 식당 코너 관리 / 리더기 관리 / 현장 운영 리포트
  - CX       ▸ VoC / 게시판 관리

[그룹 3 · 식단 운영]
  - 메뉴 식단 ▸ 메뉴 관리 / 식단 관리
  - 정산 계약
```

- title(섹션 제목) / main(대분류, chevron) / sub(소분류, 42px 들여쓰기) 3종 아이템.
- main selected = teal-500 글자, sub selected = teal-50 배경.
- 접힘(72px)에서는 아이콘만 + 구분선, 툴팁으로 라벨.
- 아이콘은 `app/components/ui/icon/`에 SVG 넣고 Icon 컴포넌트로 교체 예정(현재 스캐폴드).

---

## 7. 브랜드 · 컴포넌트 (파일럿 확정)

- **hynix 브랜드 주색: teal-400 `#009A93`** (버튼 채움 `filled-brand-primaryBtn`). 피그마 조정 반영, color-brand.css Light 갱신 완료.
- **폼 컴포넌트(파일럿, 승격 대기):** Button / Input / Textarea / Select / Radio / Checkbox / Toggle / TagChip / Badge / Table / Breadcrumbs / Sidebar + Icon(스캐폴드).
- Input·Textarea focus = CSS `:focus-within`/`:focus` → teal 테두리 (state 없음, 리렌더 0).
- 색은 전부 `root/foundation` 토큰 참조(하드코딩 폴백만). 브랜드 전환 자동 대응.

---

## 8. 미확정 (남은 결정)

- 반응형 범위: 태블릿까지 열지 최종 확정 (현재 auto-fit로 대응 중이나 브레이크포인트 정책 미정)
- 브라우저 지원 범위: 크롬 전용 권장
- 사이드바 접힘 기본값 / 접힘 트리거 위치·아이콘
- 파일럿 컴포넌트 → 공용 `packages/ui` 승격 시점
- 아이콘 SVG 확정 및 Icon 레지스트리 등록
