# ProgressBar Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 여러 스텝의 진행 상태를 세그먼트 바로 표시하고, 클릭으로 이동
- **사용처**: 캐러셀/슬라이드 인디케이터, 온보딩 스텝, 자동 재생 진행 표시
- **사용 금지**: 단일 작업의 로딩률 표시(그건 별도 로딩 인디케이터). 스텝이 1개면 사용 의미 없음

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

## 5. ✅ Sync Note
코드가 Tailwind 토큰 클래스 방식 준수(h-2xs / gap-2xs / rounded-fai-s / bg-quaternary). CSS 변수 하드코딩 없음. 양호.
