# Foundation Tokens

모든 플랫폼(web, vg)이 공유하는 기본 토큰 정의입니다.

플랫폼별 토큰을 수정하기 전에 Foundation 토큰을 먼저 확인합니다.

## 토큰 목록

| 파일 | 설명 |
| --- | --- |
| color-global.md | 전체 컬러 팔레트 (Primitive) |
| color-semantic.md | 시맨틱 컬러 (light / dark 모드) |
| typography.md | 폰트 원시값 (family, weight, size, lineHeight, letterSpacing) |

## 규칙

- Foundation 토큰은 플랫폼 독립적입니다.
- 직접 수정 시 모든 플랫폼에 영향을 줍니다.
- `npm run sync` 실행 시 CSS가 자동 재생성됩니다.
- CSS 파일은 직접 편집하지 않습니다. JSON만 수정합니다.

## 조건부 토큰

아래 파일은 조건에 따라 선택적으로 import합니다.

- `dark.css` — 다크 모드 활성화 시
- `color-brand.css` — 브랜드별 컬러 오버라이드 시
