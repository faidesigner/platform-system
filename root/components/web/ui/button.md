# Button Specification
**Status**: Final

## 1. 🎯 Definition & Usage
- **목적**: 사용자 액션을 유발하는 기본 인터랙션 컴포넌트
- **사용처**: CTA, 폼 제출, 다이얼로그 액션
- **사용 금지**: 페이지 이동만 하는 요소는 Link 사용 (버튼 모양이 필요하면 href prop으로 링크 렌더). 눌림 상태 유지가 필요하면 ToggleButton. 아이콘만 있는 버튼은 IconButton. 한 화면에 impact CTA는 1개만

## 2. ⚡ Variants

| tone | 설명 |
|---|---|
| primary | 주요 액션 (다크 배경) |
| secondary | 보조 액션 (테두리) |
| tertiary | 약한 액션 |
| assistive | 보조 정보성 |
| brandAssistive | 브랜드 강조 |
| warning | 파괴적/경고 액션 (레드 솔리드) — AlertDialog 확인 버튼 기본 |

| size | height | typography |
|---|---|---|
| xl | py-m + px-xl | `w/text/M` |
| l | h-3xl + px-l | `w/text/S` |
| m | py-s + px-m | text/XS (13px) |
| s | py-2xs + px-ms | `w/caption/M` |

## 3. ⚡ Interaction & State
- **Hover / Active**: tone별 배경·테두리 전환 (Token Mapping 참조), `transition-colors`
- **Focus**: `focus-visible` 시 brand 테두리 (numeric ring 유틸 사용 금지 — 시맨틱 border 토큰만)
- **Disabled**: fill-disabled 배경 + disabled 텍스트/테두리, 클릭 차단, `cursor-not-allowed`
- **Loading**: 스피너 + disabled + `aria-busy`. `clickAction`(비동기) 사용 시 pending 동안 자동 적용, fire-once(재클릭 무시)
- **링크 렌더**: `href` 제공 시 `<a>`(또는 as 컴포넌트). 단 disabled/loading이면 `<button>` 유지 (disabled 링크는 접근성 안티패턴)
- **접근성**: `type` 기본값 `"button"`(의도치 않은 폼 submit 방지), iconOnly는 `label`(aria-label) 필수

## 4. 📐 Layout & Content Rules
- **shape**: `square` (rounded-8px) / `round` (rounded-circle)
- **impact**: true일 때 브랜드 컬러 강조 CTA
- **loading**: spinner 표시 + disabled 처리
- **icon**: leading icon 옵션
- **endContent**: 라벨 뒤 트레일링 슬롯 (배지, 셰브론) — 버튼 텍스트 컬러 상속, iconOnly면 무시
- **iconOnly**: 정사각(aspect-square), 좌우 패딩 제거

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| tone | primary \| secondary \| tertiary \| assistive \| brandAssistive \| warning | `'primary'` | 시각적 톤 |
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

## 6. 🎨 Token Mapping
```json
{
  "component": "Button",
  "variants": {
    "primary": {
      "default": {
        "bg-color": "{color.filled.optional.brand-primaryBtn}",
        "text-color": "{color.text.basic.inverse}",
        "border": "none",
        "_description": "구현 기준 토큰. filled.basic.primary와 해석값 동일(gray.800)"
      },
      "disabled": {
        "bg-color": "{color.filled.basic.disabled}",
        "text-color": "{color.text.basic.disabled}",
        "border": "{color.border.disabled}"
      }
    },
    "warning": {
      "default": {
        "bg-color": "{color.filled.basic.negative}",
        "text-color": "{color.text.basic.inverse}",
        "border": "none"
      },
      "hover": { "overlay": "{color.interaction.normal.white.hover}" },
      "pressed": { "overlay": "{color.interaction.strong.white.pressed}" },
      "_description": "파괴적/경고 액션 전용. 색상 negative(red) 계열, hover/focus는 interaction.normal, pressed는 interaction.strong 오버레이 — light 단계는 변화가 약해 상향 (디자이너 확정 2026-07-14)"
    },
    "impact": {
      "default": {
        "bg-color": "{color.filled.optional.brand-primary}",
        "text-color": "{color.text.optional.brand-secondaryBtn}",
        "border": "{color.border.brand-primary}",
        "_description": "확정: 구현 기준 gray.900 고정(--fai-color-on-brand). 파운데이션 brand-primaryBtn(라이트 white/다크 gray.900)과 불일치하나 대비 문제로 구현 유지. 다크 모드 대응 시 재검토"
      }
    }
  }
}
```

## 7. ✅ Best Practices
- 라벨은 동사형으로 짧게 ("확인"보다 "저장하기") — 무엇이 일어나는지 명확하게
- 한 화면에 primary/impact는 하나만, 나머지 액션은 secondary 이하 톤으로 위계 구성
- 비동기 액션(저장/제출/결제)은 loading 수동 관리 대신 clickAction 사용 — 중복 클릭 자동 차단
- 파괴적 액션(삭제 등)은 버튼만으로 실행하지 말고 확인 다이얼로그와 함께
- iconOnly는 반드시 label + tooltip과 함께 (IconButton 스펙과 동일 규칙)
