# Color Global (Primitive Tokens)

> **Layer 1 — 원시 색상 데이터.** 컴포넌트에서 직접 사용 금지.
> 반드시 [`color-semantic.json`](./color-semantic.json)의 시맨틱 토큰을 통해서만 참조할 것.

## 개요

`color-global.json`은 FAI 디자인 시스템의 색상 기반(primitive) 팔레트입니다.
CSS에서는 `--color-{hue}-{step}` 형식의 변수로 정의되며, 실제 HEX 값의 단일 출처(single source of truth)입니다.

## 색상 팔레트

| 팔레트 | 스텝 범위 | 주요 용도 |
|--------|-----------|-----------|
| `black` / `white` | — | 고정 기준 색상 |
| `red` | 50 – 900 | 오류·위험 |
| `yellow` | 50 – 900 | 주의·경고(서브) |
| `orange` | 50 – 900 | 경고(주) |
| `green` | 50 – 900 | 브랜드 컬러 |
| `mint` | 50 – 900 | 성공 상태 |
| `blue` | 50 – 900 | 정보 상태 |
| `indigo` | 50 – 900 | 확장 브랜드 |
| `purple` | 50 – 900 | 확장 강조 |
| `grape` | 50 – 900 | 확장 강조 |
| `gray` | 30, 50 – 900 | UI 중립 톤 전반 |
| `sand` | 50 – 900 | 베이지 계열 서피스·카드·면 배경 |

> `gray-30`은 표준 50-단계 외 추가된 스텝으로, 매우 연한 배경에만 사용합니다.
> `sand`는 시맨틱 토큰 `sand.filled` / `sand.text` / `sand.border`를 통해서만 사용합니다.

## 사이즈 스케일 (size)

CSS `--size-{n}` 변수로 정의된 원시 수치 스케일.
spacing, borderRadius 계산의 기반이 됩니다.

| 토큰 | rem | px |
|------|-----|----|
| `size.2` | 0.125rem | 2px |
| `size.4` | 0.25rem | 4px |
| `size.6` | 0.375rem | 6px |
| `size.8` | 0.5rem | 8px |
| `size.12` | 0.75rem | 12px |
| `size.16` | 1rem | 16px |
| `size.20` | 1.25rem | 20px |
| `size.24` | 1.5rem | 24px |
| `size.32` | 2rem | 32px |
| `size.40` | 2.5rem | 40px |
| `size.56` | 3.5rem | 56px |
| `size.over` | 62.438rem | ~999px (완전한 원) |

## 사용 규칙

- ✅ `color-semantic.json`에서 이 파일의 토큰을 alias로 참조
- ✅ 새 색상 추가 시 반드시 이 파일에 먼저 등록
- ❌ 컴포넌트 코드에서 `--color-*` 변수 직접 사용 금지
- ❌ 임의의 HEX 값을 컴포넌트에 하드코딩 금지

## 파일 구조

```
color-global.json
└── color
    ├── black / white
    ├── red / yellow / orange / green / mint
    ├── blue / indigo / purple / grape
    ├── gray / bluegray
    └── sand / skin / brown
└── size
    └── 2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / over
```
