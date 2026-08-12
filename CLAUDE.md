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

[Rule: 공용 컴포넌트 승격]
사용자가 "이 컴포넌트 공용으로 올려줘" 또는 이와 유사한 말을 하면, 넌 반드시 아래 순서를 따라야 해.
1. 대상 컴포넌트 파일을 `products/homepage/src/components/`에서 `packages/ui/components/`로 이동해.
2. `packages/ui/index.ts`에 해당 컴포넌트를 export 추가해.
   - named export면: `export { ComponentName } from './components/ComponentName';`
   - default export면: `export { default as ComponentName } from './components/ComponentName';`
3. 기존 homepage의 import 경로를 `'@fai/ui'`로 교체해.
4. 완료되면 사용자에게 "공용 컴포넌트로 승격 완료했습니다."라고 보고해.

[Rule: 작업 범위 제한 및 최적화]
1. 불필요한 탐색 금지: 파일 검색이나 코드 분석 시, 현재 지시받은 작업과 직접적인 관련이 없는 폴더나 파일은 절대 스캔하지 마.
2. 타겟팅: 명시된 컴포넌트, `homepage-system.md`, `foundation` 폴더 안의 관련 토큰 등 작업에 꼭 필요한 최소한의 Context만 읽어서 빠르고 가볍게 응답해.
3. 묻고 움직이기: 전체 코드를 광범위하게 읽어야 할 상황이 발생하면, 멋대로 탐색하기 전에 반드시 사용자에게 먼저 허락을 구해.

# QA 재발 방지 규칙 (HOM-20 재발 사후분석 2026-07-15)

배경: HOM-20(페이지 전환 스크롤 포커싱)이 "Fix Complete"로 표시됐는데도 재발했다.
원인은 ① 수정 커밋이 개발 브랜치에만 있고 **develop에 머지되지 않음**, ② 수정의 핵심(rAF 지연 같은 DOM/타이밍 부수효과)을 지키는 **회귀 테스트 부재**였다. 아래 규칙으로 구조적으로 막는다.

[Rule: Fix Complete = develop 머지까지]
1. Homepage QA 보드에서 버그 수정의 "완료(Fix Complete)"는 **develop 브랜치에 머지될 때** 성립한다. 수정 커밋을 개발 브랜치에만 두고 방치하지 마.
2. 티켓을 "❹ QA 요청" 이상으로 올리기 전, 반드시 해당 수정이 develop에 반영됐는지 확인해. 미머지 브랜치에 남은 수정은 "재발"로 되돌아온다.
3. 여러 티켓이 하나의 omnibus 브랜치에 묶여 있으면 티켓별 cherry-pick 대신 브랜치 통째 머지가 현실적일 수 있다 — 단, 티켓 범위 밖 변경(콘텐츠 삭제 등)이 섞였는지 리뷰하고 애매하면 사용자에게 확인해.

[Rule: 타이밍·DOM 부수효과는 회귀 테스트로 고정]
1. 버그가 순수 로직이 아니라 **실행 시점/부수효과**(rAF 지연, 이벤트 순서, async 경합 등)에 있으면, 순수 함수 테스트만으로는 재발을 못 막는다. 그 **부수효과 자체를 검증하는 회귀 테스트**를 반드시 추가해.
2. 예: 스크롤 최상단 이동이 "동기 호출이 아니라 rAF로 지연"돼야 하면, `SmoothScroll.test.tsx`처럼 동기 호출 시 실패하도록 테스트를 짜라. (판정 로직 `decideScrollAction`만 테스트하면 "어떻게 적용하는가"의 회귀를 놓친다.)
3. 정적 export여도 Next App Router는 SPA 소프트 내비게이션을 쓴다 — "production은 fresh mount라 안전"이라는 가정을 근거로 테스트/수정을 생략하지 마.

[Rule: develop 머지 ≠ dev 배포 — QA 검증은 dev 프리뷰 재배포까지] (HOM-46/48 재발 사후분석 2026-07-16)
배경: 7건(HOM-45/46/47/48/51/52/55)이 develop 병합(`ebb35b6`)까지 마치고 "❹ QA 요청"으로 올라왔지만, 병합 이후 `deploy.sh dev`가 실행되지 않아 **QA가 보는 dev 프리뷰엔 수정 전 상태가 그대로 서빙**되고 있었다. 위 [Fix Complete = develop 머지까지] 규칙의 다음 구멍이다.
1. QA팀이 검증하는 대상은 develop 브랜치가 아니라 **dev CloudFront 프리뷰**(`d6hs8futv6rcu.cloudfront.net`)다. develop 머지 후 반드시 `cd products/homepage && ./scripts/deploy.sh dev` 를 실행해 프리뷰를 최신화한 뒤에만 "❹ QA 요청"으로 올려라.
2. **staleness는 추측하지 말고 기계로 확인하라.** `deploy.sh`가 배포된 커밋을 `/version.json`으로 남긴다. QA 착수 전/검증 중 항상 대조:
   `curl -s https://d6hs8futv6rcu.cloudfront.net/version.json` 의 `sha` ↔ `git rev-parse HEAD`(develop). 다르면 재배포부터.
3. 카드 노트의 "Playwright PASS"가 **로컬/브랜치 빌드** 기준인지 **dev 배포본** 기준인지 구분해 적어라. 로컬 PASS는 dev 반영을 보장하지 않는다.
4. dev 검증이 끝나도 그건 **프리뷰**일 뿐 — 실서비스(www.fainders.ai) 반영은 별도 `deploy.sh prd`다. "dev 검증 완료"를 "배포 완료"로 오인하지 마.

[Rule: dev 검증 ≠ PRD 배포 — "배포후" 티켓의 기준선은 PRD다] (HOM-60/61/62 유령 티켓 사후분석 2026-08-12)
배경: HOM-60(주소 오타)·HOM-61(CCTV 방침 제거)·HOM-62(ctaBanner 문구) 3건이 "아직 안 고쳐졌다"고 재신고됐다. 실측해 보니 **develop에는 모두 반영돼 있었고 main(=PRD)에만 옛 값이 남아** 있었다. PRD 배포가 2026-08-05에 멈춰 있는 동안 develop만 12커밋 앞서 있었고, QA팀은 `www.fainders.ai`를 보고 이미 고친 버그를 다시 적었다. 위 두 규칙([Fix Complete = develop 머지까지], [develop 머지 ≠ dev 배포])의 **다음 구멍**이다. 실손실: QA 재작성 3건 + 개발자 재조사.
1. 카드의 `위치구분`이 **"배포후"면 검증 기준선은 PRD(`www.fainders.ai`)**다. dev 프리뷰가 최신이어도 그 티켓은 닫히지 않는다. `위치구분`을 먼저 보고 어느 환경을 대조할지 정해라.
2. **"배포후" 티켓을 조사할 때는 develop만 보지 마라.** 코드가 이미 고쳐져 있는지 양쪽을 기계로 대조하라:
   `git show main:<파일>` ↔ `git show develop:<파일>`, 그리고 `curl -s https://www.fainders.ai/version.json` 의 `sha` ↔ `git rev-parse main`.
   develop에만 있으면 **코드 결함이 아니라 미배포**다 — 카드에 그렇게 적고 재수정하지 마라.
3. 상태 승격 기준선을 이렇게 읽어라: **❸ Fix Complete = develop 머지 / ❹ QA 요청 = dev 배포 완료 / ❻ Release = PRD 배포 완료**. "배포후" 티켓을 ❻로 올리기 전 반드시 `deploy.sh prd`가 돌았는지 `version.json`으로 확인하라.
4. **PRD가 develop보다 뒤처진 채 방치되면 유령 티켓이 계속 생산된다.** develop과 main의 격차(`git log main..develop --oneline`)가 쌓이면 배포 일정을 먼저 확인해라 — 개별 티켓을 파고들기 전에.
