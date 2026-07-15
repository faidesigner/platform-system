# Skeleton Specification
**Status**: Draft

> 참고: Astryx Skeleton (https://astryx.atmeta.com/components/Skeleton)

## 1. 🎯 Definition & Usage
- **목적**: 콘텐츠 로딩 중 실제 레이아웃 모양을 미리 보여주는 시머 플레이스홀더
- **사용처**: 로딩 화면 — 실제 콘텐츠 형태(텍스트 줄, 아바타, 카드)에 맞춰 배치
- **사용 금지**: 크기를 알 수 없는 콘텐츠 로딩(그건 Spinner). 즉시 뜨는 콘텐츠

## 2. ⚡ Variants

| variant | 설명 |
|---|---|
| text | 텍스트 줄 (기본, 라운드 s) |
| circle | 원형 (아바타용) |
| rect | 사각 블록 (이미지/카드용) |

## 3. ⚡ Interaction & State
- **애니메이션**: `animate-pulse` 시머 (은은한 밝기 반복)
- **접근성**: `aria-hidden` 또는 컨테이너에 `aria-busy="true"` + `role="status"`. 스크린리더엔 "로딩 중" 알림 별도
- **모션 축소**: `motion-reduce:animate-none`

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| variant | 'text'\|'circle'\|'rect' | 'text' | 모양 |
| width | string\|number | — | 너비 (예: '80%', 120) |
| height | string\|number | — | 높이 |
| count | number | 1 | 반복 개수(text 줄 등) |
| className | string | — | 추가 클래스 |

## 5. 🎨 Token Mapping
- **배경**: `bg-quaternary`
- **radius**: text/rect → `rounded-fai-s`, circle → `rounded-fai-circle`
- **애니메이션**: `animate-pulse motion-reduce:animate-none`
- **기본 높이**: text → 1em 상당

## 6. ✅ Best Practices
- 실제 콘텐츠 레이아웃과 유사하게 배치(형태 미리보기)
- 로딩 완료 시 실제 콘텐츠로 교체
- 크기 미지의 로딩은 Spinner
