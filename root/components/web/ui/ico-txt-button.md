# IcoTxtButton Specification
**Status**: Draft

> 아이콘 + 텍스트를 함께 담는 버튼. 텍스트 전용 Button, 아이콘 전용 IconButton과 구분되는 별도 컴포넌트.

## 1. 🎯 Definition & Usage
- **목적**: 아이콘과 라벨을 나란히 보여주는 액션 버튼
- **사용처**: 다운로드(↓ 다운로드), 외부이동(↗ 바로가기) 등 아이콘이 의미를 보강하는 CTA
- **사용 금지**: 텍스트만이면 Button, 아이콘만이면 IconButton

## 2. ⚡ Variants

| variant | 설명 |
|---|---|
| primary | 주요 액션 (brand 배경) |
| secondary | 보조 액션 |
| tertiary | 약한 액션 (테두리) |

| size | padding | font | icon |
|---|---|---|---|
| XL | px-XL py-M | 16px | 20px |
| L | px-M py-S | 15px | 16px |
| M | px-S py-XS | 13px | 16px |
| S | px-XS py-XXS | 12px | 14px |

| shape | radius |
|---|---|
| square (기본) | S(8px), 단 size=S는 XS(6px) |
| round | circle(999px) |

## 3. ⚡ Interaction & State
- **iconPosition**: left(기본) / right
- **isImpact**: `data-impact=true` → accent 테두리 강조
- **isLoading**: 스피너 표시 + "로딩 중…" + disabled + 고정폭(150px)
- **상태 오버레이**: `::after` 레이어로 hover/focus/pressed 표현 (variant별 opacity 토큰)
- **disabled**: fill-disabled + text-disabled

## 4. 📐 Layout & Content Rules
- **구조**: `inline-flex` 중앙정렬, 콘텐츠 gap은 size별(XS~3XS)
- **contents 래퍼**: `z-10`으로 after 오버레이 위 노출, 높이 24px

## 5. ✅ Sync Note (코드 확인 2026-07-15)
Tailwind 토큰 클래스 방식으로 수정 완료. sizeMap의 padding/gap은 `px-xl py-m`, `px-m py-s`, `px-s py-xs`, `px-xs py-2xs` 및 `gap-xs`/`gap-2xs`/`gap-3xs`로 연결됨. shape radius는 `rounded-fai-circle`, `rounded-fai-xs`, `rounded-fai-s`로 전환됨.
