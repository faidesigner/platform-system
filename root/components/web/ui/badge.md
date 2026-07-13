# Badge Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 상태(Status) 또는 카테고리(Category)를 한눈에 표시하는 읽기 전용 인디케이터
- **사용처**: 시스템 상태 표시(Failed, Degraded 등), 분류 태그(팀명, 콘텐츠 유형, 우선순위)
- **사용 금지**: 메타데이터(날짜, 기간, 카운트, 설명)는 배지가 아닌 supporting 텍스트 사용. 클릭 가능한 요소로 사용 금지(액션이 필요하면 Button/Link 사용)

## 2. ⚡ Variants

### Semantic (솔리드 배경 — 주의가 필요한 시스템 상태 전용)

| variant | bg | text |
|---|---|---|
| neutral *(default)* | 중립 배경 | 기본 텍스트 |
| info | 인포 솔리드 | inverse |
| success | 포지티브 솔리드 | inverse |
| warning | 워닝 솔리드 | inverse |
| error | 네거티브 솔리드 | inverse |

### Category (틴트 배경 + 컬러 텍스트 — 분류/태깅 전용)

| variant | 매핑 토큰 계열 |
|---|---|
| blue | filled.basic.info-secondary + text.basic.Info (blue 계열 시맨틱 토큰) |
| mint | filled.basic.positive-secondary + text.basic.positive (mint 계열 시맨틱 토큰) |
| orange | filled.basic.warning-secondary + text.basic.warning (orange 계열 시맨틱 토큰) |
| red | filled.basic.negative-secondary + text.basic.negative (red 계열 시맨틱 토큰) |
| yellow | tag.category-yellow |
| green | tag.category-green |
| indigo | tag.category-indigo |
| purple | tag.category-purple |
| grape | tag.category-grape |
| gray | tag.category-gray |


## 3. ⚡ Interaction & State
- **Default**: 정적 요소. hover/active/focus 상태 없음 (read-only)
- **Disabled**: 해당 없음 — 인터랙션 자체가 없음

## 4. 📐 Layout & Content Rules
- **구조**: `inline-flex`, `align-items: center`, `justify-content: center`, `white-space: nowrap`
- **height**: `{size.20}`
- **padding**: 상하 0 / 좌우 `{size.8}`
- **gap**: `{size.4}` (icon–label 간격)
- **radius**: `rounded-circle` (pill 형태)
- **typography**: supporting 사이즈 + medium weight
- **Label**: 필수. 1~2단어 유지. HTML 태그는 `<span>`
- **Icon**: 선택. leading 위치만 허용, 반드시 텍스트 라벨과 함께 사용

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| variant | semantic \| category 유니언 | `'neutral'` | 시각적 스타일 변형 |
| label | ReactNode | 필수 | 배지 텍스트 |
| icon | ReactNode | – | 선택적 leading 아이콘 |

## 6. 🎨 Token Mapping
```json
{
  "component": "Badge",
  "variants": {
    "neutral": {
      "default": {
        "bg-color": "{color.filled.basic.tertiary}",
        "text-color": "{color.text.basic.primary}"
      }
    },
    "info": {
      "default": {
        "bg-color": "{color.filled.basic.info}",
        "text-color": "{color.text.basic.inverse}"
      }
    },
    "success": {
      "default": {
        "bg-color": "{color.filled.basic.positive}",
        "text-color": "{color.text.basic.inverse}"
      }
    },
    "warning": {
      "default": {
        "bg-color": "{color.filled.basic.warning}",
        "text-color": "{color.text.basic.inverse}"
      }
    },
    "error": {
      "default": {
        "bg-color": "{color.filled.basic.negative}",
        "text-color": "{color.text.basic.inverse}"
      }
    },
    "blue": {
      "default": {
        "bg-color": "{color.filled.basic.info-secondary}",
        "text-color": "{color.text.basic.Info}",
        "_description": "전용 tag.category-blue 토큰 부재 → blue 계열 시맨틱 토큰(info-secondary/Info) 재사용"
      }
    },
    "mint": {
      "default": {
        "bg-color": "{color.filled.basic.positive-secondary}",
        "text-color": "{color.text.basic.positive}",
        "_description": "mint 계열 시맨틱 토큰(positive-secondary/positive) 재사용"
      }
    },
    "orange": {
      "default": {
        "bg-color": "{color.filled.basic.warning-secondary}",
        "text-color": "{color.text.basic.warning}",
        "_description": "orange 계열 시맨틱 토큰(warning-secondary/warning) 재사용"
      }
    },
    "red": {
      "default": {
        "bg-color": "{color.filled.basic.negative-secondary}",
        "text-color": "{color.text.basic.negative}",
        "_description": "red 계열 시맨틱 토큰(negative-secondary/negative) 재사용"
      }
    },
    "yellow": {
      "default": {
        "bg-color": "{color.filled.tag.category-yellow-secondary}",
        "text-color": "{color.text.tag.category-yellow}"
      }
    },
    "green": {
      "default": {
        "bg-color": "{color.filled.tag.category-green-secondary}",
        "text-color": "{color.text.tag.category-green}"
      }
    },
    "indigo": {
      "default": {
        "bg-color": "{color.filled.tag.category-indigo-secondary}",
        "text-color": "{color.text.tag.category-indigo}"
      }
    },
    "purple": {
      "default": {
        "bg-color": "{color.filled.tag.category-purple-secondary}",
        "text-color": "{color.text.tag.category-purple}"
      }
    },
    "grape": {
      "default": {
        "bg-color": "{color.filled.tag.category-grape-secondary}",
        "text-color": "{color.text.tag.category-grape}"
      }
    },
    "gray": {
      "default": {
        "bg-color": "{color.filled.tag.category-gray-secondary}",
        "text-color": "{color.text.tag.category-gray}"
      }
    }
  },
  "layout": {
    "height": { "value": "{size.20}", "tailwind": "h-5" },
    "padding-x": { "value": "{size.8}", "tailwind": "px-2" },
    "gap": { "value": "{size.4}", "tailwind": "gap-1" },
    "radius": { "value": "rounded-circle", "tailwind": "rounded-full" }
  }
}
```

## 7. ✅ Best Practices
- 배지는 주의를 뺏는 요소 — 사용자가 인지/조치해야 하는 상태에만 사용
- semantic(success/warning/error/info)은 시스템 상태 전용, category 컬러는 분류 태그 전용
- 모든 행에 같은 배지 반복 금지(전부 초록 "Active"면 아무것도 눈에 안 띔) — 예외 상태만 배지 처리
- 라벨은 1~2단어, 상세 내용은 주변 텍스트로
