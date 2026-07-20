# Spinner Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 완료 시점을 알 수 없는 비동기 작업의 진행 상태를 표시
- **사용처**: 데이터 요청, 폼 제출, 버튼 처리 등 결과를 기다리는 상태
- **사용 금지**: 크기가 정해진 콘텐츠 영역의 로딩(그건 Skeleton). 한 화면에 여러 Spinner 중첩

## 2. ⚡ Variants

| prop | 값 | 설명 |
|---|---|---|
| size | `sm` / `md` / `lg` | FAI size 토큰 기준 외곽 16 / 20 / 24px |
| shade | `default` | 밝은 배경 위 브랜드 강조색 |
| shade | `onMedia` | 사진, 영상, 어두운 배경 위 반전색 |
| shade | `subtle` | 목록 등에서 덜 강조된 보조색 |
| shade | `inherit` | 부모의 `currentColor` 상속. 버튼 내부 등에 사용 |

## 3. ⚡ Interaction & State
- **애니메이션**: 활성 아크 75%, `--duration-slow-min` 선형 무한 회전
- **모션 축소**: 정지하면 고장으로 보일 수 있어 `--duration-slow-max`로 감속
- **label**: Spinner 아래에 표시. 문자열이면 접근성 이름으로도 자동 사용
- **접근성**: `role="status"`, `aria-live="polite"`. 우선순위는 명시적 `aria-label` → 문자열 label → `Loading`

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
| shade | `'default' \| 'onMedia' \| 'subtle' \| 'inherit'` | `'default'` | 배경에 따른 색상 처리 |
| label | `ReactNode` | — | Spinner 아래의 표시 콘텐츠 |
| aria-label | `string` | label 또는 `Loading` | 스크린리더용 이름 |
| className | `string` | — | 레이아웃 확장 클래스 |

## 5. 🎨 Token Mapping
- **크기**: sm → `size-m`, md → `size-l`, lg → `size-xl`
- **간격**: Spinner와 label 사이 `gap-s`
- **default**: 활성 `text-brand-text`, 트랙 `text-quaternary`
- **onMedia**: 활성 `text-inverse`, 트랙 `text-inverse-subtle`
- **subtle**: 활성 `text-secondary`, 트랙 `text-quaternary`
- **inherit**: 활성 `currentColor`, 트랙 `currentColor` + opacity 30
- **label**: `text-body font-semibold text-primary`
- **motion**: `--duration-slow-min`, reduced motion → `--duration-slow-max`

## 6. ✅ Best Practices
- 무엇을 기다리는지 알 수 있도록 의미 있는 label 또는 `aria-label` 제공
- 어두운 배경과 미디어 위에서는 `onMedia` 사용
- 화면 전체 상태를 대표하는 Spinner 하나만 사용
- 레이아웃이 이미 정해진 콘텐츠는 Spinner 대신 Skeleton 사용

## 7. ✅ Sync Note
- foundation에 14px spacing size가 없어 실제 외곽 14/20/24px 중 sm을 가장 가까운 `size.16`으로 정규화
- 임의 spacing, color, radius 없이 foundation/Tailwind 토큰만 사용

