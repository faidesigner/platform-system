import { describe, expect, it } from "vitest";

import {
  buildKoIndex,
  classify,
  flattenMessages,
  isInstructionCell,
  loadDecisionSet,
  normalize,
  sameIgnoringWhitespace,
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
