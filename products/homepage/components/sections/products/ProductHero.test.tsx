import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render } from "@testing-library/react";

import ProductHero from "./ProductHero";

vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "ko" }),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/lib/analytics/track", () => ({ trackEvent: vi.fn() }));

/**
 * HOM-109 — 히어로 배경 영상의 뷰포트 분기.
 *
 * ⚠️ `<source media>`에 기대면 안 된다. **iOS Safari(WebKit)는 video의 `<source media>`를 무시**하고
 * 첫 source를 고르지 않는다 — 2026-09-30 배포본이 iPhone 393px에서도 데스크톱 영상을 틀었다
 * (Playwright WebKit 실측, QA 신고 "iOS는 모바일 영상이 안 나오고 갤럭시만 나온다").
 * 그래서 matchMedia로 고른 경로를 video의 `src`에 직접 넣는다. 이 테스트는 그 방식을 고정한다.
 */
type Listener = (e: { matches: boolean }) => void;
function mockMatchMedia(initial: boolean) {
  const listeners: Listener[] = [];
  const mql = {
    matches: initial,
    media: "(max-width: 767px) and (orientation: portrait)",
    addEventListener: (_: string, l: Listener) => listeners.push(l),
    removeEventListener: (_: string, l: Listener) => listeners.splice(listeners.indexOf(l), 1),
  };
  const spy = vi.fn().mockReturnValue(mql);
  vi.stubGlobal("matchMedia", spy);
  return {
    spy,
    change(matches: boolean) {
      mql.matches = matches;
      listeners.forEach((l) => l({ matches }));
    },
  };
}

const props = { subtitle: "s", title: "t", ctaLabel: "" };
const videoSrc = (c: HTMLElement) => c.querySelector("video")?.getAttribute("src") ?? null;

afterEach(() => vi.unstubAllGlobals());

describe("ProductHero 배경 영상", () => {
  it("폰 세로(≤767px·portrait)면 모바일 영상을 video src로 직접 건다 (source media 미사용)", () => {
    const mm = mockMatchMedia(true);
    const { container } = render(
      <ProductHero {...props} videoSrc="/videos/d.mp4" mobileVideoSrc="/videos/m.mp4" />,
    );
    expect(mm.spy).toHaveBeenCalledWith("(max-width: 767px) and (orientation: portrait)");
    expect(videoSrc(container)).toBe("/videos/m.mp4");
    expect(container.querySelector("video source")).toBeNull();
  });

  it("그 밖(태블릿·폰 가로·데스크톱)이면 기본 영상을 건다", () => {
    mockMatchMedia(false);
    const { container } = render(
      <ProductHero {...props} videoSrc="/videos/d.mp4" mobileVideoSrc="/videos/m.mp4" />,
    );
    expect(videoSrc(container)).toBe("/videos/d.mp4");
  });

  it("회전 등으로 조건이 바뀌면 영상을 바꾼다", () => {
    const mm = mockMatchMedia(false);
    const { container } = render(
      <ProductHero {...props} videoSrc="/videos/d.mp4" mobileVideoSrc="/videos/m.mp4" />,
    );
    act(() => mm.change(true));
    expect(videoSrc(container)).toBe("/videos/m.mp4");
  });

  it("모바일 영상이 없으면 matchMedia 없이 기본 영상을 바로 건다", () => {
    const mm = mockMatchMedia(true);
    const { container } = render(<ProductHero {...props} videoSrc="/videos/d.mp4" />);
    expect(videoSrc(container)).toBe("/videos/d.mp4");
    expect(mm.spy).not.toHaveBeenCalled();
  });

  it("자체 호스팅 경로가 없으면 video를 렌더하지 않는다", () => {
    const { container } = render(<ProductHero {...props} videoSrc="MISSING_FROM_DESIGN" />);
    expect(container.querySelector("video")).toBeNull();
  });
});
