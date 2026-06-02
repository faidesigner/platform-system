# NavigationBar Specification
**Status**: Final

## 1. 🎯 Definition & Usage
- **목적**: 전역 상단 네비게이션
- **사용처**: 모든 페이지 최상단 고정

## 2. ⚡ Interaction & State
- **투명(home)**: 스크롤 전 transparent / 스크롤 중 transparent / 스크롤 끝 surface
- **불투명(sub)**: 스크롤 0 transparent / 스크롤 > 0 surface
- **텍스트 색상**: 투명 상태 → text-inverse / surface 상태 → text-primary

## 3. 📐 Layout & Content Rules
- **높이**: h-16 (64px) fixed
- **로고**: 110×26px
- **메뉴**: tablet 이상 노출 / mobile 햄버거
- **드롭다운**: 제품 메뉴 hover 서브메뉴
- **언어선택**: KO / EN / JP

## 4. 🎨 Token Mapping
```json
{
  "component": "NavigationBar",
  "states": {
    "transparent": {
      "bg": "transparent",
      "text": "{color.text.basic.inverse}"
    },
    "surface": {
      "bg": "{color.bg.100}",
      "text": "{color.text.basic.primary}"
    }
  }
}
```
