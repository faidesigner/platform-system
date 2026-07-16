# Selector Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 목록에서 단일 값을 고르는 드롭다운 셀렉터. label/validation/description/required 지원
- **사용처**: 폼·설정에서 중간 규모(대략 3~20개) 옵션 중 하나 선택
- **사용 금지**: 액션 메뉴는 DropdownMenu. 2개뿐이면 SegmentedControl/radio. yes/no는 Switch/Checkbox. 20개 초과·검색 필요는 Typeahead. 내비게이션은 링크

## 2. ⚡ Variants (status)
default / error / warning / success — 검증 상태

## 3. ⚡ Interaction & State
- **열기/닫기**: 트리거 클릭, 바깥 클릭·Esc 닫기
- **선택**: 옵션 클릭 시 값 확정 + 닫힘
- **clearable**: 선택 해제 버튼 옵션
- **sections**: ~8개 초과 시 섹션·구분선으로 그룹핑
- **placeholder**: 기대 선택 힌트("국가 선택")
- **disabled**: disabledMessage prop(Tooltip 래핑 금지)
- **접근성**: 트리거 `role="combobox"` + `aria-expanded`, 목록 `role="listbox"`, 옵션 `role="option"` + `aria-selected`. 키보드 ↑/↓/Enter

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | — | 레이블 |
| value | string \| null | 필수 | 선택 값 |
| onChange | (v:string)=>void | 필수 | 변경 |
| options | SelectorOption[] | 필수 | 옵션 목록 |
| placeholder | string | '선택' | 미선택 힌트 |
| status | 'default'\|'error'\|'warning'\|'success' | 'default' | 검증 |
| helpText | string | — | 보조 설명 |
| clearable | boolean | false | 지우기 |
| disabled | boolean | false | 비활성 |
| required | boolean | false | 필수 |

### SelectorOption
| prop | type | 설명 |
|---|---|---|
| value | string | 값 |
| label | string | 표시 |
| description | string | 설명 |
| section | string | 섹션 라벨 |
| disabled | boolean | 비활성 |

## 5. 🎨 Token Mapping
- **트리거**: `flex items-center justify-between px-m py-xs rounded-fai-s border border-border-secondary`, error 시 `border-border-negative`
- **목록**: `mt-2xs rounded-fai-m border border-border-tertiary bg-bg-100 py-2xs shadow-M`
- **옵션**: `px-m py-xs text-body-s`, hover `bg-interaction-light-black-hover`, 선택 `font-medium`
- **placeholder**: `text-tertiary`

## 6. ✅ Best Practices
- 보이는 label 제공
- 8개 초과 시 sections
- 의미 있는 placeholder
