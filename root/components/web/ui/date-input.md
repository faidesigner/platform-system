# Date Input Specification
**Status**: Draft

> DateInput(단일) + DateRangeInput(기간) + DateTimeInput(날짜+시간) 3개를 한 파일에 정의.
> 위치: `packages/ui/components/date-input/` · Calendar(calendar.md) 재사용
> 오버레이 표면은 **overlay-rules.md Level 1** 규칙을 따름

## 1. 🎯 Definition & Usage
- **DateInput**: 달력 팝오버로 단일 날짜 선택 (예약일, 마감일)
- **DateRangeInput**: 기간 선택 + 프리셋 (조회 기간, 필터)
- **DateTimeInput**: 날짜 + 시간 목록 (회의 시작, 발행 시각)
- **사용 금지**: 생년월일 등 먼 과거는 텍스트 입력 권장. 시간만 필요하면 TimeInput(추후) 사용

## 2. ⚡ Variants — 폼 트리거 신규 규칙 ✱

> ✱ 총괄 디자이너 확정(2026-07): **날짜/셀렉트류 트리거는 박스형**, 자유 텍스트 입력은 기존 라인형(LineInput) 유지.
> ✱ **required 표시는 빨간 별표(*)로 통일** — 기존 LineInput의 그린 도트도 이 규칙으로 교체.

| 트리거 상태 | 스타일 |
|---|---|
| default | border-secondary 1px + bg-100, radius `rounded-8px`, height `{size.40}` |
| hover | border-primary |
| open(focus) | border-brand |
| error | border-negative + 하단 에러 메시지 |
| disabled | fill-disabled + disabled 텍스트/테두리 |

## 3. ⚡ Interaction & State
- **팝오버**: 트리거 클릭으로 열림, 바깥 클릭/Escape 닫힘 (overlay-rules Level 1)
- **자동 닫힘**: DateInput은 날짜 선택 즉시 / RangeInput은 start·end 완성 시 / DateTimeInput은 시간까지 선택 시
- **클리어**: `hasClear` — 값이 있을 때만 X 버튼 (트리거 클릭과 분리, stopPropagation)
- **프리셋** (Range): 팝오버 좌측 목록, 클릭 즉시 적용+닫힘
- **시간 목록** (DateTime): `timeIncrement` 간격(기본 30분), 날짜 선택 전 비활성
- **접근성**: 트리거 `aria-haspopup="dialog"` + `aria-expanded`, 팝오버 `role="dialog"`, 라벨 연결(aria-labelledby)

## 4. 📐 Layout & Content Rules
- **트리거**: 아이콘(캘린더 16px) + 값/플레이스홀더 + 클리어, gap `{size.8}`, 좌우 padding `{size.12}`, min-width 220px
- **라벨**: `w/text/S` medium + required 빨간 * · **설명/에러**: `w/caption/M` (tertiary/negative)
- **팝오버**: 트리거 아래 `{size.4}` 간격, 좌측 정렬
- **값 표기**: Intl.DateTimeFormat(locale, dateStyle medium) — 기본 ko-KR

## 5. 🧩 Props (API)

### 공통 (3종 모두)
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 라벨 (labelHidden 가능) |
| description / errorMessage | string | – | 보조/에러 텍스트 |
| required / disabled / error | boolean | `false` | |
| min / max | ISO string | – | 선택 범위 |
| isDateDisabled | (date) => boolean | – | 개별 비활성 |
| hasClear | boolean | `false` | 클리어 버튼 |
| placeholder / locale | string | 종류별 기본 | |

### 종류별
| 컴포넌트 | value | onChange | 추가 prop |
|---|---|---|---|
| DateInput | `ISODateString \| null` | (value) => void | – |
| DateRangeInput | `DateRange \| null` | (value) => void | presets: {label, range}[] |
| DateTimeInput | `'YYYY-MM-DDTHH:mm' \| null` | (value) => void | timeIncrement (기본 30) |

## 6. 🎨 Token Mapping
```json
{
  "component": "DateInput",
  "trigger": {
    "height": "{size.40}",
    "radius": "rounded-8px",
    "bg-color": "{color.bg.100}",
    "border": { "default": "{color.border.secondary}", "hover": "{color.border.primary}", "open": "{color.border.brand-primary}", "error": "{color.border.negative}" },
    "icon-color": "{color.icon.basic.secondary}",
    "placeholder-color": "{color.text.basic.tertiary}",
    "typography": "{w.text.S}"
  },
  "label": { "typography": "{w.text.S} medium", "required-mark": "{color.text.basic.negative}" },
  "popover": "overlay-rules.md Level 1 참조",
  "time-list": {
    "selected-bg": "{color.filled.basic.primary}",
    "selected-text": "{color.text.basic.inverse}"
  }
}
```

## 7. ✅ Best Practices
- min/max로 선택 불가 기간을 사전 차단 — 에러 사후 처리 지양
- 조회 필터에는 프리셋(오늘/최근 7일/최근 30일) 제공 권장
- 시간 간격은 도메인에 맞게 (회의 15분, 예약 30분 등)
- 라벨은 항상 제공, placeholder를 라벨 대용으로 쓰지 말 것
