# CHANGELOG: 유튜브 쇼케이스 영상 로케일별 오버라이드 + RSS 창 이탈 안전망 (HOM-25, 2026-07-16)

## 배경
Notion HOM-25 최신 댓글 요청: en 전용 영상 2건(`lLDFJ-3rs2U`, `VJSlS3ujdEo`)의 한국어 번역 대응, 숏츠 설명 누락 재확인.

## 변경 사항

### 1. `media.showcase.videoOverrides` — videoId 키 매핑 번역 오버라이드
- `messages/{ko,en,ja}.json`에 `media.showcase.videoOverrides.<videoId>.{title,description}` 신규.
- `app/[locale]/media/page.tsx`가 `t.has()`로 존재 여부 확인 후 `visibleShowcaseVideos` 결과에 병합 — 오버라이드 없는 videoId는 원문(유튜브 RSS 원본) 그대로 노출.
- 기존 `media.retailTechLetter.letterTitles`(Phase 8)와 동일 패턴 재사용 — 리싱크마다 재생성되는 외부 동기화 데이터(RSS)에 정적 messages 인덱스 키를 못 쓰는 문제를 videoId 키로 우회.
- `lLDFJ-3rs2U`, `VJSlS3ujdEo`: ko 번역 반영, `youtube-curation.json`의 `hideInLocales`에서 `ko` 제거(en·ko 노출, ja는 미번역이라 계속 숨김). ja 값은 임시로 영문 원문 — `docs/TODO_i18n-marketing-review.md`에 검수 대상 등록.

### 2. `scripts/sync-youtube.mjs` — RSS 창 이탈 안전망 (구조적 버그 수정)
- **재발 버그**: `hideInLocales`로 로케일 제한된 영상이 `manual` 고정 목록에 없으면, 새 영상 게시로 RSS 최신 15개 창이 밀릴 때 완전히 사라짐. 2026-07-15에 2건(`lLDFJ-3rs2U`, `VJSlS3ujdEo`)에서 발생해 `manual` 고정으로 수정했으나, 2026-07-16 재싱크 중 3번째 영상(`fSzG6pXZx-w`)에서 동일 패턴 재발을 확인.
- **구조적 수정**: `loadPreviousVideos()`로 직전 `youtube-showcase.json`을 읽어두고, RSS+manual 병합 후에도 `hideInLocales`에 등록된 videoId가 빠져있으면 직전 데이터로 복구(`rescued`) + 콘솔 경고(`manual` 고정 권고) 출력.
- 이번에 발견된 `fSzG6pXZx-w`는 안전망으로 복구된 것을 확인 후 즉시 `manual`에 정식 고정(안전망은 최후 보루이지 정상 상태가 아님).

### 3. 숏츠 설명 문구 확인 (댓글 3번 항목)
- 재싱크 결과 빈 설명 영상 0건. 7/15에 유일하게 비어있던 `SQVWhX_U3f4`(망고케이크 ep1)에 BD가 추가한 설명 반영 확인. 신규 숏츠(`am92ZPQxrmo`)도 설명 있음.

## 검증
- `pnpm test`: 59건 통과.
- `pnpm build`: 정적 export 성공. `out/ko`, `out/en`, `out/ja` 각 media 페이지에서 영상별 노출/문구를 직접 grep으로 대조 확인(ko·en에 새 타이틀 노출, ja는 `hideInLocales` 유지로 미노출).
- key-sync 검증(`ko=en=ja`): videoOverrides 관련 키는 3개 로케일 동일. (무관한 기존 이슈로 `products.visionCheckout.reviews`에 ja 전용 index 3 항목 발견 — 이번 스코프 밖, 별도 확인 필요.)

## 후속 필요 작업
1. ja 실번역 확정 시 `videoOverrides`의 ja 값 교체 + `hideInLocales`에서 `ja` 제거.
2. `products.visionCheckout.reviews` ja 전용 항목(index 3, Comma Store) 의도 여부 확인.
3. develop 머지 + dev 프리뷰 재배포 + QA 검증 (HOM-46/48 재발 방지 규칙에 따라 `deploy.sh dev` 후 `version.json` 대조 필수).
