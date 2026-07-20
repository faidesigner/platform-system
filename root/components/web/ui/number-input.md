# NumberInput Specification
**Status**: Draft

> 기존 LineInput 패턴(label/error/helpText/disabled) 계승.

## 1. 🎯 Definition & Usage
- **목적**: 숫자 값 입력. min/max/step 제약 + 증감 스텝퍼 + 검증
- **사용처**: 수량, 측정값, 퍼센트 등
- **사용 금지**: 숫자가 섞인 자유 텍스트는 TextInput. isOptional과 isRequired 동시 지정 금지

## 2. ⚡ Variants (status)

| status | 설명 |
|---|---|
| default | 기본 |
| error | 검증 실패 (border-negative) |
| warning | 경고 |
| success | 통과 |

## 3. ⚡ Interaction & State
- **스텝퍼**: ▲/▼ 버튼으로 step 단위 증감. min/max 도달 시 해당 버튼 disabled
- **키보드**: ↑/↓로 증감, 직접 입력도 가능
- **단위 suffix**: "%", "GB" 등 표시
- **clearable**: 지우기 버튼 옵션
- **접근성**: `<input type="number">` 기반. label 연결, aria-invalid(error)

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 라벨 |
| value | number | 필수 | 현재 값 |
| onChange | (v:number)=>void | 필수 | 값 변경 |
| min | number | — | 최소 |
| max | number | — | 최대 |
| step | number | 1 | 증감 단위 |
| unit | string | — | 단위 suffix (%/GB 등) |
| status | 'default'\|'error'\|'warning'\|'success' | 'default' | 검증 상태 |
| helpText | string | — | 보조 설명 |
| disabled | boolean | false | 비활성 |
| required | boolean | false | 필수 |

## 5. 🎨 Token Mapping
- **컨테이너 padding**: `py-s`
- **라벨 간격**: `gap-xs`
- **필드 padding**: `px-m py-xs`, radius `rounded-fai-s`, `border border-border-secondary`
- **error**: `border-border-negative`, helpText `text-negative`
- **스텝퍼 버튼**: `w-l h-l`, hover `bg-interaction-light-black-hover`
- **단위**: `text-body-s text-secondary`

## 6. ✅ Best Practices
- min/max/step으로 유효 범위 유도
- 단위 표시로 무엇을 입력하는지 명확히
- isOptional/isRequired 동시 지정 금지
