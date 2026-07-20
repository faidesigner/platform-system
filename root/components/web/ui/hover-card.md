# Hover Card Specification
**Status**: Draft

> 표면은 **overlay-rules.md Level 1** · z-index `{z-index.popover}`

## 1. 🎯 Definition & Usage
- **목적**: 트리거에 hover/focus 시 리치 콘텐츠 미리보기 카드
- **사용처**: 사용자 멘션 프로필 미리보기, 링크/문서 미리보기, 축약 정보의 상세
- **사용 금지**: 한 줄 텍스트 힌트는 Tooltip(추후). 클릭이 필요한 인터랙티브 콘텐츠는 DropdownMenu/Popover. 모바일(터치)에서는 hover가 없으므로 필수 정보를 여기에만 두지 말 것

## 2. ⚡ Variants

| placement | 위치 |
|---|---|
| bottom *(default)* | 트리거 아래 `{size.4}` |
| top | 트리거 위 `{size.4}` |

## 3. ⚡ Interaction & State
- **열림**: hover/focus 후 `delay`(기본 300ms) — 스치는 커서에 안 뜨게
- **닫힘**: 벗어난 후 `hideDelay`(기본 200ms) — 카드 위로 마우스 이동 시간 확보, 카드 위에 있으면 유지
- **Escape**: 즉시 닫힘
- **접근성**: focus로도 열림(키보드), `role="dialog"`. 카드에만 있는 정보는 트리거 대상에서도 접근 가능해야 함

## 4. 📐 Layout & Content Rules
- **카드**: max-width 320px, padding `{size.16}`, Level 1 표면 (bg-100 + border-tertiary + radius 16 + shadow-M)
- **콘텐츠**: 자유 구성 (아바타+이름+설명 등) — 단 인터랙티브 요소 최소화

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | 트리거 |
| content | ReactNode | 필수 | 카드 내용 |
| placement | 'top' \| 'bottom' | `'bottom'` | 위치 |
| delay / hideDelay | number(ms) | `300` / `200` | 열림/닫힘 지연 |
| enabled | boolean | `true` | false면 열리지 않음 |
| onOpenChange | (isOpen) => void | – | 상태 알림 |

## 6. 🎨 Token Mapping
```json
{
  "component": "HoverCard",
  "surface": "overlay-rules.md Level 1 참조",
  "z-index": "{z-index.popover}",
  "card": { "max-width": "320px", "padding": "{size.16}", "offset": "{size.4}" },
  "timing": { "open-delay": "300ms", "hide-delay": "200ms", "_description": "motion 토큰 아님 — 지연 시간 (모션 아님)" }
}
```

## 7. ✅ Best Practices
- 미리보기는 "누르기 전 판단"을 돕는 보조 — 핵심 정보·액션을 카드에만 두지 말 것
- 카드 콘텐츠는 3~4줄 이내로 — 더 길면 클릭해서 상세로
- 링크 트리거와 함께 쓰면 좋음 (hover 미리보기 + 클릭 이동)
