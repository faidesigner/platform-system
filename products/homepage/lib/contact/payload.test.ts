import { describe, it, expect } from "vitest";
import { buildContactPayload, parseUtm, zapierContactUrl } from "./payload";

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

describe("zapierContactUrl", () => {
  /**
   * `lang`은 **제출 로케일**이어야 한다.
   *
   * 예전에는 `?lang=ko`가 상수에 박혀 있어 en·ja 페이지에서 제출해도 ko로 전송됐다.
   * 전송 자체는 성공하므로(요청 200, 완료 화면 도달) 아무 오류도 보이지 않고,
   * 다운스트림에서 로케일별로 분기하면 en·ja 리드가 ko 쪽으로 흘러간다 —
   * "영문으로 제출했는데 도달하지 않았다"로 나타난다 (2026-08-31 실측 확인).
   */
  it("로케일이 lang 쿼리로 들어간다", () => {
    expect(zapierContactUrl("ko")).toBe(
      "https://hooks.zapier.com/hooks/catch/21523474/2fqxxmt/?lang=ko",
    );
    expect(zapierContactUrl("en")).toBe(
      "https://hooks.zapier.com/hooks/catch/21523474/2fqxxmt/?lang=en",
    );
    expect(zapierContactUrl("ja")).toBe(
      "https://hooks.zapier.com/hooks/catch/21523474/2fqxxmt/?lang=ja",
    );
  });

  it("훅 경로는 로케일과 무관하게 동일하다 (Zap 매핑 보존)", () => {
    const paths = (["ko", "en", "ja"] as const).map((l) => zapierContactUrl(l).split("?")[0]);
    expect(new Set(paths).size).toBe(1);
    expect(paths[0]).toBe("https://hooks.zapier.com/hooks/catch/21523474/2fqxxmt/");
  });

  it("알 수 없는 로케일은 ko로 떨어진다", () => {
    // 리드를 잃는 것보다 ko로라도 들어가는 편이 낫다.
    expect(zapierContactUrl("zz")).toContain("lang=ko");
    expect(zapierContactUrl(undefined)).toContain("lang=ko");
  });
});
