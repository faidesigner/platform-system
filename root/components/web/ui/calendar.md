# Calendar Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 월 그리드에서 날짜(단일/기간)를 선택하는 컴포넌트
- **사용처**: 예약/일정 선택, 기간 필터, DateInput의 팝오버 내부
- **사용 금지**: 생년월일처럼 먼 과거 날짜 입력에는 부적합 (텍스트 입력 병행 권장)

## 2. ⚡ Variants

| mode | value 형태 | 동작 |
|---|---|---|
| single *(default)* | `'YYYY-MM-DD'` | 클릭 즉시 선택 |
| range | `{ start, end }` | 첫 클릭 start → 두 번째 클릭 end (역순 클릭 시 자동 정렬) |

## 3. ⚡ Interaction & State

| 셀 상태 | 스타일 |
|---|---|
| default | 투명 배경, hover 시 fill-faint |
| selected (single/range 끝점) | filled.basic.primary 배경 + inverse 텍스트 + semibold |
| in-range (기간 중간) | fill-faint 배경, radius 없음 (연결감) |
| today | border-primary 테두리 |
| outside (이웃 달) | text fourth, `hasOutsideDays=false`면 숨김 |
| disabled (min/max 밖, isDateDisabled) | text disabled + 클릭 차단 |

- **키보드**: 방향키로 날짜 이동 (←→ ±1일, ↑↓ ±7일, 달 경계 자동 전환)
- **월 이동**: 헤더 좌우 버튼, 월 라벨은 `aria-live="polite"`
- **접근성**: `role="grid"`, 셀은 button + `aria-pressed` + ISO 날짜 aria-label

## 4. 📐 Layout & Content Rules
- **그리드**: 7열 × 6주 고정 (레이아웃 밀림 방지)
- **셀**: `{size.40}` 정사각, `w/text/S`, radius `rounded-8px`
- **요일 헤더**: `w/caption/M` + tertiary 텍스트, Intl 로케일 기반 (기본 ko-KR)
- **주 시작 요일**: `weekStartsOn` 0(일)~6(토), 기본 일요일

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| mode | 'single' \| 'range' | `'single'` | 선택 모드 |
| value | ISO string \| DateRange | – | 선택 값 (제어형) |
| onChange | (value, date?) => void | – | 선택 콜백 |
| min / max | ISO string | – | 선택 가능 범위 (포함) |
| isDateDisabled | (date: Date) => boolean | – | 개별 날짜 비활성 |
| weekStartsOn | 0~6 | `0` | 주 시작 요일 |
| locale | string | `'ko-KR'` | 요일/월 표기 |
| hasOutsideDays | boolean | `true` | 이웃 달 날짜 표시 |

## 6. 🎨 Token Mapping
```json
{
  "component": "Calendar",
  "cell": {
    "size": "{size.40}",
    "typography": "{w.text.S}",
    "radius": "rounded-8px",
    "selected": {
      "bg-color": "{color.filled.basic.primary}",
      "text-color": "{color.text.basic.inverse}"
    },
    "in-range": { "bg-color": "{color.filled.basic.primaryOp-secondary}" },
    "today": { "border": "{color.border.primary}" },
    "outside": { "text-color": "{color.text.basic.fourth}" },
    "disabled": { "text-color": "{color.text.basic.disabled}" }
  },
  "weekday-header": {
    "typography": "{w.caption.M}",
    "text-color": "{color.text.basic.tertiary}"
  },
  "month-label": { "typography": "{w.text.S} semibold" }
}
```

## 7. ✅ Best Practices
- range 모드에서 start만 찍힌 진행 상태를 시각적으로 유지할 것
- min/max로 선택 불가 기간을 명확히 — 에러 사후 처리보다 사전 차단
- 셀 크기 40px 유지 — 터치 타깃 최소 기준
- 먼 과거/미래 날짜가 필요한 입력엔 달력 단독 사용 지양
