import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/ko.json";
import { ZAPIER_CONTACT_URL } from "@/lib/contact/payload";

// scrollIntoView/scrollTo jsdom 폴리필은 vitest.setup.ts에서 전역 처리.

const trackEvent = vi.fn();
vi.mock("@/lib/analytics/track", () => ({ trackEvent: (...a: unknown[]) => trackEvent(...a) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
// SmoothScroll(lenisRef 경유 import)이 @/i18n/navigation → next-intl createNavigation을
// 끌어오는데, next-intl 내부의 bare `next/navigation` import를 vitest가 해석하지 못한다.
// 테스트 대상과 무관하므로 usePathname만 스텁으로 대체.
vi.mock("@/i18n/navigation", () => ({ usePathname: () => "/contact", useRouter: () => ({ push: vi.fn() }) }));
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

/** 개인정보 수집·이용 동의 체크박스. 라벨이 input을 감싸므로 접근성 이름으로 특정한다. */
function privacyCheckbox() {
  return screen.getByRole("checkbox", { name: /개인정보 수집/ });
}

function fillRequired() {
  fireEvent.change(screen.getByPlaceholderText("회사명"), { target: { value: "FAI" } });
  fireEvent.change(screen.getByPlaceholderText("성함"), { target: { value: "함명원" } });
  fireEvent.change(screen.getByPlaceholderText("name@example.com"), { target: { value: "a@b.com" } });
  // HOM-78 — 동의는 필수값이다. 체크하지 않으면 제출 자체가 막힌다.
  fireEvent.click(privacyCheckbox());
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

  // HOM-78 — 개인정보 수집·이용 동의는 법정 필수다. 다른 필수값이 모두 채워져도
  // 동의 없이는 전송되지 않아야 한다. 동의 체크를 폼 검증에서 빼면 이 테스트가 실패한다.
  it("필수값을 모두 채워도 개인정보 동의를 체크하지 않으면 전송하지 않고 에러를 노출한다", () => {
    renderSection();
    fireEvent.change(screen.getByPlaceholderText("회사명"), { target: { value: "FAI" } });
    fireEvent.change(screen.getByPlaceholderText("성함"), { target: { value: "함명원" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), { target: { value: "a@b.com" } });

    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
    expect(screen.getByText("개인정보 처리방침에 동의해 주세요.")).toBeInTheDocument();
  });

  // 법 제15조 제2항 — 목적·항목·보유기간을 동의 화면에 직접 표시해야 한다.
  // 링크로만 안내하면 요건을 충족하지 못한다(2026-08-06 Slack 검토 지적).
  it("동의 영역에 수집 목적·항목·보유기간이 화면에 표시된다", () => {
    renderSection();
    expect(screen.getByText("문의 접수 및 회신, 도입 상담 진행")).toBeInTheDocument();
    expect(screen.getByText("(필수) 회사명, 성함, 이메일")).toBeInTheDocument();
    expect(screen.getByText("(선택) 전화번호, 관심 제품 및 업종")).toBeInTheDocument();
    expect(screen.getByText("문의 처리 완료 후 1년")).toBeInTheDocument();
    // 제4호 거부권·불이익 고지. 목적·항목·보유기간만으로는 요건 미충족이다.
    expect(
      screen.getByText("동의를 거부하실 수 있으나, 거부 시 문의·상담 서비스 이용이 제한됩니다."),
    ).toBeInTheDocument();
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
