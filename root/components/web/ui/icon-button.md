# Icon Button Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 텍스트 없이 아이콘만으로 액션을 수행하는 정사각/원형 버튼
- **사용처**: 툴바, 밀도 높은 UI, 닫기/뒤로가기/설정 등 아이콘만으로 의미가 명확한 액션
- **사용 금지**: 아이콘만으로 의미가 불명확한 액션 (텍스트 Button 사용). label(aria-label) 없이 사용 금지

## 2. ⚡ Variants

| variant | 배경 | 인터랙션 |
|---|---|---|
| primary | 브랜드 primaryBtn 솔리드 | white 오버레이 (hover/focus/pressed) |
| secondary | 브랜드 secondaryBtn | black 오버레이 |
| tertiary *(default)* | 투명 + border-faint | black 오버레이 |
| assistive | 투명 | black 오버레이 + opacity |

| size | padding | icon |
|---|---|---|
| XL | `{padding.M}` 16px | 24px |
| L *(default)* | `{padding.MS}` 12px | 24px |
| M | `{padding.XS}` 6px | 20px |
| S | `{padding.XS}` 6px | 16px |

- **shape**: `circle` *(default)* / `square` (`{cornerRadius.S}` 8px)
- **isImpact**: 브랜드 그라디언트 border 강조

## 3. ⚡ Interaction & State
- **Hover/Focus/Pressed**: `::after` 오버레이 레이어에 interaction 토큰 적용 (`--color-interaction-light-*`)
- **Loading**: 스피너로 아이콘 대체 + disabled + `aria-busy`
- **clickAction**: 비동기 액션 — pending 동안 자동 로딩, fire-once(재클릭 무시)
- **href**: 링크 렌더 (disabled/loading이면 button 유지 — disabled 링크는 안티패턴)
- **Disabled**: variant별 disabled 토큰 + 오버레이 숨김

## 4. 📐 Layout & Content Rules
- **구조**: `inline-flex` 정사각 (padding 기반), 아이콘 중앙 정렬
- **아이콘**: ReactNode 또는 내장 프리셋(arrowshapeLeft/Right/Up — Up은 hover 롤링 모션)
- **label**: 필수 권장 — 구체적으로 ("삭제"보다 "대화 삭제")
- **tooltip**: 권장 — label은 스크린리더 전용이라 시각 사용자에겐 hover 힌트 필요

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| icon | ReactNode \| 프리셋 문자열 | 필수 | 아이콘 |
| variant | primary \| secondary \| tertiary \| assistive | `'tertiary'` | 시각적 변형 |
| size | XL \| L \| M \| S | `'L'` | 크기 |
| shape | square \| circle | `'circle'` | 모서리 |
| isImpact | boolean | `false` | 브랜드 강조 border |
| label | string | – | aria-label (필수 권장) |
| tooltip | string | – | hover 툴팁 (title) |
| loading | boolean | `false` | 스피너 + disabled |
| clickAction | (e) => void \| Promise\<void\> | – | 비동기 액션 — 자동 로딩, fire-once |
| href / as / target / rel | – | – | 링크 렌더 (Button과 동일 규칙) |

## 6. 🎨 Token Mapping
```json
{
  "component": "IconButton",
  "variants": {
    "primary": {
      "default": {
        "bg-color": "{color.filled.optional.brand-primaryBtn}",
        "overlay-hover": "{color.interaction.light.white.hover}",
        "overlay-pressed": "{color.interaction.light.white.pressed}"
      },
      "disabled": { "bg-color": "{color.filled.basic.disabled}" }
    },
    "secondary": {
      "default": {
        "bg-color": "{color.filled.optional.brand-secondaryBtn}",
        "text-color": "{color.text.basic.primary}",
        "overlay-hover": "{color.interaction.light.black.hover}"
      }
    },
    "tertiary": {
      "default": {
        "border": "{color.border.tertiary}",
        "overlay-hover": "{color.interaction.light.black.hover}"
      },
      "disabled": { "border": "{color.border.disabled}" }
    },
    "assistive": {
      "default": { "overlay-hover": "{color.interaction.light.black.hover}" }
    }
  },
  "layout": {
    "padding": { "XL": "{padding.M}", "L": "{padding.MS}", "M": "{padding.XS}", "S": "{padding.XS}" },
    "icon-size": { "XL": "24px", "L": "24px", "M": "20px", "S": "16px" },
    "radius": { "square": "{cornerRadius.S}", "circle": "{cornerRadius.circle}" }
  }
}
```

## 7. ✅ Best Practices
- aria-label은 구체적으로 — 휴지통 아이콘이면 "삭제"보다 "대화 삭제"
- tooltip 추가 권장 — 톱니바퀴 하나도 설정/환경설정/구성 등 여러 의미 가능
- 툴바·밀도 높은 영역에는 assistive/tertiary로 시각적 소음 최소화
- 아이콘만으로 액션이 자명하지 않으면 IconButton 대신 텍스트 Button 사용
- tooltip 생략 금지 — label은 스크린리더에만 전달되고 시각 사용자는 hover 힌트가 필요
