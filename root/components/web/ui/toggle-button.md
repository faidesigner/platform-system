# Toggle Button Specification
**Status**: Draft

> ToggleButton(단일) + ToggleButtonGroup(선택 관리) 2개 컴포넌트를 한 파일에 정의.

## 1. 🎯 Definition & Usage
- **목적**: 눌림(pressed)/해제 상태를 오가는 토글형 버튼과 그 선택 상태를 관리하는 그룹
- **사용처**: 툴바 액션, 뷰 모드 전환(리스트/그리드), 서식 컨트롤(굵게/기울임/밑줄)
- **사용 금지**: 단순 on/off 설정은 Switch 사용. 페이지 이동/뷰 라우팅은 Tab 사용. 일회성 액션은 일반 Button 사용

## 2. ⚡ Variants & State

| 상태 | 스타일 |
|---|---|
| unpressed | Button tertiary 톤 그대로 (surface + border-faint) |
| pressed | fill-soft 배경 + primary 텍스트 + border-subtle + semibold |

| Group type | 동작 |
|---|---|
| single *(default)* | 하나만 선택, 활성 항목 재클릭 시 해제(null) |
| multiple | 복수 선택/해제 |

## 3. ⚡ Interaction & State
- **토글**: 클릭 시 pressed ↔ unpressed. `aria-pressed`로 상태 노출
- **낙관적 업데이트**: `pressedChangeAction`(비동기) 사용 시 다음 상태를 먼저 표시하고, 실패하면 원래 상태로 롤백
- **그룹 모드**: `value`가 있고 ToggleButtonGroup 안이면 선택 관리를 그룹에 위임 (컨텍스트 자동 감지)
- **pressedIcon**: 눌림 상태에서 아이콘 교체 (없으면 기존 icon 유지)
- **레이아웃 밀림 방지**: semibold 전환 시 폭 변화가 없도록 bold 폭을 invisible 스팬으로 미리 예약
- **접근성**: 버튼별 `aria-pressed`, 그룹은 `role="group"` + `aria-label`

## 4. 📐 Layout & Content Rules
- **ToggleButton**: 기존 Button(tertiary) 레이아웃·사이즈·radius 그대로 상속
- **ToggleButtonGroup**: `inline-flex items-center gap-2xs` — ButtonGroup(연결형)과 달리 gap 분리형. vertical은 `flex-col items-stretch`
- 그룹의 size/disabled가 자식 기본값으로 주입, 개별 prop 우선

## 5. 🧩 Props (API)

### ToggleButton

| prop | type | default | 설명 |
|---|---|---|---|
| label | string | – | 접근성 라벨 (iconOnly면 aria-label) |
| pressed | boolean | `false` | 눌림 상태 (제어형) |
| onPressedChange | (pressed, e) => void | – | 상태 변경 콜백 (동기) |
| pressedChangeAction | (pressed) => void \| Promise | – | 비동기 토글 — 낙관적 표시 + 실패 롤백 |
| icon / pressedIcon | ReactNode | – | 기본/눌림 아이콘 |
| iconOnly | boolean | `false` | 아이콘 전용 (label → aria-label) |
| value | string | – | 그룹 모드 식별 값 |
| size / shape / loading / tooltip / href … | – | – | Button과 동일 (tone은 tertiary 고정) |

### ToggleButtonGroup

| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | ToggleButton들 (각자 value 필수) |
| label | string | 필수 | 그룹 aria-label |
| type | 'single' \| 'multiple' | `'single'` | 선택 모드 |
| value | string \| null (single) / string[] (multiple) | 필수 | 선택 값 (제어형) |
| onChange | (value) => void | 필수 | 선택 변경 콜백 |
| orientation | 'horizontal' \| 'vertical' | `'horizontal'` | 배치 방향 |
| size | Button size | – | 그룹 기본 size |
| disabled | boolean | `false` | 그룹 전체 비활성화 |

## 6. 🎨 Token Mapping
```json
{
  "component": "ToggleButton",
  "states": {
    "unpressed": {
      "_description": "Button tertiary 토큰 그대로 (button.md 참조)"
    },
    "pressed": {
      "bg-color": "{color.filled.basic.tertiary}",
      "text-color": "{color.text.basic.primary}",
      "border": "{color.border.secondary}",
      "font-weight": "semibold"
    }
  },
  "group-layout": {
    "gap": { "value": "{size.4}", "tailwind": "gap-2xs" },
    "_description": "연결형 아님 — 항목별 독립 radius 유지"
  }
}
```

## 7. ✅ Best Practices
- 토글은 상태를 보여주는 버튼 — 액션 실행엔 Button, on/off 설정엔 Switch
- 그룹 내 모든 토글은 같은 크기·형태로 통일
- iconOnly 토글에는 label(aria-label)과 tooltip 필수
- single 그룹에서 "항상 하나는 선택돼야 하는" UX가 필요하면 onChange에서 null 무시
- 눌림 상태가 시각적으로 명확해야 함 — 색상만으로 구분하지 말고 semibold 강조 유지
