import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TabletDrawerMenu } from "@fai/ui/components/navigation/TabletDrawerMenu";

/**
 * HOM-68 회귀 방지 — 태블릿·모바일 드로어의 채용 항목.
 *
 * 드로어는 데스크톱 navItems를 재사용하지 않고 자체적으로 항목을 렌더한다.
 * 따라서 데스크톱에서 채용을 제외해도 드로어에는 그대로 남는 구멍이 생긴다 —
 * 이 테스트가 그 경로를 따로 고정한다.
 */
vi.mock("next/navigation", () => ({ useParams: () => ({ locale: "ja" }) }));

const LABELS = {
  products: "제품",
  about: "회사소개",
  media: "미디어",
  careers: "채용",
  contact: "문의하기",
};

describe("TabletDrawerMenu 채용 항목 (HOM-68)", () => {
  it("showCareers=false면 채용 항목을 렌더하지 않는다", () => {
    render(<TabletDrawerMenu labels={LABELS} showCareers={false} />);
    expect(screen.queryByText("채용")).toBeNull();
    // 나머지 항목은 그대로 남아야 한다.
    expect(screen.getByText("회사소개")).toBeTruthy();
    expect(screen.getByText("문의하기")).toBeTruthy();
  });

  it("showCareers=true면 채용 항목을 외부 링크로 렌더한다", () => {
    render(<TabletDrawerMenu labels={LABELS} showCareers={true} />);
    const careers = screen.getByText("채용").closest("a");
    expect(careers).toBeTruthy();
    expect(careers?.getAttribute("href")).toContain("greetinghr.com");
  });

  it("showCareers 미지정 시 기존 동작(노출)을 유지한다", () => {
    render(<TabletDrawerMenu labels={LABELS} />);
    expect(screen.getByText("채용")).toBeTruthy();
  });
});
