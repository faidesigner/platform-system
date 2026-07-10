import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

// @fai/ui 배럴은 SVG 임포트를 끌어와 vitest에서 해석 불가 → 스와이프 검증에 무관하므로 최소 스텁.
vi.mock("@fai/ui", () => ({
  IcoTxtButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  IconButton: (props: { "aria-label"?: string; onClick?: () => void }) => (
    <button aria-label={props["aria-label"]} onClick={props.onClick} />
  ),
  ProgressBar: () => <div data-testid="progressbar" />,
}));
vi.mock("@fai/ui/components/common/Icon/SocialIcon", () => ({ default: () => null }));
vi.mock("next/image", () => ({
  default: (p: { alt?: string }) => <img alt={p.alt ?? ""} />,
}));
vi.mock("@/lib/analytics/track", () => ({ trackEvent: vi.fn() }));

import MediaShowcaseSection from "./ShowcaseSection";

const videos = [
  { videoId: "a", title: "VIDEO_A", description: "da", thumbnailAlt: "A", href: "#a" },
  { videoId: "b", title: "VIDEO_B", description: "db", thumbnailAlt: "B", href: "#b" },
];

const a11y = {
  prevVideo: "prev",
  nextVideo: "next",
  goToVideoTemplate: "go {index}",
  followAriaLabelTemplate: "follow {label}",
};

function renderSection() {
  return render(
    <MediaShowcaseSection
      title="미디어"
      channelLabel="YouTube"
      ctaLabel="더 알아보기"
      videos={videos}
      socials={[]}
      a11y={a11y}
    />,
  );
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** 썸네일 컨테이너(onTouch 핸들러 보유)로 이벤트가 버블되도록 내부 img에서 발화. */
function swipe(dxFromTo: [number, number]) {
  const img = screen.getAllByRole("img")[0];
  fireEvent.touchStart(img, { touches: [{ clientX: dxFromTo[0] }] });
  fireEvent.touchEnd(img, { changedTouches: [{ clientX: dxFromTo[1] }] });
  // 슬라이드 완료 setTimeout(ANIM_MS=400) 이후 index 갱신
  act(() => vi.advanceTimersByTime(400));
}

describe("ShowcaseSection 모바일 스와이프 (HOM-33)", () => {
  it("← 스와이프(왼쪽으로)하면 다음 영상으로 전환", () => {
    renderSection();
    expect(screen.getByText("VIDEO_A")).toBeInTheDocument();
    swipe([300, 100]); // dx=-200 → next
    expect(screen.getByText("VIDEO_B")).toBeInTheDocument();
  });

  it("→ 스와이프(오른쪽으로)하면 이전 영상으로 전환(wrap)", () => {
    renderSection();
    swipe([100, 300]); // dx=+200 → prev → wrap to 마지막(VIDEO_B)
    expect(screen.getByText("VIDEO_B")).toBeInTheDocument();
  });

  it("임계값(40px) 미만 이동은 무시", () => {
    renderSection();
    swipe([200, 180]); // dx=-20 → 무시
    expect(screen.getByText("VIDEO_A")).toBeInTheDocument();
  });
});
