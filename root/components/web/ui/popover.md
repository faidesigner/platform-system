# Popover Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 트리거(버튼)에 앵커된 클릭 오버레이. 보조 액션·인라인 확인·부가 정보
- **사용처**: 확인 팝오버, 필터 패널, 설정 패널, 단축키 목록
- **구분**: hover 미리보기는 HoverCard, 짧은 도움말은 Tooltip, 무거운 입력은 Dialog
- **사용 금지**: 팝오버 중첩. 스크롤이 필요할 만큼 많은 콘텐츠(→ Dialog)

## 2. ⚡ Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| trigger | ReactNode | 필수 | 앵커 요소(버튼 등) |
| children | ReactNode | 필수 | 팝오버 콘텐츠 |
| placement | 'bottom'\|'top'\|'left'\|'right'\|'bottom-start'... | 'bottom' | 위치 |
| open | boolean | — | 제어 모드 열림 상태 |
| onOpenChange | (open:boolean)=>void | — | 열림 변경 콜백 |
| showCloseButton | boolean | false | 명시적 닫기 버튼 |

## 3. ⚡ Interaction & State
- **열기**: 트리거 클릭
- **닫기**: 바깥 클릭 / Esc / (옵션)닫기 버튼 / 내부 액션 완료
- **비제어/제어**: open 미지정 시 내부 상태, 지정 시 제어 모드
- **접근성**: 트리거 `aria-haspopup="dialog"` + `aria-expanded`, 패널 `role="dialog"`. 열릴 때 패널로 포커스, 닫으면 트리거 복귀

## 4. 🎨 Token Mapping
- **패널**: `bg-bg-100`, `border border-border-tertiary`, radius `rounded-fai-m`, `shadow-M`
- **padding**: `p-m`
- **간격**: 콘텐츠 `gap-s`
- **닫기 버튼**: IconButton(tertiary), 우상단

## 5. ✅ Best Practices
- 단일 작업/정보에 집중
- 명확한 닫기 수단 제공(바깥 클릭 또는 닫기 버튼)
- 팝오버 중첩 금지, 무거운 입력은 Dialog로
