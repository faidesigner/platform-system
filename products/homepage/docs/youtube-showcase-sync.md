# 미디어 쇼케이스 — 유튜브 동기화 가이드

미디어 페이지의 ShowcaseSection은 `@faindersAI` 채널 영상을 카드 캐러셀로 보여줍니다.
데이터는 **수동 실행 스크립트**로 갱신합니다(현재 자동화 없음, API 키 불필요).

## 동작 개요
- 데이터 소스: 유튜브 **공개 RSS 피드**(`youtube.com/feeds/videos.xml?channel_id=...`). API 키 불필요.
- 동기화 스크립트가 RSS → `config/youtube-showcase.json` 생성.
- `components/sections/media/ShowcaseSection.tsx` 가 이 JSON을 빌드 시 읽어 정적으로 노출.
- 썸네일은 `videoId`로 `maxresdefault → hqdefault → 브랜드 디폴트 이미지` 순 fallback.

## 갱신 방법
```bash
cd products/homepage
node scripts/sync-youtube.mjs      # RSS 최신 영상 → config/youtube-showcase.json
# 변경된 JSON 커밋 후 빌드/배포하면 반영
```

## 큐레이션 (노출/제외 선택)
기본은 **채널 최신 영상 전체**가 최신순으로 노출됩니다.
바꾸려면 `config/youtube-curation.json` 을 편집한 뒤 스크립트를 다시 실행합니다.

```json
{
  "exclude": ["videoId1"],          // 나오지 말아야 하는 영상(숨김)
  "pinned":  ["videoId2"],          // 나와야 하는 영상 — 지정 순서대로 맨 앞 고정
  "manual":  [                      // RSS(최신 ~15개)에 없는 옛 영상을 수동 추가
    { "videoId": "abc123", "title": "제목", "description": "설명" }
  ],
  "limit": null                     // 노출 개수 제한(숫자). null이면 전체
}
```
- `videoId` 는 유튜브 URL `watch?v=` 뒤의 값(예: `https://youtu.be/U12evbt9Aoo` → `U12evbt9Aoo`).
- RSS는 **최신 약 15개**만 제공합니다. 더 오래된 영상을 꼭 넣어야 하면 `manual` 에 직접 적습니다.

> **재싱크는 영상을 빼지 않습니다 (2026-11-19 변경)**
> RSS는 최신 15개만 주기 때문에, 신규 영상이 올라오면 예전 영상은 RSS 창 밖으로 밀려납니다.
> 예전에는 이때 `manual`/`pinned` 에 없는 영상이 쇼케이스에서 소리 없이 빠졌습니다(HOM-25에서 2건,
> 2026-11-19 재싱크에서 6건이 빠질 뻔함). 지금은 **직전 `youtube-showcase.json` 에 있던 영상을 그대로 이어받습니다.**
> - 영상을 내리려면 `exclude` 에 `videoId` 를 적고 다시 실행합니다. 그 외의 경로로는 빠지지 않습니다.
> - 순서는 `RSS 최신순 → 이어받은 영상(직전 순서) → 새로 추가한 manual` 입니다.
> - 이어받은 영상은 제목·설명이 직전 값으로 고정됩니다. 유튜브에서 제목을 바꿨다면 `manual` 에 적어 덮어씁니다.
> - 규칙 본체는 `scripts/lib/youtubeShowcase.mjs`, 테스트는 같은 폴더의 `youtubeShowcase.test.mjs` 입니다.
> - 그래도 재싱크 후에는 `git diff config/youtube-showcase.json` 으로 추가·삭제를 한 번 확인합니다
>   (채널의 Shorts도 일반 영상과 똑같이 들어옵니다. 빼고 싶으면 `exclude`).

## 언어별 노출 제외 (hideInLocales, HOM-25)
같은 내용의 영상이 언어별로 따로 있을 때(예: VCO 사용법 ko/ja/en 버전), 로케일마다 맞는 언어 영상만
보이게 하려면 `youtube-curation.json` 의 `hideInLocales` 에 **videoId → 숨길 로케일 배열**을 적는다.

```json
{
  "hideInLocales": {
    "fSzG6pXZx-w": ["ko", "ja"],   // 영어 영상 → en 에서만 노출
    "U12evbt9Aoo": ["ko", "en"],   // 일본어 영상 → ja 에서만 노출
    "NZf1qo6LS8w": ["en"]          // 한국어 영상 → en 에서만 숨김(ko·ja 노출)
  }
}
```
- 로케일 값: `ko` / `en` / `ja` (`jp` 아님).
- 재싱크 시 이 규칙이 `youtube-showcase.json` 각 영상의 `hideInLocales` 필드로 **구워진다**.
  렌더 시점에 `media/page.tsx` 가 `lib/showcaseVisibility.ts` 의 `visibleShowcaseVideos(videos, locale)` 로 걸러낸다.
- 영어 영상을 en·ja 에만 노출하려면 `["ko"]` 만 적는다(2026-11-03 게시 영어 영상 3건이 이 설정).
- 규칙은 curation(수동 소스)에 있으므로 **재싱크·재배포에도 리셋되지 않는다**. showcase.json 만 고치면 재싱크 때 날아간다.
- 아직 번역본이 없는 영상을 "특정 언어에서만" 노출하고 싶을 때도 동일하게 쓴다(번역 완료 후 항목 삭제).

## 자동화(나중에)
정기 갱신이 필요해지면 이 스크립트를 **GitHub Actions cron** 에서 호출 → `next build` → S3 배포로
자동화하면 됩니다(현재는 의도적으로 미설정 — 수동 실행 + 커밋 방식).

## 관련 파일
- `scripts/sync-youtube.mjs` — 동기화 스크립트(RSS 읽기·파일 쓰기)
- `scripts/lib/youtubeShowcase.mjs` — 노출 규칙(순서·제외·고정·이어받기·언어별 숨김)
- `config/youtube-curation.json` — 큐레이션 규칙(수동 편집)
- `config/youtube-showcase.json` — 생성 결과(스크립트가 덮어씀)
- `components/sections/media/ShowcaseSection.tsx` — 소비 컴포넌트
