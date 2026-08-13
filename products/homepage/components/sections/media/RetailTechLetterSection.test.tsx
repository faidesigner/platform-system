import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RetailTechLetterSection from "./RetailTechLetterSection";

/**
 * HOM-76 회귀 방지 — 리테일테크 레터 구독 CTA는 ja에서 숨긴다(일본 BD팀 요청).
 * 구독 CTA만 사라져야 하며 지난 레터 목록은 모든 로케일에서 그대로 보여야 한다.
 */

const LETTERS = [
  {
    id: "12",
    title: "리테일 테크 레터 12호",
    previewText: "미리보기",
    publishedAt: "2026-06-25T11:00:00Z",
    url: "https://stibee.example/12",
  },
];

const BASE = {
  title: "리테일 테크 레터",
  ctaLabel: "새로운 레터 구독하기",
  moreLabel: "더보기",
  url: "https://stibee.example/subscribe",
  letters: LETTERS,
};

describe("RetailTechLetterSection 구독 CTA (HOM-76)", () => {
  it("showSubscribeCta=false면 구독 CTA를 렌더하지 않는다", () => {
    render(<RetailTechLetterSection {...BASE} showSubscribeCta={false} />);
    expect(screen.queryByText("새로운 레터 구독하기")).toBeNull();
  });

  it("구독 CTA를 숨겨도 지난 레터 목록과 제목은 그대로 노출한다", () => {
    render(<RetailTechLetterSection {...BASE} showSubscribeCta={false} />);
    expect(screen.getByText("리테일 테크 레터")).toBeTruthy();
    expect(screen.getByText("리테일 테크 레터 12호")).toBeTruthy();
  });

  it("showSubscribeCta=true면 구독 CTA를 구독 URL로 연결한다", () => {
    render(<RetailTechLetterSection {...BASE} showSubscribeCta={true} />);
    const cta = screen.getByText("새로운 레터 구독하기").closest("a");
    expect(cta?.getAttribute("href")).toBe(BASE.url);
  });

  it("showSubscribeCta 미지정 시 기존 동작(노출)을 유지한다", () => {
    render(<RetailTechLetterSection {...BASE} />);
    expect(screen.getByText("새로운 레터 구독하기")).toBeTruthy();
  });
});
