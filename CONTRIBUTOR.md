# 👋 Fainders Platform System — 협업 가이드

> 디자이너/기여자를 위한 작업 가이드입니다.

---

## 1. 구조 한눈에 보기

```
platform-system/
├── root/
│   ├── foundation/        ← 모든 디자인 토큰 (색상, 타이포, 스페이싱)
│   ├── components/web/    ← 컴포넌트 스펙 문서 (.md)
│   └── web/tokens/        ← 그리드 토큰
├── packages/
│   └── ui/                ← 실제 공용 컴포넌트 (.tsx)
└── products/
    └── homepage/          ← Fainders 홈페이지 Next.js 프로젝트
```

- `.md` 파일 — 사람이 읽는 스펙/문서
- `CLAUDE.md` — AI(Claude Code)가 읽는 작업 규칙
- `root/design-system.md` — AI가 구조 파악하는 진입점 (수정 금지)

---

## 2. 규칙 파일 위치

| 파일 | 역할 | 수정 |
|---|---|---|
| `CLAUDE.md` | Claude Code 작업 규칙 | 선연에게 문의 |
| `homepage-system.md` | 홈페이지 전용 디자인 헌법 | 선연에게 문의 |
| `component-template.md` | 신규 컴포넌트 작성 양식 | 선연에게 문의 |

---

## 3. 새 컴포넌트 만들 때

1. `component-template.md` 복사해서 스펙 작성
2. `root/components/web/ui/` 또는 `root/components/web/layout/`에 저장
3. Claude Code로 tsx 구현 → `packages/ui/components/`에 저장
4. 브랜치 따서 PR

---

## 4. 토큰 규칙

- **색상**: `root/foundation/color-semantic.json` 기준 시맨틱 토큰만 사용
- **스페이싱**: `root/foundation/spacing.json` 토큰만 사용
- **금지**: 헥스 코드 하드코딩 (`#0052CC`), 임의 픽셀 값 (`w-[13px]`)

---

## 5. Git 브랜치 규칙

| prefix | 용도 | 예시 |
|---|---|---|
| `feat/` | 기능 개발 | `feat/button-component` |
| `design/` | 토큰, 스타일 변경 | `design/color-tokens` |
| `claude-design/` | Claude Design에서 가져온 컴포넌트 | `claude-design/navigation-bar` |
| `fix/` | 버그 수정 | `fix/button-hover` |
| `chore/` | 설정, 구조 변경 | `chore/folder-structure` |

---

## 6. 커밋 메시지 규칙

```
feat:    새 컴포넌트/기능 추가
fix:     버그 수정
design:  토큰/스타일 변경
chore:   설정, 파일 정리
docs:    문서 업데이트
```

---

## 7. 작업 완료 후 필수

작업이 끝날 때마다 Claude Code에게:
```
오늘 작업한 내용 요약해서 CHANGELOG.md에 날짜별로 추가해줘
```

---

## 8. 데이터 위치 요약

| 자산 종류 | 위치 |
|---|---|
| 색상/타이포/스페이싱 토큰 | `root/foundation/` |
| 그리드 토큰 | `root/web/tokens/` |
| 컴포넌트 스펙 문서 | `root/components/web/` |
| 공용 컴포넌트 tsx | `packages/ui/components/` |
| 홈페이지 프로젝트 | `products/homepage/` |

---

궁금한 점은 선연에게 문의해주세요 🙏

---

## 9. 홈페이지 작업 시 규칙

**작업 시작할 때마다:**
```
README.md 읽고 시작해줘
```

**공통으로 쓸 컴포넌트 만들었을 때:**
```
이 컴포넌트 공용으로 올려줘
```
→ Claude Code가 `packages/ui/components/`에 저장 + `packages/ui/index.ts`에 export 자동 추가
