# Carousel Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 아이템들을 가로 스크롤로 훑어보는 컨테이너
- **사용처**: 추천 상품/콘텐츠 목록, 썸네일 스트립, 태그 목록 등 가로로 넘겨보는 UI
- **사용 금지**: 핵심 콘텐츠를 캐러셀 뒤로 숨기지 말 것. 세로 목록이 더 적합한 콘텐츠에 사용 금지

## 2. ⚡ Variants

| gap | 값 |
|---|---|
| none | 0 |
| 2xs | `{size.4}` |
| s *(default)* | `{size.8}` |
| m | `{size.16}` |
| l | `{size.24}` |

## 3. ⚡ Interaction & State
- **스크롤**: 네이티브 가로 스크롤 (터치/트랙패드/휠). 스크롤바는 숨김
- **버튼**: `hasButtons`(기본 true) — 콘텐츠가 넘칠 때만 좌우 원형 버튼 표시, 클릭 시 뷰포트 80%씩 smooth 스크롤. 끝에 도달한 방향의 버튼은 opacity 0 + 포커스 제외
- **가장자리 페이드**: `hasEdgeFade`(기본 true) — 스크롤 가능한 방향에 2rem gradient mask로 "더 있음" 암시
- **스냅**: `hasSnap`(기본 false) — scroll-snap-x, 아이템 snap-start
- **접근성**: `role="region"` + aria-label, 버튼에 "이전/다음 항목" aria-label

## 4. 📐 Layout & Content Rules
- **구조**: relative 래퍼 > overflow-x-auto flex 트랙 > 아이템들
- **버튼**: `{size.32}` 원형, bg-100 배경 + border-secondary + shadow-S, 좌우 `{size.4}` 여백
- **아이템 폭**: 자식이 자체 width를 가져야 함 (shrink-0 권장)

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | 캐러셀 아이템들 |
| gap | none \| 2xs \| s \| m \| l | `'s'` | 아이템 간격 |
| hasButtons | boolean | `true` | 좌우 내비게이션 버튼 |
| hasEdgeFade | boolean | `true` | 가장자리 페이드 |
| hasSnap | boolean | `false` | 스크롤 스냅 |
| aria-label | string | `'캐러셀'` | region 라벨 |

## 6. 🎨 Token Mapping
```json
{
  "component": "Carousel",
  "nav-button": {
    "size": "{size.32}",
    "bg-color": "{color.bg.100}",
    "icon-color": "{color.icon.basic.primary}",
    "border": "{color.border.secondary}",
    "shadow": "{shadow.S}",
    "radius": "rounded-circle",
    "hover-bg": "{color.filled.basic.primaryOp-secondary}"
  },
  "layout": {
    "gap-default": { "value": "{size.8}", "tailwind": "gap-s" },
    "edge-fade": "2rem gradient mask"
  }
}
```

## 7. ✅ Best Practices
- 아이템 일부가 걸쳐 보이게 해서 스크롤 가능함을 암시 (edge fade와 함께)
- 버튼은 보조 수단 — 터치/휠 스크롤이 기본 동작
- 카드형 아이템에는 hasSnap 권장, 연속 콘텐츠(태그 등)에는 비권장
- 아이템 수가 2~3개뿐이면 캐러셀 대신 그리드 배치 검토
