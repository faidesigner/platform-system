# Input Button Specification
**Status**: Draft

> 참조 구조: Seed Design input-button (치수/상태 모델) — 값은 전부 기존 foundation 토큰으로 매핑
> 라벨/설명 셸 없음 — Field 계열 래퍼가 담당 (신규 패턴 ✱, 기존 DateInput류는 라벨 내장형)

## 1. 🎯 Definition & Usage
- **목적**: 입력 필드 형태의 버튼 — 직접 타이핑하지 않고 피커/선택창을 여는 트리거. 선택 완료 시 값이 표시됨
- **사용처**: 지역/카테고리 선택(시트·다이얼로그), 날짜 피커 진입점, 필터 선택
- **사용 금지**: 단독 사용 금지 — 반드시 선택 UI(Dialog, DropdownMenu, Calendar 등)와 함께. 자유 텍스트 입력은 LineInput

## 2. ⚡ Variants (Seed 치수 → foundation 매핑)

| size | height | gap | radius | padding-x | typography | clear |
|---|---|---|---|---|---|---|
| large | `{size.52}` | `{size.8}` (Seed 10→8) | `{cornerRadius.MS}` 12px | `{size.16}` | `w/text/M` | 22px |
| medium *(default)* | `{size.40}` | `{size.8}` | `rounded-8px` | `{size.12}` (Seed 14→12) | `w/text/S` | 18px |

- large는 터치/모바일, medium은 데스크톱 (Seed 가이드 동일)

## 3. ⚡ Interaction & State (Seed 상태 모델)

| 상태 | 스타일 |
|---|---|
| enabled | bg-100 + border-secondary 1px |
| hover | border-primary |
| pressed | interaction.light.black.pressed 오버레이 |
| error | **negative 2px 스트로크** (1px border + 1px inset shadow — 레이아웃 무밀림) ✱ |
| disabled | fill-disabled + disabled 텍스트, 클릭 차단 |
| readonly ✱ | fill-disabled 배경 + **primary 텍스트**, 클릭 차단 — 신규 상태 |

- 클리어: 값 있을 때만, 클릭 시 onClear (트리거 클릭과 분리)
- 접근성: `aria-haspopup="dialog"`, readonly는 `aria-readonly`, 클리어는 개별 버튼 롤

## 4. 📐 Layout & Content Rules
- **구조**: prefix 슬롯 → value/placeholder(truncate) → clear → suffix 슬롯
- **value**: 텍스트 또는 Chip 등 ReactNode. 없으면 placeholder(tertiary)
- min-width 160px

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| label | string | – | aria-label (단독 사용 시 필수, Field 래퍼 시 생략) |
| value | ReactNode | – | 선택된 값 |
| placeholder | string | `'선택'` | |
| size | 'large' \| 'medium' | `'medium'` | |
| prefix / suffix | ReactNode | – | 앞/뒤 슬롯 |
| hasClear / onClear | – | `false` | 클리어 버튼 |
| error / disabled / readOnly | boolean | `false` | 상태 |
| onClick | MouseEventHandler | – | 피커 열기 |

## 6. 🎨 Token Mapping
```json
{
  "component": "InputButton",
  "enabled": { "bg-color": "{color.bg.100}", "border": "{color.border.secondary}" },
  "hover": { "border": "{color.border.primary}" },
  "pressed": { "overlay": "{color.interaction.light.black.pressed}" },
  "error": { "stroke": "{color.border.negative} 2px (border+inset shadow)" },
  "disabled": { "bg-color": "{color.filled.basic.disabled}", "text-color": "{color.text.basic.disabled}" },
  "readonly": { "bg-color": "{color.filled.basic.disabled}", "text-color": "{color.text.basic.primary}" },
  "placeholder-color": "{color.text.basic.tertiary}",
  "motion": "{motion.duration.instant}"
}
```

## 7. ✅ Best Practices
- placeholder는 동작을 암시 ("지역 선택") — 라벨 대용 금지
- 선택 UI가 닫힌 뒤 값이 즉시 반영되는지 확인 (value는 제어형)
- readonly는 "볼 수 있지만 지금은 못 바꾸는" 값에만 — 영구히 못 바꾸면 일반 텍스트로
