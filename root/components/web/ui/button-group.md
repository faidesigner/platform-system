# Button Group Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 같은 대상에 대한 관련 액션 버튼들을 하나의 연결된 단위로 묶는 컨테이너
- **사용처**: 복사/잘라내기/붙여넣기, 정렬 옵션 등 동일 객체 대상 액션 묶음 (2~4개)
- **사용 금지**: 뷰 전환/내비게이션 용도 금지 (SegmentedControl·Tab 사용). 성격이 다른 액션 혼합 금지 (Save 옆 Delete ❌). ButtonGroup 중첩 금지 — 여러 그룹은 gap 두고 나란히 배치. 5개 이상이면 Toolbar/DropdownMenu 검토

## 2. ⚡ Variants

| orientation | 설명 |
|---|---|
| horizontal *(default)* | 가로 연결 — 좌우 바깥 모서리만 radius |
| vertical | 세로 연결 — 상하 바깥 모서리만 radius |

| shape | 바깥 모서리 |
|---|---|
| square *(default)* | `rounded-8px` (Button square와 동일) |
| round | circle (Button round와 동일) |

## 3. ⚡ Interaction & State
- **연결 스타일**: 안쪽 모서리 radius 제거, 인접 border 1px 겹침(-1px margin)으로 이중 테두리 방지. 바깥 모서리에만 radius
- **키보드**: 가로는 ←/→, 세로는 ↑/↓로 버튼 간 포커스 이동 (순환), Home/End로 처음/끝 이동
- **Disabled**: 그룹 `disabled` 시 모든 자식 버튼 비활성 + `aria-disabled`
- **접근성**: `role="group"` + `aria-label` (label prop 필수)

## 4. 📐 Layout & Content Rules
- **구조**: `inline-flex items-stretch` (vertical은 `flex-col`) — 자식 높이 동일하게 늘어남
- **자식**: Button 컴포넌트만. 그룹의 size/tone이 기본값으로 주입되고 개별 Button prop이 우선
- **일관성**: 그룹 내 모든 버튼은 같은 tone 사용 권장 — 하나의 연결된 단위로 보이도록
- **간격**: 버튼 사이 gap 없음(연결형). 그룹끼리는 gap으로 분리

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | Button 자식들 (2~4개 권장) |
| label | string | 필수 | 그룹 접근성 라벨 (aria-label) |
| orientation | 'horizontal' \| 'vertical' | `'horizontal'` | 배치 방향 |
| size | Button size (xl\|l\|m\|s) | – | 그룹 기본 size (개별 Button 우선) |
| tone | Button tone | – | 그룹 기본 tone (개별 Button 우선) |
| shape | 'square' \| 'round' | `'square'` | 바깥 모서리 radius |
| disabled | boolean | `false` | 그룹 전체 비활성화 |

## 6. 🎨 Token Mapping
```json
{
  "component": "ButtonGroup",
  "layout": {
    "display": "inline-flex items-stretch",
    "gap": { "value": "none", "_description": "연결형 — 인접 border -1px 겹침" },
    "radius-outer": {
      "square": { "value": "rounded-8px", "tailwind": "rounded-fai-s" },
      "round": { "value": "rounded-circle", "tailwind": "rounded-fai-circle" }
    },
    "radius-inner": { "value": "none", "tailwind": "rounded-none" }
  },
  "_description": "색상·타이포·패딩은 자식 Button의 tone/size 토큰을 그대로 사용 (button.md 참조)"
}
```

## 7. ✅ Best Practices
- 같은 대상에 대한 관련 액션만 묶을 것 (선택된 텍스트의 복사·잘라내기·붙여넣기 등)
- 그룹 내 모든 버튼은 같은 tone으로 — 하나의 연결된 단위로 보이게
- 2~4개 유지, 더 많으면 Toolbar나 DropdownMenu 사용
- 성격이 크게 다른 액션 혼합 금지 (Save 옆 Delete는 혼란 유발)
- 내비게이션 용도 금지 — 뷰 전환은 SegmentedControl/Tab
- ButtonGroup 중첩 금지 — 여러 그룹은 gap 두고 나란히
