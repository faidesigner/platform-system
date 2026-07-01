import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/ko.json";
import { ZAPIER_CONTACT_URL } from "@/lib/contact/payload";

// scrollIntoView/scrollTo jsdom 폴리필은 vitest.setup.ts에서 전역 처리.

const trackEvent = vi.fn();
vi.mock("@/lib/analytics/track", () => ({ trackEvent: (...a: unknown[]) => trackEvent(...a) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
// SVGR 임포트(.svg → 컴포넌트)는 Next 빌드 전용 변환이라 Vite/jsdom에서 해석 불가 —
// 테스트 대상과 무관한 순수 아이콘이므로 최소 스텁으로 대체.
vi.mock("@fai/ui/components/common/Icon/IcRequiredDot", () => ({
  IcRequiredDot: () => null,
}));
vi.mock("@fai/ui/components/CustomerSupportGraphic", () => ({
  CustomerSupportGraphic: () => null,
}));

const fetchMock = vi.fn(() => Promise.resolve({ ok: true } as Response));

import { ContactUsSection } from "./ContactUsSection";

// ContactUsSection이 useTranslations를 호출하므로 intl 컨텍스트 필수.
// ko 메시지로 감싸면 기존 한국어 문자열 단언이 그대로 통과.
function renderSection() {
  return render(
    <NextIntlClientProvider locale="ko" messages={messages}>
      <ContactUsSection />
    </NextIntlClientProvider>,
  );
}

function fillRequired() {
  fireEvent.change(screen.getByPlaceholderText("회사명"), { target: { value: "FAI" } });
  fireEvent.change(screen.getByPlaceholderText("성함"), { target: { value: "함명원" } });
  fireEvent.change(screen.getByPlaceholderText("name@example.com"), { target: { value: "a@b.com" } });
}

describe("ContactUsSection 제출", () => {
  beforeEach(() => {
    trackEvent.mockClear();
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("검증 실패(빈 폼)면 Zapier 전송도 inquiry_complete도 하지 않는다", () => {
    renderSection();
    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("필수값 입력 후 제출하면 Zapier 웹훅으로 규격대로 전송하고 inquiry_complete를 발화한다", async () => {
    renderSection();
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(ZAPIER_CONTACT_URL);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/x-www-form-urlencoded",
    );
    // body는 form-urlencoded content-type이지만 내용은 JSON 문자열(Zap 계약).
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      company: "FAI",
      name: "함명원",
      email: "a@b.com",
      solution: [],
      option: [],
    });

    await waitFor(() =>
      expect(trackEvent).toHaveBeenCalledWith("inquiry_complete", {
        location: "contact_form",
        label: "문의하기",
      }),
    );
  });
});
