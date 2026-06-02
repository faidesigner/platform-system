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

## 작업 범위

이 프로젝트에서 작업하는 디자이너는 **`products/homepage/` 안에서만** 작업합니다.

| 작업 내용 | 위치 |
|-----------|------|
| 페이지 레이아웃, 화면 구성 | `src/app/` |
| 사이트 이름, 메뉴, 연락처 등 텍스트 수정 | `src/config/site.ts` |
| 전역 스타일 | `src/app/globals.css` |

---

## 공용 컴포넌트 사용 (`@fai/ui`)

Button, NavigationBar, Header, Footer, HeroSection은 공용 패키지에서 가져옵니다.

```ts
import { Button, NavigationBar, Footer, HeroSection } from '@fai/ui'
```

공용 컴포넌트의 소스는 `packages/ui/components/`에 있습니다.
**이 파일들은 직접 수정하지 않습니다.** 수정이 필요하면 컴포넌트 담당자에게 요청합니다.

---

## 디자인 토큰

색상, 간격, 타이포그래피는 반드시 foundation 토큰을 사용합니다.

- 토큰 위치: `platform-system/root/foundation/`
- 그리드 토큰: `platform-system/root/web/tokens/grid.json`
- 임의의 색상, 간격, radius 값은 사용하지 않습니다.

---

## Claude Code로 작업할 때

작업 전에 다음 파일을 먼저 읽도록 지시합니다.

1. `homepage-system.md` — 이 프로젝트의 구조와 컨벤션
2. `platform-system/root/foundation/` — 디자인 토큰

**지시 예시:**
> "homepage-system.md와 foundation 토큰을 먼저 읽고, `src/app/` 안에서만 작업해줘."
