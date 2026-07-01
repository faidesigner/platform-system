import { describe, it, expect } from "vitest";
import { buildEvent } from "./events";

describe("buildEvent", () => {
  it("이벤트명과 파라미터를 그대로 payload로 조립한다", () => {
    expect(
      buildEvent("lead_acquisition_click", { location: "home_cta_banner", label: "도입 문의하기" }),
    ).toEqual({
      name: "lead_acquisition_click",
      params: { location: "home_cta_banner", label: "도입 문의하기" },
    });
  });

  it("interest_click도 동일 규격으로 조립한다", () => {
    expect(buildEvent("interest_click", { location: "nav", label: "제품" })).toEqual({
      name: "interest_click",
      params: { location: "nav", label: "제품" },
    });
  });
});
