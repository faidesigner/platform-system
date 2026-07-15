import { describe, it, expect } from "vitest";
import { visibleShowcaseVideos, type ShowcaseVideoVisibility } from "./showcaseVisibility";

// 언어별 노출 제외 규칙(HOM-25): 유튜브 쇼케이스 영상은 videoId별로 특정 로케일에서 숨길 수 있다.
// 예) 영어 소개영상은 en에만, 일본어 사용법은 ja에만 노출.
const v = (videoId: string, hideInLocales?: string[]): ShowcaseVideoVisibility => ({
  videoId,
  hideInLocales,
});

describe("visibleShowcaseVideos", () => {
  it("hideInLocales가 없으면 모든 로케일에서 노출된다", () => {
    const videos = [v("plain")];
    expect(visibleShowcaseVideos(videos, "ko")).toEqual(videos);
    expect(visibleShowcaseVideos(videos, "en")).toEqual(videos);
    expect(visibleShowcaseVideos(videos, "ja")).toEqual(videos);
  });

  it("현재 로케일이 hideInLocales에 있으면 제외한다", () => {
    // 영어 소개영상: ko/ja에서 숨김 → en에서만 노출
    const en = v("fSzG6pXZx-w", ["ko", "ja"]);
    expect(visibleShowcaseVideos([en], "ko")).toEqual([]);
    expect(visibleShowcaseVideos([en], "ja")).toEqual([]);
    expect(visibleShowcaseVideos([en], "en")).toEqual([en]);
  });

  it("일본어/한국어 영상 규칙을 로케일별로 정확히 가른다", () => {
    const ja = v("U12evbt9Aoo", ["ko", "en"]); // 일본어 → ja에만
    const ko = v("NZf1qo6LS8w", ["en"]); // 한국어 → en에서만 제외(ko·ja 노출)
    const all = [ja, ko];
    expect(visibleShowcaseVideos(all, "ko")).toEqual([ko]);
    expect(visibleShowcaseVideos(all, "en")).toEqual([]);
    expect(visibleShowcaseVideos(all, "ja")).toEqual([ja, ko]); // 의도된 ja 동시노출
  });

  it("순서를 보존하고 원본 배열을 변형하지 않는다", () => {
    const videos = [v("a"), v("b", ["ko"]), v("c")];
    const result = visibleShowcaseVideos(videos, "ko");
    expect(result.map((x) => x.videoId)).toEqual(["a", "c"]);
    expect(videos).toHaveLength(3); // 원본 불변
  });

  it("빈 hideInLocales 배열은 노출로 취급한다", () => {
    const videos = [v("x", [])];
    expect(visibleShowcaseVideos(videos, "ko")).toEqual(videos);
  });
});
