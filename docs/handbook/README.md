# Homepage Handbook

`products/homepage`(fainders.ai 홈페이지)를 다루는 **개발자·기획자 공용 참조 문서**. 단순 작업로그가 아니라, 팀이 반복 참조할 구조·규칙·릴리스 절차를 담는다.

| 문서 | 대상 | 내용 |
|---|---|---|
| [architecture.md](architecture.md) | 개발자 | 시스템 개요: 정적 export, config+messages 구조, `@fai/ui`, i18n, GA, SEO, 배포 |
| [i18n-copy-guide.md](i18n-copy-guide.md) | 기획자·개발자 | 카피/번역을 어디서 어떻게 바꾸나, 번역 금지 대상, 검수 흐름 |
| [release-checklist.md](release-checklist.md) | 개발자 | PRD 배포 준비 체크리스트 + 현재 남은 결정/미해결 이슈 |

## 관련 위치
- 배포/환경변수/테스트: `products/homepage/README.md`
- 자동화 스킬(에이전트용): `.claude/skills/`
- 설계 스펙·구현 계획(에이전트 프로세스): `docs/superpowers/`
- i18n 마케팅 검수 대상: `products/homepage/docs/TODO_i18n-marketing-review.md`
- 개발 로그: `products/homepage/docs/CHANGELOG_*.md`, 루트 `CHANGELOG.md`
- QA 보드: Notion "Homepage QA"
