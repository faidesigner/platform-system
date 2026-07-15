# ProgressBar Specification
**Status**: Draft

> ⚠️ 진행 표시는 **용도별 2개 컴포넌트**로 나뉜다 (2026-07-15, Astryx 반영):
> - **ProgressBar** (본 문서 §1~4) — 스텝/세그먼트 인디케이터 (캐러셀·온보딩). 클릭 이동.
> - **LinearProgress** (§5~7) — 단일 작업 진행률 바 (determinate/indeterminate, %, semantic 색상). 참고: Astryx ProgressBar.
> 둘은 이름·용도가 다르므로 섞지 말 것.

## 1. 🎯 Definition & Usage (ProgressBar = 스텝 인디케이터)
- **목적**: 여러 스텝의 진행 상태를 세그먼트 바로 표시하고, 클릭으로 이동
- **사용처**: 캐러셀/슬라이드 인디케이터, 온보딩 스텝, 자동 재생 진행 표시
- **사용 금지**: 단일 작업의 로딩률 표시(그건 LinearProgress). 스텝이 1개면 사용 의미 없음

## 2. ⚡ Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| count | number | 필수 | 전체 스텝 수 |
| activeIndex | number | 필수 | 현재 활성 인덱스 (0-based) |
| onChange | (index:number)=>void | 필수 | 스텝 클릭 시 인덱스 전달 |
| getAriaLabel | (index:number)=>string | `스텝 N로 이동` | 버튼 aria-label 생성 |
| duration | number | 4000 | 활성 바가 0→100% 채워지는 시간(ms) |
| className | string | `""` | 추가 클래스 |

## 3. ⚡ Interaction & State
- **활성 바**: `activeIndex` 세그먼트가 `duration` 동안 0%→100% 채워짐(`fai-progress-fill` keyframe, linear)
- **완료 바**: `activeIndex` 이전 세그먼트는 100% 고정
- **미도달 바**: 이후 세그먼트는 빈 트랙(quaternary)
- **클릭**: 각 세그먼트가 버튼 → 해당 인덱스로 이동
- **접근성**: 각 세그먼트 `<button>` + aria-label

## 4. 📐 Layout & Content Rules
- **트랙 높이**: `h-2xs`
- **세그먼트 간격**: `gap-2xs`, 각 세그먼트 `flex-1`
- **radius**: `rounded-fai-s`
- **트랙 배경**: `bg-quaternary`
- **채움 색**: `bg-icon-basic-inverse`

---

## 5. 🎯 Definition & Usage (LinearProgress = 진행률 바)
- **목적**: 단일 작업의 완료율을 가로 바로 표시
- **사용처**: 파일 업로드, 다운로드, 디스크 사용량 등 소요 시간이 있는 작업
- **사용 금지**: 즉시 끝나는 액션. 같은 작업에 여러 바 쌓기(하나 + 값 라벨로)

### Variants
| variant | 용도 |
|---|---|
| accent | 일반 진행 (기본) |
| success | 완료 |
| warning | 경고 |
| error | 오류 |

### 모드
- **determinate**: `value` 지정 → 0~max 비율로 채움
- **indeterminate**: `value` 미지정 → 무한 슬라이드 애니메이션

## 6. 🧩 Props (API) — LinearProgress
| prop | type | default | 설명 |
|---|---|---|---|
| label | string | 필수 | 접근성 레이블(숨겨도 스크린리더가 읽음) |
| value | number | — | 0~max. 미지정 시 indeterminate |
| max | number | 100 | 최대값 |
| variant | 'accent'\|'success'\|'warning'\|'error' | 'accent' | 색상 |
| showValueLabel | boolean | false | 값 라벨 표시 |
| formatValue | (v,max)=>string | — | 값 라벨 포맷(예: `${v}GB`) |
| labelHidden | boolean | false | 라벨 시각적 숨김 |

## 7. 🎨 Token Mapping — LinearProgress
- **트랙**: `h-2xs bg-quaternary rounded-fai-s`
- **채움**: variant별 `bg-filled-optional-brand-primary`(accent) / `bg-filled-basic-positive`(success) / `-warning` / `-negative`
- **라벨**: `text-body-s text-secondary`
- **indeterminate**: 40% 폭 바 무한 슬라이드

## 8. ✅ Best Practices
- 총량 알면 determinate, 모르면 indeterminate
- 항상 label 제공(숨겨도 스크린리더 필요)
- 바 안에 아이콘/라벨 넣지 말고 옆에 배치

## 9. ✅ Sync Note
두 컴포넌트 모두 Tailwind 토큰 클래스 방식 준수(h-2xs / gap-2xs / rounded-fai-s / bg-quaternary / bg-filled-*). CSS 변수 하드코딩 없음. 양호.
