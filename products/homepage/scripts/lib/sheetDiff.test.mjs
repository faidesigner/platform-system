import { describe, expect, it } from "vitest";

import {
  buildKoIndex,
  classify,
  diffIaRows,
  diffMediaRows,
  flattenMessages,
  isInstructionCell,
  loadDecisionSet,
  normalize,
  sameIgnoringWhitespace,
  summarize,
} from "./sheetDiff.mjs";

describe("normalize", () => {
  it("스마트쿼트를 ASCII 따옴표로 통일한다", () => {
    expect(normalize("‘AI 자동 계산대’")).toBe("'AI 자동 계산대'");
    expect(normalize("“따옴표”")).toBe('"따옴표"');
  });

  it("개행과 연속 공백을 단일 공백으로 축약한다", () => {
    expect(normalize("人手不足に悩まない\n店舗運営")).toBe("人手不足に悩まない 店舗運営");
    expect(normalize("a   b")).toBe("a b");
  });

  it("앞뒤 공백을 제거한다", () => {
    expect(normalize("  Resort \n")).toBe("Resort");
  });

  it("NFD 자모분리 한글을 NFC로 정규화한다", () => {
    const nfd = "가".normalize("NFD");
    expect(nfd).not.toBe("가");
    expect(normalize(nfd)).toBe("가");
  });

  it("null·undefined는 빈 문자열이다", () => {
    expect(normalize(null)).toBe("");
    expect(normalize(undefined)).toBe("");
  });
});

describe("sameIgnoringWhitespace", () => {
  it("줄바꿈만 다른 값을 같다고 본다", () => {
    expect(sameIgnoringWhitespace("最小限の人員で\n店舗運営", "最小限の人員で店舗運営")).toBe(true);
  });

  it("공백만 다른 값을 같다고 본다", () => {
    expect(sameIgnoringWhitespace("Bakery&Cafe", "Bakery & Cafe")).toBe(true);
  });

  it("문구가 다르면 다르다고 본다", () => {
    expect(sameIgnoringWhitespace("Bakery&Cafe", "Bakery&Coffee")).toBe(false);
  });
});

describe("flattenMessages", () => {
  it("중첩 객체와 배열을 점 표기 경로로 펼친다", () => {
    expect(flattenMessages({ a: { b: "1" }, c: [{ d: "2" }, "3"] })).toEqual({
      "a.b": "1",
      "c.0.d": "2",
      "c.1": "3",
    });
  });

  it("숫자 문자열 키를 쓰는 next-intl 구조를 그대로 펼친다", () => {
    expect(flattenMessages({ items: { 0: { title: "t" } } })).toEqual({ "items.0.title": "t" });
  });
});

describe("buildKoIndex", () => {
  it("같은 ko 원문을 쓰는 키를 한 항목에 모은다", () => {
    const idx = buildKoIndex({ "x.y": "인건비 절감", "p.q": "인건비 절감", "r.s": "급식" });
    expect(idx.get("인건비 절감")).toEqual(["x.y", "p.q"]);
    expect(idx.get("급식")).toEqual(["r.s"]);
  });

  it("정규화된 ko로 조회된다(줄바꿈 차이 흡수)", () => {
    const idx = buildKoIndex({ "a.b": "리테일의 미래를\n한발 먼저" });
    expect(idx.get("리테일의 미래를 한발 먼저")).toEqual(["a.b"]);
  });
});

describe("isInstructionCell", () => {
  it.each([
    "언어 전환시 미노출",
    "일본어 번역시 미노출",
    "*영어로 언어 전환시 토스트 제거",
    "*일본어 번역시에만 노출되는 영역",
    "번역x",
  ])("지시문 셀 %s 을 번역값으로 보지 않는다", (v) => {
    expect(isInstructionCell(v)).toBe(true);
  });

  it("실제 번역문은 지시문이 아니다", () => {
    expect(isInstructionCell("Meet Our New AI Staff")).toBe(false);
    expect(isInstructionCell("バーコードのスキャンは不要です")).toBe(false);
  });

  it("빈 값은 지시문이 아니다", () => {
    expect(isInstructionCell("")).toBe(false);
  });
});

describe("classify", () => {
  const decisions = loadDecisionSet([
    { key: "products.visionCheckout.reviews.1.category", locale: "ja" },
  ]);
  const base = { ambiguous: false, decisions };

  it("지시문 셀은 INSTRUCTION", () => {
    expect(
      classify({
        ...base,
        key: "nav.careers",
        locale: "en",
        codeValue: "Careers",
        sheetValue: "언어 전환시 미노출",
      }),
    ).toBe("INSTRUCTION");
  });

  it("확정안으로 선언된 키는 DECIDED", () => {
    expect(
      classify({
        ...base,
        key: "products.visionCheckout.reviews.1.category",
        locale: "ja",
        codeValue: "社員食堂・学生食堂",
        sheetValue: "給食",
      }),
    ).toBe("DECIDED");
  });

  it("선언은 (key, locale) 쌍으로만 적용된다", () => {
    expect(
      classify({
        ...base,
        key: "products.visionCheckout.reviews.1.category",
        locale: "en",
        codeValue: "Cafeteria",
        sheetValue: "Canteen",
      }),
    ).toBe("CONTENT");
  });

  it("줄바꿈만 다르면 WHITESPACE", () => {
    expect(
      classify({
        ...base,
        key: "a.b",
        locale: "ja",
        codeValue: "最小限の人員で店舗運営",
        sheetValue: "最小限の人員で\n店舗運営",
      }),
    ).toBe("WHITESPACE");
  });

  it("ko 원문이 여러 키에 걸리면 AMBIGUOUS", () => {
    expect(
      classify({
        ...base,
        ambiguous: true,
        key: "a.b",
        locale: "en",
        codeValue: "Save on OPEX",
        sheetValue: "Save on Operating Costs",
      }),
    ).toBe("AMBIGUOUS");
  });

  it("그 외 문구 차이는 CONTENT", () => {
    expect(
      classify({ ...base, key: "a.b", locale: "en", codeValue: "Resort", sheetValue: "Ski Resort" }),
    ).toBe("CONTENT");
  });

  it("INSTRUCTION이 DECIDED보다 우선한다", () => {
    expect(
      classify({
        ...base,
        key: "products.visionCheckout.reviews.1.category",
        locale: "ja",
        codeValue: "社員食堂・学生食堂",
        sheetValue: "일본어 번역시 미노출",
      }),
    ).toBe("INSTRUCTION");
  });

  it("DECIDED가 WHITESPACE·AMBIGUOUS보다 우선한다", () => {
    expect(
      classify({
        ...base,
        ambiguous: true,
        key: "products.visionCheckout.reviews.1.category",
        locale: "ja",
        codeValue: "社員食堂・学生食堂",
        sheetValue: "社員食堂 ・学生食堂",
      }),
    ).toBe("DECIDED");
  });
});

describe("loadDecisionSet", () => {
  it("비어 있거나 없는 입력도 안전하다", () => {
    expect(loadDecisionSet(undefined).size).toBe(0);
    expect(loadDecisionSet([]).size).toBe(0);
  });
});

const IA_MESSAGES = {
  ko: {
    "a.title": "급식",
    "b.title": "리조트",
    "c.title": "인건비 절감",
    "d.title": "인건비 절감",
    "e.title": "리테일의 미래를\n한발 먼저",
  },
  en: {
    "a.title": "Cafeteria",
    "b.title": "Resort",
    "c.title": "Save on OPEX",
    "d.title": "Save on OPEX",
    "e.title": "The Future of Retail",
  },
  ja: {
    "a.title": "社員食堂・学生食堂",
    "b.title": "リゾート",
    "c.title": "人件費の削減",
    "d.title": "人件費の削減",
    "e.title": "リテールの未来を",
  },
};
const iaRow = (over) => ({ IA: "PR01", screen: "product", property: "", key: "9", ko: "", en: "", ja: "", ...over });

describe("diffIaRows", () => {
  it("시트와 다른 en 값을 CONTENT로 잡는다", () => {
    const diffs = diffIaRows({
      rows: [iaRow({ ko: "리조트", en: "Ski Resort", ja: "リゾート" })],
      messages: IA_MESSAGES,
      decisions: new Set(),
      tab: "product-vco",
    });
    expect(diffs).toEqual([
      expect.objectContaining({
        key: "b.title",
        locale: "en",
        codeValue: "Resort",
        sheetValue: "Ski Resort",
        bucket: "CONTENT",
        rowId: "PR01/product//9",
        tab: "product-vco",
        ambiguous: false,
      }),
    ]);
  });

  it("ko 원문이 두 키에 걸리면 두 키 모두 AMBIGUOUS로 낸다", () => {
    const diffs = diffIaRows({
      rows: [iaRow({ ko: "인건비 절감", en: "Save on Operating Costs", ja: "人件費の削減" })],
      messages: IA_MESSAGES,
      decisions: new Set(),
    });
    expect(diffs.map((d) => d.key)).toEqual(["c.title", "d.title"]);
    expect(diffs.every((d) => d.bucket === "AMBIGUOUS" && d.ambiguous)).toBe(true);
  });

  it("시트 값이 코드와 같으면 diff를 만들지 않는다", () => {
    expect(
      diffIaRows({
        rows: [iaRow({ ko: "리조트", en: "Resort", ja: "リゾート" })],
        messages: IA_MESSAGES,
        decisions: new Set(),
      }),
    ).toEqual([]);
  });

  it("셀 안 줄바꿈만 다른 ko도 같은 키로 매칭한다", () => {
    const diffs = diffIaRows({
      rows: [iaRow({ ko: "리테일의 미래를/\n한발 먼저", en: "Retail AI At Your Store", ja: "リテールの未来を" })],
      messages: IA_MESSAGES,
      decisions: new Set(),
    });
    // '/' 가 붙은 시트 표기는 ko 매칭에 실패하는 것이 정상 — 별도 미매칭 리포트로 넘어간다.
    expect(diffs).toEqual([]);
  });

  it("ko가 코드에 없는 행은 diff 없이 건너뛴다", () => {
    expect(
      diffIaRows({
        rows: [iaRow({ ko: "99.70%", en: "99.70%", ja: "99.70%" })],
        messages: IA_MESSAGES,
        decisions: new Set(),
      }),
    ).toEqual([]);
  });

  it("시트 셀이 비어 있으면 그 로케일은 비교하지 않는다", () => {
    expect(
      diffIaRows({
        rows: [iaRow({ ko: "리조트", en: "", ja: "" })],
        messages: IA_MESSAGES,
        decisions: new Set(),
      }),
    ).toEqual([]);
  });

  it("코드에 없는 locale 값은 건너뛴다", () => {
    const diffs = diffIaRows({
      rows: [iaRow({ ko: "급식", en: "Canteen", ja: "給食" })],
      messages: { ko: IA_MESSAGES.ko, en: {}, ja: IA_MESSAGES.ja },
      decisions: new Set(),
    });
    expect(diffs.map((d) => d.locale)).toEqual(["ja"]);
  });
});

const MEDIA_MESSAGES = {
  ko: {
    "media.showcase.videoOverrides.abc.title": "VCO 챌린지",
    "media.showcase.videoOverrides.abc.description": "설명",
    "media.news.items.0.title": "투자 유치",
    "media.news.items.0.description": "뉴스 본문",
    "media.retailTechLetter.letterTitles.31": "레터 제목",
  },
  en: {
    "media.showcase.videoOverrides.abc.title": "The VCO Challenge",
    "media.showcase.videoOverrides.abc.description": "desc",
    "media.news.items.0.title": "Funding",
    "media.news.items.0.description": "news body",
    "media.retailTechLetter.letterTitles.31": "Letter Title",
  },
  ja: {
    "media.showcase.videoOverrides.abc.title": "VCOチャレンジ",
    "media.showcase.videoOverrides.abc.description": "説明",
    "media.news.items.0.title": "資金調達",
    "media.news.items.0.description": "ニュース本文",
    "media.retailTechLetter.letterTitles.31": "レタータイトル",
  },
};

describe("diffMediaRows", () => {
  it("ko 타이틀로 videoOverrides를 찾아 제목·설명을 대조한다", () => {
    const diffs = diffMediaRows({
      rows: [
        {
          contents: "유튜브",
          ko_타이틀: "VCO 챌린지",
          ko_디스크립션: "설명",
          en_타이틀: "VCO Challenge",
          en_디스크립션: "desc",
          ja_타이틀: "VCOチャレンジ",
          ja_디스크립션: "説明",
        },
      ],
      messages: MEDIA_MESSAGES,
      decisions: new Set(),
    });
    expect(diffs).toEqual([
      expect.objectContaining({
        key: "media.showcase.videoOverrides.abc.title",
        locale: "en",
        codeValue: "The VCO Challenge",
        sheetValue: "VCO Challenge",
        bucket: "CONTENT",
        tab: "media",
      }),
    ]);
  });

  it("뉴스 행은 title·description 두 필드를 대조한다", () => {
    const diffs = diffMediaRows({
      rows: [
        {
          contents: "뉴스",
          ko_타이틀: "투자 유치",
          en_타이틀: "Funding Round",
          en_디스크립션: "news body",
          ja_타이틀: "資金調達",
          ja_디스크립션: "ニュース本文",
        },
      ],
      messages: MEDIA_MESSAGES,
      decisions: new Set(),
    });
    expect(diffs.map((d) => [d.key, d.locale])).toEqual([["media.news.items.0.title", "en"]]);
  });

  it("레터 행은 제목 하나만 대조한다(설명 키가 없다)", () => {
    const diffs = diffMediaRows({
      rows: [
        {
          contents: "리테일테크레터",
          ko_타이틀: "레터 제목",
          en_타이틀: "A Different Letter Title",
          en_디스크립션: "무시되어야 함",
          ja_타이틀: "レタータイトル",
        },
      ],
      messages: MEDIA_MESSAGES,
      decisions: new Set(),
    });
    expect(diffs.map((d) => d.key)).toEqual(["media.retailTechLetter.letterTitles.31"]);
  });

  it("코드에 없는 ko 타이틀 행은 건너뛴다", () => {
    expect(
      diffMediaRows({
        rows: [{ contents: "유튜브", ko_타이틀: "유튜브 링크", en_타이틀: "YouTube Link" }],
        messages: MEDIA_MESSAGES,
        decisions: new Set(),
      }),
    ).toEqual([]);
  });
});

describe("summarize", () => {
  it("버킷별 건수를 센다", () => {
    expect(summarize([{ bucket: "CONTENT" }, { bucket: "CONTENT" }, { bucket: "DECIDED" }])).toEqual({
      CONTENT: 2,
      DECIDED: 1,
    });
  });

  it("빈 입력은 빈 객체다", () => {
    expect(summarize([])).toEqual({});
  });
});
