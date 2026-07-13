# Banner Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 페이지/섹션 상단에 지속적으로 노출되는 상태 알림 (사용자가 조치할 때까지 유지)
- **사용처**: 폼 에러, 시스템 업데이트, 점검 공지, 성공 확인 메시지
- **사용 금지**: 자동으로 사라지는 짧은 메시지는 Toast 사용. 같은 status의 배너를 여러 개 쌓지 말고 하나로 통합

## 2. ⚡ Variants

### Status (필수 — 아이콘·컬러 결정)

| status | bg | icon color | role |
|---|---|---|---|
| info | 인포 틴트 | Info | `status` |
| success | 포지티브 틴트 | positive | `status` |
| warning | 워닝 틴트 | warning | `alert` |
| error | 네거티브 틴트 | negative | `alert` |

### Container

| container | 설명 |
|---|---|
| card *(default)* | 독립 카드 — `rounded-8px` 적용 |
| section | 전체 너비 섹션 배너 — radius 없음 |

## 3. ⚡ Interaction & State
- **Default**: 정적 노출, 사용자가 조치/해제할 때까지 유지
- **Dismiss**: `isDismissable=true`일 때 닫기(ghost icon) 버튼 노출. 클릭 시 내부 상태로 자체 숨김 (`onDismiss` 콜백은 선택)
- **Expand/Collapse**: `children` 제공 시 헤더 end 영역에 chevron 토글 버튼 노출. 클릭 시 콘텐츠 영역 표시/숨김, chevron 180° 회전 (motion: fast + standard easing)
- **접근성**: error/warning → `role="alert"`, info/success → `role="status"`. 아이콘은 `aria-hidden`, 토글 버튼에 `aria-expanded`

## 4. 📐 Layout & Content Rules
- **구조**: 2단 구성 — Header(상태 컬러 배경) + Content(선택, 접이식 카드 배경)
- **Header**: `flex`, `align-items: flex-start` (description 없이 액션만 있으면 center), gap `{size.8}`, padding 상하 `{size.12}` / 좌우 `{size.16}`
- **Content**: padding 상하 `{size.12}` / 좌우 `{size.16}`, 좌·우·하단 border, 카드 배경. card 컨테이너일 때 하단 radius만 적용 (Header는 상단 radius만)
- **Icon**: 헤더 좌측 고정. status별 기본 아이콘(info/warning/error/success), `icon` prop으로 교체 가능
- **Title**: 필수. `w/text/S` (14px) + semibold, 기본 텍스트 컬러. 짧고 스캔 가능하게 ("Payment failed" ⭕ / 긴 설명문 ❌)
- **Description**: 선택. `w/caption/M` (12px) + regular, secondary 텍스트 컬러
- **End 영역**: endContent(액션 버튼) → expand 토글 → dismiss 버튼 순서, gap `{size.8}`

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| status | 'info' \| 'success' \| 'warning' \| 'error' | 필수 | 아이콘·컬러 스킴 결정 |
| title | ReactNode | 필수 | 헤더 타이틀 |
| description | ReactNode | – | 타이틀 아래 보조 설명 |
| icon | ReactNode | – | 기본 status 아이콘 교체 |
| isDismissable | boolean | `false` | 닫기 버튼 노출 + 자체 숨김 처리 |
| onDismiss | () => void | – | 닫기 클릭 콜백 |
| endContent | ReactNode | – | 헤더 end 영역 액션 버튼 (ghost/secondary Button 권장) |
| container | 'card' \| 'section' | `'card'` | 카드형 / 전체 너비형 |
| defaultIsExpanded | boolean | `false` | 콘텐츠 영역 초기 펼침 여부 |
| children | ReactNode | – | 접이식 콘텐츠 영역 (리스트, 링크 등 리치 콘텐츠) |

## 6. 🎨 Token Mapping
```json
{
  "component": "Banner",
  "variants": {
    "info": {
      "default": {
        "bg-color": "{color.filled.basic.info-secondary}",
        "icon-color": "{color.icon.basic.Info}"
      }
    },
    "success": {
      "default": {
        "bg-color": "{color.filled.basic.positive-secondary}",
        "icon-color": "{color.icon.basic.positive}"
      }
    },
    "warning": {
      "default": {
        "bg-color": "{color.filled.basic.warning-secondary}",
        "icon-color": "{color.icon.basic.warning}"
      }
    },
    "error": {
      "default": {
        "bg-color": "{color.filled.basic.negative-secondary}",
        "icon-color": "{color.icon.basic.negative}"
      }
    }
  },
  "text": {
    "title-color": "{color.text.basic.primary}",
    "description-color": "{color.text.basic.secondary}"
  },
  "content-area": {
    "bg-color": "{color.bg.100}",
    "border-color": "{color.border.tertiary}"
  },
  "layout": {
    "gap": { "value": "{size.8}", "tailwind": "gap-2" },
    "padding-y": { "value": "{size.12}", "tailwind": "py-3" },
    "padding-x": { "value": "{size.16}", "tailwind": "px-4" },
    "radius": { "value": "rounded-8px", "tailwind": "rounded-lg", "_description": "card 컨테이너 전용, section은 radius 없음" }
  }
}
```

## 7. ✅ Best Practices
- 메시지 성격에 맞는 status 선택: 업데이트=info, 주의=warning, 문제=error, 확인=success
- 페이지 콘텐츠 내부에는 card, 페이지 전체 너비 메시지에는 section 컨테이너 사용
- info/success는 dismissable로, error는 문제 해결 전까지 유지
- 타이틀은 짧고 스캔 가능하게, 상세 내용은 description 또는 접이식 children으로
- 자동으로 사라져야 하는 메시지는 Banner 대신 Toast 사용
- 같은 status의 배너를 여러 개 쌓지 말 것 — 관련 메시지는 하나의 배너로 통합
