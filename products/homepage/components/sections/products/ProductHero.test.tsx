import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

import ProductHero from "./ProductHero";

vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "ko" }),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/lib/analytics/track", () => ({ trackEvent: vi.fn() }));

/**
 * HOM-109 — 히어로 배경 영상의 뷰포트 분기.
 *
 * `<source media>`로 브라우저가 **하나만** 골라 받게 한다. JS(matchMedia)로 src를 바꾸면
 * 정적 HTML에 영상이 없다가 hydration 뒤에 붙고, 잘못 짜면 두 파일을 모두 받는다.
 * 브라우저는 첫 번째로 일치하는 `<source>`를 쓰므로 **모바일 source가 먼저**여야 한다 —
 * 순서가 뒤집히면 media 없는 기본 source가 항상 이겨서 모바일 분기가 조용히 죽는다.
 */
const props = { subtitle: "s", title: "t", ctaLabel: "" };
const sources = (c: HTMLElement) =>
  [...c.querySelectorAll("video source")].map((s) => ({
    src: s.getAttribute("src"),
    media: s.getAttribute("media"),
  }));

describe("ProductHero 배경 영상", () => {
  it("모바일 영상이 있으면 ≤420px source를 기본 source보다 먼저 둔다", () => {
    const { container } = render(
      <ProductHero {...props} videoSrc="/videos/d.mp4" mobileVideoSrc="/videos/m.mp4" />,
    );
    expect(sources(container)).toEqual([
      { src: "/videos/m.mp4", media: "(max-width: 420px)" },
      { src: "/videos/d.mp4", media: null },
    ]);
  });

  it("모바일 영상이 없으면 기본 source 하나만 둔다", () => {
    const { container } = render(<ProductHero {...props} videoSrc="/videos/d.mp4" />);
    expect(sources(container)).toEqual([{ src: "/videos/d.mp4", media: null }]);
  });

  it("자체 호스팅 경로가 없으면 video를 렌더하지 않는다", () => {
    const { container } = render(<ProductHero {...props} videoSrc="MISSING_FROM_DESIGN" />);
    expect(container.querySelector("video")).toBeNull();
  });
});
