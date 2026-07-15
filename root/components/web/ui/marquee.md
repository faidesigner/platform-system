# Marquee Specification
**Status**: Draft

> Marquee(범용 롤링 트랙) + LogoMarquee(로고 전용 프리셋) 2개 컴포넌트.
> LogoMarquee는 Marquee를 감싼 프리셋이므로 규칙은 Marquee가 원본.

## 1. 🎯 Definition & Usage
- **Marquee**: 자식 요소를 끊김 없이 가로로 무한 롤링하는 트랙
- **LogoMarquee**: 협력사 로고를 타일에 담아 롤링하는 Marquee 프리셋
- **사용처**: 협력사 로고 띠, 공지 티커, 반복 강조 콘텐츠
- **사용 금지**: 사용자가 읽고 조작해야 하는 핵심 콘텐츠(정지 불가하므로 접근성 저하). 항목이 1~2개뿐이면 정적 배치 사용

## 2. ⚡ Props (API)

### Marquee
| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | 롤링할 아이템 |
| speed | number | 30 | 트랙 한 바퀴 소요 시간(초) |
| gapClassName | string | `gap-2xl` | 아이템 간격 Tailwind 클래스 |
| ariaLabel | string | — | 영역 레이블 |

### LogoMarquee
| prop | type | default | 설명 |
|---|---|---|---|
| logos | LogoItem[] | 필수 | `{ src, alt }` 배열 |
| speed | number | 30 | Marquee로 전달 |
| tileOpacity | number | 10 | 로고 타일 배경 불투명도(%) |

## 3. ⚡ Interaction & State
- **무한 루프**: 아이템을 2벌 복제 → `-50%` keyframe(`animate-fai-marquee`)으로 끊김 없이 롤링
- **접근성**: 복제본에 `aria-hidden` 부여(스크린리더 중복 방지). `motion-reduce:animate-none`으로 모션 축소 설정 존중
- **풀블리드**: `left-1/2 w-screen -translate-x-1/2`로 뷰포트 전체 폭 사용

## 4. 📐 Layout & Content Rules
- **gap**: 기본 `gap-2xl`
- **애니메이션 duration**: CSS 변수 `--marquee-duration`을 inline style로 주입 (동적 Tailwind 클래스 금지 — 빌드 스캔 불가)
- **LogoMarquee 타일**: `py-ms`, radius `rounded-fai-s`, 로고 이미지 140×40

## 5. ⚠️ Sync Note (코드 확인 2026-07-15)
- `LogoMarquee`가 타일 폭에 `w-[var(--size-180)]` 사용 중. `--size-*` CSS 변수는 방출되지 않으므로(→ CLAUDE.md 구현 규칙) **Tailwind spacing 클래스로 교체 필요**. 180px 대응 클래스 확인 후 수정 권장.
- 로고 타일 배경이 `color-mix(... var(--fai-bg-fill-inverse) ...)` 임의 표현. 토큰 클래스로 정리 가능한지 검토.
