# TreeList Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 계층 데이터를 브랜치 연결선과 함께 보여주는 확장형 트리
- **사용처**: 파일 탐색기, 중첩 카테고리 브라우저, 부모-자식 관계 시각화
- **사용 금지**: 평면(비계층) 데이터는 List. 4~5레벨 초과 중첩 금지(구조를 평탄화하거나 다른 패턴)

## 2. ⚡ Interaction & State
- **expand/collapse**: 브랜치 노드 클릭 시 하위 펼침/접힘. chevron 회전
- **아이콘**: 노드별 아이콘(폴더/문서 등)으로 종류 구분
- **endContent**: 우측 배지/카운트(예: 안 읽음 수)
- **선택**: `selected` 노드 강조(현재 페이지 등)
- **접근성**: `role="tree"` + 노드 `role="treeitem"` + `aria-expanded`/`aria-selected`. 키보드 ↑/↓/←/→

## 3. 🧩 Props (API)

### TreeList
| prop | type | default | 설명 |
|---|---|---|---|
| nodes | TreeNode[] | 필수 | 트리 데이터 |
| defaultExpanded | string[] | [] | 초기 펼침 노드 id |
| selectedId | string | — | 선택된 노드 |
| onSelect | (id:string)=>void | — | 선택 콜백 |

### TreeNode
| prop | type | 설명 |
|---|---|---|
| id | string | 노드 id |
| label | string | 표시 텍스트 |
| icon | ReactNode | 좌측 아이콘 |
| endContent | ReactNode | 우측(배지 등) |
| children | TreeNode[] | 하위 노드 |
| href | string | 링크 노드 |

## 4. 🎨 Token Mapping
- **노드 행**: `flex items-center gap-s px-m py-2xs rounded-fai-s`, hover `bg-interaction-light-black-hover`
- **선택 노드**: `bg-filled-basic-secondary font-medium`
- **들여쓰기**: 레벨당 `pl-l`(또는 depth × size)
- **브랜치 선**: `border-l border-border-tertiary`
- **chevron**: `w-l h-l`, 펼침 시 90° 회전
- **텍스트**: `text-body-s text-basic-primary`

## 5. ✅ Best Practices
- 노드마다 의미 있는 라벨·아이콘
- 중요한 브랜치는 미리 펼침(defaultExpanded)
- 4~5레벨 넘게 중첩하지 않기
