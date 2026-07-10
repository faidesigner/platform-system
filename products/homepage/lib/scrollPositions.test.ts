import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  saveScrollPosition,
  readScrollPosition,
  samePath,
  classifyPop,
  decideScrollAction,
  clampScrollY,
  retryDone,
  applyScroll,
  SCROLL_CAP,
} from "./scrollPositions";

/**
 * 스크롤 복원 순수 로직 단위 테스트 (HOM-37).
 * DOM/라우팅에서 분리된 로직이므로 100% 커버.
 */

beforeEach(() => {
  sessionStorage.clear();
});

describe("saveScrollPosition / readScrollPosition", () => {
  it("왕복 저장·조회", () => {
    saveScrollPosition("/media", 320);
    expect(readScrollPosition("/media")).toBe(320);
  });

  it("없는 url → null", () => {
    expect(readScrollPosition("/nope")).toBeNull();
  });

  it("무효값(NaN) → null", () => {
    sessionStorage.setItem("fai:scrollPositions", JSON.stringify({ "/x": "abc" }));
    expect(readScrollPosition("/x")).toBeNull();
  });

  it("항목 수 상한 초과 시 오래된 것부터 제거", () => {
    for (let i = 0; i < SCROLL_CAP + 5; i++) saveScrollPosition(`/p${i}`, i);
    // 가장 오래된 5개는 제거됨
    expect(readScrollPosition("/p0")).toBeNull();
    expect(readScrollPosition("/p4")).toBeNull();
    // 최근 것은 유지
    expect(readScrollPosition(`/p${SCROLL_CAP + 4}`)).toBe(SCROLL_CAP + 4);
  });

  it("기존 url 재저장 시 최신으로 이동해 상한에서 살아남음", () => {
    saveScrollPosition("/keep", 10);
    for (let i = 0; i < SCROLL_CAP; i++) saveScrollPosition(`/q${i}`, i);
    saveScrollPosition("/keep", 99); // 다시 최신화
    for (let i = SCROLL_CAP; i < SCROLL_CAP + 5; i++) saveScrollPosition(`/q${i}`, i);
    expect(readScrollPosition("/keep")).toBe(99);
  });

  it("storage 예외를 삼킨다(throw 없음)", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => saveScrollPosition("/x", 1)).not.toThrow();
    spy.mockRestore();
  });
});

describe("samePath", () => {
  it("해시 차이 무시", () => {
    expect(samePath("/media", "/media#reviews")).toBe(true);
  });
  it("search 차이 무시", () => {
    expect(samePath("/media?a=1", "/media?b=2")).toBe(true);
  });
  it("pathname 차이 구분", () => {
    expect(samePath("/media", "/about")).toBe(false);
  });
});

describe("classifyPop", () => {
  it("pathname 동일 → hash-only", () => {
    expect(classifyPop("/media#a", "/media")).toBe("hash-only");
  });
  it("pathname 변경 → path-change", () => {
    expect(classifyPop("/about", "/media")).toBe("path-change");
  });
});

describe("decideScrollAction", () => {
  const base = {
    isFirstRun: false,
    navType: "navigate" as string | undefined,
    pendingPopMatches: false,
    localeY: null as number | null,
    hash: "",
    savedY: null as number | null,
  };

  it("1) 일반 push → top", () => {
    expect(decideScrollAction(base)).toEqual({ type: "top" });
  });

  it("2) pathname 변경 pop → 저장 위치 복원", () => {
    expect(decideScrollAction({ ...base, pendingPopMatches: true, savedY: 540 })).toEqual({
      type: "restore",
      y: 540,
    });
  });

  it("3) 회귀: 해시 전용 pop 직후 push → top (pendingPop 미설정)", () => {
    // 해시 전용 pop은 pendingPop을 설정하지 않으므로 이어지는 push는 pendingPopMatches=false
    expect(decideScrollAction({ ...base, pendingPopMatches: false, hash: "" })).toEqual({
      type: "top",
    });
  });

  it("6) 첫 마운트 back_forward → 복원 / navigate → 미복원(top)", () => {
    expect(
      decideScrollAction({ ...base, isFirstRun: true, navType: "back_forward", savedY: 200 }),
    ).toEqual({ type: "restore", y: 200 });
    expect(decideScrollAction({ ...base, isFirstRun: true, navType: "navigate" })).toEqual({
      type: "top",
    });
  });

  it("저장값 없는 복원은 0으로 폴백", () => {
    expect(
      decideScrollAction({ ...base, pendingPopMatches: true, savedY: null }),
    ).toEqual({ type: "restore", y: 0 });
  });

  it("언어 전환(localeY) → 복원 (pendingPop 없을 때)", () => {
    expect(decideScrollAction({ ...base, localeY: 88 })).toEqual({ type: "restore", y: 88 });
  });

  it("해시 앵커 → anchor", () => {
    expect(decideScrollAction({ ...base, hash: "#reviews" })).toEqual({
      type: "anchor",
      hash: "#reviews",
    });
  });

  it("우선순위: pendingPop이 localeY·hash보다 우선", () => {
    expect(
      decideScrollAction({ ...base, pendingPopMatches: true, savedY: 5, localeY: 9, hash: "#x" }),
    ).toEqual({ type: "restore", y: 5 });
  });
});

describe("clampScrollY / retryDone", () => {
  it("clamp: 음수·초과 클램프", () => {
    expect(clampScrollY(-10, 500)).toBe(0);
    expect(clampScrollY(600, 500)).toBe(500);
    expect(clampScrollY(300, 500)).toBe(300);
    expect(clampScrollY(300, -5)).toBe(0); // maxY 음수 → 0
  });

  it("4) 콘텐츠 높이 미달이면 재시도 계속, 도달·상한이면 종료", () => {
    expect(retryDone(100, 300, 0, 10)).toBe(false); // maxY<target, 재시도
    expect(retryDone(300, 300, 0, 10)).toBe(true); // 도달
    expect(retryDone(100, 300, 10, 10)).toBe(true); // 상한 도달
  });
});

describe("applyScroll (5) Lenis 폴백", () => {
  it("Lenis 있으면 lenis.scrollTo 사용", () => {
    const lenis = { resize: vi.fn(), scrollTo: vi.fn() };
    const win = { scrollTo: vi.fn() };
    applyScroll(250, lenis, win);
    expect(lenis.scrollTo).toHaveBeenCalledWith(250, { immediate: true });
    expect(win.scrollTo).not.toHaveBeenCalled();
  });

  it("Lenis 없으면 window.scrollTo 폴백", () => {
    const win = { scrollTo: vi.fn() };
    applyScroll(250, null, win);
    expect(win.scrollTo).toHaveBeenCalledWith(0, 250);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
