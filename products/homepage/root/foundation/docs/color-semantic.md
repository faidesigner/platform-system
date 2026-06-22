# Color Semantic Tokens

> **Layer 2 — 시맨틱 색상 데이터.** 컴포넌트가 참조하는 유일한 색상 변수.
> 원시값은 [`color-global.json`](./color-global.json)을 alias로 참조합니다.

## 개요

`color-semantic.json`은 역할(의미) 기반 색상 토큰입니다.
라이트/다크 모드 모두 동일한 토큰 이름을 사용하며, 모드 전환 시 값만 달라집니다.

JSON 최상위 그룹은 `semantic`이며, 하위에 `bg`, `color`, `border` 카테고리가 있습니다.  
런타임에 쓰는 CSS 변수명·Tailwind 유틸리티 매핑은 **`app/globals.css`**와 **`tailwind.config.ts`**에 정의되어 있으며, 이 JSON의 각 키와 1:1로 대응되도록 유지합니다.

---

## 카테고리

### `semantic.bg` — 배경 (Background)

| 토큰 | JSON 경로 | 라이트 | 다크 | 설명 |
|------|------------|--------|------|------|
| `surface` | `semantic.bg.surface` | white | gray-900 | 페이지 기본 배경 |
| `surface-alt` | `semantic.bg.surface-alt` | gray-30 | gray-800 | 카드·패널 보조 배경 |
| `surface-sunken` | `semantic.bg.surface-sunken` | gray-50 | gray-700 | 인풋·비활성 영역 눌린 배경 |
| `surface-raised` | `semantic.bg.surface-raised` | white | gray-800 | 모달·드롭다운 부상 배경 |
| `overlay` | `semantic.bg.overlay` | rgba(0,0,0,0.52) | rgba(0,0,0,0.35) | 스크림 (딤드) |
| `overlay-strong` | `semantic.bg.overlay-strong` | rgba(0,0,0,0.74) | same | 스크림 강조 |
| `overlay-max` | `semantic.bg.overlay-max` | rgba(0,0,0,0.87) | same | 스크림 최대 |
| `brand` | `semantic.bg.brand` | green-500 | green-500 | 브랜드 기본 배경 |
| `brand-subtle` | `semantic.bg.brand-subtle` | green-100 | green-300 | 브랜드 연한 배경 |
| `fill-strong` | `semantic.bg.fill-strong` | gray-800 | gray-400 | 강조 버튼·배지 배경 |
| `fill` | `semantic.bg.fill` | gray-500 | gray-500 | 보조 컴포넌트 배경 |
| `fill-soft` | `semantic.bg.fill-soft` | gray-50 | gray-700 | 보조 버튼·태그 배경 |
| `fill-faint` | `semantic.bg.fill-faint` | gray-30 | gray-800 | 호버·선택 영역 연한 배경 |
| `fill-inverse` | `semantic.bg.fill-inverse` | white | gray-900 | 반전 배경 |
| `fill-disabled` | `semantic.bg.fill-disabled` | gray-50 | gray-700 | 비활성 배경 |
| `success` | `semantic.bg.success` | mint-50 | mint-900 | 성공 상태 배경 |
| `warning` | `semantic.bg.warning` | orange-50 | orange-900 | 경고 상태 배경 |
| `error` | `semantic.bg.error` | red-50 | red-900 | 오류 상태 배경 |
| `info` | `semantic.bg.info` | blue-50 | blue-900 | 정보 상태 배경 |

---

### `semantic.color` — 텍스트 & 아이콘 (Content)

| 토큰 | JSON 경로 | 라이트 | 다크 | 설명 |
|------|------------|--------|------|------|
| `primary` | `semantic.color.primary` | gray-900 | white | 기본 본문 텍스트 |
| `secondary` | `semantic.color.secondary` | gray-700 | gray-100 | 보조 텍스트 (레이블·설명) |
| `tertiary` | `semantic.color.tertiary` | gray-500 | gray-200 | 힌트·플레이스홀더 |
| `quaternary` | `semantic.color.quaternary` | gray-300 | gray-400 | 딤드·보조 캡션 |
| `inverse` | `semantic.color.inverse` | white | white | 반전 텍스트 (어두운 배경 위) |
| `inverse-subtle` | `semantic.color.inverse-subtle` | gray-100 | gray-600 | 반전 보조 텍스트 |
| `disabled` | `semantic.color.disabled` | gray-100 | gray-600 | 비활성 텍스트 |
| `brand` | `semantic.color.brand` | green-600 | green-500 | 브랜드 텍스트 |
| `on-brand` | `semantic.color.on-brand` | white | gray-900 | 브랜드 배경 위 텍스트 |
| `success` | `semantic.color.success` | mint-500 | mint-400 | 성공 상태 텍스트·아이콘 |
| `warning` | `semantic.color.warning` | orange-500 | orange-400 | 경고 상태 텍스트·아이콘 |
| `error` | `semantic.color.error` | red-500 | red-400 | 오류 상태 텍스트·아이콘 |
| `info` | `semantic.color.info` | blue-500 | blue-400 | 정보 상태 텍스트·아이콘 |

---

### `semantic.border` — 테두리 (Border)

| 토큰 | JSON 경로 | 라이트 | 다크 | 설명 |
|------|------------|--------|------|------|
| `default` | `semantic.border.default` | gray-700 | gray-200 | 기본 테두리 |
| `subtle` | `semantic.border.subtle` | gray-100 | gray-500 | 보조 테두리 |
| `faint` | `semantic.border.faint` | gray-50 | gray-700 | 연한 구분선 |
| `inverse` | `semantic.border.inverse` | white | white | 반전 테두리 |
| `brand` | `semantic.border.brand` | green-500 | green-500 | 브랜드 테두리 |
| `brand-subtle` | `semantic.border.brand-subtle` | green-300 | green-700 | 브랜드 보조 테두리 |
| `disabled` | `semantic.border.disabled` | gray-30 | gray-700 | 비활성 테두리 |
| `success` | `semantic.border.success` | mint-500 | mint-400 | 성공 상태 테두리 |
| `warning` | `semantic.border.warning` | orange-500 | orange-400 | 경고 상태 테두리 |
| `error` | `semantic.border.error` | red-500 | red-400 | 오류 상태 테두리 |
| `info` | `semantic.border.info` | blue-500 | blue-400 | 정보 상태 테두리 |

---

### `semantic.sand` — 샌드 서피스 (Sand)

Sand 계열 배경 위 요소에 사용하는 전용 시맨틱 토큰입니다.
라이트/다크에서 명도가 반전됩니다 (라이트: 옅음→진함 / 다크: 진함→옅음).

#### `sand.filled` — 배경·면

| 토큰 | JSON 경로 | 라이트 | 다크 | 설명 |
|------|------------|--------|------|------|
| `sand-filled-primary` | `semantic.sand.filled.primary` | sand-50 | sand-900 | 연한 Sand 면 (surface 용도) |
| `sand-filled-secondary` | `semantic.sand.filled.secondary` | sand-100 | sand-800 | 보조 Sand 면 |
| `sand-filled-tertiary` | `semantic.sand.filled.tertiary` | sand-200 | sand-700 | 진한 Sand 면 (card 용도) |
| `sand-filled-disabled` | `semantic.sand.filled.disabled` | sand-400 | sand-500 | 비활성 Sand 면 |

#### `sand.text` — 텍스트 위계

| 토큰 | JSON 경로 | 라이트 | 다크 | 설명 |
|------|------------|--------|------|------|
| `sand-text-primary` | `semantic.sand.text.primary` | sand-900 | sand-50 | 주요 텍스트 |
| `sand-text-secondary` | `semantic.sand.text.secondary` | sand-700 | sand-200 | 보조 텍스트 |
| `sand-text-tertiary` | `semantic.sand.text.tertiary` | sand-600 | sand-400 | 힌트·캡션 |

#### `sand.border` — 경계선

| 토큰 | JSON 경로 | 라이트 | 다크 | 설명 |
|------|------------|--------|------|------|
| `sand-border-primary` | `semantic.sand.border.primary` | sand-700 | sand-300 | 주요 경계선 |
| `sand-border-secondary` | `semantic.sand.border.secondary` | sand-300 | sand-600 | 보조 경계선 |

```tsx
// Sand 면 배경
<div className="bg-sand-filled-tertiary">
  <p className="text-sand-text-primary">카드 제목</p>
  <p className="text-sand-text-tertiary">보조 설명</p>
  <div className="border border-sand-border-secondary" />
</div>
```

---

## Tailwind 사용 예시

시맨틱 색상은 `tailwind.config.ts`에 매핑된 유틸리티로만 사용합니다. 클래스 이름은 설정 파일을 단일 출처로 삼습니다.

```tsx
// 배경
<div className="bg-surface">...</div>
<div className="bg-brand">...</div>
<div className="bg-error-bg">...</div>

// 텍스트
<p className="text-primary">...</p>
<span className="text-tertiary">...</span>
<span className="text-error">오류 메시지</span>

// 테두리
<input className="border border-default focus:border-brand" />
```

## 다크 모드

`<html>` 또는 루트 요소에 `dark` 클래스를 추가하면 `:where(.dark)` 블록이 활성화되어 동일 토큰이 다크 값으로 자동 전환됩니다.

```html
<html class="dark">
```
