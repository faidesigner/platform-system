# hynix 아이콘 (자리만 세팅 · 나중에 채움)

피그마 아이콘(check, x-circle, alert-circle, alert-triangle, info, chevron-down 등)은
SVG 이미지라 디자인 데이터로 안 넘어온다 → **나중에 SVG를 여기 넣고 Icon 컴포넌트로 노출**.

## 구조
- `svg/` : 원본 svg 파일 (예: check.svg, x-circle.svg, chevron-down.svg ...)
- `Icon.tsx` : name prop으로 svg를 렌더하는 래퍼 (아이콘 채운 뒤 활성화)

## 현재 컴포넌트에서 임시로 인라인 그린 아이콘 (교체 대상)
- checkbox 체크, toast 4종 아이콘, tag-chip/toast/modal 닫기(x-circle), input chevron-down

## 넣을 때
1. svg/ 에 파일 추가
2. Icon.tsx 의 map 에 등록
3. 각 컴포넌트의 인라인 <svg> 를 <Icon name="..." /> 로 교체
