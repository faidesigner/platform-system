# Button Specification
**Status**: Final

## 1. 🎯 Definition & Usage
- **목적**: 사용자 액션을 유발하는 기본 인터랙션 컴포넌트
- **사용처**: CTA, 폼 제출, 다이얼로그 액션

## 2. ⚡ Variants

| tone | 설명 |
|---|---|
| primary | 주요 액션 (다크 배경) |
| secondary | 보조 액션 (테두리) |
| tertiary | 약한 액션 |
| assistive | 보조 정보성 |
| brandAssistive | 브랜드 강조 |

| size | height |
|---|---|
| xl | py-m + px-xl |
| l | h-3xl + px-l |
| m | py-s + px-m |
| s | py-2xs + px-ms |

## 3. 📐 Layout & Content Rules
- **shape**: `square` (rounded-8px) / `round` (rounded-circle)
- **impact**: true일 때 브랜드 컬러 강조 CTA
- **loading**: spinner 표시 + disabled 처리
- **icon**: leading icon 옵션

## 4. 🎨 Token Mapping
```json
{
  "component": "Button",
  "variants": {
    "primary": {
      "default": {
        "bg-color": "{color.filled.basic.primary}",
        "text-color": "{color.text.basic.inverse}",
        "border": "none"
      },
      "disabled": {
        "bg-color": "{color.filled.basic.disabled}",
        "text-color": "{color.text.basic.disabled}",
        "border": "{color.border.disabled}"
      }
    },
    "impact": {
      "default": {
        "bg-color": "{color.filled.optional.brand-primary}",
        "text-color": "{color.text.optional.brand-primaryBtn}",
        "border": "{color.border.brand-primary}"
      }
    }
  }
}
```

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| tone | primary \| secondary \| tertiary \| assistive \| brandAssistive | `'primary'` | 시각적 톤 |
| size | xl \| l \| m \| s | `'m'` | 크기 |
| shape | square \| round | `'square'` | rounded-8px / circle |
| impact | boolean | `false` | 브랜드 강조 CTA |
| loading | boolean | `false` | 스피너 + disabled |
| icon | ReactNode | – | leading 아이콘 |
| label | string | – | 접근성 라벨. children 없으면 보이는 텍스트, iconOnly면 aria-label |
| iconOnly | boolean | `false` | 정사각 아이콘 전용 버튼 (icon 필수, endContent 무시) |
| endContent | ReactNode | – | 라벨 뒤 트레일링 콘텐츠 (배지, 셰브론 등) |
| onClick | MouseEventHandler | – | 동기 클릭 핸들러 |
| clickAction | (e) => void \| Promise\<void\> | – | 비동기 액션 — pending 동안 자동 로딩, fire-once (재클릭 무시) |
| tooltip | string | – | hover 툴팁 (title) |
| href | string | – | 링크 렌더. disabled/loading이면 button 유지 (disabled 링크 안티패턴) |
| as | ElementType | `'a'` | href 렌더 컴포넌트 (Next.js Link 등) |
| target / rel | string | – | href 제공 시에만 적용 |

> loading·disabled 시 클릭 차단, `aria-busy` 부여. iconOnly는 `aria-label` 필수.
