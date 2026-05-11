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
