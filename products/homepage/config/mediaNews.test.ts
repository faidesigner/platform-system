import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "@/config/site";
import ko from "@/messages/ko.json";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";

/**
 * 미디어 페이지 "FAI News" 목록의 config ↔ messages 정합성.
 *
 * `app/[locale]/media/page.tsx` 는 `siteConfig.media.items[i]` 에 `media.news.items.<i>.*` 번역을
 * **인덱스**로 붙인다. 기사를 config 에만 넣거나 messages 에서 한 칸 밀리면 빌드는 통과하고
 * 모든 기사의 제목이 다른 기사의 썸네일·링크에 붙는다. 화면에서는 눈으로 대조해야만 보이므로
 * 여기서 고정한다.
 */
const ROOT = join(__dirname, "..");
const items = siteConfig.media.items;
const TEXT_FIELDS = ["title", "description", "thumbnailAlt"] as const;

type NewsText = Record<(typeof TEXT_FIELDS)[number], string>;
const LOCALES: Record<string, Record<string, NewsText>> = {
  ko: ko.media.news.items,
  en: en.media.news.items,
  ja: ja.media.news.items,
};

describe("FAI News: config ↔ messages 정합성", () => {
  it("검사할 기사가 있다", () => {
    expect(items.length).toBeGreaterThan(0);
  });

  it.each(Object.keys(LOCALES))("%s 의 항목 키가 config 인덱스(0..n-1)와 정확히 같다", (locale) => {
    const expected = items.map((_, i) => String(i));
    expect(Object.keys(LOCALES[locale])).toEqual(expected);
  });

  it.each(Object.keys(LOCALES))("%s 의 모든 항목에 title·description·thumbnailAlt 가 채워져 있다", (locale) => {
    const empty: string[] = [];
    items.forEach((_, i) => {
      for (const field of TEXT_FIELDS) {
        const value = LOCALES[locale][String(i)]?.[field];
        if (typeof value !== "string" || value.trim() === "") empty.push(`${locale}.${i}.${field}`);
      }
    });
    expect(empty).toEqual([]);
  });

  it("ko 의 title 이 같은 인덱스의 config title 과 일치한다 (한 칸 밀림 방지)", () => {
    const mismatched = items
      .map((item, i) => ({ i, config: item.title, ko: LOCALES.ko[String(i)]?.title }))
      .filter((row) => row.config !== row.ko);
    expect(mismatched).toEqual([]);
  });
});

describe("FAI News: config 항목", () => {
  it("date 가 YYYY-MM-DD 형식이고 내림차순이다", () => {
    const dates = items.map((item) => item.date);
    for (const date of dates) expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("모든 thumbnail 파일이 public/ 에 있고 배포 제외 패턴(_original)이 아니다", () => {
    const broken = items
      .map((item) => item.thumbnail)
      .filter((src) => src.includes("_original") || !existsSync(join(ROOT, "public", src)));
    expect(broken).toEqual([]);
  });

  it("href 가 중복되지 않는다 (같은 기사 이중 등록 방지)", () => {
    const hrefs = items.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
