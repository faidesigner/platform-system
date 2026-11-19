import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";

import letterData from "./retail-tech-letter.json";
import showcase from "./youtube-showcase.json";

/**
 * 외부 동기화 콘텐츠(Stibee 레터·유튜브 쇼케이스)와 messages 사이의 어긋남을 잡는다.
 *
 * 레터 제목은 id 로 번역을 얹는데, 번역이 없으면 media/page.tsx 가 한글 원문으로 폴백한다.
 * 화면은 깨지지 않으니 아무도 모른 채 en·ja 에 한글 제목이 나간다(2026-11-19: 32~35호).
 */
const LOCALES = { ko, en, ja } as const;
const HANGUL = /[가-힣]/;

describe("Retail Tech Letter ↔ messages", () => {
  const ids = letterData.letters.map((l) => l.id);

  it.each(Object.keys(LOCALES))("%s: 모든 레터에 제목 번역이 있다", (locale) => {
    const titles = LOCALES[locale as keyof typeof LOCALES].media.retailTechLetter
      .letterTitles as Record<string, string>;
    const missing = ids.filter((id) => !titles[id]?.trim());
    expect(missing).toEqual([]);
  });

  it.each(["en", "ja"])("%s: 제목에 한글이 섞여 있지 않다", (locale) => {
    const titles = LOCALES[locale as keyof typeof LOCALES].media.retailTechLetter
      .letterTitles as Record<string, string>;
    const leaked = ids.filter((id) => HANGUL.test(titles[id] ?? ""));
    expect(leaked).toEqual([]);
  });

  it("모든 레터에 썸네일과 링크가 있다", () => {
    const broken = letterData.letters.filter(
      (l) => !l.thumbnailUrl?.startsWith("https://") || !l.url.startsWith("https://"),
    );
    expect(broken.map((l) => l.id)).toEqual([]);
  });

  it("레터는 최신순이고 id 가 겹치지 않는다", () => {
    const dates = letterData.letters.map((l) => l.publishedAt);
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("유튜브 쇼케이스 데이터", () => {
  it("videoId 가 겹치지 않고 필수 필드가 비어 있지 않다", () => {
    const videoIds = showcase.videos.map((v) => v.videoId);
    expect(new Set(videoIds).size).toBe(videoIds.length);
    const broken = showcase.videos.filter((v) => !v.videoId || !v.title?.trim() || !v.href);
    expect(broken).toEqual([]);
  });

  it("hideInLocales 값은 ko/en/ja 뿐이고, 어느 로케일에서도 쇼케이스가 비지 않는다", () => {
    const videos = showcase.videos as { videoId: string; hideInLocales?: string[] }[];
    const bad = videos.filter((v) => (v.hideInLocales ?? []).some((l) => !(l in LOCALES)));
    expect(bad.map((v) => v.videoId)).toEqual([]);
    for (const locale of Object.keys(LOCALES)) {
      const visible = videos.filter((v) => !(v.hideInLocales ?? []).includes(locale));
      expect(visible.length, locale).toBeGreaterThan(0);
    }
  });
});
