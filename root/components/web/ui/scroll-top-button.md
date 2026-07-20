# ScrollTopButton Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 스크롤을 일정 이상 내리면 나타나 클릭 시 페이지 맨 위로 부드럽게 이동
- **사용처**: 긴 페이지의 우하단 플로팅 버튼
- **사용 금지**: 짧은 페이지(스크롤 여지 없음). 여러 개 동시 배치

## 2. ⚡ Props (API)
props 없음 — 자체적으로 스크롤 상태를 감지하는 완결형 컴포넌트.

## 3. ⚡ Interaction & State
- **표시 임계값**: `window.scrollY > 300`이면 Fade-in, 이하면 Fade-out(`opacity` + `pointer-events-none`)
- **호버**: `scale 1.05` + `y -4`로 살짝 떠오름 (framer-motion spring)
- **탭**: `scale 0.95` 눌림 타격감
- **클릭**: `scrollTo({ top:0, behavior:'smooth' })`
- **접근성**: aria-label "맨 위로 이동"

## 4. 📐 Layout & Content Rules
- **기반**: `IconButton variant="primary" size="XL" icon="arrowshapeUp"`
- **전환**: `transition-opacity duration-300`
- **크기·라운드·배경**: IconButton XL 프리셋 상속 (원형, brand-primary 배경)

## 5. ✅ Sync Note (코드 확인 2026-07-15)
- 레이아웃/색상을 IconButton에 위임하고, 자체는 표시 로직 + 모션만 담당 → 토큰 하드코딩 없음. 양호.
- 코드 주석에 `w-[var(--size-56)]` 등 언급이 있으나 실제로는 IconButton size="XL"로 처리됨(주석은 참고용). IconButton 명세가 크기 토큰의 SSOT.
