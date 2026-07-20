# TabletDrawerMenu Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 태블릿 뷰포트에서 열리는 드로어 메뉴. 아코디언 형태로 네비 항목을 펼침
- **사용처**: 태블릿 폭 NavigationBar의 햄버거 → 드로어
- **사용 금지**: 데스크톱 (그건 MegaNavMenu). 모바일 전용 UI가 따로 있으면 그쪽

## 2. ⚡ Props (API)
| prop | type | 설명 |
|---|---|---|
| onNavigate | ()=>void | 항목 클릭(이동) 시 호출 — 보통 드로어 닫기용 |

> 하위: `SubMenuItem`(개별 링크), 아코디언 섹션. `DrawerPrimitives`를 사용.

## 3. ⚡ Interaction & State
- **아코디언**: 섹션 헤더 클릭 시 하위 항목 펼침/접힘 (`useState` 기반)
- **항목 클릭**: `onNavigate` 호출로 드로어 닫기
- **의존**: `DrawerPrimitives`(드로어 뼈대) 재사용

## 4. 📐 Layout & Content Rules
- **텍스트**: 하위 항목 `text-basic-secondary`
- 나머지 표면·간격은 DrawerPrimitives 규칙 상속

## 5. ✅ Sync Note (코드 확인 2026-07-15)
- 드로어 표면/동작은 DrawerPrimitives에 위임. TabletDrawerMenu는 아코디언 로직 담당.
- DrawerPrimitives 자체 명세는 아직 없음(별도 작성 대상). 표면 토큰 SSOT는 거기서 정의 예정.
