import { describe, it, expect, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";

/**
 * 무인매장 3열 카드 타이틀 정렬 회귀 방지 (QA 2026-08-31 "카드 3개 세로 정렬 어긋남").
 *
 * 원래는 en 첫 카드 문구가 `Save on / Operating Costs` 2줄이라 첫 카드만
 * `items-center` + 음수 좌우 마진을 특례로 줬다. 2줄이면 2줄 높이 박스 안에서
 * center == start라 티가 안 났다. 그런데 시트 갱신으로 문구가 `Save on Costs` 1줄이 되자
 * **첫 카드 제목만 세로 가운데**로 내려와 2·3번과 어긋났다.
 *
 * 즉 인덱스에 특례를 박은 레이아웃이 문구 길이에 결합돼 있었던 것이 원인이다.
 * 이 테스트는 세 카드 제목이 **동일한 정렬 클래스**를 갖도록 강제한다 —
 * 문구가 몇 줄이 되든 특정 인덱스만 다르게 취급하지 않는다.
 */

vi.mock("@fai/ui/components/common/Icon/EffectGraphic", () => ({ default: () => null }));

import StoreEffects from "./StoreEffects";

beforeAll(() => {
  // jsdom에 IntersectionObserver가 없다 — 관찰만 no-op으로 받는다.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const CARDS = [
  { title: "Save on Costs", description: "Staff smarter", icon: "cost" },
  { title: "AI Checkout", description: "Nothing to scan", icon: "checkout" },
  { title: "Remote Operation", description: "Monitor from anywhere", icon: "remote" },
];

describe("StoreEffects 3열 카드 타이틀", () => {
  it("세 카드 제목이 동일한 클래스로 렌더된다 (인덱스 특례 없음)", () => {
    const { container } = render(
      <StoreEffects title="What Can You Expect?" cards={CARDS} list={[]} />,
    );
    const headings = Array.from(container.querySelectorAll("h3"));
    expect(headings).toHaveLength(3);
    const classes = headings.map((h) => h.className);
    expect(new Set(classes).size).toBe(1);
  });

  it("제목에 인라인 style로 개행 정책을 따로 주지 않는다", () => {
    const { container } = render(
      <StoreEffects title="What Can You Expect?" cards={CARDS} list={[]} />,
    );
    for (const h of Array.from(container.querySelectorAll("h3"))) {
      expect(h.getAttribute("style")).toBeNull();
    }
  });

  it("카드 폭을 밀어내는 음수 마진 특례가 남아 있지 않다", () => {
    const { container } = render(
      <StoreEffects title="What Can You Expect?" cards={CARDS} list={[]} />,
    );
    expect(container.innerHTML).not.toMatch(/-mx-/);
  });
});
