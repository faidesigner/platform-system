# figma-component-input

Figma 안에 컴포넌트를 하나씩 생성하기 위한 개발용 플러그인입니다.

## Build

컴포넌트 값은 `platform-system/root/foundation/*.json`과
`platform-system/root/web/tokens/grid.json`을 기준으로 해석합니다.
제품 폴더 안의 복제된 foundation 값은 사용하지 않습니다.

```bash
node scripts/build-figma-component-input.js all
node scripts/build-figma-component-input.js nav-tab
node scripts/build-figma-component-input.js badge
node scripts/build-figma-component-input.js banner
node scripts/build-figma-component-input.js breadcrumbs
node scripts/build-figma-component-input.js button-group
node scripts/build-figma-component-input.js button
node scripts/build-figma-component-input.js icon-button
node scripts/build-figma-component-input.js toggle-button
node scripts/build-figma-component-input.js checkbox
node scripts/build-figma-component-input.js card
node scripts/build-figma-component-input.js carousel
node scripts/build-figma-component-input.js calendar
```

`all`은 모든 spec을 플러그인 UI 목록에 포함합니다.
개별 spec 이름을 넘기면 해당 컴포넌트만 UI 목록에 포함합니다.

## Figma에서 실행

1. Figma에서 테스트 파일을 엽니다.
2. `Plugins > Development > Import plugin from manifest...`
3. `tools/figma-component-input/manifest.json` 선택
4. `figma-component-input` 실행
5. 생성할 컴포넌트를 선택한 뒤 `생성` 클릭

## 원칙

- 선택한 컴포넌트만 생성합니다.
- 무거운 토큰 전체 import/update는 하지 않습니다.
- 실행 시 `Generated`와 `Published` 페이지를 준비합니다.
- 생성물은 `Generated`에만 추가하고, `Published`는 건드리지 않습니다.
- 생성된 Figma 컴포넌트는 디자이너가 편집하고, 이후 MCP로 다시 읽어 코드화합니다.
