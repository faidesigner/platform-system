# Scrollbar Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 자식 콘텐츠를 감싸 스크롤 가능한 영역으로 만드는 컨테이너
- **사용처**: 넘치는 콘텐츠의 가로/세로 스크롤 래퍼
- **사용 금지**: 페이지 전체 스크롤(브라우저 기본 사용). 스크롤이 필요 없는 고정 콘텐츠

## 2. ⚡ Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | — | 스크롤될 콘텐츠 |
| className | string | `""` | 추가 클래스 |
| ...props | HTMLAttributes<div> | — | div 표준 속성 전달 |

> `forwardRef`로 ref 전달 지원.

## 3. 📐 Layout & Content Rules
- **display**: `inline-flex`, 세로 정렬 items-start, 가운데 정렬
- **overflow**: auto
- **padding**: 세로 S(8px) / 가로 2XS(4px)

## 4. ⚠️ Sync Note (코드 확인 2026-07-15)
⚠️ **토큰 미연결**: 코드가 `py-[var(--padding-S,8px)]`, `px-[var(--padding-2XS,4px)]` 형태로 CSS 변수를 참조하는데, `--padding-*` 변수는 방출되지 않음(→ CLAUDE.md 구현 규칙). fallback(8px/4px)으로만 그려지는 상태. **Tailwind spacing 클래스로 교체 필요**: `py-s px-2xs`. 교체 시 토큰 연결됨.
