# Table Specification
**Status**: Draft

> Table(본체) + TableRow(행) + TableCell(셀) + TableHeaderCell(헤더 셀) 4개 컴포넌트를 한 파일에 정의.
> 정렬/필터/선택/페이지네이션 등 동작은 별도 훅 영역(미구현). 본 명세는 구조·스타일 범위.

## 1. 🎯 Definition & Usage
- **Table**: 데이터 기반 테이블 본체. density, dividers, hover, striped 지원
- **TableRow / TableCell / TableHeaderCell**: 행·셀·헤더 셀 구성 요소
- **사용처**: 정형 데이터 목록, 비교 표, 관리 화면
- **사용 금지**: 계층 데이터는 TreeList. 단순 나열은 List. 레이아웃 용도의 표 금지(의미 있는 표 데이터만)

## 2. ⚡ Variants

| density | 행 높이 |
|---|---|
| compact | py-2xs |
| default | py-s |
| comfortable | py-m |

| 옵션 | 설명 |
|---|---|
| dividers | 행 사이 구분선 |
| hover | 행 hover 하이라이트 |
| striped | 홀짝 행 배경 교차 |

## 3. ⚡ Interaction & State
- **hover**: 옵션 시 행에 `hover:bg-interaction-light-black-hover`
- **striped**: 짝수 행 `bg-filled-basic-secondary`
- **정렬/필터/선택**: 별도 훅으로 제공 예정(본 구현 범위 밖). 헤더 셀에 정렬 표시 슬롯만 마련
- **접근성**: `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` 시맨틱. 헤더 `scope="col"`

## 4. 🧩 Props (API)

### Table
| prop | type | default | 설명 |
|---|---|---|---|
| density | 'compact'\|'default'\|'comfortable' | 'default' | 행 밀도 |
| dividers | boolean | true | 행 구분선 |
| hover | boolean | false | hover 하이라이트 |
| striped | boolean | false | 줄무늬 |
| children | ReactNode | 필수 | thead/tbody 구성 |

### TableRow
| prop | type | 설명 |
|---|---|---|
| children | ReactNode | TableCell들 |
| selected | boolean | 선택 상태 강조 |

### TableCell / TableHeaderCell
| prop | type | 설명 |
|---|---|---|
| children | ReactNode | 내용 |
| align | 'left'\|'center'\|'right' | 정렬 |
| sortable | boolean | (HeaderCell) 정렬 가능 표시 |

## 5. 🎨 Token Mapping
- **셀 padding**: density별 `px-m` + `py-2xs`/`py-s`/`py-m`
- **헤더**: `bg-bg-100`, `text-basic-secondary`, `font-medium`, 하단 `border-b border-border-tertiary`
- **행 구분선**: `border-b border-border-tertiary`
- **hover**: `hover:bg-interaction-light-black-hover`
- **striped**: `bg-filled-basic-secondary`
- **텍스트**: `text-body-s text-basic-primary`

## 6. ✅ Best Practices
- 의미 있는 표 데이터에만 사용(레이아웃용 금지)
- 정렬 가능 컬럼은 헤더에 표시
- 대량 데이터는 Pagination 병용
