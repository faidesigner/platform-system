# Pagination Specification
**Status**: Draft

> 참고: Astryx Pagination (https://astryx.atmeta.com/components/Pagination)

## 1. 🎯 Definition & Usage
- **목적**: 여러 페이지 콘텐츠를 앞뒤로 이동
- **사용처**: 테이블/리스트/카드 그리드 **아래** 배치
- **사용 금지**: 모든 항목이 한 페이지에 들어가면 사용 안 함. 콘텐츠 위에 배치 금지(항상 아래)

## 2. ⚡ Variants

| variant | 설명 | 용도 |
|---|---|---|
| pages | 번호 페이지 | 데이터 테이블(특정 페이지 점프) |
| count | 항목 범위 + 페이지 크기 선택 | 큰 리스트 |
| compact | 이전/다음 + 현재 위치 | 좁은 공간 |
| dots | 점 인디케이터 | 캐러셀(≤10페이지) |

## 3. ⚡ Interaction & State
- **이전/다음**: 첫/끝 페이지에서 해당 버튼 disabled
- **번호 클릭**(pages): 해당 페이지로 점프. 많으면 말줄임(…)
- **페이지 크기**(count): 드롭다운으로 rows per page 조절
- **접근성**: `nav[aria-label]`, 현재 페이지 `aria-current="page"`

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| variant | 'pages'\|'count'\|'compact'\|'dots' | 'pages' | 형태 |
| page | number | 필수 | 현재 페이지(1-based) |
| pageCount | number | 필수 | 전체 페이지 수 |
| onPageChange | (p:number)=>void | 필수 | 페이지 변경 |
| totalItems | number | — | 전체 항목 수(count) |
| pageSize | number | — | 페이지당 항목(count) |
| onPageSizeChange | (n:number)=>void | — | 크기 변경(count) |

## 5. 🎨 Token Mapping
- **컨테이너**: 가로 flex, `gap-2xs`, 중앙/우측 정렬
- **페이지 버튼**: `w-2xl h-2xl`, radius `rounded-fai-s`, `text-body-s`
- **현재 페이지**: `bg-filled-basic-secondary` 강조
- **hover**: `hover:bg-interaction-light-black-hover`
- **dots**: 점 `w-2xs h-2xs rounded-fai-circle`, 활성 `bg-filled-optional-brand-primary`

## 6. ✅ Best Practices
- 콘텐츠 아래 배치
- 데이터 테이블은 pages, 캐러셀은 dots(≤10)
- totalItems 알면 전달(남은 양 표시)
