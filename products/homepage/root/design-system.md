# FAI Design System

> **핵심 규칙:** 모든 UI 개발 시 `foundation/` 폴더의 JSON 수치를 최우선 기준으로 따르고,
> 시맨틱 토큰(CSS 변수)과 이를 참조하는 Tailwind 확장 유틸리티를 사용한다.
> 임의의 HEX 값, 픽셀 수치, 스타일 하드코딩을 금지한다.

---

## 토큰 위계 (Token Hierarchy)

```
Layer 0 — Source JSON  (foundation/*.json)
│   진실의 단일 출처. 모든 수치는 여기서 시작.
│
├── Layer 1 — Primitive Tokens  (globals.css :root)
│   └── --color-{hue}-{step}  /  --size-{n}
│       원시 팔레트. 컴포넌트에서 직접 참조 금지.
│
├── Layer 2 — Semantic Tokens  (globals.css :root / :where(.dark))
│   └── 배경·텍스트·테두리·타이포·여백·반경 등 역할 기반 변수
│       컴포넌트가 참조하는 유일한 변수.
│
└── Layer 3 — Tailwind Classes  (tailwind.config.ts)
    └── 시맨틱 변수를 매핑한 유틸리티 클래스
        JSX/TSX에서 실제로 쓰는 클래스.
```

---

## 폴더 구조

```
platform-design/
├── design-system.md              ← 현재 파일 (전체 규칙·위계 문서)
│
├── foundation/                   ← Layer 0: 수치 원본 JSON
│   ├── docs/                     ← 토큰 설명 문서
│   │   ├── color-global.md
│   │   ├── color-semantic.md
│   │   ├── typography.md
│   │   └── spacing.md
│   ├── color-global.json         원시 색상 팔레트 (10개 팔레트 × 10스텝)
│   ├── color-semantic.json       시맨틱 색상 (bg / color / border, 라이트+다크)
│   ├── typography.json           폰트 패밀리, 15개 fontSize + lineHeight
│   └── spacing.json              11단계 spacing + 7단계 borderRadius
│
└── components/
    └── web/                      데스크톱·웹 전용 컴포넌트 스펙
```

---

## 필수 사용 규칙

### 1. 색상

```tsx
// ✅ 올바른 사용 — 시맨틱 유틸(토큰 매핑) 또는 시맨틱 CSS 변수
<div className="bg-surface text-primary border-default" />
<span className="text-error bg-error-bg" />

// ❌ 금지
<div style={{ background: '#ffffff', color: '#1f2023' }} />
<div className="bg-white text-gray-900" />   // Tailwind 원시 팔레트 직접 사용 금지
```

### 2. 타이포그래피

```tsx
// ✅ 올바른 사용 — 타이포 토큰에 매핑된 유틸
<h1 className="text-display-m" />
<p  className="text-body" />
<span className="text-caption-s" />

// ❌ 금지
<h1 className="text-[64px]" />
<p  style={{ fontSize: '16px' }} />
```

### 3. 여백 & 모서리

```tsx
// ✅ 올바른 사용
<section className="py-section-y px-section-x" />
<button  className="px-button-x py-button-y rounded-button" />
<img     className="rounded-full-token" />

// ❌ 금지
<section className="py-16 px-8" />         // Tailwind 원시 스케일 직접 사용 금지
<button  style={{ borderRadius: '8px' }} />
```

### 4. 다크 모드

- 모드 전환은 `<html class="dark">` 한 곳에서만 제어
- 컴포넌트 내부에서 `dark:` 접두어 클래스나 별도 조건부 스타일 작성 금지
- 시맨틱 토큰이 자동으로 다크 값으로 전환됨

---

## 토큰 수정 절차

```
foundation/*.json 수정
      ↓
globals.css CSS 변수 반영
      ↓
tailwind.config.ts 클래스 매핑 확인
      ↓
컴포넌트는 변경 없이 자동 반영
```

새로운 색상·수치가 필요할 때는 반드시 `foundation/*.json`에 먼저 추가한다.
JSON을 거치지 않고 CSS나 Tailwind에 직접 값을 추가하지 않는다.

---

## 카테고리별 토큰 요약

| 카테고리 | JSON 파일 | CSS 변수 | Tailwind |
|----------|-----------|----------|----------|
| 원시 색상 | `color-global.json` | `--color-*` | (직접 사용 금지) |
| 배경 색상 | `color-semantic.json` | 시맨틱 `--*bg*` | `tailwind.config.ts` 매핑 |
| 텍스트·아이콘 색상 | `color-semantic.json` | 시맨틱 `--*color*` | 동일 |
| 테두리 색상 | `color-semantic.json` | 시맨틱 `--*border*` | 동일 |
| 폰트 크기 | `typography.json` | 시맨틱 텍스트 스케일 | 동일 |
| 여백 | `spacing.json` | 시맨틱 스페이스 스케일 | 동일 |
| 모서리 둥글기 | `spacing.json` | 시맨틱 반경 스케일 | 동일 |

실제 클래스 이름·변수 접두어는 `globals.css`와 `tailwind.config.ts`를 단일 출처로 본다.

---

## 관련 파일

- 소스 코드: 저장소 루트의 `app/globals.css`, `tailwind.config.ts`
- 토큰 상세: `foundation/*.json` (수치 원본), `foundation/docs/*.md` (설명 문서)
