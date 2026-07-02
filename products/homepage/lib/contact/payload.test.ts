import { describe, it, expect } from "vitest";
import { buildContactPayload, parseUtm, ZAPIER_CONTACT_URL } from "./payload";

describe("parseUtm", () => {
  it("URL 쿼리에서 utm_* 파라미터를 추출하고 없는 값은 빈 문자열로 채운다", () => {
    expect(parseUtm("?utm_source=google&utm_medium=cpc&utm_campaign=spring")).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring",
      utm_content: "",
      utm_term: "",
    });
  });

  it("쿼리가 비어도 모든 utm 키를 빈 문자열로 반환한다", () => {
    expect(parseUtm("")).toEqual({
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
    });
  });
});

describe("buildContactPayload", () => {
  it("VCO 세부 관심 → solution=['vision checkout'], content에 세부 라벨을 담는다", () => {
    const p = buildContactPayload({
      values: { company: "FAI", name: "함명원", email: "a@b.com", phone: "010" },
      interests: { bakery: true, catering: true },
      utm: { utm_source: "google", utm_medium: "cpc" },
      referrer: "https://ref",
    });
    expect(p).toEqual({
      company: "FAI",
      name: "함명원",
      email: "a@b.com",
      phone: "010",
      solution: ["vision checkout"],
      option: [],
      content: "관심 제품: VISION CHECK-OUT(베이커리, 급식)",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      referrer: "https://ref",
    });
  });

  it("VCO + MICRO STORE 혼합 → solution 고정 순서로 배열, content에 두 라인 모두", () => {
    const p = buildContactPayload({
      values: { company: "FAI", name: "홍", email: "h@b.com" },
      interests: { bakery: true, "micro-store": true },
    });
    expect(p.solution).toEqual(["vision checkout", "micro store"]);
    expect(p.content).toBe("관심 제품: VISION CHECK-OUT(베이커리), MICRO STORE");
    expect(p.phone).toBe("");
  });

  it("standard-store 단독 → solution=['standard store'], content=STANDARD STORE", () => {
    const p = buildContactPayload({
      values: { company: "C", name: "N", email: "e@e.com" },
      interests: { "standard-store": true },
    });
    expect(p.solution).toEqual(["standard store"]);
    expect(p.content).toBe("관심 제품: STANDARD STORE");
  });

  it("관심사 미선택 → solution=[], content=''", () => {
    const p = buildContactPayload({
      values: { company: "C", name: "N", email: "e@e.com" },
      interests: {},
    });
    expect(p.solution).toEqual([]);
    expect(p.content).toBe("");
    expect(p.option).toEqual([]);
  });
});

describe("ZAPIER_CONTACT_URL", () => {
  it("라이브 contact-us와 동일한 Zapier catch hook", () => {
    expect(ZAPIER_CONTACT_URL).toBe(
      "https://hooks.zapier.com/hooks/catch/21523474/2fqxxmt/?lang=ko",
    );
  });
});
