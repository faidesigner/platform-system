# Kbd Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 키보드 단축키를 스타일된 키 배지로 렌더
- **사용처**: 툴팁, 메뉴, 도움말 텍스트에서 키 조합 표시 (예: ⌘ + K)
- **사용 금지**: 실제 입력 필드(그건 input). 클릭 액션(그건 Button)

## 2. ⚡ Variants

| size | 설명 |
|---|---|
| s | 작은 배지 (캡션/조밀한 UI) |
| m | 기본 |

## 3. ⚡ Interaction & State
- **정적 표시 전용** — 상태·인터랙션 없음
- **조합 키**: 여러 키는 각각 배지로 렌더, 사이에 `+` 또는 구분자
- **접근성**: `<kbd>` 시맨틱 태그 사용. 조합은 `aria-label`로 읽기 쉽게 (예: "Command K")

## 4. 📐 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | 키 라벨 (예: "⌘", "K", "Esc") |
| size | 's' \| 'm' | 'm' | 배지 크기 |
| className | string | — | 추가 클래스 |

## 5. 🎨 Token Mapping
- **배경**: `bg-filled-basic-secondary`
- **테두리**: `border border-border-secondary`
- **radius**: `rounded-fai-xs`
- **폰트**: `font-mono font-medium`
- **텍스트**: size m → `text-caption-m`, size s → `text-caption-s`
- **padding**: m → `px-2xs py-3xs`, s → `px-3xs py-3xs`
- **최소 너비**: 정사각형에 가깝게 (단일 키 기준)

## 6. ✅ Best Practices
- 실제 표기와 동일하게(⌘, ⇧, ⌥, Esc, Enter). OS별 표기 차이 주의
- 조합은 Kbd 여러 개 + 구분자로. 하나에 "⌘K" 몰아넣지 않기
