# Color Semantic Tokens

> **Layer 2 — 시맨틱 색상 데이터.** 역할(의미) 기반 색상 토큰.
> 원시값은 [`color-global.json`](../color-global.json)을 alias(`{color.…}`)로 참조합니다.
> **이 문서는 `color-semantic.json`의 실제 구조를 설명하며, 값의 단일 진실원본은 JSON입니다.**
> (개별 색상값을 여기 복제하지 않습니다 — 복제하면 JSON과 어긋나 드리프트가 재발합니다.)

## 최상위 구조

`color-semantic.json`의 최상위 키는 **`light` / `dark`** 두 개(모드 우선)입니다.
두 모드는 **동일한 키 트리**를 가지며 리프 값만 다릅니다.

```
color-semantic.json
├─ light
│   ├─ bg / text / icon / border / filled / interaction / sand
└─ dark
    └─ (light과 동일한 카테고리·키, 값만 상이)
```

> ⚠️ 흔한 오해: 최상위가 `semantic`이거나 카테고리가 `bg/color/border` 3종이라는 설명은 **틀립니다.**
> 실제 최상위는 `light`/`dark`, 카테고리는 아래 7종이며, 텍스트/아이콘은 `color`가 아니라 각각 `text`·`icon`입니다.

## 값 형식

- **Alias**: `"{color.gray.900}"` — `color-global.json`의 원시 토큰 참조.
- **Raw**: 스크림·인터랙션 오버레이 등 알파 포함 값은 8자리 HEX 원문(`"#00000085"`, `"#FFFFFF14"`).

## 카테고리 (`light`/`dark` 공통 키 트리)

### `bg` — 배경 (flat)
`100` · `200` · `300` · `scrim` · `srim-live` · `scrim-forSleep` · `elevation100` · `elevation200`
> JSON 원문 오탈자 보존: `srim-live`(= scrim), `scrim-forSleep`. 코드에서 참조 시 철자 그대로 사용.

### `text` — 텍스트 (3 서브그룹)
- `basic`: `primary` `secondary` `tertiary` `fourth` `inverse` `inverse-secondary` `negative` `warning` `positive` `Info` `disabled`
- `optional`: `brand-primaryBtn` `brand-secondaryBtn` `brand-primary` `brand-secondary`
- `tag`: `category-{yellow|green|indigo|purple|grape|gray}`

### `icon` — 아이콘 (`text`와 동일한 3 서브그룹·키 구성)
- `basic` / `optional` / `tag` — 위 `text`와 키 이름 동일.

### `border` — 테두리 (flat)
`primary` · `secondary` · `tertiary` · `inverse` · `disabled` · `negative` · `warning` · `positive` · `Info` · `brand-primary` · `brand-secondary`
> `tertiary`(라이트 `{color.gray.50}`)가 가장 옅은 구분선. 런타임에선 `--fai-border-faint`
> (라이트 gray-50 / 다크 gray-700, Tailwind `border-border-faint`)가 이에 대응.

### `filled` — 면 채우기 (4 서브그룹)
- `basic`: `primary` `secondary` `tertiary` `fourth` `primaryOp` `primaryOp-secondary` `inverse` `inverse-disabled` `inverseOp` `info` `info-secondary` `positive` `positive-secondary` `warning` `warning-secondary` `negative` `negative-secondary` `disabled`
- `optional`: `brand-primaryBtn` `brand-secondaryBtn` `brand-absoluteBtn` `brand-primary` `brand-secondary`
- `tag`: `category-{색상}` + 각 `category-{색상}-secondary`
- `toast`: `dafault` *(JSON 원문 오탈자 — `default` 아님)*

### `interaction` — 상호작용 오버레이 (모두 raw 알파 HEX)
- `btn-tertiary`: `filled-disabled`
- `light` / `normal` / `strong`(강도) → 각각 `white` / `black` / `brand(FAI)` → 상태 `default` `hover` `focus` `pressed`
  - 강도는 알파값 크기 차이(light < normal < strong). 예: `strong.black.pressed = "#00000085"`.

### `sand` — Sand 팔레트 (3 서브그룹)
- `filled`: `primary` `secondary` `tertiary` `disabled`
- `text`: `primary` `secondary` `tertiary`
- `border`: `primary` `secondary`

## 런타임 매핑 (중요)

이 JSON은 **디자인 소스**입니다. 런타임 CSS 변수·Tailwind 유틸리티는
**`products/homepage/app/globals.css`** 와 **`products/homepage/tailwind.config.ts`** 가 별도로 정의하며,
이 JSON과 **키 이름이 1:1로 일치하지 않습니다**(예: `text.basic.primary` → CSS `--color-text-basic-primary` /
`--fai-color-primary`, Tailwind `text-primary`). 즉 globals.css는 이 JSON의 **부분집합을 자체 명명 규칙으로** 옮겨 담습니다.

- 새 색을 쓰려면: ① 이 JSON에 역할이 있는지 확인 → ② globals.css에 대응 CSS 변수가 있는지 확인 →
  ③ Tailwind 시맨틱 유틸리티(`text-primary`, `border-border-faint`, `bg-surface` 등)로 사용.
- **임의 HEX 하드코딩 금지**(CLAUDE.md). 필요한 역할의 CSS 변수가 globals.css에 없으면 토큰을 먼저 추가.

## 다크 모드

`<html>` 또는 루트 요소에 `dark` 클래스를 추가하면 globals.css의 `:where(.dark)` 블록이 활성화되어
동일 토큰이 다크 값으로 자동 전환됩니다.

```html
<html class="dark">
```
