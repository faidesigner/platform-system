# Design Review Checklist (⚠️ 총괄 디자이너 검토 대기 목록)
**용도**: 컴포넌트/토큰 작업 중 발견된 미확정 규칙을 모아두는 문서.
"내가 ⚠️검토해야하는 시스템 알려줘"라고 하면 이 목록을 기준으로 보고합니다.
확정된 항목은 아래 "확정 이력"으로 이동합니다.

---

## 🔴 검토 대기

### 1. 오버레이 등장/퇴장 모션
- 파운데이션 motion 토큰(duration fast/medium/slow + ease-standard)은 존재
- 오버레이(팝오버/다이얼로그/토스트)에 어떤 모션(페이드? 스케일? 어떤 duration?)을 적용할지 미정
- 현재 구현: 모션 없이 즉시 표시/제거

### 2. 다크 모드 공백 (2026-07-14 감사 결과)
- `color-brand.json` — 다크 값 없음
- `effects.json`(그림자) — 다크 값 없음
- `globals.css`의 `--fai-*` 별칭 계층 — 다크 오버라이드 부분적(7곳), 전수 확인 필요
- 신규 컴포넌트 전체 — 라이트 기준으로만 구현/검증됨
- ✅ 있는 것: color-semantic(dark.css), 스크림(bg.scrim 다크 값 존재)

### 3. z-index 마이그레이션 (스케일 자체는 확정됨)
- 기존 컴포넌트(NavigationBar, Header, Drawer, Toast 등)의 하드코딩 z-index를 신규 스케일로 교체 — 전수 조사 필요
- `root/foundation/index.css`에 `@import './z-index.css';` 추가 — codex 작업 충돌 방지 위해 머지 후
- `scripts/sync-tokens.js`에 z-index.json 통합 — 머지 후

### 4. spacing 하드코딩 → CSS 변수 전환 (보류 중)
- tailwind.config.ts의 spacing 값이 하드코딩 사본 (px-s = '0.5rem' 등)
- 트리거 문구: "size 하드코딩 수정하던거 이제 하자!" — codex 머지 후 진행 약속됨

### 5. impact 버튼 텍스트 색 — 다크 모드 재검토
- 라이트: gray.900 고정으로 확정 (구현 기준)
- 파운데이션 `brand-primaryBtn`(라이트 white/다크 gray.900)과 불일치 상태 — 다크 모드 대응 시 재검토 (button.md 기록)

### 6. primary 버튼 배경 토큰 경로 정리
- 구현: `filled.optional.brand-primaryBtn` / 의미상 후보: `filled.basic.primary` (해석값 동일 gray.800)
- 토큰 네이밍 의도 정리 필요

### 7. Dialog 모바일 반응형 검증
- 폭 규칙(min-width)이 태블릿 이상에서만 적용되도록 구현 — 모바일 실기기 확인 필요

---

## ✅ 확정 이력

| 날짜 | 항목 | 결정 |
|---|---|---|
| 2026-07-14 | 폼 트리거 스타일 | 날짜/셀렉트류 = 박스형 신규, 텍스트 = 기존 라인형 |
| 2026-07-14 | required 표시 | 빨간 별표(*) 통일, LineInput 그린 도트 교체 |
| 2026-07-14 | 오버레이 표면 2단계 | overlay-rules.md Level 1/2 채택 |
| 2026-07-14 | 다이얼로그 폭 | s 400~480 / m 560~640(기본) / l 720~800 / xl 960 |
| 2026-07-14 | z-index 스케일 | 파운데이션 신설: base 0 ~ global-alert 900 (100 단위) |
| 2026-07-14 | 파괴적 버튼 톤 | Button `warning` 톤 신설 (foundation warning 계열) |
| 2026-07-14 | impact 텍스트 색 (라이트) | 구현 기준 gray.900 고정 |
