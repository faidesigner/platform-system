# RadioList Specification
**Status**: Draft

> 참고: Astryx RadioList / RadioListItem (https://astryx.atmeta.com/components/RadioList)
> RadioList(그룹) + RadioListItem(항목) 2개 컴포넌트를 한 파일에 정의.

## 1. 🎯 Definition & Usage
- **목적**: 한 번에 하나만 선택하는 옵션 그룹. 모든 옵션이 동시에 보여 비교 용이
- **사용처**: 작은 집합(2~7개)에서 하나 고르기
- **사용 금지**: 다중 선택은 CheckboxList. 긴 목록은 Selector. 가로 배치에 4개 초과 금지(어색하게 wrap)

## 2. ⚡ Variants

| orientation | 설명 |
|---|---|
| vertical | 세로 (기본) |
| horizontal | 가로 (≤4개) |

## 3. ⚡ Interaction & State
- **단일 선택**: 그룹 내 하나만. 선택 시 이전 선택 해제
- **기본 선택**: 합리적 기본값 있으면 미리 선택
- **description/endContent**: 항목별 설명·우측 콘텐츠(가격 등)
- **validation**: required + 미선택 시 error 메시지
- **접근성**: `role="radiogroup"` + `aria-labelledby`, 항목 native `<input type="radio">`, 키보드 ↑/↓ 이동

## 4. 🧩 Props (API)

### RadioList
| prop | type | default | 설명 |
|---|---|---|---|
| value | string | 필수 | 선택된 값 |
| onChange | (v:string)=>void | 필수 | 변경 |
| name | string | 필수 | radio 그룹명 |
| label | ReactNode | — | 그룹 레이블 |
| description | ReactNode | — | 그룹 설명 |
| orientation | 'vertical'\|'horizontal' | 'vertical' | 배치 |
| error | string | — | 에러 메시지 |
| children | RadioListItem들 | 필수 | 항목 |

### RadioListItem
| prop | type | 설명 |
|---|---|---|
| value | string | 항목 값 |
| label | ReactNode | 항목 텍스트 |
| description | ReactNode | 설명 |
| endContent | ReactNode | 우측 콘텐츠 |
| disabled | boolean | 비활성 |

## 5. 🎨 Token Mapping
- **항목**: `flex items-start gap-s px-m py-s`, radius `rounded-fai-s`, hover `bg-interaction-light-black-hover`
- **라디오 원**: `w-l h-l rounded-fai-circle border-2`, 미선택 `border-border-secondary`, 선택 `border-border-brand-primary` + 내부 점 `bg-filled-optional-brand-primary`
- **라벨**: `text-body`, 설명 `text-body-s text-secondary`
- **error**: `text-negative`

## 6. ✅ Best Practices
- 옵션 2~7개로 유지
- 명확·간결한 라벨
- 합리적 기본값 미리 선택(선택이 optional이 아니면)
