import { describe, it, expect } from "vitest";
import { buildNavItems, CAREERS_URL } from "./navItems";

/**
 * HOM-68 회귀 방지 — 채용 메뉴는 ko에서만 노출한다.
 *
 * 채용 정보는 한국 채용 페이지(greetinghr)만 존재하므로 en/ja 방문자에게 노출하면
 * 한국어 전용 외부 사이트로 내보내게 된다. 데스크톱 메가메뉴는 이 빌더가 만든 navItems를,
 * 태블릿·모바일 드로어는 TabletDrawerMenu의 showCareers prop을 각각 경유하므로 두 경로 모두 고정한다.
 */

const LABELS = {
  products: "제품",
  about: "회사소개",
  media: "미디어",
  careers: "채용",
};

describe("buildNavItems (HOM-68)", () => {
  it("showCareers=true면 채용 항목을 마지막에 포함한다", () => {
    const items = buildNavItems(LABELS, { showCareers: true });
    expect(items.map((i) => i.label)).toEqual(["제품", "회사소개", "미디어", "채용"]);
  });

  it("showCareers=false면 채용 항목을 제외한다", () => {
    const items = buildNavItems(LABELS, { showCareers: false });
    expect(items.map((i) => i.label)).toEqual(["제품", "회사소개", "미디어"]);
    expect(items.some((i) => i.href === CAREERS_URL)).toBe(false);
  });

  it("채용 항목은 새 창으로 여는 외부 링크다", () => {
    const careers = buildNavItems(LABELS, { showCareers: true }).at(-1)!;
    expect(careers.external).toBe(true);
    expect(careers.href).toBe(CAREERS_URL);
  });

  it("채용 노출 여부와 무관하게 제품 항목은 메가메뉴 패널을 유지한다", () => {
    for (const showCareers of [true, false]) {
      const products = buildNavItems(LABELS, { showCareers, megaMenuPanel: "PANEL" })[0];
      expect(products.dropdown).toBe(true);
      expect(products.megaMenuPanel).toBe("PANEL");
    }
  });
});
