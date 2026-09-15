# OPEN — ja 개인정보 처리방침 PDF의 개인정보 보호책임자 영문 표기 (2026-09-15)

## 상태
- `public/contact-us/FaindersAI_プライバシーポリシー_個人情報保護方針_2026-1.pdf` 5쏽 個人情報保護管理者 칸이 **`Seokbeom Hong（ホン・ソクボム、CTO）`**.
- 회사 표준 표기는 **`Sukbum Hong`** (2026-09-04 #prj_homepage 왕민권 확인, en PDF·messages 전부 이 표기). 2026-09-02 CHANGELOG에서 이미 발견·요청 항목으로 적었고, 09-15 HOM-104(en PDF 교체) 처리 때 사용자가 dev에서 재발견.
- 2026-09-15 사용자 결정: **ja는 그대로 두고 PRD 배포**(main `c8d2c68`). 정정 파일이 나오면 별도 작업.

## 왜 코드로 못 고치나
- 법무 검토 문서. 원본 `.docx`는 개인정보 담당(김진영) 보유. Slack에는 `[일본어]개인정보처리방침 260821(수정본).docx`(08-25 신혜영)까지만 있고 정정된 PDF는 없다.
- PDF 텍스트를 직접 편집하면 폰트 서브셋·페이지네이션이 깨진다. 로컬에 Word/LibreOffice도 없다.

## 파일 받으면 할 일 (체크리스트)
1. 이선연/김진영에게서 `Sukbum Hong`으로 재출력된 ja PDF 수령 (Slack #prj_homepage 스레드 → `slack_read_file`로 받는다. Notion 첨부는 MCP로 못 받음).
2. `pdftotext`로 이름 확인 + 이름 외 본문이 기존과 같은지 word-level 대조.
3. `pdfinfo`로 쪽수 비교. 현재 5쪽, `scripts/lib/privacyCookiePages.mjs` ja `page: 4` (`clauseNeedle: "第8条 個人関連情報"`). 쪽수가 바뀌면 `page` 갱신 → `node scripts/gen-privacy-cookie.mjs`.
4. `..._2026-1.pdf` 교체. 코드 미참조 중복본 `FaindersAI_プライバシーポリシー(個人情報保護方針).pdf`도 같은 내용으로 동기화(외부 링크 대비 삭제 금지).
5. `pnpm build && pnpm test` → `node scripts/check-privacy-cookie.mjs` (deploy.sh가 자동 실행하지만 먼저 돌려 본다).
6. develop 커밋 → main 머지 → `deploy.sh dev`/`prd` → 두 환경 `version.json` sha 대조 → PRD PDF `pdftotext`로 `Sukbum Hong` 확인.
7. HOM-104 카드에 처리 노트 추가(현재 카드에 인계 노트 있음).

## 관련
- CHANGELOG.md 2026-09-15 / 2026-09-02 항목, 메모리 `homepage-privacy-pdf-repagination-trap`.
