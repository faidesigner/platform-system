# Platform Design System

Web 플랫폼 디자인 시스템입니다.
JSON 토큰을 수정하면 CSS가 자동 생성됩니다.

---

## 시작하기

```bash
git clone <repo-url>
cd platform-system

# 토큰 → CSS 최초 생성
npm run sync

# JSON 수정 시 자동 재생성 (개발 중 상시 실행)
npm run watch
```

Node.js 18 이상이 필요합니다.

---

## 폴더 구조

```
platform-system/
├── CLAUDE.md                  ← Claude Code 자동 규칙 (클론 후 즉시 적용)
├── design-system.md           ← 마스터 가이드 (AI 규칙, 공통 규칙)
├── component-template.md      ← 신규 컴포넌트 명세 작성 양식
├── scripts/
│   ├── sync-tokens.js         ← JSON → CSS 생성 스크립트
│   └── watch-tokens.js        ← JSON 변경 감지 후 자동 sync
└── root/
    ├── design-system.md       ← 작업 유형별 문서 진입점
    ├── assets/
    │   └── icon/              ← 아이콘 에셋
    ├── foundation/            ← 공유 토큰 (모든 플랫폼 공통)
    │   ├── docs/              ← 토큰별 규칙 문서
    │   ├── *.json             ← 토큰 원본 (여기만 수정)
    │   └── *.css              ← 자동 생성 (직접 수정 금지)
    └── web/
        ├── docs/              ← Web 플랫폼 문서
        ├── tokens/            ← 자동 생성 CSS + 토큰 JSON
        └── index.css          ← Web 진입점 (프로젝트에서 import)
```

---

## 토큰 수정 방법

1. `root/foundation/*.json` 또는 `root/web/tokens/*.json` 파일 수정
2. `npm run sync` 실행 (또는 `npm run watch` 실행 중이면 자동 반영)
3. CSS 파일은 자동 생성됩니다. 직접 편집하지 않습니다.

```
JSON 수정 → npm run sync → CSS 자동 갱신
```

---

## 주요 문서

| 문서 | 용도 |
| --- | --- |
| `root/design-system.md` | 작업 시작 시 진입점 |
| `root/foundation/docs/README.md` | 공유 토큰 전체 목록 |
| `root/web/docs/grid.md` | Web 레이아웃 Grid 규칙 |
| `design-system.md` | AI 규칙, 공통 명명 규칙 |
| `component-template.md` | 컴포넌트 명세 작성 양식 |

---

## Git 브랜치 규칙

브랜치 이름은 **"어디를 건드리는 작업인가"** 로 정한다. 위치가 prefix를 결정한다.

### 1. 디자인시스템 작업 → `system/`

`packages/ui/` 또는 `root/`(foundation·토큰·컴포넌트 명세)를 건드리는 작업.
**프로덕트가 지정되지 않으면 이것이 기본값.**

| 예시 | 대상 |
| --- | --- |
| `system/badge-component` | 공용 Badge 컴포넌트 |
| `system/icons-motion` | foundation 아이콘·모션 토큰 |

### 2. 프로덕트 작업 → `<프로덕트>/<타입>/`

`products/<프로덕트>/` 안에서 일어나는 작업. **프로덕트명을 반드시 포함**해 어느 프로덕트인지 명확히 한다.

| 타입 | 용도 | 예시 |
| --- | --- | --- |
| `feat/` | 기능 개발 | `homepage/feat/hero-section` |
| `fix/` | 버그 수정 | `homepage/fix/button-hover` |
| `design/` | 스타일 변경 | `design-origin/design/typography` |

### 3. Claude Design 작업 → `claude-design/` (유지)

| 예시 | 대상 |
| --- | --- |
| `claude-design/navigation-bar` | Claude Design 컴포넌트 |

### 판별 기준 (헷갈릴 때)

- 바뀌는 파일이 `packages/ui/` 또는 `root/`에 있으면 → `system/`
- 바뀌는 파일이 `products/<X>/`에 있으면 → `<X>/feat|fix|design/`
- 둘 다 걸치면 → 디자인시스템(`system/`)이 우선. 프로덕트 반영은 별도 브랜치로 분리.

---

## Claude Code와 함께 사용하기

이 프로젝트는 `CLAUDE.md`가 포함되어 있어
Claude Code 실행 시 디자인 시스템 규칙이 자동으로 적용됩니다.

- Foundation 토큰 우선 사용
- 임의 spacing / color / radius 생성 금지
- 기존 컴포넌트 재사용 우선

작업 유형별로 필요한 문서만 읽습니다 → `root/design-system.md` 참고