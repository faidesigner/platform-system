# Lightbox Specification
**Status**: Draft


## 1. 🎯 Definition & Usage
- **목적**: 이미지/비디오를 풀스크린 오버레이로 원본 해상도 감상
- **사용처**: 갤러리 확대 보기, 이미지 상세, 비디오 재생
- **사용 금지**: 폼/다이얼로그(그건 Dialog). 인라인 미디어(그건 Image/Video)

## 2. ⚡ Variants (모드)

| 모드 | 설명 |
|---|---|
| single | 단일 아이템 |
| gallery | 여러 아이템 + prev/next 내비게이션 |

## 3. ⚡ Interaction & State
- **열기/닫기**: `isOpen` 제어. 닫기 = ✕ 버튼 / Esc / 백드롭 클릭
- **내비게이션**(gallery): prev/next 버튼 + ←/→ 키
- **줌·팬**(이미지): 옵션. 확대 후 드래그로 이동
- **비디오**: 네이티브 컨트롤 사용
- **접근성**: `role="dialog"` + `aria-modal`, focus trap(열릴 때 포커스 가둠), 열릴 때 body scroll lock. 닫으면 트리거로 포커스 복귀
- **모션**: `prefers-reduced-motion` 존중

## 4. 🧩 Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| isOpen | boolean | 필수 | 열림 상태 |
| onClose | ()=>void | 필수 | 닫기 콜백 |
| items | LightboxItem[] | 필수 | 미디어 배열 |
| index | number | 0 | 현재 표시 인덱스 |
| onIndexChange | (i:number)=>void | — | 인덱스 변경 콜백(gallery) |
| enableZoom | boolean | false | 이미지 줌·팬 활성화 |

### LightboxItem
| prop | type | 설명 |
|---|---|---|
| type | 'image' \| 'video' | 미디어 종류 |
| src | string | 소스 URL |
| alt | string | 대체 텍스트(image) |
| poster | string | 포스터(video) |

## 5. 🎨 Token Mapping
- **백드롭**: 반투명 어두운 오버레이 (rgba 기반, 풀스크린 fixed)
- **컨트롤 버튼**: IconButton 재사용 (닫기/prev/next)
- **radius**: 미디어 컨테이너 `rounded-fai-m`
- **간격**: 컨트롤 배치 `gap-m`, 가장자리 `p-xl`

## 6. ✅ Best Practices
- 갤러리는 키보드(←/→/Esc) 완전 지원
- 이미지엔 의미 있는 alt, 장식이면 빈 alt
- 비디오는 자동재생 대신 사용자 제어(네이티브 컨트롤)

## 7. ⚠️ Sync Note
초기 구현. 오버레이/포커스트랩/스크롤락은 기존 Dialog·Drawer 패턴과 정합성 확인 필요.
백드롭 색은 rgba 임의값이 아닌 오버레이 토큰(overlay-rules.md)과 맞출 것 — 후속 정리 대상.
