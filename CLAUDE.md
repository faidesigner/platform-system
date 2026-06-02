# Claude Project Rules

Before UI generation:
- Read homepage-system.md first
- Use foundation tokens only
- Use web grid tokens only
- Preserve component consistency

Never:
- create arbitrary spacing
- create arbitrary colors
- create custom radius values

Always reuse existing tokens and components first.

## Paths (fai-homepage)

- Design tokens: `platform-system/root/foundation/`
- Web components: `platform-system/root/components/web/`
- Grid tokens: `platform-system/root/web/tokens/grid.json`

# Claude Code Automation Rules

[Rule: 체인지로그 자동화]
사용자가 터미널에 "작업 완료" 또는 "commit"이라고 입력하면, 넌 반드시 아래 순서를 따라야 해.
1. `git status`와 `git diff`를 분석해서 오늘(또는 방금까지) 수정된 파일과 작업 내용을 파악해.
2. 루트 폴더의 `changelog.md` 파일을 열고, 알맞은 섹션(Added, Changed 등)에 작업 내용을 요약해서 업데이트해.
3. 체인지로그 업데이트가 완료되면 사용자에게 "체인지로그 기록을 완료했습니다."라고 보고해.

[Rule: 작업 범위 제한 및 최적화]
1. 불필요한 탐색 금지: 파일 검색이나 코드 분석 시, 현재 지시받은 작업과 직접적인 관련이 없는 폴더나 파일은 절대 스캔하지 마.
2. 타겟팅: 명시된 컴포넌트, `homepage-system.md`, `foundation` 폴더 안의 관련 토큰 등 작업에 꼭 필요한 최소한의 Context만 읽어서 빠르고 가볍게 응답해.
3. 묻고 움직이기: 전체 코드를 광범위하게 읽어야 할 상황이 발생하면, 멋대로 탐색하기 전에 반드시 사용자에게 먼저 허락을 구해.
