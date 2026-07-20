# Motion Guide

이 문서는 서비스에서 사용하는 모션 토큰을 정의합니다.
실제 수치는 동일 폴더의 `motion.json` 파일을 참조하세요.

---

## 규칙

- 애니메이션과 트랜지션은 정의된 duration/easing 토큰만 사용합니다.
- 즉각적인 피드백에는 instant, 작은 상호작용에는 fast, 레이아웃이 변하는 전환에는 medium, 큰 화면 전환에는 slow를 사용합니다.
- hover처럼 자주 발생하는 상호작용은 지연이 느껴지지 않도록 fast 계열만 사용합니다.
- OS의 reduced motion 설정을 존중합니다.
- 애니메이션이 사용자의 다음 행동을 막지 않도록 합니다.

---

## Duration 스케일

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| --duration-instant-min | 100ms | 즉각적인 상태 토글 |
| --duration-instant | 150ms | 즉각 피드백 (press, 체크 토글) |
| --duration-instant-max | 200ms | 살짝 지연된 즉시 반응 |
| --duration-fast-min | 130ms | 아주 작은 상태 변화 |
| --duration-fast | 175ms | 버튼, 토글, 작은 피드백 |
| --duration-fast-max | 230ms | 작지만 눈에 보여야 하는 전환 |
| --duration-medium-min | 310ms | 작은 패널, 드롭다운 |
| --duration-medium | 410ms | 패널 열림, 콘텐츠 확장 |
| --duration-medium-max | 550ms | 레이아웃 재배치 |
| --duration-slow-min | 730ms | 큰 화면 요소 진입 |
| --duration-slow | 975ms | 페이지 수준 전환 |
| --duration-slow-max | 1300ms | 브랜드 모션, 큰 시퀀스 |

---

## Easing 스케일

| 토큰 | 값 |
| --- | --- |
| --ease-standard | cubic-bezier(0.24, 1, 0.4, 1) |

---

## CSS 변수 패턴

```css
transition-duration: var(--duration-fast);
transition-timing-function: var(--ease-standard);
```
