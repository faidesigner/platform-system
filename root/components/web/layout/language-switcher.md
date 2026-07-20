# LanguageSwitcher Specification
**Status**: Draft

## 1. 🎯 Definition & Usage
- **목적**: 지원 언어(로케일) 사이를 전환하는 인라인 스위처. 언어 버튼들을 나란히 표시
- **사용처**: NavigationBar 유틸리티 영역, 드로어 내 언어 행(langRow)
- **사용 금지**: 언어가 1개뿐인 경우. 많은 언어 목록(그건 Dropdown/Menu)

## 2. ⚡ Props (API)
| prop | type | default | 설명 |
|---|---|---|---|
| isDarkMode | boolean | false | 다크 배경 위 표시 여부(색 반전) |
| onLocaleChange | (code:string)=>void | 필수 | 언어 변경 시 코드 전달 |

> 현재 로케일은 `useLocale()`(next-intl)로 자동 감지. 하위: `LocaleButton`(개별 버튼), 구분선.

## 3. ⚡ Interaction & State
- **활성 표시**: 현재 로케일(`isActive`)인 버튼 강조
- **전환**: 다른 코드 클릭 시 `onLocaleChange(code)` 호출. 같은 코드면 무시
- **다크모드**: `isDarkMode`로 텍스트/활성 색 반전

## 4. 📐 Layout & Content Rules
- **배치**: 가로 flex, 버튼 사이 구분선
- **간격**: 항목 간 spacing XS(6px)

## 5. ✅ Sync Note (코드 확인 2026-07-15)
Tailwind 토큰 클래스 방식으로 수정 완료. 루트/항목 간격은 `gap-xs`, 버튼 radius/padding은 `rounded-fai-s p-s`로 연결됨.
