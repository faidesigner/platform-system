# Color Semantic Guide

이 문서는 서비스의 의미론적 컬러 시스템을 정의합니다.
실제 수치는 동일 폴더의 `color-semantic.json` 파일을 참조하세요.

---

## 규칙

- UI에 직접 사용하는 컬러는 반드시 이 토큰을 사용합니다.
- `color-global.json`의 원시값을 직접 UI에 사용하지 않습니다.
- 라이트/다크 모드 전환은 이 토큰으로 자동 처리됩니다. 모드별로 별도 값을 지정하지 않습니다.
- 새로운 시맨틱 토큰이 필요한 경우, 기존 카테고리 구조 안에서 추가합니다.

---

## 모드 구조

| 모드 | 적용 방식 |
| --- | --- |
| light | 기본값 (`@theme`) |
| dark | `.dark` 클래스 적용 시 자동 전환 |

---

## 카테고리 및 접두사

### `bg-` — 배경색

| 토큰 | 용도 |
| --- | --- |
| bg-100 | 기본 페이지 배경 |
| bg-200 | 카드, 패널 배경 |
| bg-300 | 인풋, 서브 영역 배경 |
| bg-scrim | 모달 오버레이 |
| bg-elevation100 | 떠있는 레이어 기본 |
| bg-elevation200 | 떠있는 레이어 보조 |

---

### `text-` — 텍스트색

#### `text-basic-`

| 토큰 | 용도 |
| --- | --- |
| text-basic-primary | 주요 본문 텍스트 |
| text-basic-secondary | 보조 텍스트 |
| text-basic-tertiary | 비활성, 힌트 텍스트 |
| text-basic-fourth | 가장 약한 텍스트 |
| text-basic-inverse | 반전 텍스트 (어두운 배경 위) |
| text-basic-negative | 에러 텍스트 |
| text-basic-warning | 경고 텍스트 |
| text-basic-positive | 성공 텍스트 |
| text-basic-Info | 정보 텍스트 |
| text-basic-disabled | 비활성화 텍스트 |

#### `text-optional-` — 브랜드 버튼/링크

| 토큰 | 용도 |
| --- | --- |
| text-optional-brand-primaryBtn | 브랜드 Primary 버튼 텍스트 |
| text-optional-brand-secondaryBtn | 브랜드 Secondary 버튼 텍스트 |
| text-optional-brand-primary | 브랜드 강조 텍스트 |
| text-optional-brand-secondary | 브랜드 보조 텍스트 |

#### `text-tag-` — 카테고리 태그 텍스트

yellow / green / indigo / purple / grape / gray 색상 계열 제공

---

### `icon-` — 아이콘색

`icon-basic-`, `icon-optional-`, `icon-tag-` 구조는 `text-` 카테고리와 동일합니다.
아이콘에 텍스트 컬러 토큰을 혼용하지 않습니다.

---

### `border-` — 테두리색

| 토큰 | 용도 |
| --- | --- |
| border-primary | 주요 테두리 |
| border-secondary | 보조 테두리 |
| border-tertiary | 가장 약한 테두리 |
| border-inverse | 반전 테두리 |
| border-disabled | 비활성 테두리 |
| border-negative | 에러 테두리 |
| border-warning | 경고 테두리 |
| border-positive | 성공 테두리 |
| border-Info | 정보 테두리 |
| border-brand-primary | 브랜드 주요 테두리 |
| border-brand-secondary | 브랜드 보조 테두리 |

---

### `filled-` — 채움색 (배경이 아닌 컴포넌트 내부)

#### `filled-basic-`

버튼, 뱃지, 칩 등 컴포넌트의 채움색에 사용합니다.
`primaryOp`, `inverseOp` 등 `Op` 접미사는 반투명 값입니다.

#### `filled-optional-` — 브랜드 버튼 채움색

#### `filled-tag-` — 카테고리 태그 채움색

`-secondary` 접미사는 해당 컬러의 연한 배경 버전입니다.

#### `filled-toast-`

토스트 메시지 배경에만 사용합니다.

---

### `interaction-` — 인터랙션 오버레이

버튼, 리스트 등 인터랙티브 요소의 hover / focus / pressed 상태에 사용합니다.

| 강도 | 용도 |
| --- | --- |
| light | 약한 인터랙션 (카드, 배경 위 요소) |
| normal | 일반 인터랙션 |
| strong | 강한 인터랙션 (Primary 버튼 위) |

각 강도별로 white / black / brand(FAI) 세 가지 계열을 제공합니다.
