# Tab Group Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **Tab**: 개별 보기로 이동하는 버튼 또는 링크
- **TabList**: 선택 값, 크기, 배치와 키보드 이동을 소유하는 상위 navigation
- **TabMenu**: 공간이 부족할 때 보조 탭을 모으는 overflow menu
- **사용 금지**: 순차 단계, 폼 입력 선택(SegmentedControl/Radio 사용)

## 2. ⚡ Variants
- size: `sm` 28 / `md` 32 / `lg` 36
- layout: `hug` / `fill`
- orientation: `horizontal` / `vertical`
- `hasDivider`: 목록 하단 또는 우측 divider
- Tab: icon, selectedIcon, endContent, hidden label, href
- TabMenu: 선택된 option label을 trigger에 표시

## 3. ⚡ Interaction & State
- 선택 탭은 `aria-current="page"`, semibold, 브랜드 indicator
- Arrow keys는 다음/이전 탭, Home/End는 처음/마지막 탭으로 focus 이동
- TabMenu는 ↑↓ 순환, Escape/외부 클릭 닫기
- controlled `value` / `onChange`

## 4. 🧩 Props (API)
### TabList
`value`, `onChange`, `size`, `layout`, `hasDivider`, `orientation`, `children`

### Tab
`value`, `label`, `href`, `icon`, `selectedIcon`, `endContent`, `isLabelHidden`

### TabMenu
`label`, `options: {value,label,icon?}[]`

## 5. 🎨 Token Mapping
- 높이: `h-element-sm/md/lg` → foundation size.28/32/36
- 항목: `px-ms gap-2xs rounded-fai-s text-body-s`
- 기본/선택: `text-secondary` / `font-semibold text-primary`
- hover: `bg-fill-faint`
- indicator: `h-3xs bg-brand rounded-fai-circle`
- divider: `border-border-subtle`
- focus: `outline-border-brand`

## 6. ✅ Best Practices
- label은 6~8개 이하로 짧게 유지하고 나머지는 TabMenu에 배치
- 현재 보기와 직접 관련된 동급 콘텐츠 탐색에 사용
- action 버튼과 함께 쓸 때 탭보다 시각적으로 강하지 않게 구성

