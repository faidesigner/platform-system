import { describe, expect, it } from "vitest";

import { buildShowcase } from "./youtubeShowcase.mjs";

const v = (videoId, extra = {}) => ({
  videoId,
  title: `title-${videoId}`,
  description: "",
  thumbnailAlt: `title-${videoId}`,
  href: `https://www.youtube.com/watch?v=${videoId}`,
  ...extra,
});
const curation = (over = {}) => ({
  exclude: [],
  pinned: [],
  hideInLocales: {},
  manual: [],
  limit: null,
  ...over,
});
const ids = (result) => result.videos.map((x) => x.videoId);

describe("buildShowcase", () => {
  it("RSS 최신순을 그대로 노출한다", () => {
    const r = buildShowcase({ rss: [v("a"), v("b")], curation: curation(), previous: [] });
    expect(ids(r)).toEqual(["a", "b"]);
    expect(r.carried).toEqual([]);
  });

  // 2026-11-19: 신규 15개가 올라오자 RSS 창(최신 15개) 밖으로 밀린 기존 6개가
  // 재싱크에서 소리 없이 빠질 뻔했다(HOM-25와 같은 원인). 빠지는 것은 exclude로만 한다.
  it("RSS 창 밖으로 밀린 직전 영상은 조용히 빠지지 않고 유지된다", () => {
    const r = buildShowcase({
      rss: [v("new1"), v("new2")],
      curation: curation(),
      previous: [v("old1"), v("old2")],
    });
    expect(ids(r)).toEqual(["new1", "new2", "old1", "old2"]);
    expect(r.carried).toEqual(["old1", "old2"]);
  });

  it("유지되는 영상은 직전 데이터(제목·설명)를 그대로 쓴다", () => {
    const r = buildShowcase({
      rss: [v("new1")],
      curation: curation(),
      previous: [v("old1", { title: "옛 제목", description: "옛 설명" })],
    });
    expect(r.videos[1]).toMatchObject({ videoId: "old1", title: "옛 제목", description: "옛 설명" });
  });

  it("exclude에 넣은 영상은 RSS·manual·직전 데이터 어디에 있든 빠진다", () => {
    const r = buildShowcase({
      rss: [v("a"), v("x1")],
      curation: curation({ exclude: ["x1", "x2", "x3"], manual: [v("x3")] }),
      previous: [v("x2"), v("keep")],
    });
    expect(ids(r)).toEqual(["a", "keep"]);
    expect(r.carried).toEqual(["keep"]);
  });

  it("직전 영상과 manual 전용 영상은 직전 순서를 유지한다", () => {
    const r = buildShowcase({
      rss: [v("new1")],
      curation: curation({ manual: [v("m1"), v("m2")] }),
      previous: [v("old1"), v("m1"), v("old2"), v("m2")],
    });
    expect(ids(r)).toEqual(["new1", "old1", "m1", "old2", "m2"]);
    // manual에 있는 것은 "밀려난 영상"이 아니다
    expect(r.carried).toEqual(["old1", "old2"]);
  });

  it("직전 데이터에 없던 manual 영상은 맨 뒤에 붙는다", () => {
    const r = buildShowcase({
      rss: [v("new1")],
      curation: curation({ manual: [v("m-new")] }),
      previous: [v("old1")],
    });
    expect(ids(r)).toEqual(["new1", "old1", "m-new"]);
  });

  it("같은 videoId가 RSS와 manual에 모두 있으면 manual 필드가 우선한다", () => {
    const r = buildShowcase({
      rss: [v("a", { title: "RSS 제목" })],
      curation: curation({ manual: [{ videoId: "a", title: "수동 제목" }] }),
      previous: [],
    });
    expect(r.videos).toHaveLength(1);
    expect(r.videos[0]).toMatchObject({
      title: "수동 제목",
      thumbnailAlt: "수동 제목",
      href: "https://www.youtube.com/watch?v=a",
    });
  });

  it("pinned는 지정 순서대로 맨 앞에 온다(유지되는 영상도 고정 가능)", () => {
    const r = buildShowcase({
      rss: [v("a"), v("b")],
      curation: curation({ pinned: ["old1", "b", "없는id"] }),
      previous: [v("old1")],
    });
    expect(ids(r)).toEqual(["old1", "b", "a"]);
  });

  it("hideInLocales 규칙을 영상에 구워 넣고, 규칙이 없어진 영상에서는 지운다", () => {
    const r = buildShowcase({
      rss: [v("a"), v("b")],
      curation: curation({ hideInLocales: { a: ["ko"], old1: ["ja"] } }),
      previous: [v("old1"), v("old2", { hideInLocales: ["en"] })],
    });
    const by = Object.fromEntries(r.videos.map((x) => [x.videoId, x]));
    expect(by.a.hideInLocales).toEqual(["ko"]);
    expect(by.b.hideInLocales).toBeUndefined();
    expect(by.old1.hideInLocales).toEqual(["ja"]);
    expect("hideInLocales" in by.old2).toBe(false);
  });

  it("limit이 있으면 앞에서부터 그 개수만 남긴다", () => {
    const r = buildShowcase({
      rss: [v("a"), v("b")],
      curation: curation({ limit: 3 }),
      previous: [v("old1"), v("old2")],
    });
    expect(ids(r)).toEqual(["a", "b", "old1"]);
  });

  it("같은 영상이 두 번 나오지 않는다", () => {
    const r = buildShowcase({
      rss: [v("a"), v("b")],
      curation: curation({ manual: [v("b")], pinned: ["a"] }),
      previous: [v("a"), v("b")],
    });
    expect(ids(r)).toEqual(["a", "b"]);
  });
});
