# Opacity Guide

이 문서는 서비스에서 사용하는 불투명도(Opacity) 토큰을 정의합니다.
실제 수치는 동일 폴더의 `opacity.json` 파일을 참조하세요.

---

## 규칙

- 불투명도 값은 임의 숫자를 사용하지 않고 정의된 토큰만 사용합니다.
- `disabled` 토큰은 비활성화 요소 전용입니다. 일반 투명 표현에 사용하지 않습니다.
- 반투명 오버레이가 필요한 경우, `color-semantic.json`의 `Op` 계열 토큰을 먼저 확인합니다.

---

## 토큰 목록

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| --opacity-disabled | 0 | 비활성화 요소 |
| --opacity-3 | 0.03 | 극히 약한 오버레이 |
| --opacity-6 | 0.06 | |
| --opacity-8 | 0.08 | hover 오버레이 |
| --opacity-12 | 0.12 | |
| --opacity-16 | 0.16 | focus 오버레이 |
| --opacity-20 | 0.20 | pressed 오버레이 |
| --opacity-28 | 0.28 | |
| --opacity-35 | 0.35 | 중간 스크림 |
| --opacity-42 | 0.42 | |
| --opacity-52 | 0.52 | |
| --opacity-61 | 0.61 | |
| --opacity-74 | 0.74 | 강한 스크림 |
| --opacity-87 | 0.87 | |
| --opacity-96 | 0.96 | |
| --opacity-100 | 1 | 완전 불투명 |

---

## CSS 변수 패턴

```css
--opacity-{값}
/* 예시 */
opacity: var(--opacity-disabled);
opacity: var(--opacity-8);
```
