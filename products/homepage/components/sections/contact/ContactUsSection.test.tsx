import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// jsdom은 scrollIntoView/scrollTo를 구현하지 않아 검증 실패 경로(폼 스크롤)에서
// "Not implemented" 예외를 던진다. 테스트 대상(inquiry_complete 발화)과 무관한
// jsdom 환경 한계이므로 no-op으로 폴리필한다.
Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn();

const trackEvent = vi.fn();
vi.mock("@/lib/analytics/track", () => ({ trackEvent: (...a: unknown[]) => trackEvent(...a) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
// SVGR 임포트(.svg → 컴포넌트)는 Next 빌드 전용 변환이라 Vite/jsdom에서 해석 불가 —
// 테스트 대상(inquiry_complete 발화)과 무관한 순수 아이콘이므로 최소 스텁으로 대체.
vi.mock("@fai/ui/components/common/Icon/IcRequiredDot", () => ({
  IcRequiredDot: () => null,
}));
vi.mock("@fai/ui/components/CustomerSupportGraphic", () => ({
  CustomerSupportGraphic: () => null,
}));

import { ContactUsSection } from "./ContactUsSection";

describe("ContactUsSection inquiry_complete", () => {
  beforeEach(() => trackEvent.mockClear());

  it("검증 실패(빈 폼)면 발화하지 않는다", () => {
    render(<ContactUsSection />);
    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("필수값 입력 후 제출하면 inquiry_complete를 발화한다", () => {
    render(<ContactUsSection />);
    fireEvent.change(screen.getByPlaceholderText("회사명"), { target: { value: "FAI" } });
    fireEvent.change(screen.getByPlaceholderText("성함"), { target: { value: "함명원" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));
    expect(trackEvent).toHaveBeenCalledWith("inquiry_complete", { location: "contact_form", label: "문의하기" });
  });
});
