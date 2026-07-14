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

### 2. 다크 모드 공백 (2026-07-14 변수 대칭 감사 — 실사용 기준)
신규 컴포넌트가 실제 사용하는 컬러 변수 83개를 다크 정의(dark.css + globals.css 다크 블록)와 대칭 확인한 결과, **다크 값이 없는 것은 3개뿐**:
- `--fai-color-inverse` — Button primary/warning 텍스트 (라이트 white 고정)
- `--fai-border-brand` — focus-visible 브랜드 테두리, SelectableCard 선택 테두리
- `--color-border-brand` — ⚠️ **존재하지 않는 토큰명** (LineInput focus가 사용, fallback #39DB1F로만 동작 중. 정식명은 `--color-border-brand-primary`) → 다크 이전에 토큰명 정정 필요
- 그 외 80개는 시맨틱 변수라 다크 자동 대응 ✅
- 파일 단위 공백(참고): color-brand.json, effects.json(그림자)은 다크 정의 자체가 없음

### 3. z-index 마이그레이션 (스케일 자체는 확정됨)
- 기존 컴포넌트의 하드코딩 z-index를 신규 스케일로 교체 — 확인된 대상: Dropdown.tsx(z-40 → --z-dropdown), HoverDropdown.tsx(z-50 → --z-dropdown), 그 외 NavigationBar/Header/Drawer/Toast 전수 조사 필요
- `root/foundation/index.css`에 `@import './z-index.css';` 추가 — codex 작업 충돌 방지 위해 머지 후
- `scripts/sync-tokens.js`에 z-index.json 통합 — 머지 후
- motion.json/motion.css는 codex 브랜치도 작업 중 — 머지 시 add/add 충돌 예상, instant 티어 유지하며 병합할 것

### 4. spacing 하드코딩 → CSS 변수 전환 (보류 중)
- tailwind.config.ts의 spacing 값이 하드코딩 사본 (px-s = '0.5rem' 등)
- 트리거 문구: "size 하드코딩 수정하던거 이제 하자!" — codex 머지 후 진행 약속됨

### 5. impact 버튼 텍스트 색 — 다크 모드 재검토
- 라이트: gray.900 고정으로 확정 (구현 기준)
- 파운데이션 `brand-primaryBtn`(라이트 white/다크 gray.900)과 불일치 상태 — 다크 모드 대응 시 재검토 (button.md 기록)

### 6. primary 버튼 배경 토큰 경로 정리
- 구현: `filled.optional.brand-primaryBtn` / 의미상 후보: `filled.basic.primary` (해석값 동일 gray.800)
- 토큰 네이밍 의도 정리 필요

### 7. InputButton ↔ Field 결합 검토 (2026-07-14 분석)
Astryx Field(라벨/설명/status 래퍼)에 InputButton을 넣는 시나리오 검증 결과:
- ✅ 구조 호환: InputButton은 라벨 셸 없는 순수 트리거로 설계 — Field가 label(htmlFor→id)·description을 소유하는 모델과 맞음. id/aria-describedby passthrough 지원
- ⚠️ **폼 패턴 이원화**: 기존 DateInput/FileInput은 라벨 내장형, InputButton은 셸 없는 신규 패턴 — Field 도입 시 기존 컴포넌트의 라벨 분리 리팩토링 필요 (결정 대기)
- ⚠️ **status 전파 없음**: Field의 status(error)가 자식 보더에 자동 반영되지 않음 — error prop을 수동으로 함께 넘겨야 함 (Field 구현 시 컨텍스트 전파 설계 필요)
- ⚠️ **에러 스트로크 두께 충돌**: Seed/InputButton은 2px, 기존 박스형(DateInput 등)은 1px — 통일 여부 결정 필요
- ⚠️ **readonly 신규 상태**: 폼 공통 규칙에 없던 상태 (fill-disabled 배경 + primary 텍스트) — 다른 폼 컴포넌트로 확대 여부 결정 필요

### 8. Dialog 모바일 오버플로 인지
- 디자이너 확정으로 모바일에서도 min-width 유지 — 단 s(400px)도 모바일 브레이크포인트(390px)보다 커서 좁은 기기에서 가로 스크롤 발생 가능. 의도 확인만 남음

---

## ✅ 확정 이력

| 날짜 | 항목 | 결정 |
|---|---|---|
| 2026-07-14 | 폼 트리거 스타일 | 날짜/셀렉트류 = 박스형 신규, 텍스트 = 기존 라인형 |
| 2026-07-14 | required 표시 | 빨간 별표(*) 통일, LineInput 그린 도트 교체 |
| 2026-07-14 | 오버레이 표면 2단계 | overlay-rules.md Level 1/2 채택 |
| 2026-07-14 | 다이얼로그 폭 | s 400~480 / m 560~640(기본) / l 720~800 / xl 960 |
| 2026-07-14 | z-index 스케일 | 파운데이션 신설: base 0 ~ global-alert 900 (100 단위) |
| 2026-07-14 | 파괴적 버튼 톤 | Button `warning` 톤 신설 — 색상 negative(red) 계열, hover는 interaction.light.white 오버레이 (솔리드 배경 선례 준수) |
| 2026-07-14 | impact 텍스트 색 (라이트) | 구현 기준 gray.900 고정 |
| 2026-07-14 | Dialog 모바일 폭 | min-width 모바일에서도 유지 |
| 2026-07-14 | border-fourth 토큰 신설 | 라이트 gray.300 / 다크 gray.400 — 중간톤 보더, 주 용도 dashed(드롭존 2px 확정). text.basic.fourth와 네이밍 정합 |
| 2026-07-14 | 모션 규칙 | foundation motion에 instant 티어 신설(min 100/기본 150/max 200ms) — 마이크로 인터랙션용. 모든 명시 duration은 motion 토큰 사용, 신규 컴포넌트 일괄 적용 |
