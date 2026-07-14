# Collapsible Specification
**Status**: Draft

> Collapsible(단일) + CollapsibleGroup(아코디언) + useCollapsible(훅) 3개를 한 파일에 정의.
> 위치: `packages/ui/components/collapsible/`

## 1. 🎯 Definition & Usage
- **Collapsible**: 트리거 클릭으로 콘텐츠를 접고 펼치는 단일 컴포넌트
- **CollapsibleGroup**: 여러 Collapsible의 열림 상태를 관리 (single=아코디언 / multiple)
- **useCollapsible**: 상태 로직만 필요한 커스텀 UI용 훅 (사이드바 섹션, 커스텀 트리거)
- **사용처**: FAQ, 상세 정보 접기, 설정 섹션, 긴 목록 축약
- **사용 금지**: 핵심 콘텐츠를 기본 접힘으로 숨기지 말 것. 항목 간 이동이 잦은 내비게이션에는 Tab 사용. 오버레이가 필요하면 Dialog/Popover

## 2. ⚡ Variants

| Group type | 동작 |
|---|---|
| single *(default)* | 하나 열면 나머지 닫힘 (아코디언), 열린 항목 재클릭 시 닫힘 |
| multiple | 여러 개 동시 열림 |

## 3. ⚡ Interaction & State
- **트리거**: 전체 폭 버튼, 클릭 시 토글. `aria-expanded` + `aria-controls`
- **셰브론**: 우측 고정, 열림 시 180° 회전 (duration 200ms)
- **상태 우선순위**: CollapsibleGroup(value 제공) > 제어(isOpen) > 비제어(defaultIsOpen)
- **useCollapsible**: `isCollapsible: false`면 항상 열림(비활성) — 조건부 접기 UI에 활용
- **hover**: 트리거 텍스트 secondary로 전환

## 4. 📐 Layout & Content Rules
- **트리거**: `w/text/S` semibold + primary 텍스트, 상하 padding `{size.12}`, 트리거-셰브론 gap `{size.8}`
- **콘텐츠**: `w/text/S` secondary 텍스트, 하단 padding `{size.12}`
- **셰브론**: 16px, icon secondary 컬러
- **Group 구분선**: 항목 사이 border-tertiary (`hasDividers`, 기본 true)

## 5. 🧩 Props (API)

### Collapsible
| prop | type | default | 설명 |
|---|---|---|---|
| trigger | ReactNode | 필수 | 항상 보이는 트리거 콘텐츠 |
| children | ReactNode | – | 접히는 콘텐츠 |
| defaultIsOpen | boolean | `false` | 비제어 초기 상태 |
| isOpen / onOpenChange | – | – | 제어 모드 |
| value | string | – | 그룹 모드 식별 값 |

### CollapsibleGroup
| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | Collapsible들 (각자 value 필수) |
| type | 'single' \| 'multiple' | `'single'` | 열림 모드 |
| defaultValue | string \| string[] | – | 비제어 초기 열림 값 |
| value / onChange | – | – | 제어 모드 |
| hasDividers | boolean | `true` | 항목 구분선 |

### useCollapsible
| option | type | 설명 |
|---|---|---|
| isCollapsible | boolean \| CollapsibleConfig | true=활성(기본 열림), config=세부 설정, false=항상 열림 |
| value | string | 그룹 모드 식별 값 |

반환: `{ isEnabled, isOpen, toggle }`

## 6. 🎨 Token Mapping
```json
{
  "component": "Collapsible",
  "trigger": {
    "typography": "{w.text.S} semibold",
    "text-color": "{color.text.basic.primary}",
    "hover-text-color": "{color.text.basic.secondary}",
    "padding-y": "{size.12}",
    "gap": "{size.8}"
  },
  "content": {
    "typography": "{w.text.S}",
    "text-color": "{color.text.basic.secondary}",
    "padding-bottom": "{size.12}"
  },
  "chevron": {
    "size": "16px",
    "color": "{color.icon.basic.secondary}",
    "motion": "rotate 180deg / 200ms"
  },
  "group-divider": "{color.border.tertiary}"
}
```

## 7. ✅ Best Practices
- 트리거 문구만 보고 내용물을 예상할 수 있게 작성 ("자세히"보다 "배송 안내")
- FAQ처럼 하나씩 읽는 콘텐츠는 single, 설정 섹션처럼 비교가 필요하면 multiple
- 기본 열림(defaultIsOpen)은 사용자가 가장 먼저 봐야 할 항목 1개에만
- 접힌 콘텐츠는 검색·SEO에 불리할 수 있음 — 핵심 정보는 접지 말 것
- 커스텀 트리거 UI가 필요하면 Collapsible을 변형하지 말고 useCollapsible로 직접 조립
