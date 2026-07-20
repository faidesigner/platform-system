# Claude Project Rules

> 공통 규칙(네이밍·토큰·검증)의 SSOT는 **`design-system.md`**. 여기엔 요약과 이 저장소 고유 규칙만 둔다.

## 📖 문서 읽기 순서 (계층)
1. **먼저 상위(공통)** — `design-system.md`(공통 규칙 SSOT) + `root/design-system.md`(작업 유형별 진입점).
2. **그다음 해당 프로덕트에서 작업할 때만** 그 프로덕트 문서를 추가로 읽는다.
   - `products/homepage` 작업 → `products/homepage/homepage-system.md` (모노레포 구조·컴포넌트 배치 헌법)
3. 관련 없는 프로덕트 문서는 읽지 않는다. 공통 규칙이 우선이고, 프로덕트 문서는 그 위에 얹히는 세부 규칙이다.

UI 생성 전:
- foundation 토큰만 사용, web grid 토큰만 사용
- 기존 컴포넌트·토큰 재사용 우선

절대 금지 (자세한 근거는 design-system.md):
- 임의 spacing / color / radius 생성 금지

## Paths (fai-homepage)

- Design tokens: `platform-system/root/foundation/`
- Web components: `platform-system/root/components/web/`
- Grid tokens: `platform-system/root/web/tokens/grid.json`

## Architecture SSOT (역할 분리)

컴포넌트 규칙은 세 곳에 나뉘며, 각 역할이 다르다. 절대 섞지 말 것.

- **`root/components/web/*.md`** — 사람이 읽는 컴포넌트 규칙의 단일 진실(SSOT).
  variant / token / layout 규칙은 여기서 정의한다. "이 컴포넌트 규칙 어디 있어?"의 답은 항상 여기.
- **`tools/figma-component-generator/specs/*.json`** — 기계용 Figma 생성 입력.
  `.md`에서 파생된 값을 플러그인(`code.js`)이 읽어 Figma에 컴포넌트를 찍어낸다. 사람용 규칙 아님.
- **`packages/ui/components/*.tsx`** — 실제 구현 코드. Figma를 MCP로 읽어 코드화한 결과물.

**워크플로우 방향**: `specs/.json` → Figma 생성 → 디자이너 편집 → MCP 읽기 → `packages/ui` 코드화.

**규칙**:
1. 새 컴포넌트를 만들면 `root/components/web/`에 `.md` 명세를 반드시 남긴다. 코드만 있고 명세 없는 상태를 금지.
2. `.md`(사람용 진실)와 `.json`(기계용 파생)의 내용이 어긋나면, `.md`를 기준으로 맞춘다.
3. 코드(`.tsx`)가 `.md` 명세와 다르면, `.md`의 `Sync Note` 섹션에 불일치를 기록한다.
4. **컴포넌트를 새로 만들 땐 항상 3종을 동시에 만든다** (2026-07-15 결정):
   - `.md` 명세 (`root/components/web/`)
   - `.tsx` 코드 (`packages/ui/components/`) + `index.ts` export
   - `.json` 스펙 (`tools/figma-component-generator/specs/`) — Figma 생성용, 바로 이 브랜치에 반영
   하나만 만들고 나머지를 미루지 않는다. 코드화 시 `.json` 스펙도 즉시 같이 생성.

**구현(.tsx) 스타일 규칙 — ⚠️ 중요**:

토큰을 코드에 쓸 때의 문법은 **foundation이 그 토큰을 어떤 형태로 방출하는가**로 정해진다. 취향이 아니라 방출 형태를 따른다.

| 토큰 종류 | foundation 방출 형태 | 코드에서 쓰는 법 | 예시 |
|---|---|---|---|
| 색상 | `--color-*` CSS 변수 O | CSS 변수 또는 Tailwind 클래스 | `bg-bg-100`, `border-border-tertiary`, `var(--color-bg-100)` |
| 간격 | CSS 변수 X, Tailwind만 | **Tailwind 클래스만** | `p-m`, `gap-s`, `px-xl` |
| radius | CSS 변수 X, Tailwind만 | **Tailwind 클래스만** | `rounded-fai-m` |
| 그림자 | CSS 변수 O + Tailwind O | Tailwind 클래스 권장 | `shadow-M` |

- **인라인 `style={{ padding: 'var(--size-16)' }}` 방식 금지.** `--size-*`, `--cornerRadius-*` CSS 변수는 방출되지 않으므로 fallback으로만 그려진다 (토큰 미연결). 간격·radius는 반드시 Tailwind 클래스로 쓴다 (매핑: `products/homepage/tailwind.config.ts`).
- 새 토큰을 쓰기 전, "이게 CSS 변수로 방출되나, Tailwind로만 나오나"를 먼저 확인한 뒤 거기 맞는 문법을 쓴다.
- **아키텍처 결정(2026-07-15)**: 간격·radius를 CSS 변수로 통일하지 않고 현행(색상=변수 / 간격류=Tailwind) 유지. Tailwind의 반응형·상태 변형을 이미 쓰는 구조이기 때문. 나중에 완전 통일이 필요하면 foundation이 간격도 CSS 변수로 방출하도록 바꾸는 별도 작업 필요.
- Figma → MCP 읽기로 코드를 갱신할 때도 이 규칙을 그대로 적용한다. `card.json` 등 스펙의 `$pixelToken`/`$token`은 CSS 변수명이 아니라 위 표대로 변환해야 한다.

# Claude Code Automation Rules

[Rule: 체인지로그 자동화]
사용자가 터미널에 "작업 완료" 또는 "commit"이라고 입력하면, 넌 반드시 아래 순서를 따라야 해.
1. `git status`와 `git diff`를 분석해서 오늘(또는 방금까지) 수정된 파일과 작업 내용을 파악해.
2. 루트 폴더의 `changelog.md` 파일을 열고, 알맞은 섹션(Added, Changed 등)에 작업 내용을 요약해서 업데이트해.
3. 체인지로그 업데이트가 완료되면 사용자에게 "체인지로그 기록을 완료했습니다."라고 보고해.

[Rule: 공용 컴포넌트 승격]
사용자가 "이 컴포넌트 공용으로 올려줘" 또는 이와 유사한 말을 하면, 넌 반드시 아래 순서를 따라야 해.
1. 대상 컴포넌트 파일을 `products/homepage/src/components/`에서 `packages/ui/components/`로 이동해.
2. `packages/ui/index.ts`에 해당 컴포넌트를 export 추가해.
   - named export면: `export { ComponentName } from './components/ComponentName';`
   - default export면: `export { default as ComponentName } from './components/ComponentName';`
3. 기존 homepage의 import 경로를 `'@fai/ui'`로 교체해.
4. 완료되면 사용자에게 "공용 컴포넌트로 승격 완료했습니다."라고 보고해.

[Rule: 작업 범위 제한 및 최적화]
1. 불필요한 탐색 금지: 파일 검색이나 코드 분석 시, 현재 지시받은 작업과 직접적인 관련이 없는 폴더나 파일은 절대 스캔하지 마.
2. 타겟팅: 명시된 컴포넌트, `design-system.md`, `foundation` 폴더 안의 관련 토큰 등 작업에 꼭 필요한 최소한의 Context만 읽어서 빠르고 가볍게 응답해.
3. 묻고 움직이기: 전체 코드를 광범위하게 읽어야 할 상황이 발생하면, 멋대로 탐색하기 전에 반드시 사용자에게 먼저 허락을 구해.
