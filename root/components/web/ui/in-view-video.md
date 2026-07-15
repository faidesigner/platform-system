# InViewVideo Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 뷰포트에 들어오면 자동 재생, 벗어나면 일시정지하는 배경/데코 비디오
- **사용처**: 스크롤 진입 시 재생되는 히어로/섹션 배경 영상
- **사용 금지**: 사용자가 재생을 제어해야 하는 콘텐츠 영상(컨트롤 있는 플레이어 사용). 음성이 중요한 영상(muted 재생이므로)

## 2. ⚡ Props (API)
| prop | type | 설명 |
|---|---|---|
| src | string | 비디오 소스. `"MISSING_FROM_DESIGN"`이면 렌더 안 함 |
| poster | string | 포스터 이미지. `"MISSING_FROM_DESIGN"`이면 무시 |
| className | string | 스타일 클래스 |

## 3. ⚡ Interaction & State
- **자동 재생/정지**: IntersectionObserver(threshold 0.25) — 25% 이상 보이면 `play()`, 벗어나면 `pause()`
- **접근성**: `prefers-reduced-motion: reduce` 감지 시 재생 안 함(pause)
- **속성**: `loop muted playsInline preload="metadata"` 고정
- **미완 처리**: src가 `MISSING_FROM_DESIGN`이면 `null` 반환(렌더 생략)

## 4. 📐 Layout & Content Rules
- 자체 스타일 없음 — 크기·비율은 `className`으로 주입받음
- 순수 동작 컴포넌트(레이아웃 토큰 미사용)

## 5. ✅ Sync Note (코드 확인 2026-07-15)
스타일을 className으로 위임하고 자체 토큰 하드코딩 없음. 토큰 규칙 위반 없음. 양호.
