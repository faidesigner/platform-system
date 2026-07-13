# Card Specification
**Status**: Draft

> Card(기본) + ClickableCard(클릭형) + SelectableCard(선택형) 3개 컴포넌트를 한 파일에 정의.
> 기존 CardItem(radius 16px, bg-100)과 동일한 시각 언어 유지.

## 1. 🎯 Definition & Usage
- **Card**: 콘텐츠를 담는 비인터랙티브 컨테이너
- **ClickableCard**: 카드 전체가 하나의 클릭 대상 (상세 이동, 액션 실행)
- **SelectableCard**: 체크박스처럼 선택/해제하는 카드 (플랜 선택, 옵션 선택)
- **사용 금지**: ClickableCard 내부에 별도 링크/버튼 중첩 금지 (접근성 위반). 단순 정보 나열에 SelectableCard 금지

## 2. ⚡ Variants (3종 공통)

| variant | 배경 |
|---|---|
| default *(기본)* | bg-100 + border-tertiary |
| transparent | 투명 |
| muted | bg-200 |
| blue / mint / orange / red | semantic secondary 틴트 (Badge category와 동일 계열) |
| yellow / green / indigo / purple / grape / gray | tag.category secondary 틴트 |

| padding | 값 |
|---|---|
| none | 0 |
| s | `{size.16}` |
| m *(default)* | `{size.24}` |
| l | `{size.32}` (기존 CardItem과 동일) |

## 3. ⚡ Interaction & State

### ClickableCard
- hover: border-subtle + shadow-S / active: shadow-XS / focus-visible: border-brand
- `onClick` → `<button>`, `href` → 링크 렌더. disabled 시 opacity 50% + 클릭 차단
- `label` 필수 (aria-label)

### SelectableCard
- `role="checkbox"` + `aria-checked`, 클릭·Space·Enter로 토글
- 선택 시: border-brand + 우상단 브랜드 체크 인디케이터 (fade in)
- 단일 선택(라디오형)이 필요하면 그룹에서 하나만 selected 유지

### Card (공통)
- 모든 variant에 transparent border 포함 — 변형 전환 시 레이아웃 밀림 방지

## 4. 📐 Layout & Content Rules
- **radius**: `{cornerRadius.M}` 16px (기존 CardItem과 동일)
- **체크 인디케이터**: `{size.20}` 원형, 우상단 `{size.8}` 여백
- 카드 폭은 부모 레이아웃(grid/flex)이 결정 — 카드 자체는 width 지정하지 않음

## 5. 🧩 Props (API)

### Card
| prop | type | default |
|---|---|---|
| variant | CardVariant | `'default'` |
| padding | none \| s \| m \| l | `'m'` |

### ClickableCard = Card props +
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | aria-label |
| onClick | (e) => void | – | 버튼 렌더 |
| href / target / as | – | – | 링크 렌더 (Button과 동일 규칙) |
| disabled | boolean | `false` | |

### SelectableCard = Card props +
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | aria-label |
| selected | boolean | 필수 | 선택 상태 (제어형) |
| onChange | (selected) => void | 필수 | 토글 콜백 |
| disabled | boolean | `false` | |

## 6. 🎨 Token Mapping
```json
{
  "component": "Card",
  "base": {
    "radius": "{cornerRadius.M}",
    "bg-color": "{color.bg.100}",
    "border": "{color.border.tertiary}"
  },
  "clickable": {
    "hover": { "border": "{color.border.secondary}", "shadow": "{shadow.S}" },
    "active": { "shadow": "{shadow.XS}" },
    "focus": { "border": "{color.border.brand-primary}" }
  },
  "selectable": {
    "selected-border": "{color.border.brand-primary}",
    "indicator": {
      "bg-color": "{color.filled.optional.brand-primary}",
      "icon-color": "{color.text.optional.brand-primaryBtn}",
      "size": "{size.20}"
    }
  },
  "tinted-variants": "badge.md category 매핑과 동일 (filled.*-secondary 계열)"
}
```

## 7. ✅ Best Practices
- 클릭 대상이 카드 전체면 ClickableCard, 카드 안 일부 요소만 클릭이면 Card + 내부 버튼
- ClickableCard의 label은 목적을 명확히 ("자세히 보기"보다 "베이직 플랜 상세 보기")
- SelectableCard는 선택 상태가 색상 외에도 체크 인디케이터로 구분되도록 유지
- 틴트 variant는 카테고리 구분 용도로만 — 상태(에러/성공) 표현엔 Banner 사용
