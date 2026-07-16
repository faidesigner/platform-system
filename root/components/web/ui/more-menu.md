# MoreMenu Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 세 개 점(⋯) 버튼을 눌러 액션 목록을 여는 오버플로 메뉴
- **사용처**: 테이블 행, 카드 헤더, 툴바의 보조/오버플로 액션
- **사용 금지**: 주요 액션을 여기 숨기지 말 것(주요 액션은 항상 보이게)

## 2. ⚡ Variants (항목 구성)

| 구성 | 설명 |
|---|---|
| items | 단순 텍스트 액션 목록 |
| dividers | 구분선으로 파괴적 액션 분리 |
| sections | 라벨된 그룹으로 묶음 |

## 3. ⚡ Interaction & State
- **트리거**: ⋯ IconButton. 클릭 시 DropdownMenu 오픈
- **닫기**: 항목 선택 / 바깥 클릭 / Esc
- **파괴적 액션**: `tone="danger"`로 강조, 보통 divider로 분리
- **접근성**: 트리거 `aria-haspopup="menu"` + `aria-expanded`, 메뉴 `role="menu"`, 항목 `role="menuitem"`

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| items | MoreMenuItem[] | 필수 | 액션 목록 |
| placement | 'bottom-end'\|'bottom-start'\|... | 'bottom-end' | 메뉴 위치 |
| ariaLabel | string | '더보기' | 트리거 레이블 |

### MoreMenuItem
| prop | type | 설명 |
|---|---|---|
| label | string | 항목 텍스트 |
| onSelect | ()=>void | 선택 콜백 |
| icon | ReactNode | 좌측 아이콘 |
| tone | 'default'\|'danger' | 톤 |
| dividerBefore | boolean | 이 항목 앞 구분선 |
| section | string | 섹션 라벨(그룹핑) |

## 5. 🎨 Token Mapping
- **트리거**: IconButton(icon=⋯, variant=tertiary)
- **메뉴 표면·항목**: 기존 DropdownMenu 규칙 상속(재사용)
- **danger 톤**: `text-negative`

## 6. ✅ Best Practices
- 오버플로/보조 액션 전용. 주요 액션은 바깥에 노출
- 항목 많으면 divider/section으로 그룹핑
