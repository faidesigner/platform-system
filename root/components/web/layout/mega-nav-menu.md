# MegaNavMenu Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 메인 네비게이션의 메가 메뉴 조립 컴포넌트. 스타일을 직접 정의하지 않고 `packages/ui`의 Menu(L)·Dropdown(XL)을 조립(Wrapping)
- **사용처**: 데스크톱 상단 NavigationBar의 주 메뉴 영역
- **사용 금지**: 모바일/태블릿 (그건 TabletDrawerMenu). 단순 링크 나열이면 Menu 직접 사용

## 2. ⚡ Props (API)

### NavItem
| prop | type | 설명 |
|---|---|---|
| label | string | 항목 텍스트 |
| href | string | 링크 |
| dropdown | boolean | 드롭다운 여부 |
| dropdownItems | {label,href}[] | 드롭다운 하위 항목 |
| external | boolean | 외부 링크 |
| ariaLabel | string | 외부 링크 접근성 레이블 |
| megaMenuPanel | ReactNode | 커스텀 메가 패널 (지정 시 HoverDropdown + 패널 렌더) |

### MegaNavMenuProps
| prop | type | 설명 |
|---|---|---|
| isTransparent | boolean | 투명 배경 상태(스크롤 위치 연동) |
| navItems | NavItem[] | 네비 항목 목록 |

## 3. ⚡ Interaction & State
- **세그먼트 분절**: navItems를 렌더 단위로 나눔 — 연속 일반 항목 → regular 세그먼트(Menu L 1개), 드롭다운 항목 → 독립 dropdown 세그먼트(Dropdown XL 1개). 항목 순서 보장
- **megaMenuPanel 지정 시**: Dropdown 대신 HoverDropdown + 패널 형태로 렌더
- **isTransparent**: 투명일 땐 흰색 hover(`bg-interaction-light-white-hover`), 아닐 땐 검정 hover(`bg-interaction-light-black-hover`)

## 4. 📐 Layout & Content Rules
- **간격**: 세그먼트 `gap-4xl`, 항목 내부 `gap-s`/`gap-3xs`
- **항목 padding**: `px-m`, `px-ms`, `py-s`
- **radius**: `rounded-fai-s`
- **텍스트**: `text-body`, 상태별 `text-primary`/`text-inverse`

## 5. ✅ Sync Note (코드 확인 2026-07-15)
Tailwind 토큰 클래스 방식 준수. CSS 변수 하드코딩 없음. 양호.
