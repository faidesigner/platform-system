# 개발 로그 — PRD(www.fainders.ai) 첫 실배포

- **날짜:** 2026-07-20
- **브랜치:** `develop` @ `0be0425` (배포 시점 워킹트리 dirty)
- **범위:** `products/homepage` → `s3://www.fainders.ai` 라이브 컷오버 (이 파이프라인으로는 최초 PRD 배포)
- **상태:** 배포 완료, 라이브 검증 완료. **커밋 미완료(dirty) — 후속 커밋 필요.**

---

## 배경

기존 `www.fainders.ai` 루트에는 신규 Next.js 홈페이지와 무관한 구 사이트 파일(레거시 standalone 페이지, `assets/` 등)이 남아 있었고, `deploy/prd.env`는 안전을 위해 기본 `DELETE=false`였다. 이번에 실제 컷오버(구 파일 삭제 + 신규 빌드로 교체)를 진행하기로 결정하면서, "함부로 지우면 안 되는 것"을 먼저 보존한 뒤 삭제를 실행했다.

## 진행 순서

1. **S3 버전닝 활성화** (`www.fainders.ai`, 이전엔 비활성) — 향후 모든 배포에 대해 구조적 롤백 수단 확보.
2. **로컬 스냅샷 백업**: 배포 전 라이브 버킷 전체(`homepage_v2` 제외, 다음 항목에서 폐기 승인됨)를 `.backups/prd-snapshot-20260720/`로 로컬 백업(2.7GB, 500파일). `.gitignore`에 `.backups/` 추가.
   - ⚠️ **실수 및 교정**: 처음에 이 백업 폴더를 `products/homepage/` **안에** 만들었더니, Tailwind 소스 스캔이 구 사이트의 컴파일된 CSS까지 훑어 존재하지 않는 `/assets/*.jpg` 클래스를 재생성 → 빌드 실패. `.backups/`를 프로젝트 밖(`platform-system/.backups/`)으로 옮기고 나서야 빌드 성공. **교훈: 백업/스크래치 데이터는 절대 빌드 스캔 대상 디렉토리 안에 두지 말 것.**
3. **`--delete` dry-run으로 삭제 대상 사전 검토** — 1010건 삭제 후보 중 `_next`(빌드 해시 교체)·`homepage_v2`(DEV 프리뷰, 폐기 승인)·`assets/`(구 사이트 전용 이미지)를 제외한 실질 콘텐츠 손실 항목을 식별:
   - **완전 소실 위험**: `document/Fainders.AI_Product Overview.pdf`(KR/EN), `document/FaindersAI_PRIVACY POLICY_singapore.pdf`, `contact-us/`의 다국어(EN/KR/JP) 개인정보처리방침 PDF — 신규 빌드에 대응 파일 없음.
   - **의도된 폐기 승인**: `recruit.html`, `solution.html`, `standard-store.html`, `vco.html`, `vision-check-out.html`, `micro-store.html`, `qa.html`, `career/` — 신규 사이트에 대응 페이지 없음, 사용자 확인 후 삭제 진행.
4. 보존 대상 PDF 6종을 백업에서 `products/homepage/public/document/`, `public/contact-us/`로 복사 → 재빌드 → dry-run 재검증(손실 없음 확인).
5. `deploy/prd.env`의 `DELETE="false"` → `DELETE="true"`로 전환.
6. `./scripts/deploy.sh prd` 실행 → 배포 완료.

## 배포 후 검증

- `curl https://www.fainders.ai/version.json`의 `sha` == `git rev-parse HEAD`(`0be0425`) 일치 확인.
- `/ko/` `/en/` `/ja/` 200 확인.
- 복원한 PDF(`Product Overview.pdf`, 싱가포르 정책) 200 확인.
- `recruit.html`, `homepage_v2/` 403(AccessDenied=삭제됨) 확인.

## 후속 과제

- **커밋 필요(dirty 배포)**: `public/document/*.pdf`(3종 추가), `public/contact-us/*.pdf`(3종 추가), `.gitignore`(`.backups/` 추가), `deploy/prd.env`(`DELETE=true`) — 사용자 명시 요청 시 커밋 진행 예정, 아직 미커밋.
- `.backups/prd-snapshot-20260720/`(로컬, 2.7GB)는 S3 버전닝 활성화로 이중 안전망 성격 — 보관 기간/삭제 시점은 별도 판단 필요.
- 삭제된 8개 레거시 standalone 페이지에 외부 링크(명함/광고 등)가 남아 있는지는 확인되지 않음 — 트래픽 모니터링 권장.
- `/code-review` 또는 `/ultrareview` 및 QA(정상/엣지/에러 케이스) 진행 권장.
