# figma-foundation-input

Figma 개발용 테스트 플러그인입니다.

`root/foundation` 토큰을 읽어서 현재 열린 Figma 파일에 Variables와 Text Styles를 생성합니다.

## 생성

```bash
node scripts/export-figma-variables.js
```

생성 결과:

- `tools/figma-foundation-input/fai-foundation-variables.json`
- `tools/figma-foundation-input/code.js`
- `tools/figma-variable-visualizer/fai-foundation-variables.json`
- `tools/figma-variable-visualizer/code.js`

## Figma에서 테스트

1. Figma에서 새 디자인 파일을 엽니다.
2. `Plugins > Development > Import plugin from manifest...`
3. `tools/figma-foundation-input/manifest.json` 선택
4. `Plugins > Development > figma-foundation-input` 실행

## 현재 범위

- Color primitive: `COLOR`
- Color semantic: `COLOR`, Light/Dark modes
- Size/spacing/radius: `FLOAT`
- Opacity: `FLOAT`
- Motion duration: `FLOAT`
- Motion easing: `STRING`
- Typography primitive/web scale: `FLOAT`
- Typography web styles: Figma `TextStyle`

Shadow처럼 Figma Variables의 단일 타입으로 표현하기 어려운 토큰은 아직 제외합니다.
