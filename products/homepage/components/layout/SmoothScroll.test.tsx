import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

// Lenis를 스텁으로 대체해 scrollTo 호출 시점을 관측한다.
// (실제 Lenis는 자체 RAF 루프를 돌려 즉시 scrollTo를 덮어쓰므로, 여기서는 그 경합을
//  구조적으로 재현하는 대신 "top 스크롤이 동기 호출인지 rAF 지연 호출인지"만 검증한다.)
const scrollToMock = vi.fn();
const resizeMock = vi.fn();
vi.mock("lenis", () => ({
  default: class {
    scrollTo = scrollToMock;
    resize = resizeMock;
    raf = vi.fn();
    destroy = vi.fn();
  },
}));

// 일반 네비게이션 경로(해시 없음) → decideScrollAction이 { type: 'top' }을 반환하는 케이스.
vi.mock("@/i18n/navigation", () => ({ usePathname: () => "/products" }));
vi.mock("@/lib/localeScroll", () => ({ consumeLocaleSwitchScroll: () => null }));

import SmoothScroll from "./SmoothScroll";

// requestAnimationFrame을 수동 플러시 큐로 대체 — 콜백이 "언제" 실행되는지 통제한다.
let rafQueue: FrameRequestCallback[] = [];
const flushRaf = () => {
  const q = rafQueue;
  rafQueue = [];
  q.forEach((cb) => cb(0));
};

beforeEach(() => {
  rafQueue = [];
  scrollToMock.mockClear();
  resizeMock.mockClear();
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    rafQueue.push(cb);
    return rafQueue.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("SmoothScroll — 라우트 전환 최상단 포커싱 (HOM-20)", () => {
  it("회귀: 일반 네비게이션의 top 스크롤은 동기 호출이 아니라 rAF로 지연돼야 한다 (Lenis RAF 경합 방지)", () => {
    render(
      <SmoothScroll>
        <div />
      </SmoothScroll>,
    );

    // 마운트 직후(effect 실행 완료) — 아직 rAF 미플러시.
    // 동기로 scrollTo(0)이 호출됐다면 Lenis RAF 루프에 덮어써져 재발한다 → 금지.
    expect(scrollToMock).not.toHaveBeenCalledWith(0, expect.objectContaining({ immediate: true }));

    // 다음 애니메이션 프레임에 비로소 최상단 스크롤이 적용돼야 한다.
    flushRaf();
    expect(scrollToMock).toHaveBeenCalledWith(0, expect.objectContaining({ immediate: true }));
  });
});
