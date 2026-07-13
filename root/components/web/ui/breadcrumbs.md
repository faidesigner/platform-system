# Breadcrumbs Specification
**Status**: Draft

> Breadcrumbs(컨테이너) + BreadcrumbItem(개별 항목) 2개 컴포넌트를 한 파일에 정의.

## 1. 🎯 Definition & Usage
- **목적**: 현재 페이지의 계층 위치를 보여주는 보조 내비게이션 트레일
- **사용처**: 상세 페이지 상단(페이지 헤딩 위), 어드민/대시보드 등 계층 구조가 있는 화면
- **사용 금지**: 주 내비게이션 대체 금지(사이드바·탑내브 보완용). 부모가 없는 최상위 페이지에는 노출하지 않음. 5단계 초과 금지 — 초과 시 페이지 계층 단순화 검토

## 2. ⚡ Variants

| variant | 설명 | typography |
|---|---|---|
| default *(기본)* | 표준 텍스트 스타일 | `w/text/S` (14px) |
| supporting | 밀도 높은 UI(어드민 패널, 사이드바)용 작은 보조 스타일 | `w/caption/M` (12px) |

## 3. ⚡ Interaction & State
- **Link (기본)**: `href` 있는 항목은 링크로 렌더. hover 시 underline (`@media (hover: hover)` 조건), cursor pointer
- **Button**: `href` 없이 `onClick`만 있으면 버튼으로 렌더 (링크와 동일한 외형, 네이티브 버튼 스타일 리셋)
- **Current**: `isCurrent` 항목은 `<span>` + `aria-current="page"`로 렌더 — 링크 아님, 인터랙션 없음
- **Auto-current**: 어떤 항목에도 `isCurrent`가 없으면 마지막 항목을 자동으로 현재 페이지로 감지해 `aria-current` 부여
- **접근성**: 루트는 `<nav aria-label="Breadcrumb">` + `<ol>` 시맨틱 마크업. separator는 장식용(`aria-hidden`)

## 4. 📐 Layout & Content Rules
- **구조**: `<nav>` > `<ol>`(flex, wrap, gap `{size.4}`) > `<li>` 항목들
- **Separator**: 기본 `/`. 각 항목이 자신의 leading separator를 렌더하고 `:first-child`에서 CSS로 숨김. `separator` prop으로 교체 가능
- **항목 내부**: gap `{size.4}`, 링크 상하 padding `{size.4}`
- **Label**: 짧게, 링크 대상 페이지 타이틀과 일치 ("Settings" ⭕ / "Application Settings Page" ❌)
- **startIcon**: 선택. 라벨 앞 아이콘 (flex-shrink 0)
- **마지막 항목**: 링크가 아닌 일반 텍스트 (현재 페이지)

## 5. 🧩 Props (API)

### Breadcrumbs

| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | BreadcrumbItem 목록 |
| separator | ReactNode | `'/'` | 항목 사이 구분자 (장식용, aria-hidden) |
| variant | 'default' \| 'supporting' | `'default'` | 트레일 전체 스타일 |
| label | string | `'Breadcrumb'` | nav 랜드마크 접근성 라벨 |

### BreadcrumbItem

| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | 항목 라벨 |
| href | string | – | 링크 URL. 현재 페이지면 생략 |
| onClick | (e) => void | – | 클릭 핸들러 (href 유무 무관) |
| isCurrent | boolean | `false` | 현재 페이지 표시 — span + aria-current 렌더 |
| startIcon | ReactNode | – | 라벨 앞 아이콘 |
| as | LinkComponent | – | 링크 렌더 컴포넌트 교체 (라우터 Link 등) |

## 6. 🎨 Token Mapping
```json
{
  "component": "Breadcrumbs",
  "variants": {
    "default": {
      "link": {
        "text-color": "{color.text.basic.secondary}",
        "typography": "{w.text.S}"
      },
      "current": {
        "text-color": "{color.text.basic.primary}",
        "typography": "{w.text.S}"
      }
    },
    "supporting": {
      "link": {
        "text-color": "{color.text.basic.secondary}",
        "typography": "{w.caption.M}"
      },
      "current": {
        "text-color": "{color.text.basic.secondary}",
        "typography": "{w.caption.M}"
      }
    }
  },
  "separator": {
    "text-color": "{color.text.basic.secondary}"
  },
  "layout": {
    "gap": { "value": "{size.4}", "tailwind": "gap-1" },
    "item-gap": { "value": "{size.4}", "tailwind": "gap-1" },
    "link-padding-y": { "value": "{size.4}", "tailwind": "py-1" }
  }
}
```

## 7. ✅ Best Practices
- 페이지 헤딩 위에 배치 — 콘텐츠를 읽기 전에 위치를 먼저 인지하도록
- 라벨은 짧게, 링크 대상 페이지 타이틀과 일치시킬 것
- 밀도 높은 UI(어드민 패널, 사이드바)에는 supporting variant 사용
- 마지막 항목은 링크가 아닌 일반 텍스트 (isCurrent 설정 시 자동 처리)
- 주 내비게이션으로 사용 금지 — 사이드바/탑내브의 보완 수단
- 부모 없는 최상위 페이지에는 노출하지 않을 것
- 트레일이 5단계를 넘지 않도록 — 넘으면 페이지 계층 단순화 검토
