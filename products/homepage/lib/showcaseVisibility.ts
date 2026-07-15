/**
 * 유튜브 쇼케이스 영상의 언어별 노출 제어 (HOM-25).
 *
 * 규칙 소스는 config/youtube-curation.json 의 `hideInLocales`(videoId → 숨길 로케일 배열)이고,
 * sync-youtube.mjs 가 이를 각 영상 항목의 `hideInLocales` 필드로 config/youtube-showcase.json 에
 * 구워 넣는다. 이 순수 함수가 렌더 시점(media/page.tsx)에 현재 로케일 기준으로 최종 노출 목록을 거른다.
 *
 * 규칙을 curation(수동 소스)에 두고 sync가 showcase로 전파하므로 재싱크·재배포에도 리셋되지 않는다.
 */
export interface ShowcaseVideoVisibility {
  videoId: string;
  /** 이 로케일 목록에서는 숨긴다. 없거나 비어 있으면 모든 로케일 노출. */
  hideInLocales?: string[];
}

/** 현재 로케일에서 노출할 영상만 남긴다(순서 보존, 원본 불변). */
export function visibleShowcaseVideos<T extends ShowcaseVideoVisibility>(
  videos: readonly T[],
  locale: string,
): T[] {
  return videos.filter((v) => !(v.hideInLocales ?? []).includes(locale));
}
