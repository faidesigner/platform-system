# fai-homepage

Fainders.AI 홈페이지 프로젝트입니다. `platform-system` monorepo의 `products/homepage`에 위치합니다.

---

## 처음 시작할 때

레포 루트(`platform-system`)에서 실행합니다.

```bash
git clone [레포 주소]
cd platform-system
pnpm install
cd products/homepage
pnpm dev
```

브라우저에서 `http://localhost:3000`으로 확인합니다.

---

## Claude Code 작업 규칙

### 시작할 때마다
```
README.md 읽고 시작해줘
```

### 공용 컴포넌트로 올릴 때
```
이 컴포넌트 공용으로 올려줘
```

Claude Code가 자동으로 아래 3단계를 수행합니다:
1. `src/components/` → `packages/ui/components/` 로 이동
2. `packages/ui/index.ts` 에 export 추가
3. homepage import 경로를 `@fai/ui` 로 교체

### 작업 완료 시마다
```
오늘 작업한 내용 요약해서 CHANGELOG.md에 날짜별로 추가해줘
```

---

## 작업 범위

이 프로젝트에서 작업하는 디자이너는 **`products/homepage/` 안에서만** 작업합니다.

| 작업 내용 | 위치 |
|---|---|
| 페이지 레이아웃, 화면 구성 | `src/app/` |
| 컴포넌트 | `src/components/` |
| 사이트 텍스트, 메뉴, 연락처 등 | `src/config/site.ts` |
| 전역 스타일 | `src/app/globals.css` |

---

## 공용 컴포넌트 사용 (`@fai/ui`)

Button, NavigationBar, Header, Footer, HeroSection은 공용 패키지에서 가져옵니다.

```ts
import { Button, NavigationBar, Footer, HeroSection } from '@fai/ui'
```

공용 컴포넌트 소스는 `packages/ui/components/`에 있습니다.
**직접 수정하지 않습니다.** 수정 필요 시 선연에게 요청합니다.

---

## 디자인 토큰 규칙

- 토큰 위치: `platform-system/root/foundation/`
- 그리드 토큰: `platform-system/root/web/tokens/grid.json`
- **금지**: 임의 색상(`#ffffff`), 임의 픽셀값(`w-[13px]`) 하드코딩

---

## Git 브랜치 규칙

| prefix | 용도 | 예시 |
|---|---|---|
| `feat/` | 기능 개발 | `feat/hero-section` |
| `claude-design/` | Claude Design 컴포넌트 | `claude-design/navigation-bar` |
| `fix/` | 버그 수정 | `fix/button-hover` |
| `design/` | 스타일 변경 | `design/typography` |

Next.js 상세 정보 (참고용)
이 프로젝트는 create-next-app으로 생성되었습니다. 폰트는 Vercel의 새로운 폰트 패밀리인 next/font 및 Geist 폰트를 사용하여 자동 최적화 로드됩니다.

더 자세한 Next.js 기능과 API는 Next.js Documentation을 참고하세요.