# List Specification
**Status**: Draft

> List(컨테이너) + ListItem(항목) 2개 컴포넌트를 한 파일에 정의.

## 1. 🎯 Definition & Usage
- **List**: 일관된 간격·구분선·마커를 가진 항목의 세로 모음
- **ListItem**: 개별 항목. start/end 슬롯(아이콘·아바타·배지), 클릭/링크 동작 지원
- **사용처**: 설정 목록, 기능 나열, 메시지 목록, 순서 있는 단계
- **사용 금지**: 단일 항목이나 관련 없는 콘텐츠 배치. 인터랙티브 항목 안에 또 인터랙티브 요소 중첩 금지(중첩 클릭 타겟)

## 2. ⚡ Variants

| marker | 설명 |
|---|---|
| none | 마커 없음 (기본) |
| disc | 불릿 (•) |
| decimal | 번호 (1. 2. 3.) |

## 3. ⚡ Interaction & State
- **header**: 리스트 레이블(스크린리더 컨텍스트). `aria-labelledby` 연결
- **dividers**: 항목 사이 구분선 옵션
- **ListItem 클릭**: `onClick` 또는 `href`(링크). 둘 중 하나만
- **접근성**: 시맨틱 `<ul>`/`<ol>` + `<li>`. 클릭형은 role/tabIndex

## 4. 🧩 Props (API)

### List
| prop | type | default | 설명 |
|---|---|---|---|
| children | ReactNode | 필수 | ListItem들 |
| header | ReactNode | — | 리스트 레이블 |
| marker | 'none'\|'disc'\|'decimal' | 'none' | 마커 종류 |
| hasDividers | boolean | false | 항목 사이 구분선 |

### ListItem
| prop | type | default | 설명 |
|---|---|---|---|
| label | ReactNode | 필수 | 항목 텍스트 |
| description | ReactNode | — | 보조 설명 |
| startContent | ReactNode | — | 좌측 슬롯(아이콘·아바타) |
| endContent | ReactNode | — | 우측 슬롯(배지·카운트) |
| href | string | — | 링크 |
| onClick | ()=>void | — | 클릭 콜백 |

## 5. 🎨 Token Mapping
- **항목 padding**: `px-m py-s`
- **항목 gap**(start↔텍스트): `gap-s`
- **텍스트**: label `text-body`, description `text-body-s text-secondary`
- **구분선**: `border-b border-border-tertiary`
- **hover**(클릭형): `hover:bg-interaction-light-black-hover`, radius `rounded-fai-s`

## 6. ✅ Best Practices
- 리스트에 header 제공(스크린리더 컨텍스트)
- start/end 슬롯으로 아이콘·배지 추가
- 클릭형/비클릭형을 명확한 시각 구분 없이 섞지 않기
