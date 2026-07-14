# Overlay Surface Rules (오버레이 표면 규칙)
**Status**: Draft — 총괄 디자이너 검토 대기
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

### 다이얼로그 폭 (신규 정의 — 검토 필요 ⚠️)

| size | max-width | 용도 |
|---|---|---|
| s | 400px | 확인/알림 (AlertDialog 기본) |
| m *(default)* | 560px | 일반 폼, 콘텐츠 |
| l | 720px | 복잡한 콘텐츠, 미리보기 |

- 모바일(<768px)에서는 좌우 `{size.20}` 여백을 남기고 풀폭

## 4. z-index 스케일 (신규 정의 — 검토 필요 ⚠️)

기존 시스템에 z-index 토큰이 없어 신규 제안:

| 이름 | 값 | 용도 |
|---|---|---|
| z-popover | 50 | Level 1 표면 |
| z-dialog | 100 | Level 2 표면 + 스크림 |
| z-toast | 150 | 토스트 (항상 최상위) |

## 5. 동작 규칙

| 규칙 | Level 1 (팝오버) | Level 2 (다이얼로그) |
|---|---|---|
| 바깥 클릭 닫기 | ⭕ | Dialog ⭕ / AlertDialog ❌ (명시적 선택 강제) |
| Escape 닫기 | ⭕ | Dialog ⭕ / AlertDialog ❌ |
| 배경 스크롤 | 허용 | 잠금 (body scroll lock) |
| 포커스 | 트리거 유지 | 표면 안으로 이동 + 트랩, 닫히면 트리거로 복귀 |
| ARIA | `role="dialog"` 비모달 | `role="dialog"` 또는 `alertdialog` + `aria-modal="true"` |

## 6. 미결 사항 (디자이너 확정 필요)

1. **다이얼로그 폭 3단계(400/560/720)** — 수치 확정 필요
2. **z-index 값(50/100/150)** — 기존 코드(NavigationBar 등)의 z-index와 충돌 여부 확인 필요
3. **등장 모션** — 파운데이션 motion 토큰(motion.css)과 연결한 등장/퇴장 애니메이션 (페이드? 스케일? duration?) — 현재 미정의, 1차 구현은 모션 없이
4. **다크 모드** — 스크림·그림자 다크 값 (현재 라이트 기준만)
