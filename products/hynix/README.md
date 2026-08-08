# fai-hynix — Design Handoff Gallery

SK hynix 프로덕트의 **완성 UI/UX 페이지 갤러리**.
개발까지 직접 가는 게 목적이 아니라, 완성된 화면을 개발자·기획자에게
**"페이지 목록 → 클릭 → 완성 화면 + 코드 복사"** 형태로 전달하는 핸드오프 도구다.

## 실행 (프로토타입 보기)

```bash
# 저장소 루트에서 의존성 설치 (최초 1회)
corepack pnpm install

# hynix dev 서버 기동
corepack pnpm --filter fai-hynix dev
# → http://localhost:3001 에서 갤러리 확인
```

`corepack pnpm` 이 안 되면 `pnpm` 을 직접 써도 된다.

## 스택 (상위와 통일)

- **Next.js 16 + React 19 + Tailwind v4** — `products/homepage` 와 동일 표준.
- **@fai/ui** (`workspace:*`) — 상위 공용 컴포넌트를 그대로 재사용한다.
  버튼·라벨 등은 직접 만들지 말고 `@fai/ui` 에서 import 한다.
- **foundation 토큰** — `root/foundation/*.css` 를 `globals.css` 에서 import.
  브랜드 색은 `data-brand="hynix"` 로 적용된다 (layout.tsx 에 이미 설정됨).

## 새 페이지 추가하는 법

1. `app/pages/_pages/<slug>/page.tsx` 생성.
   - 완성 페이지를 `default export` 로,
   - 개발자에게 넘길 원본 소스를 `export const code = \`...\`` 문자열로 함께 내보낸다.
2. `app/pages-registry.ts` 의 `PAGES` 배열에 항목 추가 (no, title, slug, Component, code).
3. 끝. 인덱스(`/`)에 자동 노출되고, 상세 페이지에서 코드 복사가 동작한다.

## 파일 구조

```
app/
  page.tsx                 # 인덱스 — 00페이지 링크 목록
  pages-registry.ts        # 페이지 등록소 (여기에만 추가하면 됨)
  pages/[slug]/page.tsx    # 상세 — 완성 화면 렌더 + 코드 복사
  pages/_pages/<slug>/     # 각 페이지의 실제 컴포넌트 + code 문자열
  components/CodePanel.tsx  # 코드 보기/복사 UI
  globals.css / layout.tsx # 토큰 연결 + hynix 브랜드 테마
```

## 컴포넌트 승격 워크플로 (hynix → packages/ui)

hynix 에서 만든 컴포넌트를 상위 공용(`@fai/ui`)으로 올릴 때의 **통일 절차**.
CLAUDE.md 의 [공용 컴포넌트 승격] 규칙을 따른다.

1. 대상 컴포넌트를 `packages/ui/components/` 로 이동.
2. `packages/ui/index.ts` 에 export 추가.
   - named: `export { X } from './components/X';`
   - default: `export { default as X } from './components/X';`
3. hynix 안의 import 경로를 `'@fai/ui'` 로 교체.
4. CLAUDE.md 규칙에 따라 **3종 동시 생성** 원칙 확인:
   `.md` 명세(`root/components/web/`) + `.tsx` 코드 + `.json` 스펙(figma-component-input).

### ⚠️ 충돌 처리 (현재 정책: 체크만, 무시)

승격 시 이름/토큰/타입이 상위와 **충돌할 수 있다.**
지금 단계에서는 **충돌을 발견하면 아래 `CONFLICTS.md` 에 기록만 하고 병합/수정은 하지 않는다** (사용자 결정).
빌드를 막지 않는 선에서 그대로 두고, 나중에 일괄 정리한다.
