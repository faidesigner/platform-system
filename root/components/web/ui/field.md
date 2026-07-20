# Field Specification
**Status**: Final (디자이너 확정 2026-07-14 — Field 방식 통일)

> 위치: `packages/ui/components/field/`
> **시각 소유권 분리**: Field = 라벨·설명·에러 텍스트만 / 자식 input = 박스 모양 전부(input-button.md 참조).
> Field에서 input 박스의 모양은 수정할 수 없다 — 상태(error/disabled)만 컨텍스트로 전파.

## 1. 🎯 Definition & Usage
- **목적**: 폼 필드의 공통 셸 — 라벨 + 설명/에러 텍스트 + 자식 input과의 접근성 배선
- **자식**: InputButton, DateInput/DateRangeInput/DateTimeInput, FileInput 등 셸 없는 input
- **사용 금지**: Field 안에 Field 중첩 금지. 자식 input에 자체 라벨을 또 주지 말 것(이중 라벨)

## 2. ⚡ 컨텍스트 전파 (status 전파 규칙 — 디자이너 확정)

| Field prop | 자식에 전파되는 것 | 자식의 반응 |
|---|---|---|
| (자동) inputId | id + 라벨 htmlFor 연결 | 라벨 클릭 시 포커스 |
| (자동) describedById | aria-describedby | 스크린리더가 설명/에러 읽음 |
| error | error 상태 | **자식이 스스로** 에러 스타일(2px negative) 렌더 |
| disabled | disabled 상태 | 자식이 스스로 disabled 스타일 렌더 |
| required | (라벨 * 표시는 Field가 담당) | – |

- 자식의 개별 prop이 컨텍스트보다 우선 (`error={true}`를 직접 주면 그 값)

## 3. ⚡ Interaction & State
- Field 자체는 인터랙션 없음. 에러 시 errorMessage가 description을 대체하고 `role="alert"`
- **접근성**: `<label htmlFor>` 연결, 설명/에러는 aria-describedby로 자식과 연결

## 4. 📐 Layout & Content Rules
- **라벨**: `w/text/S` medium + required 빨간 * (폼 공통 규칙), 하단 `{size.4}`
- **설명/에러**: `w/caption/M` (tertiary / negative), 상단 `{size.4}`
- 세로 스택: 라벨 → 자식 input → 설명/에러

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 라벨 (labelHidden으로 시각 숨김) |
| description | string | – | 보조 설명 |
| required | boolean | `false` | 빨간 * |
| error / errorMessage | – | `false` | 에러 상태 + 메시지 (컨텍스트 전파) |
| disabled | boolean | `false` | 자식 전체 비활성 (컨텍스트 전파) |
| children | ReactNode | 필수 | 셸 없는 input 1개 |

`useField()` 훅: 자식 input 구현체가 `{ inputId, describedById, error, disabled, required }` 소비

## 6. 🎨 Token Mapping
```json
{
  "component": "Field",
  "label": { "typography": "{w.text.S} medium", "color": "{color.text.basic.primary}", "required-mark": "{color.text.basic.negative}" },
  "description": { "typography": "{w.caption.M}", "color": "{color.text.basic.tertiary}" },
  "error-text": { "typography": "{w.caption.M}", "color": "{color.text.basic.negative}" },
  "input-visual": "자식 소유 — input-button.md 참조"
}
```

## 7. ✅ Best Practices
- 모든 폼 입력은 Field로 감싸는 것을 기본으로 (라벨 없는 입력 금지)
- errorMessage는 해결 방법을 담아서 ("필수 항목입니다"보다 "지역을 선택하세요")
- 한 Field에 input 하나 — 복수 입력 조합은 InputGroup(추후) 검토
