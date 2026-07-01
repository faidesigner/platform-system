import { describe, it, expect, vi, beforeEach } from "vitest";

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
});
