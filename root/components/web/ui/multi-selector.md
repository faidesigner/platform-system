# MultiSelector Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 목록에서 여러 값을 고르는 체크박스 드롭다운. 선택 항목을 count/labels/badges로 표시
- **사용처**: 필터링, 유한한 옵션 집합에서 다중 선택
- **사용 금지**: 단일 선택은 Selector. 20개 초과인데 검색 없이 나열 금지

## 2. ⚡ Variants (선택 표시)

| display | 설명 |
|---|---|
| count | "3개 선택" (기본) |
| labels | 선택 라벨 나열 |
| badges | 선택을 배지로 |

## 3. ⚡ Interaction & State
- **다중 선택**: 옵션 체크박스 토글. 닫히지 않고 계속 선택
- **search**: 15개 초과 시 검색 필터 권장
- **select-all**: 대부분 전체 선택할 상황이면 전체 선택 토글
- **sections**: 섹션·구분선 그룹핑
- **접근성**: 트리거 `aria-expanded`, 목록 `role="listbox" aria-multiselectable`, 옵션 `role="option" aria-selected` + 체크박스

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | — | 레이블 |
| values | string[] | 필수 | 선택된 값들 |
| onChange | (v:string[])=>void | 필수 | 변경 |
| options | MultiSelectorOption[] | 필수 | 옵션 |
| display | 'count'\|'labels'\|'badges' | 'count' | 선택 표시 방식 |
| searchable | boolean | false | 검색 필터 |
| selectAll | boolean | false | 전체 선택 토글 |
| placeholder | string | '선택' | 미선택 힌트 |
| disabled | boolean | false | 비활성 |

### MultiSelectorOption
| prop | type | 설명 |
|---|---|---|
| value | string | 값 |
| label | string | 표시 |
| section | string | 섹션 |
| disabled | boolean | 비활성 |

## 5. 🎨 Token Mapping
- **트리거**: Selector와 동일 (`border-border-secondary`, `rounded-fai-s`, `px-m py-xs`)
- **목록**: `rounded-fai-m border border-border-tertiary bg-bg-100 shadow-M`
- **옵션**: 체크박스 + 라벨, `px-m py-xs`, hover `bg-interaction-light-black-hover`
- **검색 입력**: 목록 상단 `px-m py-2xs border-b border-border-tertiary`
- **체크박스**: 기존 Checkbox 규칙 상속

## 6. ✅ Best Practices
- 다중 선택 전용(단일은 Selector)
- 15개 초과 시 검색 활성화
- 대부분 전체선택 상황이면 select-all 제공
