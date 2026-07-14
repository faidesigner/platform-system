# Overlay Surface Rules (오버레이 표면 규칙)
**Status**: Active — 폭/z-index 확정(2026-07-14), 모션·다크 모드는 design-review.md 추적
**적용 대상**: Popover, DateInput 팝오버, Dialog, AlertDialog, Dropdown, Tooltip 등 화면 위에 뜨는 모든 표면

> 이 문서는 기존 파운데이션에 없던 규칙을 신규 정의한 것입니다.
> 확정되면 각 컴포넌트 스펙(date-input.md, dialog.md 등)이 이 문서를 참조합니다.

---

## 1. 표면 위계 (Surface Hierarchy)

오버레이는 화면에서 "떠 있는 높이"에 따라 2단계로 나눕니다.

| 레벨 | 종류 | 예시 |
|---|---|---|
| Level 1 — 부착형 | 트리거 옆/아래에 붙는 표면 | 팝오버, 드롭다운, 캘린더 팝업, 툴팁 |
| Level 2 — 차단형 | 화면 전체를 가리고 뜨는 표면 | Dialog, AlertDialog, 전체 화면 시트 |

## 2. Level 1 — 팝오버/드롭다운

| 속성 | 값 | 토큰 |
|---|---|---|
| 배경 | 흰색 | `{color.bg.100}` |
| 테두리 | 1px | `{color.border.tertiary}` |
| radius | 16px | `{cornerRadius.M}` = rounded-fai-m |
| 그림자 | 중간 | `{shadow.M}` |
| 트리거와의 간격 | 4px | `{size.4}` |

- 바깥 클릭 또는 Escape로 닫힘
- 트리거에 `aria-haspopup` + `aria-expanded`

## 3. Level 2 — 다이얼로그

| 속성 | 값 | 토큰 |
|---|---|---|
| 배경 | 흰색 | `{color.bg.100}` |
| radius | 16px | `{cornerRadius.M}` |
| 그림자 | 최대 | `{shadow.XL}` |
| 스크림 | 검정 52% | `{color.bg.scrim}` (#00000085 — 기존 토큰) |
| 패딩 | 24px | `{size.24}` |

### 다이얼로그 폭 (디자이너 확정 ✅)

| size | width (min~max) | 용도 |
|---|---|---|
| s | 400~480px | 확인/알림 (AlertDialog 기본) |
| m *(default)* | 560~640px | 일반 폼, 콘텐츠 |
| l | 720~800px | 복잡한 콘텐츠, 미리보기 |
| xl | 960px | 대형 콘텐츠 |

- 모바일에서도 min-width 유지 (디자이너 확정)

## 4. z-index 스케일 (디자이너 확정 ✅ — 파운데이션 승격)

`root/foundation/z-index.json`으로 파운데이션에 정의됨. 상세는 `root/foundation/docs/z-index.md` 참조.

| 토큰 | 값 |
|---|---|
| --z-base | 0 |
| --z-sticky-header | 100 |
| --z-dropdown | 200 |
| --z-popover | 300 |
| --z-tooltip | 400 |
| --z-drawer | 500 |
| --z-dialog | 600 |
| --z-toast | 700 |
| --z-loading-overlay | 800 |
| --z-global-alert | 900 |

## 5. 동작 규칙

| 규칙 | Level 1 (팝오버) | Level 2 (다이얼로그) |
|---|---|---|
| 바깥 클릭 닫기 | ⭕ | Dialog ⭕ / AlertDialog ❌ (명시적 선택 강제) |
| Escape 닫기 | ⭕ | Dialog ⭕ / AlertDialog ❌ |
| 배경 스크롤 | 허용 | 잠금 (body scroll lock) |
| 포커스 | 트리거 유지 | 표면 안으로 이동 + 트랩, 닫히면 트리거로 복귀 |
| ARIA | `role="dialog"` 비모달 | `role="dialog"` 또는 `alertdialog` + `aria-modal="true"` |

## 6. 미결 사항 (design-review.md에서 추적)

1. **등장 모션** — 파운데이션 motion 토큰(duration/ease) 기반 오버레이 모션 값 미정, 1차 구현은 모션 없이
2. **다크 모드** — 그림자(effects) 다크 값 부재 (스크림은 다크 값 존재)
3. **z-index 마이그레이션** — 기존 컴포넌트 하드코딩 교체 + index.css import (머지 후)
