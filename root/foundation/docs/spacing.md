# Spacing Guide

이 문서는 서비스의 간격(Spacing), 여백(Padding), 모서리(Corner Radius) 토큰을 정의합니다.
실제 수치는 동일 폴더의 `spacing.json` 파일을 참조하세요.

---

## 규칙

- 간격, 여백, 모서리 값은 정의된 토큰만 사용합니다. 임의 px 값을 사용하지 않습니다.
- `size-` 토큰은 플랫폼 공통 원시값입니다. UI에 직접 사용하지 않습니다.
- UI에는 반드시 플랫폼 토큰(`padding-`, `spacing-`, `cornerRadius-`)을 사용합니다.
- `mw` 토큰은 Web 플랫폼, `vgk` 토큰은 VG/Kiosk 플랫폼 전용입니다. 혼용하지 않습니다.

---

## 구조

```
spacing.json
├── size          ← 공통 원시값 (모든 플랫폼)
├── mw            ← Web 플랫폼 전용
│   ├── padding
│   ├── spacing
│   └── cornerRadius
└── vgk           ← VG/Kiosk 플랫폼 전용
    ├── padding
    ├── spacing
    └── cornerRadius
```

---

## size — 원시 스케일

단위: `rem` (기준: 16px = 1rem)

| 토큰 | 값 |
| --- | --- |
| --size-none | 0rem |
| --size-2 | 0.125rem |
| --size-4 | 0.25rem |
| --size-6 | 0.375rem |
| --size-8 | 0.5rem |
| --size-12 | 0.75rem |
| --size-16 | 1rem |
| --size-20 | 1.25rem |
| --size-24 | 1.5rem |
| --size-32 | 2rem |
| --size-40 | 2.5rem |
| --size-48 | 3rem |
| --size-56 | 3.5rem |
| --size-64 | 4rem |
| --size-72 | 4.5rem |
| --size-80 | 5rem |
| --size-96 | 6rem |
| --size-120 | 7.5rem |
| --size-over | 62.4375rem (화면 초과) |

---

## padding — 내부 여백

컴포넌트 내부의 패딩에 사용합니다.

```css
/* Web */
--padding-{스케일}   /* 예: --padding-S, --padding-M */

/* VGK */
--padding-{스케일}
```

스케일 단계: none / 8XS – 8XL (플랫폼별 실제값 상이)

---

## spacing — 요소 간 간격

컴포넌트 외부의 Gap, Margin에 사용합니다.

```css
--spacing-{스케일}   /* 예: --spacing-XS, --spacing-L */
```

스케일 단계: none / 7XS – 9XL (플랫폼별 실제값 상이)

---

## cornerRadius — 모서리 곡률

```css
--cornerRadius-{스케일}   /* 예: --cornerRadius-S, --cornerRadius-circle */
```

| 특수 값 | 용도 |
| --- | --- |
| --cornerRadius-none | 모서리 없음 |
| --cornerRadius-circle | 완전한 원형 (50%) |
