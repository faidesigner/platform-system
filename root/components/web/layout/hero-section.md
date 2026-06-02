# HeroSection Specification
**Status**: Final

## 1. 🎯 Definition & Usage
- **목적**: 메인 히어로 — 스크롤 기반 비디오 확장 애니메이션
- **사용처**: 홈페이지 최상단

## 2. ⚡ Interaction & State
- **초기**: 상단 카피 + 하단 작은 비디오 박스 (400×344px, rounded-top)
- **스크롤 20% 이상**: 비디오 전체화면 확장 + 텍스트 페이드인
- **라이브러리**: framer-motion (layout FLIP)

## 3. 📐 Layout & Content Rules
- **섹션 높이**: h-[400vh] (sticky 스크롤)
- **비디오**: object-cover 전체
- **확장 후 텍스트**: container 기준 하단 좌우 배치
