# MegaMenuPanel Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 메가 메뉴 안에 펼쳐지는 콘텐츠 패널. 이미지 + 제목 + 설명이 있는 항목 카드들을 담음
- **사용처**: MegaNavMenu의 `megaMenuPanel` prop으로 주입되는 확장 패널
- **사용 금지**: 단순 텍스트 드롭다운(그건 Dropdown). 패널 없는 항목

## 2. ⚡ Props (API)

### MegaMenuItemData
| prop | type | 설명 |
|---|---|---|
| label | string | 항목 제목 |
| description | string | 항목 설명 |
| href | string | 링크 |
| image | string | 배경 이미지 |
| bgStyle | {backgroundPosition, backgroundSize} | 이미지 위치/크기 조정 |

### MegaMenuPanelProps
| prop | type | 설명 |
|---|---|---|
| title | string | 패널 제목 |
| items | MegaMenuItemData[] | 항목 목록 |

## 3. 📐 Layout & Content Rules
- **컨테이너**: width 100%, height 332px, 세로 배치 space-between
- **radius**: cornerRadius XL (24px)
- **border**: 0.5px border-tertiary
- **배경**: bg-100
- **그림자**: shadow-XL
- **텍스트**: 제목 text-basic-primary, 설명 text-basic-secondary, 강조 text-optional-brand-primary

## 4. ✅ Sync Note (코드 확인 2026-07-15)
Tailwind 토큰 클래스 방식으로 수정 완료. 컨테이너는 `pt-l px-3xl pb-3xl rounded-fai-xl`, 이미지 프레임은 `rounded-fai-s`, 내부 간격은 `gap-xl`/`gap-6xl`로 연결됨.
