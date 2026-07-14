# Dropdown Menu Specification
**Status**: Draft

> DropdownMenu(컨테이너) + DropdownMenuItem(액션 항목) 2개를 한 파일에 정의.
> 위치: `packages/ui/components/dropdown-menu/` · 표면은 **overlay-rules.md Level 1**

## ⚠️ 기존 Dropdown과의 역할 구분 (충돌 방지 규칙 — 필독)

| | 기존 `Dropdown` / `HoverDropdown` | 신규 `DropdownMenu` |
|---|---|---|
| 항목 성격 | **링크(href) 이동** — 내비게이션, 메가 메뉴 | **액션(onClick) 실행** — 더보기, 행 액션 |
| 사용처 | NavigationBar, 헤더 메뉴 | 테이블 행 ⋯ 버튼, 카드 액션, 컨텍스트 메뉴 |
| ARIA | 링크 목록 | `role="menu"` + `menuitem` |
| 선택 기준 | "누르면 다른 페이지로 가는가?" → Dropdown | "누르면 현재 대상에 무언가 실행되는가?" → DropdownMenu |

> 기존 Dropdown(z-40)·HoverDropdown(z-50)의 하드코딩 z-index는 신규 스케일(`--z-dropdown` 200)로 교체 대상 — design-review.md 3번 참조

## 1. 🎯 Definition & Usage
- **목적**: 트리거 클릭으로 열리는 컨텍스트 액션 메뉴
- **사용 금지**: 페이지 이동 목록(→ Dropdown), 값 선택 폼 컨트롤(→ Selector, 추후), 2개 이하 액션(그냥 버튼으로)

## 2. ⚡ Variants

| placement | 정렬 |
|---|---|
| bottom-start *(default)* | 트리거 좌측 기준 |
| bottom-end | 트리거 우측 기준 (화면 우측 가장자리 트리거용) |

## 3. ⚡ Interaction & State
- **열림/닫힘**: 트리거 클릭 토글, 바깥 클릭·Escape 닫힘 (overlay-rules Level 1)
- **항목 실행**: 클릭 또는 Enter/Space → onClick 실행 후 메뉴 자동 닫힘
- **키보드**: 열리면 첫 항목 포커스, ↑↓ 순환 이동
- **hover/focus**: fill-faint 배경, `--duration-instant` 전환
- **접근성**: 트리거 래퍼 `aria-haspopup="menu"` + `aria-expanded`, 패널 `role="menu"` + `aria-label`, 항목 `role="menuitem"`, disabled는 `aria-disabled` + 포커스 제외

## 4. 📐 Layout & Content Rules
- **패널**: min-width 200px, padding `{size.8}`, 트리거 아래 `{size.4}` — 표면은 Level 1(bg-100 + border-tertiary + radius 16 + shadow-M)
- **항목**: 아이콘(선택) + 라벨 + 설명(선택) + endContent(선택), padding `{size.12}`×`{size.8}`, radius `rounded-8px`, `w/text/S`
- **그룹 구분**: 항목 사이 `<Divider />` 사용 (divider.md)
- **endContent**: 단축키 힌트·Badge 등 읽기 전용만 (버튼 중첩 금지)

## 5. 🧩 Props (API)

### DropdownMenu
| prop | type | default | 설명 |
|---|---|---|---|
| trigger | (open, toggle) => ReactNode | 필수 | 트리거 렌더 함수 (기존 Dropdown과 동일 컨벤션) |
| label | string | 필수 | 메뉴 aria-label |
| children | ReactNode | 필수 | DropdownMenuItem / Divider |
| placement | 'bottom-start' \| 'bottom-end' | `'bottom-start'` | 패널 정렬 |
| onOpenChange | (isOpen) => void | – | 열림 상태 알림 |

### DropdownMenuItem
| prop | type | default | 설명 |
|---|---|---|---|
| label | ReactNode | 필수 | 항목 라벨 |
| icon | ReactNode | – | 앞 아이콘 |
| description | ReactNode | – | 보조 설명 |
| endContent | ReactNode | – | 우측 콘텐츠 (읽기 전용) |
| onClick | () => void | – | 액션 — 실행 후 자동 닫힘 |
| disabled | boolean | `false` | |

## 6. 🎨 Token Mapping
```json
{
  "component": "DropdownMenu",
  "surface": "overlay-rules.md Level 1 참조",
  "z-index": "{z-index.dropdown}",
  "panel": { "min-width": "200px", "padding": "{size.8}", "offset": "{size.4}" },
  "item": {
    "typography": "{w.text.S}",
    "padding": "{size.12} x {size.8}",
    "radius": "rounded-8px",
    "hover-bg": "{color.filled.basic.primaryOp-secondary}",
    "icon-color": "{color.icon.basic.secondary}",
    "description": { "typography": "{w.caption.M}", "color": "{color.text.basic.tertiary}" },
    "motion": "{motion.duration.instant}"
  }
}
```

## 7. ✅ Best Practices
- 항목 라벨은 동사형 ("수정", "복제", "삭제")
- 파괴적 액션은 목록 맨 아래 + Divider로 분리, 실행 전 AlertDialog로 확인
- 항목 7개 초과 시 그룹핑 또는 설계 재검토
- 자주 쓰는 액션은 메뉴에 숨기지 말고 노출 버튼으로
