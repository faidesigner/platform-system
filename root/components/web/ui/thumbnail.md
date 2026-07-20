# Thumbnail Specification
**Status**: Draft


## 1. Definition & Usage
- **목적**: 업로드하거나 선택한 이미지 파일을 64x64 미리보기로 표시
- **사용처**: 파일 업로드 결과, 이미지 선택 목록, 상세 보기 진입점
- **사용 금지**: 일반 콘텐츠 카드, 비이미지 파일의 파일 타입 표시

## 2. Variants

| 상태 | 표시 |
|---|---|
| image | `src` 이미지를 정사각형에 맞춰 표시 |
| placeholder | `src`가 없을 때 이미지 아이콘 표시 |
| loading | `src`가 없으면 Skeleton, 있으면 이미지 위 Spinner 오버레이 |
| disabled | 투명도를 낮추고 클릭 및 제거 상호작용 차단 |

## 3. Interaction & State
- `onClick`이 있으면 전체 미리보기가 버튼으로 동작
- `onRemove`가 있으면 우측 상단에 제거 버튼 표시
- 제거 버튼 이벤트는 부모의 상세 보기 클릭으로 전파하지 않음
- 로딩 중에는 상세 보기 클릭을 막고 진행 상태를 전달
- `label`은 파일명을 나타내며 접근성 이름과 기본 툴팁에 사용

## 4. Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| src | `string` | - | 이미지 URL |
| alt | `string` | `''` | 이미지 대체 텍스트 |
| label | `string` | - | 파일명 및 접근성 이름 |
| onClick | `MouseEventHandler` | - | 미리보기 선택 또는 상세 보기 |
| onRemove | `MouseEventHandler` | - | 이미지 제거 |
| isLoading | `boolean` | `false` | 로딩 상태 |
| isDisabled | `boolean` | `false` | 비활성 상태 |

## 5. Token Mapping
- **크기**: `size.64` -> `size-thumbnail`
- **radius**: `cornerRadius.S` -> `rounded-fai-s`
- **배경/테두리**: `bg-fill-faint`, `border-border-subtle`
- **로딩 오버레이**: `bg-overlay`, `Spinner`의 `onMedia`
- **제거 버튼**: `size-l`, `bg-surface`, `shadow-XS`
- **간격**: `right-2xs top-2xs`

## 6. Best Practices
- `label`에는 사용자가 구분할 수 있는 파일명을 제공
- 이미지가 정보 전달에 필요하면 의미 있는 `alt` 제공
- 클릭 동작은 상세 보기나 라이트박스처럼 예측 가능한 결과에 연결
- 비이미지 파일은 Thumbnail 대신 파일 아이콘이 있는 별도 패턴 사용

## 7. Sync Note
- 64px 고정 규격을 foundation `size.64`에 연결한 `size-thumbnail` 클래스로 구현
- 임의 spacing, color, radius 없이 foundation/Tailwind 토큰만 사용
