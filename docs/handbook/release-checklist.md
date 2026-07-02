# 릴리스 / PRD 배포 준비 체크리스트

브랜치 `feat/static-export-deploy` 기준. 실서비스(www.fainders.ai) 배포 전 확인용 + 현재 남은 결정/미해결 이슈 정리.

## 현재 브랜치에 반영된 것 (요약)
- **i18n**: 전 사이트 3개국어(ko/en/ja) 번역, `jp→ja` 리네임, hreflang·`<html lang>`·OG.
- **GA4**: 클릭 이벤트 3종(12지점, 데스크톱+모바일).
- **Contact→Zapier**: 문의 폼 실제 전송(자체 payload 빌더).
- **QA 수정**: 스크롤 포커싱, 언어전환 위치보존, 푸터 정책 PDF(자체호스팅), 리뷰 아이콘 컬러, 유튜브 썸네일 폴백, 미디어 테스트카드 제거, 만나밀 이미지 세로복구, imageSection 화질 재추출 등.

## 수동 체크 (배포 전 브라우저 확인)
- `/ko` `/en` `/ja` 각 페이지 진입·렌더(404 없음), 언어 전환 시 화면/스크롤 유지.
- 페이지 이동 시 최상단 진입(제품/회사소개/미디어), [자세히 알아보기]→VCO 최상단, [실제 도입 후기 더보기]→리뷰 섹션.
- 푸터 개인정보/CCTV **PDF 링크 열림**(새 탭).
- ctaBanner/hero [도입 문의하기]→문의 화면, 문의 폼 제출→Zapier 리드 도달(실제 리드 생성 주의).
- VCO 리뷰 아이콘 컬러, 미디어 유튜브 썸네일(11·12번), 뉴스 빈 카드 없음.
- 만나밀 고객 이미지 세로 정상.

## PRD 배포 전 결정/조치 (열린 이슈)
1. **en/ja 색인 정책**: 현재 코드 `robots index:true`(3로케일). 미번역 외부콘텐츠 감안해 en/ja를 실제 색인할지 최종 결정.
2. **미디어 외부 동기 콘텐츠**: YouTube(RSS)·Retail Tech Letter(Stibee) 제목이 en/ja에서 한국어 → SEO 노출 정책(자동번역/로케일별 숨김/수용) 결정.
3. **마케팅 카피 검수**: `products/homepage/docs/TODO_i18n-marketing-review.md`의 en/ja 초벌(언론 헤드라인·로마자 인명/주소·용어) 확정.
4. **GA4 콘솔(코드 밖)**: `location`/`label` 맞춤 측정기준 등록 + `lead_acquisition_click`/`inquiry_complete` 주요 이벤트(전환) 등록. 소급 적용 안 됨 → 배포 전 등록 권장.
5. **`G-FZQS63DGEW`**: 코드에 없음. `G-GCQKJ5TF6R`의 "연결된 사이트 태그"로 함께 수집 중 → GA4 관리에서 해제.
6. **HOM-14 imageSection 화질**: 원본 해상도 한계로 최대 재추출 완료. 추가 개선 원하면 고해상 디자인 소스 필요(Pending).
7. **HOM-22 웰스토리 사진**: 드라이브 신규 촬영본 확인됨. 교체/추가할 컷 선택 필요(Pending).
8. **잔여 마이너**: 문의 완료 후 "계속 둘러보기"가 `router.push("/")`로 로케일 없는 루트로 이동(정적 export에 `/` 페이지 없음) → 로케일 인식 라우터로 교체 권장.

## 배포 명령 (요약)
```bash
cd products/homepage
pnpm build && pnpm test          # lint 은 사전 깨짐 — 제외
./scripts/deploy.sh prd          # 확인 프롬프트 승인 (FLAT_HTML=true)
```
자세한 절차·함정은 `.claude/skills/homepage-deploy` 또는 `products/homepage/README.md`.
