import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Snap from "lenis/snap";

// Slack #prj_homepage 2026-07-28 리포트: VCO 히어로 확장 이후 스크롤이 간헐적으로 멈춰
// Why FAI 섹션으로 못 넘어가는 버그의 회귀 테스트.
//
// 원인: distanceThreshold("30%")는 lenis/snap 내부에서 "뷰포트 높이의 30%"로 계산되는데,
// Hero 섹션의 실제 스크롤 range(h-180vh - 100vh = 80vh)에 비해 이 값이 훨씬 커서, 펼침
// snap 지점(EXPANDED_STOP) 이후 남은 free-scroll 구간의 상당 부분(재현 시 최대 75%)이
// "가까운 snap으로 되돌리는" 존에 들어간다. 감쇄성 스크롤(트랙패드/휠 관성)이 이 존 안에서
// 멈추면 500ms 뒤 debounce된 onSnap이 펼침 지점으로 강제로 되돌린다 — 사용자 눈에는
// "스크롤이 안 먹는다"로 보인다. (수치는 실제 Playwright 재현: innerHeight=900 기준
// pointB=360, threshold=270, sectionEnd=720 → 360~630 구간 전체가 되돌림 존.)
//
// 수정(HeroSection.tsx): scrollYProgress가 EXPANDED_STOP을 지나는 순간 snap.stop()을 호출해
// 이후 자유 스크롤을 보장하고, 다시 접힘 방향으로 내려올 때 snap.start()로 재활성화한다.
// 이 테스트는 그 "지나간 뒤 stop() 호출" 부수효과가 실제 lenis/snap 동작에 대해 유효한지를
// (mock이 아니라 실제 라이브러리로) 검증한다.

const INNER_HEIGHT = 900;
const POINT_A = 0;
const POINT_B = 360; // el.offsetTop(0) + range(720) * EXPANDED_STOP(0.5)

type Listener = (payload: unknown) => void;

function createFakeLenis() {
  let scroll = 0;
  const listeners = new Map<string, Listener[]>();
  return {
    get scroll() {
      return scroll;
    },
    isHorizontal: false,
    on(event: string, cb: Listener) {
      const arr = listeners.get(event) ?? [];
      arr.push(cb);
      listeners.set(event, arr);
    },
    off(event: string, cb: Listener) {
      listeners.set(event, (listeners.get(event) ?? []).filter((l) => l !== cb));
    },
    scrollTo(value: number, opts?: { onComplete?: () => void }) {
      // 테스트에서는 lenis의 자체 애니메이션(duration)을 생략하고 즉시 도달로 취급.
      scroll = value;
      opts?.onComplete?.();
    },
    emit(event: string, payload: unknown) {
      listeners.get(event)?.forEach((cb) => cb(payload));
    },
    setScroll(v: number) {
      scroll = v;
    },
  };
}

describe("HeroSection — VCO 확장 이후 스크롤 멈춤 회귀 (Slack #prj_homepage 2026-07-28)", () => {
  let lenis: ReturnType<typeof createFakeLenis>;
  let snap: Snap;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("innerHeight", INNER_HEIGHT);
    lenis = createFakeLenis();
    // HeroSection.tsx의 build()와 동일한 구성.
    snap = new Snap(lenis as never, {
      type: "proximity",
      distanceThreshold: "30%",
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    snap.add(POINT_A);
    snap.add(POINT_B);
  });

  afterEach(() => {
    snap.destroy();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("재현: snap이 켜진 채로 방치하면(수정 전) 펼침 지점을 지난 감쇄성 스크롤이 다시 펼침 지점으로 되돌려진다", () => {
    lenis.setScroll(516); // 펼침 지점(360)을 지나 진행하다 감쇄된 상태
    lenis.emit("virtual-scroll", { deltaY: 0, deltaX: 0, event: { type: "wheel" } });

    vi.advanceTimersByTime(600); // onSnap debounce(500ms) 경과

    expect(lenis.scroll).toBe(POINT_B); // 버그: 516 → 360으로 강제 후퇴
  });

  it("회귀: 펼침 지점을 지나는 시점에 snap.stop()을 호출하면 이후 감쇄성 스크롤이 되돌려지지 않는다", () => {
    lenis.setScroll(516);
    // HeroSection의 scrollYProgress 리스너가 v>=EXPANDED_STOP을 감지해 호출하는 것과 동일한 시점.
    snap.stop();

    lenis.emit("virtual-scroll", { deltaY: 0, deltaX: 0, event: { type: "wheel" } });
    vi.advanceTimersByTime(600);

    expect(lenis.scroll).toBe(516); // 고정: stop() 이후 onSnap이 즉시 무시되어 값이 그대로 유지
  });

  it("회귀: 접힘 방향으로 되돌아오면 snap.start()로 재활성화되어 접힘 snap이 다시 동작한다", () => {
    snap.stop(); // 펼침 지점을 지나 released 상태였다고 가정
    lenis.setScroll(100); // 접힘 방향으로 복귀 중 감쇄 (접힘 지점 0에 더 가까운 위치)
    snap.start(); // HeroSection 리스너가 v<EXPANDED_STOP 복귀를 감지해 호출

    lenis.emit("virtual-scroll", { deltaY: 0, deltaX: 0, event: { type: "wheel" } });
    vi.advanceTimersByTime(600);

    expect(lenis.scroll).toBe(POINT_A); // 접힘 snap이 정상적으로 재작동
  });
});
