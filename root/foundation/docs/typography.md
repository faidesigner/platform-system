# Typography Primitive Guide

이 문서는 서비스의 폰트 원시값(Primitive)을 정의합니다.
실제 수치는 동일 폴더의 `typography.json` 파일을 참조하세요.

---

## 규칙

- 이 토큰은 직접 UI에 사용하지 않습니다.
- UI에는 반드시 `typography-w.json` 토큰을 사용합니다.
- 폰트 크기는 `rem` 단위로 저장됩니다. (기준: 16px = 1rem)
- `letterSpacing`은 `px` 단위로 저장됩니다.

---

## 구성

| 카테고리 | CSS 접두사 | 설명 |
| --- | --- | --- |
| family | --font-family- | 폰트 패밀리 정의 |
| weight | --font-weight- | 폰트 굵기 |
| size | --font-size- | 폰트 크기 (rem) |
| lineHeight | --font-lineHeight- | 줄 높이 (rem) |
| letterSpacing | --font-letterSpacing- | 자간 (px) |

---

## 폰트 패밀리

| 토큰 | 폰트 | 사용 언어 |
| --- | --- | --- |
| --font-family-pretendard | Pretendard Variable | KO / EN |
| --font-family-m-plus-2 | M PLUS 2 | JA |

---

## 폰트 굵기

| 토큰 | 값 |
| --- | --- |
| --font-weight-400 | 400 (Regular) |
| --font-weight-500 | 500 (Medium) |
| --font-weight-600 | 600 (SemiBold) |
| --font-weight-700 | 700 (Bold) |

---

## CSS 변수 패턴

```css
--font-{카테고리}-{값}
/* 예시 */
--font-size-16
--font-lineHeight-24
--font-letterSpacing-03
```
