# Link Specification
**Status**: Draft

> 참고: Astryx Link (https://astryx.atmeta.com/components/Link)

## 1. 🎯 Definition & Usage
- **목적**: 인라인/독립 텍스트 내비게이션용 스타일 앵커
- **사용처**: 페이지 간 이동, 외부 URL 이동
- **사용 금지**: 내비게이션이 아닌 액션은 Button 사용. "여기 클릭"·"더보기" 같은 모호한 텍스트 금지 — 목적지를 서술

## 2. ⚡ Variants

| underline | 설명 |
|---|---|
| always | 항상 밑줄 |
| hover | hover 시에만 밑줄 (기본) |
| none | 밑줄 없음 |

## 3. ⚡ Interaction & State
- **isExternal**: 새 탭(`target=_blank` + `rel="noopener noreferrer"`) + 외부 링크 표시 아이콘(↗)
- **isStandalone**: 인라인 텍스트 밖에 놓일 때 지정 → 기본 본문 폰트 사이징 적용
- **hover/focus**: 색상 강조 + underline=hover면 밑줄 노출. focus-visible 링
- **접근성**: 텍스트 링크는 보이는 텍스트가 곧 접근성 이름이므로 `label`(aria-label) 설정 금지. `label`은 아이콘 전용 링크처럼 내용이 서술적이지 않을 때만 사용

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| href | string | 필수 | 목적지 URL |
| children | ReactNode | 필수 | 링크 텍스트 |
| underline | 'always' \| 'hover' \| 'none' | 'hover' | 밑줄 방식 |
| isExternal | boolean | false | 외부 링크(새 탭 + 아이콘) |
| isStandalone | boolean | false | 독립 배치(본문 폰트 사이징) |
| label | string | — | 아이콘 전용 링크의 접근성 이름 (텍스트 링크엔 금지) |
| className | string | — | 추가 클래스 |

## 5. 🎨 Token Mapping
- **색상**: `text-optional-brand-primary` (링크 컬러)
- **hover**: 밑줄 + 색 유지 (`hover:underline` when underline=hover)
- **외부 아이콘**: 우측 inline, 텍스트와 `gap-3xs`
- **폰트**: 인라인은 상속, `isStandalone` 시 `text-body`

## 6. ✅ Best Practices
- 서술적이고 간결한 링크 텍스트로 목적지를 명확히
- 인라인 텍스트 밖이면 `isStandalone` 지정
- 텍스트 링크에 `label` 설정하지 않기 (스크린리더가 실제 내용을 못 읽게 됨)
