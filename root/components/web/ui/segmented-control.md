# SegmentedControl Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 상호 배타적 옵션 중 하나를 고르는 세그먼트 버튼 그룹. 항상 정확히 하나 선택
- **사용처**: 2~5개 뷰/모드 전환(값·모드 제어). 모든 옵션이 동시에 보여야 할 때
- **사용 금지**: 페이지 내비게이션(그건 TabList). on/off 단일 상태(그건 ToggleButton)

## 2. ⚡ Variants

| 속성 | 값 |
|---|---|
| layout | auto (내용 폭) / fill (균등 분할) |
| content | label / icon+label / icon-only |

## 3. ⚡ Interaction & State
- **단일 선택 강제**: 항상 하나 활성
- **disabled item**: 개별 항목 비활성 가능
- **icon-only**: 라벨 숨김 시 `aria-label` 필수
- **접근성**: `role="group"` + 그룹 `aria-label`, 항목은 `role="radio"`/`aria-checked` 또는 버튼+`aria-pressed`

## 4. 🧩 Props (API)

### SegmentedControl
| prop | type | default | 설명 |
|---|---|---|---|
| value | string | 필수 | 선택 값 |
| onChange | (v:string)=>void | 필수 | 변경 |
| ariaLabel | string | 필수 | 그룹 레이블 |
| fill | boolean | false | 균등 분할 |
| children | SegmentedControlItem들 | 필수 | 항목 |

### SegmentedControlItem
| prop | type | 설명 |
|---|---|---|
| value | string | 항목 값 |
| label | ReactNode | 라벨 |
| icon | ReactNode | 아이콘 |
| labelHidden | boolean | 아이콘만(라벨 숨김) |
| disabled | boolean | 비활성 |

## 5. 🎨 Token Mapping
- **컨테이너**: `inline-flex gap-3xs p-3xs rounded-fai-s bg-filled-basic-secondary`
- **항목**: `px-m py-2xs rounded-fai-xs text-body-s`, `fill` 시 `flex-1`
- **선택 항목**: `bg-bg-100 shadow-XS font-medium`
- **미선택 hover**: `hover:bg-interaction-light-black-hover`
- **disabled**: `opacity-40`

## 6. ✅ Best Practices
- 2~5개 상호 배타 뷰/모드 전환에 사용
- 그룹에 설명적 aria-label
- 페이지 이동은 TabList, on/off는 ToggleButton
