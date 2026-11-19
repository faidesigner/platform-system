import { describe, expect, it } from "vitest";

import { buildLetters } from "./stibeeLetters.mjs";

const PUB = "https://faindersai.stibee.com";
const api = (id, publishedAt, extra = {}) => ({ id, title: `레터 ${id}`, previewText: "", publishedAt, ...extra });
const prev = (id, publishedAt, thumbnailUrl) => ({
  id: String(id),
  title: `레터 ${id}`,
  previewText: "",
  publishedAt,
  url: `${PUB}/p/${id}`,
  ...(thumbnailUrl ? { thumbnailUrl } : {}),
});

describe("buildLetters", () => {
  it("publishedAt 최신순으로 정렬하고 id·url을 문자열로 만든다", () => {
    const r = buildLetters({
      items: [api(1, "2026-01-01"), api(3, "2026-03-01"), api(2, "2026-02-01")],
      previous: [],
      publication: PUB,
    });
    expect(r.letters.map((l) => l.id)).toEqual(["3", "2", "1"]);
    expect(r.letters[0].url).toBe(`${PUB}/p/3`);
  });

  it("id나 title이 없는 항목은 버리고 title·previewText 공백을 다듬는다", () => {
    const r = buildLetters({
      items: [api(1, "2026-01-01", { title: "  제목  ", previewText: " " }), { id: 2 }, { title: "id 없음" }],
      previous: [],
      publication: PUB,
    });
    expect(r.letters).toHaveLength(1);
    expect(r.letters[0]).toMatchObject({ title: "제목", previewText: "" });
  });

  it("직전 JSON에 수동 입력된 썸네일을 id로 보존한다", () => {
    const r = buildLetters({
      items: [api(1, "2026-01-01"), api(2, "2026-02-01")],
      previous: [prev(2, "2026-02-01", "https://img/b.png"), prev(1, "2026-01-01", "https://img/a.png")],
      publication: PUB,
    });
    expect(r.letters.map((l) => l.thumbnailUrl)).toEqual(["https://img/b.png", "https://img/a.png"]);
    expect(r.defaulted).toEqual([]);
  });

  // 2026-11-19: 32~35호가 썸네일 없이 들어와 카드 4장만 이미지가 비는 상태로 배포될 뻔했다.
  // Stibee API는 썸네일을 주지 않으므로, 새 레터는 가장 최근 기존 레터의 배너를 물려받는다.
  it("새 레터는 직전 최신 레터의 썸네일을 물려받고 defaulted로 알린다", () => {
    const r = buildLetters({
      items: [api(1, "2026-01-01"), api(2, "2026-02-01"), api(3, "2026-03-01"), api(4, "2026-04-01")],
      previous: [prev(1, "2026-01-01", "https://img/old.png"), prev(2, "2026-02-01", "https://img/latest.png")],
      publication: PUB,
    });
    const by = Object.fromEntries(r.letters.map((l) => [l.id, l.thumbnailUrl]));
    expect(by).toEqual({
      4: "https://img/latest.png",
      3: "https://img/latest.png",
      2: "https://img/latest.png",
      1: "https://img/old.png",
    });
    expect(r.defaulted).toEqual(["4", "3"]);
  });

  it("직전 JSON의 순서와 무관하게 publishedAt이 가장 늦은 레터의 썸네일을 기본값으로 쓴다", () => {
    const r = buildLetters({
      items: [api(9, "2026-09-01")],
      previous: [prev(1, "2026-01-01", "https://img/old.png"), prev(2, "2026-02-01", "https://img/latest.png")],
      publication: PUB,
    });
    expect(r.letters[0].thumbnailUrl).toBe("https://img/latest.png");
  });

  it("물려받을 썸네일이 하나도 없으면 thumbnailUrl 없이 두고 defaulted에도 넣지 않는다", () => {
    const r = buildLetters({ items: [api(1, "2026-01-01")], previous: [], publication: PUB });
    expect("thumbnailUrl" in r.letters[0]).toBe(false);
    expect(r.defaulted).toEqual([]);
    expect(r.missingThumb).toEqual(["1"]);
  });

  it("limit이 있으면 최신 것부터 그 개수만 남긴다", () => {
    const r = buildLetters({
      items: [api(1, "2026-01-01"), api(2, "2026-02-01"), api(3, "2026-03-01")],
      previous: [],
      publication: PUB,
      limit: 2,
    });
    expect(r.letters.map((l) => l.id)).toEqual(["3", "2"]);
  });
});
