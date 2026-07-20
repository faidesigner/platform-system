# DrawerPrimitives Specification
**Status**: Draft

> 드로어의 공통 뼈대 3종: `DrawerMenu`(컨테이너) + `DrawerListItem`(항목) + `DefaultListIcon`(기본 아이콘).
> TabletDrawerMenu 등이 이 프리미티브를 조립해 사용.

## 1. 🎯 Definition & Usage
- **DrawerMenu**: 드로어 내비 컨테이너(`<nav>`), 세로 스택
- **DrawerListItem**: 드로어 항목 — 내부링크/외부링크/버튼 3형태 자동 분기
- **DefaultListIcon**: 항목 기본 아이콘(점선 사각형 SVG)
- **사용처**: 모바일/태블릿 드로어 메뉴 구성
- **사용 금지**: 데스크톱 메가메뉴(그건 MegaNavMenu)

## 2. ⚡ Props (API)

### DrawerListItem
| prop | type | 설명 |
|---|---|---|
| label | string | 항목 텍스트 (필수) |
| href | string | 링크 주소 |
| isExternal | boolean | 외부 링크 여부 (target=_blank + noopener) |
| onClick | ()=>void | 클릭 콜백 |
| rightIcon | ReactNode | 우측 아이콘 |
| children | ReactNode | 하위(아코디언 내용 등) |

## 3. ⚡ Interaction & State
- **렌더 분기**: href+isExternal → `<a target=_blank>`, href만 → next `<Link>`, href 없음 → `<button>`(아코디언 토글용)
- **접근성**: 컨테이너 `aria-label="Drawer Navigation"`, 외부링크 rel="noopener noreferrer"

## 4. 📐 Layout & Content Rules
- **컨테이너**: 세로 스택, `padding-bottom 3XL(40px)`, `bg-100`, full-width
- **항목**: `padding 16px 40px`, space-between, radius `S(8px)`
- **텍스트**: text-basic-secondary, 16px/500, lineHeight 24px, Pretendard

## 5. ✅ Sync Note (코드 확인 2026-07-15)
Tailwind 토큰 클래스 방식으로 수정 완료. 컨테이너는 `bg-100 pb-3xl`, 항목은 `px-3xl py-m rounded-fai-s`, 텍스트는 `text-body font-medium text-secondary`로 연결됨. 기본 아이콘 색상도 `currentColor` 상속으로 전환됨.
