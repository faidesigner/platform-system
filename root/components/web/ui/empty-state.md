# Empty State Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 데이터가 없거나 검색 결과가 빈 상황의 안내
- **사용처**: 빈 목록/테이블, 검색 무결과, 첫 사용(온보딩) 상태, 에러 후 빈 화면
- **사용 금지**: 로딩 중에는 Skeleton(추후) 사용. 일시적 오류 알림은 Banner

## 2. ⚡ Variants

| variant | 용도 | 크기 |
|---|---|---|
| default | 페이지/패널 중앙 | 아이콘 56px 원, 제목 `w/text/M` |
| compact | 좁은 카드·사이드 패널 | 아이콘 40px 원, 제목 `w/text/S` |

## 3. ⚡ Interaction & State
- 자체 인터랙션 없음 — actions 슬롯의 Button이 해결 동선 담당
- **접근성**: 제목은 시맨틱 헤딩(`headingLevel`, 기본 h3) — 페이지 구조에 맞게 조정

## 4. 📐 Layout & Content Rules
- **구조**: 세로 중앙 정렬 — 아이콘(fill-faint 원) → 제목(semibold) → 설명(secondary, max-width 400px) → actions
- **간격**: gap `{size.8}` (compact `{size.4}`), 상하 padding `{size.56}`/`{size.24}`
- **제목**: 상황 서술 ("아직 프로젝트가 없어요") / **설명**: 이유·다음 행동
- **actions**: 최대 2개 (primary 1 + secondary 1)

## 5. 🧩 Props (API)

| prop | type | default | 설명 |
|---|---|---|---|
| title | string | 필수 | 상태 제목 |
| description | string | – | 이유·다음 행동 |
| icon | ReactNode | – | 상단 아이콘 |
| actions | ReactNode | – | 해결 동선 버튼(들) |
| headingLevel | 1~6 | `3` | 제목 헤딩 레벨 |
| compact | boolean | `false` | 축소 레이아웃 |

## 6. 🎨 Token Mapping
```json
{
  "component": "EmptyState",
  "icon-circle": { "bg-color": "{color.filled.basic.primaryOp-secondary}", "icon-color": "{color.icon.basic.tertiary}", "size": { "default": "{size.56}", "compact": "{size.40}" } },
  "title": { "typography": { "default": "{w.text.M} semibold", "compact": "{w.text.S} semibold" }, "color": "{color.text.basic.primary}" },
  "description": { "typography": "{w.text.S}", "color": "{color.text.basic.secondary}", "max-width": "400px" }
}
```

## 7. ✅ Best Practices
- 제목은 상황을, 설명은 다음 행동을 — "결과 없음"으로 끝내지 말 것
- 검색 무결과에는 검색어 조정 힌트 제공
- 첫 사용 상태에는 핵심 액션 버튼 필수 (빈 화면에서 막히지 않게)
