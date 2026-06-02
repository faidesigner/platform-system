# 🏛️ Fainders Design System Constitution (디자인 헌법)

## 1. 개요 및 목적
- 본 프로젝트는 Fainders 홈페이지 리뉴얼을 위한 프론트엔드 코드베이스입니다.
- **작업 주도:** 디자이너 1인이 AI(Cursor)를 활용해 UI/UX 코드를 100% 구현합니다.
- **개발자 역할:** 완성된 UI 코드에 API 및 비즈니스 로직만 최종 연결합니다.

## 2. 디자인 토큰 규칙
모든 스타일링은 Tailwind CSS를 기반으로 하되, `foundation/` JSON과 연동된 시맨틱 토큰(CSS 변수) 및 `tailwind.config.ts`에 매핑된 유틸리티를 최우선으로 사용합니다.

- **금지 사항:** 컴포넌트 내부(tsx)에 헥스 코드(`#0052CC`)나 임의의 픽셀 값(`w-[13px]`)을 하드코딩하는 것을 엄격히 금지합니다.
- **데이터 위치:**
  - 원시 수치 및 CSS 변수: `globals.css`
  - Tailwind 클래스 매핑: `tailwind.config.ts`

## 3. AI (Cursor / Claude) 작업 지침
AI가 새로운 컴포넌트를 생성하거나 수정할 때 반드시 지켜야 할 프로세스입니다.

1. **토큰 확인:** 코드를 짜기 전, 항상 `tailwind.config.ts`와 `app/globals.css`를 먼저 읽고, 사용 가능한 시맨틱 유틸·변수 목록을 파악할 것.
2. **시멘틱 매칭:** 브랜드·표면·테두리 등은 JSON·시맨틱 변수에 정의된 역할(role)에 맞는 클래스만 사용할 것. 원시 Tailwind 색상·임의 값으로 대체하지 말 것.
3. **컴포넌트 구조:** 모든 UI는 재사용 가능한 React(Next.js) 컴포넌트로 작성할 것.

## 4. 커뮤니케이션
- UI에 필요한 새로운 컬러나 여백 수치가 발생하면, 디자이너가 직접 `globals.css`에 변수를 추가하고 `tailwind.config.ts`를 업데이트합니다. AI는 임의로 새로운 규칙을 만들지 마세요.

## 5. Git 버전 관리 (Version Control)
안전한 AI 코딩과 향후 프론트엔드 개발자와의 원활한 핸드오프(Handoff)를 위해 아래의 Git 워크플로우를 엄격히 준수합니다.

- **작업 단위 커밋:** 하나의 컴포넌트(예: 메인 배너, 네비게이션 바) 작업이 정상적으로 화면에 렌더링되는 것을 확인하면 즉시 Commit & Push 합니다. (AI가 코드를 망칠 경우를 대비한 세이브 포인트)
- **커밋 메시지 컨벤션:**
  - `feat:` 새로운 UI 컴포넌트나 섹션 추가 (예: `feat: 메인 Hero 섹션 UI 구현`)
  - `fix:` 스타일 깨짐, 여백 오류 등 버그 수정
  - `design:` CSS, 디자인 토큰 등 스타일 규칙 변경
  - `chore:` 파일 이동, 설정 변경 등
- **핸드오프(Handoff):** UI 퍼블리싱이 100% 완료된 안정적인 상태의 코드만 `main` 브랜치에 반영하여 프론트엔드 개발자에게 전달합니다.

## 6. 파일 및 폴더 구조 (File Structure)
모든 컴포넌트 코드와 디자인 자산은 반드시 아래의 지정된 경로에 모아서 관리합니다.
- **디자인 시스템 자산 (Tokens):** `/platform-system/root/foundation/`
- **웹 UI 컴포넌트 (React/Next.js):** `/platform-system/root/components/web/`

## 7. 표준 그리드 (Layout Grid)

레이아웃은 `platform-system/root/web/tokens/grid.json`에 정의된 토큰을 기준으로 하며, `tailwind.config.ts`의 `screens` · `container`에 동기화되어 있습니다.

| 브레이크포인트 | 시작 너비 | 컬럼 | 거터 | Container Padding | 최대 콘텐츠 너비 |
|---|---|---|---|---|---|
| mobile | 390px | 4 | 16px | 20px | 100% |
| tablet | 768px | 8 | 20px | 24px | 720px |
| laptop | 1280px | 8 | 20px | 24px | 1120px |
| desktop | 1440px | 12 | 24px | 32px | 1200px |
| desktop-lg | 1920px | 12 | 24px | 40px | 1440px |

**컨테이너 사용:**

```tsx
// ✅ 올바른 사용 — container 클래스로 자동 max-width + padding 적용
<div className="container">...</div>

// ❌ 금지 — 임의 수치 하드코딩
<div className="max-w-[1200px] mx-auto px-8">...</div>
```

**그리드 컬럼 사용:**

```tsx
// ✅ 올바른 사용 — 정의된 브레이크포인트 접두어 + grid-cols 조합
<div className="grid grid-cols-4 tablet:grid-cols-8 desktop:grid-cols-12 gap-m laptop:gap-xl">

// ❌ 금지 — 임의 grid 구조 생성 금지
<div className="grid grid-cols-[repeat(10,1fr)] gap-[18px]">
```
