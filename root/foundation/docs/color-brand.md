# Color Brand Guide

이 문서는 클라이언트별 브랜드 컬러 오버라이드 시스템을 정의합니다.
실제 수치는 동일 폴더의 `color-brand.json` 파일을 참조하세요.

---

## 규칙

- 브랜드 컬러는 `[data-brand='클라이언트명']` 속성으로 적용합니다.
- `color-semantic.json`의 기본값을 오버라이드합니다. 별도 클래스를 추가하지 않습니다.
- 브랜드 토큰은 브랜드 고유 영역(버튼, 로고 근처 강조 요소)에만 사용합니다.
- 새 클라이언트 추가 시 반드시 아래 토큰 구조를 모두 정의합니다.

---

## 지원 클라이언트

| data-brand 값 | 클라이언트 |
| --- | --- |
| `fainders.ai` | Fainders AI (기본 브랜드) |
| `px24` | PX24 |
| `changi-airport` | Changi Airport |
| `sevenelev` | 7-Eleven |
| `hynix` | SK하이닉스 (brand-primary = hynix-teal.500, brand-secondary = hynix-teal.50) |

---

## 중립색(그레이) 오버라이드 — hynix 패턴

브랜드가 기본 gray 대신 다른 중립 스케일을 쓸 때는, 브랜드 항목에 `gray` 객체로
**primitive 별칭**을 정의합니다 (semantic 재매핑 아님).

- hynix는 `gray.30~900` 전체를 `bluegray` 동일 스텝으로 별칭 처리.
- 방출 결과: `[data-brand='hynix'] { --color-gray-900: var(--color-bluegray-900); … }`
- gray를 참조하는 모든 semantic(`text-basic-*`, `bg-*`, `border-*`)과 dark 모드가
  자동으로 따라오므로, semantic 68곳을 개별 재정의하지 않습니다.
- 전제: 대체 스케일의 스텝 구조가 gray와 1:1일 것. 스텝이 다르면 semantic 재매핑으로 처리.

---

## 브랜드 다크 모드 — `dark` 그룹

브랜드가 다크 모드용 브랜드 컬러를 가지면, 브랜드 항목에 `dark` 하위 그룹으로 정의합니다
(구조는 기본과 동일: brand-primary/filled/text/icon/boder).

- 방출: `[data-brand='클라이언트'].dark` 등 조합 셀렉터 블록 (기본 브랜드 블록보다 높은 특이성).
- 중립색은 별도 정의 불필요 — gray primitive 별칭이 다크 semantic까지 자동 적용.
- 관례: 다크에서는 브랜드색을 한 단계 밝게 (hynix: 500 → 400).
- Figma: `scripts/export-figma-variables.js`의 `BRAND_MODES`에 `base: 'dark'` 항목을 추가하면
  Semantic 컬렉션에 `{브랜드} Dark` 모드로 방출됩니다.

---

## 토큰 구조

각 클라이언트는 아래 토큰을 반드시 포함합니다.

| 토큰 | 용도 |
| --- | --- |
| brand-primary | 브랜드 주요 강조색 |
| brand-secondary | 브랜드 보조 강조색 |
| filled.brand-primaryBtn | Primary 버튼 배경 |
| filled.brand-secondaryBtn | Secondary 버튼 배경 |
| filled.brand-primary | 브랜드 채움 주요색 |
| filled.brand-secondary | 브랜드 채움 보조색 |
| filled.brand-absoluteBtn | 절대 배경 위 버튼 (흰색 고정) |
| text.brand-primaryBtn | Primary 버튼 텍스트 |
| text.brand-secondaryBtn | Secondary 버튼 텍스트 |
| text.brand-primary | 브랜드 강조 텍스트 |
| text.brand-secondary | 브랜드 보조 텍스트 |
| icon.brand-primaryBtn | Primary 버튼 아이콘 |
| icon.brand-secondaryBtn | Secondary 버튼 아이콘 |
| icon.brand-primary | 브랜드 강조 아이콘 |
| icon.brand-secondary | 브랜드 보조 아이콘 |
| border.brand-primary | 브랜드 주요 테두리 |
| border.brand-secondary | 브랜드 보조 테두리 |

---

## CSS 변수 패턴

```css
/* 브랜드 적용 */
[data-brand='fainders.ai'] {
  --color-brand-primary: ...;
  --color-filled-brand-primaryBtn: ...;
}
```

---

## 적용 방법

```html
<!-- HTML root 또는 해당 영역의 최상위 요소에 적용 -->
<html data-brand="fainders.ai">
<div data-brand="changi-airport">
```
