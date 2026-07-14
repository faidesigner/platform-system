# Dialog Specification
**Status**: Draft

> Dialog + DialogHeader + AlertDialog + useImperativeDialog + useImperativeAlertDialog 5개를 한 파일에 정의.
> 위치: `packages/ui/components/dialog/` · 표면 규칙은 **overlay-rules.md Level 2**를 따름

## 1. 🎯 Definition & Usage
- **Dialog**: 화면을 차단하는 범용 모달 (폼, 상세, 설정)
- **DialogHeader**: 제목/부제 + 닫기 버튼 헤더
- **AlertDialog**: 파괴적·비가역 액션 확인 전용 (삭제, 탈퇴, 발행 취소)
- **useImperativeDialog / useImperativeAlertDialog**: 상태 관리 없이 show()/confirm()으로 여는 명령형 훅 (confirm은 Promise\<boolean\>)
- **사용 금지**: 단순 알림은 Toast/Banner. 트리거 옆 보조 UI는 Popover. 여러 다이얼로그 중첩 금지

## 2. ⚡ Variants

| size | width (min~max) | 용도 |
|---|---|---|
| s | 400~480px | 확인/알림 (AlertDialog 고정) |
| m *(default)* | 560~640px | 일반 폼·콘텐츠 |
| l | 720~800px | 복잡한 콘텐츠·미리보기 |
| xl | 960px | 대형 콘텐츠 |

> 디자이너 확정(2026-07-14). 모바일에서는 min-width 해제(풀폭-여백)

## 3. ⚡ Interaction & State
- **열림/닫힘**: 제어형(isOpen/onOpenChange). Dialog는 스크림 클릭·Escape 닫힘 허용(`dismissable`, 기본 true), **AlertDialog는 불가** — 명시적 선택 강제
- **스크롤**: 열리면 body 스크롤 잠금, 패널 내부만 스크롤 (max-height 85vh)
- **포커스**: 열리면 패널 안 첫 포커스 요소로 이동 + Tab 트랩(순환), 닫히면 트리거로 복귀. AlertDialog는 취소 버튼이 첫 포커스(덜 위험한 쪽)
- **접근성**: `role="dialog"`/`"alertdialog"` + `aria-modal="true"`, 라벨은 label prop 또는 DialogHeader title
- **AlertDialog 액션**: `isActionLoading`으로 진행 중 표시, 완료 후 닫기는 호출자 책임

## 4. 📐 Layout & Content Rules
- **패널**: radius `{cornerRadius.M}` + shadow-XL + padding `{size.24}`, 모바일 좌우 여백 `{size.20}`
- **스크림**: `{color.bg.scrim}` (#00000085 — 기존 토큰)
- **DialogHeader**: 제목 `w/text/M` semibold, 부제 `w/caption/M` secondary, 하단 padding `{size.16}`, `hasDivider` 옵션
- **AlertDialog**: 제목 + 설명(`w/text/S` secondary) + 우측 정렬 버튼 2개(취소 secondary / 액션), 버튼 gap `{size.8}`

## 5. 🧩 Props (API)

### Dialog
| prop | type | default | 설명 |
|---|---|---|---|
| isOpen / onOpenChange | – | 필수 | 제어형 상태 |
| size | s \| m \| l \| xl | `'m'` | 폭 |
| dismissable | boolean | `true` | 스크림/Escape 닫기 |
| label | string | – | aria-label (Header 없을 때 필수) |
| role | 'dialog' \| 'alertdialog' | `'dialog'` | |

### DialogHeader
| prop | type | default | 설명 |
|---|---|---|---|
| title | string | 필수 | 제목 |
| subtitle | string | – | 부제 |
| onOpenChange | (open) => void | – | 제공 시 닫기(X) 버튼 렌더 |
| startContent / endContent | ReactNode | – | 앞/뒤 슬롯 |
| hasDivider | boolean | `false` | 하단 구분선 |

### AlertDialog
| prop | type | default | 설명 |
|---|---|---|---|
| isOpen / onOpenChange | – | 필수 | |
| title / description | string | 필수 | 무엇이 일어나는지 명시 |
| actionLabel | string | 필수 | 동작 명시 ("삭제하기") |
| cancelLabel | string | `'취소'` | |
| actionTone | 'warning' \| 'primary' | `'warning'` | Button warning 톤 (디자이너 확정 신설) |
| isActionLoading | boolean | `false` | 액션 진행 중 |
| onAction | () => void | 필수 | |

### 훅
- `useImperativeDialog()` → `{ show(options), hide, isOpen, element }`
- `useImperativeAlertDialog()` → `{ confirm(options): Promise<boolean>, element }`
- 두 훅 모두 반환된 `element`를 JSX에 렌더해야 동작

## 6. 🎨 Token Mapping
```json
{
  "component": "Dialog",
  "surface": "overlay-rules.md Level 2 참조",
  "panel": {
    "radius": "{cornerRadius.M}",
    "bg-color": "{color.bg.100}",
    "shadow": "{shadow.XL}",
    "padding": "{size.24}",
    "max-height": "85vh"
  },
  "scrim": "{color.bg.scrim}",
  "z-index": "{z-index.dialog}", 
  "alert-action": "Button warning 톤 사용 (button.md 참조)"
}
```

## 7. ✅ Best Practices
- AlertDialog 설명에는 결과를 명시 ("되돌릴 수 없습니다") — 제목만으로 끝내지 말 것
- 액션 라벨은 동사로 ("확인" ❌ / "삭제하기" ⭕) — 무엇이 실행되는지 버튼만 보고 알 수 있게
- 파괴적 플로우는 useImperativeAlertDialog로 — `if (await confirm(...))` 패턴이 상태 관리 실수를 줄임
- Dialog 안에 Dialog 중첩 금지 — 플로우가 복잡하면 단계형 콘텐츠로
- 다이얼로그가 자주 열리는 UX라면 설계 재검토 (인라인 편집, 별도 페이지 고려)
