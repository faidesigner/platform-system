# Divider Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 콘텐츠 영역을 시각적으로 구분하는 선
- **사용처**: 목록 항목 사이, 섹션 경계, 메뉴 그룹 구분, "또는" 같은 라벨 구분
- **사용 금지**: 여백(spacing)으로 충분히 구분되면 선 남용 금지 — 시각적 소음. 표 내부는 Table 자체 border 사용

## 2. ⚡ Variants

| variant | 색 | 용도 |
|---|---|---|
| subtle *(default)* | border-tertiary | 목록/메뉴 내부의 약한 구분 |
| strong | border-secondary | 섹션 간 강한 구분 |

| orientation | 동작 |
|---|---|
| horizontal *(default)* | 전체 폭 가로선. `label` 지원 |
| vertical | `self-stretch` 세로선 (flex 안에서 부모 높이) |

## 3. ⚡ Interaction & State
- 인터랙션 없음 (정적 요소)
- **접근성**: `role="separator"`, vertical은 `aria-orientation="vertical"`

## 4. 📐 Layout & Content Rules
- **두께**: 1px 고정
- **label**: horizontal 전용. 좌우 선 + 가운데 텍스트(`w/caption/M` tertiary), gap `{size.12}`
- 여백은 Divider 자체가 갖지 않음 — 부모 레이아웃(gap/margin)이 결정

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| orientation | 'horizontal' \| 'vertical' | `'horizontal'` | 방향 |
| variant | 'subtle' \| 'strong' | `'subtle'` | 강도 |
| label | ReactNode | – | 가운데 라벨 (horizontal 전용) |

## 6. 🎨 Token Mapping
```json
{
  "component": "Divider",
  "variants": {
    "subtle": { "border": "{color.border.tertiary}" },
    "strong": { "border": "{color.border.secondary}" }
  },
  "label": {
    "typography": "{w.caption.M}",
    "text-color": "{color.text.basic.tertiary}",
    "gap": "{size.12}"
  }
}
```

## 7. ✅ Best Practices
- 기본은 subtle — strong은 페이지 수준 섹션 경계에만
- 연속된 모든 항목에 선을 긋지 말 것 — 그룹 경계에만
- 라벨 구분("또는", 날짜)은 소셜 로그인 분리, 타임라인 날짜 경계 등에 사용
