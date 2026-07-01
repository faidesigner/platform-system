import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({ sendGAEvent: (...a: unknown[]) => sendGAEvent(...a) }));

import { trackEvent } from "./track";

describe("trackEvent", () => {
  beforeEach(() => sendGAEvent.mockClear());

  it("sendGAEvent를 'event', 이벤트명, 파라미터 순으로 호출한다", () => {
    trackEvent("inquiry_complete", { location: "contact_form", label: "문의하기" });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "inquiry_complete", {
      location: "contact_form",
      label: "문의하기",
    });
  });

  describe("SSR / GA 미로드 환경", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("window가 없으면 sendGAEvent를 호출하지 않고 에러 없이 no-op으로 종료한다", () => {
      vi.stubGlobal("window", undefined);

      expect(() =>
        trackEvent("inquiry_complete", { location: "contact_form", label: "문의하기" })
      ).not.toThrow();
      expect(sendGAEvent).not.toHaveBeenCalled();
    });
  });
});
