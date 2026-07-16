# Slider Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 정해진 범위 내에서 숫자 값/범위를 드래그로 선택
- **사용처**: 볼륨, 가격, 퍼센트 등 연속 범위 탐색
- **사용 금지**: 정밀 숫자 입력(그건 NumberInput). step이 너무 커서 위치가 몇 개뿐이면(그건 SegmentedControl/radio)

## 2. ⚡ Variants

| 모드 | 설명 |
|---|---|
| single | 단일 값 (thumb 1개) |
| range | 범위 값 (thumb 2개) |

| status | 설명 |
|---|---|
| default / error / warning / success | 검증 상태 |

## 3. ⚡ Interaction & State
- **드래그/키보드**: thumb 드래그 또는 ←/→로 step 단위 이동
- **marks**: 고정 간격 눈금 + 라벨 옵션
- **값 포맷**: "$50", "75%" 등 단위 포함 표시
- **disabled**: disabledMessage prop으로 사유 안내(Tooltip 래핑 금지 — hover 이벤트 삼킴)
- **접근성**: `<input type="range">` 기반. label 필수(숨겨도), `aria-valuenow/min/max`

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 접근성 레이블 |
| value | number \| [number,number] | 필수 | 값(single) 또는 범위(range) |
| onChange | (v)=>void | 필수 | 값 변경 |
| min | number | 0 | 최소 |
| max | number | 100 | 최대 |
| step | number | 1 | 단위 |
| marks | {value,label?}[] | — | 눈금 |
| formatValue | (v)=>string | — | 값 포맷 |
| status | 'default'\|'error'\|'warning'\|'success' | 'default' | 검증 |
| disabled | boolean | false | 비활성 |
| disabledMessage | string | — | 비활성 사유 |
| labelHidden | boolean | false | 라벨 시각적 숨김 |

## 5. 🎨 Token Mapping
- **트랙**: `h-3xs bg-quaternary rounded-fai-circle`
- **채움**: `bg-filled-optional-brand-primary`, error 시 `bg-filled-basic-negative`
- **thumb**: `w-l h-l rounded-fai-circle bg-bg-100 border-2 border-border-brand-primary shadow-XS`
- **marks 라벨**: `text-caption-s text-secondary`
- **값 표시**: `text-body-s`

## 6. ✅ Best Practices
- 항상 label 제공(숨겨도)
- 값에 단위 포함해 포맷("$50"/"75%")
- 정밀 입력은 NumberInput과 병용
