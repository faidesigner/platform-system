import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * 베이커리 랜딩(public/contact-bakery-vco.html) 본문 슬라이드.
 *
 * 본문은 디자인팀이 준 세로 긴 시안(1000×14813, v0.5 3차 · Slack 2026-11-18)을 섹션 경계에서
 * 8장으로 자른 이미지다. 시안이 곧 스펙이므로 장수·치수를 그대로 고정한다.
 *
 * 이전에는 7장이 HTML 안에 base64 로 박혀 있어 HTML 하나가 529KB 였고, loading="lazy" 가
 * 아무 일도 하지 않았다(이미 HTML 과 함께 다 받는다). 광고 유입 페이지라 첫 화면 속도가
 * 전환에 직접 걸리므로 파일로 분리했고, 다시 inline 으로 돌아가지 않도록 여기서 막는다.
 */
const PUBLIC = join(__dirname, "..", "public");
const html = readFileSync(join(PUBLIC, "contact-bakery-vco.html"), "utf-8");

/** 시안의 섹션 높이(px, 폭 1000 기준). 배경색이 바뀌는 지점에서 잘랐다. */
const DESIGN_WIDTH = 1000;
const DESIGN_SECTION_HEIGHTS = [1957, 1723, 1683, 2875, 1066, 1987, 1583, 1939];

const slidesBlock = html.slice(html.indexOf('<div class="slides"'), html.indexOf("<!-- Page 8"));
const imgs = [...slidesBlock.matchAll(/<img\b[^>]*>/g)].map((m) => {
  const tag = m[0];
  const attr = (name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
  return {
    src: attr("src") ?? "",
    alt: attr("alt") ?? "",
    width: Number(attr("width")),
    height: Number(attr("height")),
    loading: attr("loading"),
    fetchpriority: attr("fetchpriority"),
  };
});

/** 무손실·알파 없는 WebP(VP8) 헤더에서 실제 픽셀 크기를 읽는다. */
function webpSize(file: string) {
  const b = readFileSync(file);
  expect(b.toString("ascii", 0, 4)).toBe("RIFF");
  expect(b.toString("ascii", 12, 16), "손실 WebP(VP8)가 아니다").toBe("VP8 ");
  return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
}

describe("베이커리 랜딩 본문 슬라이드", () => {
  it("시안의 8개 섹션이 순서대로 들어 있다", () => {
    expect(imgs.map((i) => i.src)).toEqual(
      DESIGN_SECTION_HEIGHTS.map((_, n) => `/images/landing/bakery-v05/${String(n + 1).padStart(2, "0")}.webp`),
    );
  });

  it("이미지를 HTML 에 inline(base64) 하지 않는다", () => {
    expect(slidesBlock).not.toContain("data:image");
    // 본문을 뺀 HTML(스타일·폼·스크립트)은 60KB 를 넘을 이유가 없다.
    expect(statSync(join(PUBLIC, "contact-bakery-vco.html")).size).toBeLessThan(60_000);
  });

  it("각 이미지의 width·height 속성이 시안 치수·실제 파일 크기와 같다", () => {
    imgs.forEach((img, n) => {
      const file = join(PUBLIC, img.src);
      expect(existsSync(file), `${img.src} 파일이 없다`).toBe(true);
      expect({ width: img.width, height: img.height }, img.src).toEqual({
        width: DESIGN_WIDTH,
        height: DESIGN_SECTION_HEIGHTS[n],
      });
      expect(webpSize(file), `${img.src} 실제 크기`).toEqual({ width: img.width, height: img.height });
    });
  });

  it("첫 장만 즉시 받고 나머지는 lazy 로 받는다", () => {
    expect(imgs[0]).toMatchObject({ loading: "eager", fetchpriority: "high" });
    expect(imgs.slice(1).map((i) => i.loading)).toEqual(imgs.slice(1).map(() => "lazy"));
  });

  it("alt 가 장마다 다르고 비어 있지 않다", () => {
    const alts = imgs.map((i) => i.alt.trim());
    expect(alts.every((a) => a.length >= 10)).toBe(true);
    expect(new Set(alts).size).toBe(alts.length);
  });

  it("이미지 한 장이 400KB 를 넘지 않는다", () => {
    const heavy = imgs
      .map((i) => ({ src: i.src, kb: Math.round(statSync(join(PUBLIC, i.src)).size / 1024) }))
      .filter((i) => i.kb > 400);
    expect(heavy).toEqual([]);
  });

  it("본문 바로 뒤에 기존 CTA 폼이 이어진다", () => {
    const after = html.slice(html.indexOf("<!-- Page 8"));
    expect(after.indexOf('<div class="cta-section" id="inquiry">')).toBeGreaterThan(-1);
    expect(after).toContain('<form id="leadForm"');
    expect(after).toContain('id="stickyCta"');
  });
});

/**
 * 하단 고정 버튼("우리 매장도 가능한지 확인하기")의 위·아래 여백.
 *
 * 이전 값은 `padding:12px 20px env(safe-area-inset-bottom,0px)` 였다. 아래 여백이 safe-area 값뿐이라
 * 홈 인디케이터가 없는 기기·일반 브라우저에서는 0 이 되어 버튼이 화면 바닥에 붙었다(2026-11-19 오너 지적).
 * 아래 여백은 "위 여백 + safe-area" 여야 한다. safe-area 가 0 이면 위·아래가 같고,
 * 홈 인디케이터가 있으면 그만큼만 더 띄운다.
 */
describe("베이커리 랜딩 하단 고정 버튼 여백", () => {
  const rule = html.match(/\.sticky-cta\{([^}]*)\}/)?.[1] ?? "";
  const padding = rule.match(/(?:^|;)padding:([^;]+)/)?.[1].trim() ?? "";

  it("아래 여백 = 위 여백 + safe-area-inset-bottom", () => {
    const m = padding.match(/^(\d+px) (\d+px) calc\((\d+px) \+ env\(safe-area-inset-bottom, ?0px\)\)$/);
    expect(m, `padding 값이 예상 형태가 아니다: "${padding}"`).not.toBeNull();
    const [, top, , bottomBase] = m!;
    expect(bottomBase).toBe(top);
  });

  it("safe-area 를 쓰려면 viewport-fit=cover 가 있어야 한다", () => {
    expect(html).toMatch(/<meta name="viewport"[^>]*viewport-fit=cover/);
  });
});
