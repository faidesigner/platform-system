import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * van 랜딩(public/contact-van-vco.html) 하단 고정 바의 iPhone safe-area 대응.
 *
 * 하단 바는 `position:fixed; bottom:0` 이다. iPhone 에서 Safari 툴바가 접히거나 인앱 브라우저
 * (카카오톡·인스타그램 — 광고 유입 대부분)로 열리면 페이지가 화면 맨 아래까지 내려가고,
 * 홈 인디케이터가 바닥에서 8~13px 높이에 그려진다. 아래 여백이 16px 고정이면 버튼과 인디케이터
 * 사이가 3px 남짓이라 버튼 아랫부분 탭이 홈 제스처와 겹친다.
 *
 * 베이커리 랜딩에서 같은 부류의 문제(아래 여백 0)를 고친 날(2026-11-19) 함께 맞췄다.
 * 베이커리 쪽 규칙은 tests/bakeryLandingSlides.test.ts 가 고정한다.
 */
const html = readFileSync(join(__dirname, "..", "public", "contact-van-vco.html"), "utf-8");
const css = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));

/** `selector { ... }` 블록 본문들을 이어 붙인다(같은 선택자가 여러 번 선언돼 있어도 전부 본다). */
const block = (selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...css.matchAll(new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`, "g"))]
    .map((m) => m[1])
    .join("\n");
};
const decl = (body: string, prop: string) =>
  body.match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*([^;]+);`))?.[1].trim() ?? "";

describe("van 랜딩 하단 고정 바 safe-area", () => {
  it("viewport-fit=cover 가 있다(없으면 env(safe-area-inset-*) 가 항상 0 이다)", () => {
    expect(html).toMatch(/<meta name="viewport"[^>]*viewport-fit=cover/);
  });

  it("하단 바 아래 여백 = 기본 16px + safe-area-inset-bottom", () => {
    expect(decl(block(".bottom-bar"), "padding")).toBe(
      "12px 20px calc(16px + env(safe-area-inset-bottom, 0px))",
    );
  });

  it("하단 바에 가려지지 않도록 푸터 여백도 safe-area 만큼 늘린다", () => {
    expect(decl(block("footer"), "margin-bottom")).toBe("calc(90px + env(safe-area-inset-bottom, 0px))");
  });

  // viewport-fit=cover 를 켜면 가로 모드에서 본문이 노치 밑으로 들어간다.
  // cover 를 켜기 전(auto)과 같은 모습이 되도록 좌우는 body 에서 되돌린다.
  it("가로 모드 노치 영역은 body 좌우 여백으로 피한다", () => {
    const body = block("body");
    expect(decl(body, "padding-left")).toBe("env(safe-area-inset-left, 0px)");
    expect(decl(body, "padding-right")).toBe("env(safe-area-inset-right, 0px)");
  });
});
