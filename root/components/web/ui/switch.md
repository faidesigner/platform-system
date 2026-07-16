# Switch Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 저장 버튼 없이 즉시 적용되는 on/off 설정 제어
- **사용처**: 알림, 테마, 공개 여부 등 이진 환경설정
- **사용 금지**: 폼 제출 후 적용되는 값(Checkbox 사용), 3개 이상 상태

## 2. ⚡ Variants
- `value=false`: 중립 트랙 + 16px thumb
- `value=true`: 브랜드 트랙 + 20px thumb
- `labelPosition`: `start` / `end`
- `labelSpacing`: `hug` / `spread`
- `status`: `error` / `warning` / `success`

## 3. ⚡ Interaction & State
- **크기**: 트랙 40×24, padding 4, thumb off 16 / on 20
- **controlled**: `value`와 `onChange`로 상태 소유
- **async**: `changeAction` 실행 중 thumb 안 Spinner와 `aria-busy`
- **disabled**: `disabledMessage`가 있으면 focus를 유지한 `aria-disabled`, 없으면 native disabled
- **접근성**: native checkbox + `role="switch"`, label/htmlFor, description/status aria-describedby

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 접근성 및 표시 라벨 |
| value | boolean | 필수 | on/off 값 |
| onChange | `(checked, event) => void` | — | 값 변경 |
| changeAction | async callback | — | 비동기 변경 작업 |
| description | string | — | 보조 설명 |
| isDisabled / disabledMessage | boolean / string | false / — | 비활성 및 사유 |
| isLoading | boolean | false | 로딩 상태 |
| isLabelHidden | boolean | false | 라벨 시각 숨김 |
| labelPosition | `'start' \| 'end'` | `'end'` | 라벨 위치 |
| labelSpacing | `'hug' \| 'spread'` | `'hug'` | 라벨과 컨트롤 배치 |
| status | `{type,message?}` | — | 검증 상태 |

## 5. 🎨 Token Mapping
- 트랙: `w-3xl h-xl p-2xs rounded-fai-circle`
- off / on: `bg-fill` / `bg-brand`
- thumb: `size-m` → `size-l`, `bg-100 shadow-XS`
- 라벨: `text-body-s font-medium text-primary`
- 설명: `text-caption-m text-tertiary`
- motion: `--duration-fast`

## 6. ✅ Best Practices
- 즉시 반영되는 설정에만 사용
- 상태를 설명하는 짧고 명확한 label 제공
- disabled 이유는 외부 Tooltip 대신 `disabledMessage` 사용

