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
        "border": "{color.border.tertiary}"
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
