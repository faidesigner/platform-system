# FAI Foundation Variable Visualizer

Figma 개발용 테스트 플러그인입니다.

`root/foundation` 토큰을 현재 열린 Figma 파일의 Variables/Text Styles로 가져오고, `FAI Variables Overview` 페이지에 색상/숫자/모션 토큰을 시각화합니다.

## 생성

```bash
node scripts/export-figma-variables.js
```

## Figma에서 테스트

1. Figma에서 테스트 파일을 엽니다.
2. `Plugins > Development > Import plugin from manifest...`
3. `tools/figma-variable-visualizer/manifest.json` 선택
4. `FAI Foundation Variable Visualizer` 실행
