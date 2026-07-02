# `.claude/skills/` — Homepage 프로젝트 스킬

이 폴더의 스킬은 **git으로 공유**되며, Claude Code(및 호환 에이전트)가 `products/homepage` 작업 시 자동으로 참조한다. 각 스킬은 이 저장소에서 반복적이고 실수하기 쉬운 워크플로우를 규격화한 것이다.

| 스킬 | 언제 쓰나 |
|---|---|
| **homepage-deploy** | 홈페이지 정적 export를 DEV 프리뷰/PRD로 배포할 때 (`scripts/deploy.sh`, env별 함정, 배포 후 검증) |
| **homepage-qa** | Notion "Homepage QA" 보드의 버그 티켓을 처리할 때 (dev 대조 → 수정 → 카드 기록 → 검증 → 커밋) |
| **homepage-i18n** | 사용자 노출 카피/번역을 추가·수정할 때 (messages 키 동기, 서버/클라 접근, @fai/ui 경계, 번역금지, 오염 검증) |

## 사용
Claude Code는 작업 맥락에 맞는 스킬을 자동 로드한다. 수동 호출은 `/homepage-deploy` 등(에이전트 환경에 따라 다름). 스킬 본문은 실제 명령·규칙·검증 절차를 담고 있으니 그대로 따르면 된다.

## 유지보수
- 이 스킬들은 **프로젝트 전용 레퍼런스/런북**이다(규율 강제형 아님). 워크플로우가 바뀌면 해당 SKILL.md를 갱신하고 커밋한다.
- 사람이 읽는 참조 문서는 `docs/handbook/` 참조.
