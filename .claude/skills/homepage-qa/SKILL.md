---
name: homepage-qa
description: Use when working QA bug tickets for the FAI homepage from the Notion "Homepage QA" board — diagnosing against the existing dev version, fixing on the working branch, recording the fix and open decisions back on the Notion card, verifying, and committing.
---

# Homepage QA 처리 사이클

## 개요
디자인/기획팀이 Notion **"Homepage QA"** 보드(부모: QA Board)에 버그 티켓을 올린다. 각 티켓을 진단 → 수정 → **Notion 카드에 처리내용·결정이슈 기록 + 상태 갱신** → 검증 → 커밋/푸시한다. "기존 dev 버전에서 정상 동작"이라는 티켓은 `platform-system/.worktrees/main`(= 기존 dev, `main` 브랜치)과 대조해 올바른 동작을 복원한다.

## 위치 정보
- 보드/DB: Notion "Homepage QA" (data source `collection://390cd683-476b-8037-b84e-000b3181df39`). 조회는 `notion-query-data-sources`(SQL).
- 카드 주요 필드: `이름`, `진행상태`(status), `결함 심각도`, `위치구분`(배포전 Dev / 배포후), `userDefined:ID`(HOM-N).
- 작업 브랜치: `feat/static-export-deploy`. 비교 기준(기존 dev): `.worktrees/main`.

## 상태값 (진행상태)
`❶ 🐞Bug(버그)` · `❷ Debugging(디버깅중)` · `❸ Fix Complete(디버깅 완료)` · `❹ QA 요청` · `❺ QA 완료` · `❻ Release(배포 완료)` · `✚ Pending(처리보류)` · `❶ ✨NEW`.

## 사이클
1. **읽기**: 카드의 `## 🚨 이슈 사항` / `## 👉 기대 결과`를 정확히 파악. 첨부 이미지/영상·재현 조건 확인.
2. **대조**: "dev 정상" 언급 시 `.worktrees/main`의 해당 파일과 비교해 원래 타겟/동작 복원(예: 링크 href, 스크롤).
3. **수정**: `feat/static-export-deploy`에서 근본 원인 수정. 같은 원인의 다른 티켓이 있으면 한 번에.
4. **검증**: `pnpm build && pnpm test`(lint 제외). UI/동작 이슈면 Playwright로 실측(로케일 오염은 `homepage-i18n` 참조).
5. **기록(필수)**: 카드에 `insert_content`로 처리 노트(무엇을·어떻게·커밋 SHA·**남은 결정이슈**) 추가 + `진행상태`를 `❸ Fix Complete` 또는 결정보류면 `✚ Pending`으로.
6. **커밋/푸시**: 커밋 메시지에 `HOM-N` 참조. 완료 후 push.

## 카드 기록 템플릿 (insert_content, end)
```
---
## 🔧 개발 처리 — <날짜> (담당/도구)
- 원인: …
- 조치: … (커밋 `<sha>`)
- ⚠️ 결정 필요: … (있으면)
```

## 유의
- 스코프에서 **제외 지시된 항목**(예: "UI 디테일 수정")은 건드리지 않는다 — 착수 전 제외 범위 확인.
- 에셋/디자인 판단이 필요한 티켓(이미지 교체 등)은 **확인·리포트만** 하고 상태 `Pending`, 카드에 선택지 정리 후 사람 결정에 맡긴다.
- 코드가 아니라 GA4 콘솔·마케팅 카피 등 **코드 밖 작업**이 필요하면 카드에 인계 사항으로 명시.
- 커밋만 하고 push/PR은 사용자 지시 범위를 따른다(작업 브랜치 누적 여부 확인).
