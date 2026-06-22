# Spacing Guide

이 문서는 서비스의 간격(Spacing), 여백(Padding), 모서리(Corner Radius) 토큰을 정의합니다.
실제 수치는 동일 폴더의 `spacing.json` 파일을 참조하세요.

---

## 규칙

- 간격, 여백, 모서리 값은 정의된 토큰만 사용합니다. 임의 px 값을 사용하지 않습니다.
- `size-` 토큰은 원시값입니다. UI에 직접 사용하지 않습니다.
- UI에는 반드시 `mw` 토큰(`padding-`, `spacing-`, `cornerRadius-`)을 사용합니다.

---

## 구조

```
spacing.json
├── size    ← 원시값
└── mw      ← Web 플랫폼
    ├── padding
    ├── spacing
    └── cornerRadius
```

---

## size — 원시 스케일

단위: `rem` (기준: 16px = 1rem)

| 토큰 | rem | px |
| --- | --- | --- |
| --size-none | 0rem | 0px |
| --size-2 | 0.125rem | 2px |
| --size-4 | 0.25rem | 4px |
| --size-6 | 0.375rem | 6px |
| --size-8 | 0.5rem | 8px |
| --size-12 | 0.75rem | 12px |
| --size-16 | 1rem | 16px |
| --size-18 | 1.125rem | 18px |
| --size-20 | 1.25rem | 20px |
| --size-24 | 1.5rem | 24px |
| --size-28 | 1.75rem | 28px |
| --size-32 | 2rem | 32px |
| --size-36 | 2.25rem | 36px |
| --size-40 | 2.5rem | 40px |
| --size-48 | 3rem | 48px |
| --size-52 | 3.25rem | 52px |
| --size-56 | 3.5rem | 56px |
| --size-60 | 3.75rem | 60px |
| --size-64 | 4rem | 64px |
| --size-72 | 4.5rem | 72px |
| --size-80 | 5rem | 80px |
| --size-88 | 5.5rem | 88px |
| --size-96 | 6rem | 96px |
| --size-100 | 6.25rem | 100px |
| --size-120 | 7.5rem | 120px |
| --size-140 | 8.75rem | 140px |
| --size-150 | 9.375rem | 150px |
| --size-180 | 11.25rem | 180px |
| --size-240 | 15rem | 240px |
| --size-320 | 20rem | 320px |
| --size-over | 62.4375rem | ~999px (화면 초과) |

---

## padding — 내부 여백

컴포넌트 내부의 패딩에 사용합니다.

```css
--padding-{스케일}   /* 예: --padding-S, --padding-M */
```

| 스케일 | size 참조 | px |
| --- | --- | --- |
| 3XS | size.2 | 2px |
| 2XS | size.4 | 4px |
| XS | size.6 | 6px |
| S | size.8 | 8px |
| MS | size.12 | 12px |
| M | size.16 | 16px |
| ML | size.18 | 18px |
| L | size.20 | 20px |
| XL | size.24 | 24px |
| 2XL | size.32 | 32px |
| 3XL | size.40 | 40px |
| 4XL | size.56 | 56px |
| 5XL | size.80 | 80px |
| 6XL | size.100 | 100px |
| 7XL | size.120 | 120px |
| 8XL | size.180 | 180px |

---

## spacing — 요소 간 간격

컴포넌트 외부의 Gap, Margin에 사용합니다.

```css
--spacing-{스케일}   /* 예: --spacing-XS, --spacing-L */
```

| 스케일 | size 참조 | px |
| --- | --- | --- |
| 3XS | size.2 | 2px |
| 2XS | size.4 | 4px |
| XS | size.6 | 6px |
| S | size.8 | 8px |
| MS | size.12 | 12px |
| M | size.16 | 16px |
| ML | size.18 | 18px |
| L | size.20 | 20px |
| XL | size.24 | 24px |
| 2XL | size.32 | 32px |
| 3XL | size.40 | 40px |
| 4XL | size.56 | 56px |
| 5XL | size.80 | 80px |
| 6XL | size.100 | 100px |
| 7XL | size.120 | 120px |
| 8XL | size.180 | 180px |
| 9XL | size.240 | 240px |

---

## cornerRadius — 모서리 곡률

컴포넌트 모서리 둥글기에 사용합니다.

```css
--cornerRadius-{스케일}   /* 예: --cornerRadius-S, --cornerRadius-M */
```

| 스케일 | size 참조 | px | 주요 용도 |
| --- | --- | --- | --- |
| none | size.None | 0px | 모서리 없음 |
| 2XS | size.4 | 4px | 태그, 배지, 칩 |
| XS | size.6 | 6px | 소형 인풋 |
| S | size.8 | 8px | 인풋, 버튼 소형 |
| MS | size.12 | 12px | 카드 소형, 버튼 중형 |
| M | size.16 | 16px | 카드 기본, 패널 |
| L | size.20 | 20px | 대형 카드, 모달 |
| XL | size.24 | 24px | 풀스크린 시트, 바텀시트 |
| circle | size.Over | ~999px | 아바타, 원형 버튼, 필 배지 |
