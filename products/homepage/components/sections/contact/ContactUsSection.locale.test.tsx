import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import koMessages from "@/messages/ko.json";
import enMessages from "@/messages/en.json";
import jaMessages from "@/messages/ja.json";

/**
 * HOM-72 회귀 방지 — 문의 페이지 하단 상담 토스트의 로케일별 채널.
 *
 * ko는 카카오톡, ja는 LINE, en은 상담 채널이 없어 토스트 자체를 노출하지 않는다.
 * 토스트는 데스크톱(≥421px)·모바일(≤420px) 두 벌로 렌더되므로 양쪽 앵커를 모두 확인한다.
 */

vi.mock("@/lib/analytics/track", () => ({ trackEvent: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/contact",
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@fai/ui/components/common/Icon/IcRequiredDot", () => ({ IcRequiredDot: () => null }));
vi.mock("@fai/ui/components/CustomerSupportGraphic", () => ({ CustomerSupportGraphic: () => null }));

import { ContactUsSection } from "./ContactUsSection";

const MESSAGES = { ko: koMessages, en: enMessages, ja: jaMessages } as const;

function renderAt(locale: keyof typeof MESSAGES) {
  return render(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      <ContactUsSection />
    </NextIntlClientProvider>,
  );
}

/** 상담 토스트 CTA 앵커만 추린다(폼 내부 개인정보 링크 등 다른 앵커 제외). */
function chatAnchors(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll("a[target='_blank']")).filter((a) =>
    /pf\.kakao\.com|lin\.ee/.test(a.getAttribute("href") ?? ""),
  ) as HTMLAnchorElement[];
}

describe("ContactUsSection 상담 토스트 채널 (HOM-72)", () => {
  it("ko는 카카오톡 채널로 연결한다", () => {
    const { container } = renderAt("ko");
    const anchors = chatAnchors(container);
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) {
      expect(a.getAttribute("href")).toBe("http://pf.kakao.com/_cZLcn");
    }
  });

  it("ja는 LINE 링크로 연결한다 (카카오 링크가 남으면 안 된다)", () => {
    const { container } = renderAt("ja");
    const anchors = chatAnchors(container);
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) {
      expect(a.getAttribute("href")).toBe("https://lin.ee/7sWaw8t");
    }
    expect(container.innerHTML).not.toContain("pf.kakao.com");
  });

  it("en은 상담 토스트를 렌더하지 않는다", () => {
    const { container } = renderAt("en");
    expect(chatAnchors(container)).toHaveLength(0);
    expect(container.innerHTML).not.toContain("pf.kakao.com");
    expect(container.innerHTML).not.toContain("lin.ee");
  });

  it("토스트를 노출하는 로케일에서는 문의 폼이 함께 보인다 (토스트 숨김이 폼을 가리지 않는다)", () => {
    for (const locale of ["ko", "en", "ja"] as const) {
      const { container, unmount } = renderAt(locale);
      expect(container.querySelector("form")).toBeTruthy();
      unmount();
    }
    expect(screen.queryByText("__never__")).toBeNull();
  });
});
