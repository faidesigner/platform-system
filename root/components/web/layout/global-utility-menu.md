# GlobalUtilityMenu Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 글로벌 유틸리티 메뉴(다국어 등 부가 기능) 조립 컴포넌트. `packages/ui`의 Dropdown(S)·Menu(M)를 Wrapping
- **사용처**: NavigationBar 우측 유틸리티 영역 / 드로어 내 부가 메뉴
- **사용 금지**: 주 네비게이션(그건 MegaNavMenu). 언어 전환 단독이면 LanguageSwitcher 직접 사용

## 2. ⚡ Props (API)
| prop | type | 설명 |
|---|---|---|
| navItems | NavItem[] | 유틸리티 항목 목록 |
| langRow | ReactNode | 언어 전환 UI (NavigationBar가 주입) |
| onClose | ()=>void | 메뉴 닫기 콜백 (필수) |
| isTransparent | boolean | 투명 상태(기본 false, Drawer는 항상 bg-surface) |

## 3. ⚡ Interaction & State
- **항목 렌더**: 종류별로 Dropdown(S) 트리거 또는 일반 링크 — 동일 토큰(ITEM_BASE) 공유
- **hover**: `bg-interaction-light-black-hover` + `text-primary`
- **전환**: `transition-colors duration-200`

## 4. 📐 Layout & Content Rules
- **항목**: `px-m py-xs`, `text-body-s`, `rounded-fai-s`, full-width space-between
- **간격**: `gap-m`, `gap-s`
- **섹션 padding**: `py-2xl`, `py-xs`
- **구분선**: `border-b border-border-subtle`
- **배경**: `bg-surface`

## 5. ✅ Sync Note (코드 확인 2026-07-15)
Tailwind 토큰 클래스 방식 준수. CSS 변수 하드코딩 없음. 양호.
