import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  SITE_SEO,
  SEO_LOCALES,
  PAGE_SEO_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_SIZE,
  getSiteSeo,
  getPageDescription,
  getOgImage,
  type SeoPageKey,
} from "@/config/seo";
import { pageMetadata, localePath, absoluteUrl } from "@/lib/seo";

/**
 * HOM-74 회귀 방지 — SEO 메타데이터.
 *
 * 이 티켓의 실질은 "노션 명세(2026 리뉴얼)와 코드가 어긋나 있었다"이다. 코드에는 2024/2026-v3.0.0
 * 판 문구가 남아 있었고, 명세가 직접 버그로 지목한 og:url 루트 고정도 그대로였다.
 * 아래 테스트는 명세의 핵심 계약만 고정한다 — 문구 전문을 복제하지 않고(그건 config가 소스),
 * **구조적으로 틀리면 반드시 깨지는 조건**을 검증한다.
 */

const PUBLIC_DIR = join(__dirname, "../public");
const ALL_PAGES = Object.keys(PAGE_SEO_DESCRIPTION) as SeoPageKey[];

function readJpegSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    // SOF0/1/2 프레임 헤더에 실제 픽셀 크기가 들어 있다.
    if (marker >= 0xc0 && marker <= 0xc2) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error(`JPEG SOF 마커를 찾지 못함: ${path}`);
}

describe("사이트 SEO 문구 (HOM-74 ①②)", () => {
  it("세 로케일 모두 title·description·og 문구를 가진다", () => {
    for (const l of SEO_LOCALES) {
      const s = SITE_SEO[l];
      for (const field of ["title", "description", "ogTitle", "ogDescription"] as const) {
        expect(s[field].trim().length, `${l}.${field}`).toBeGreaterThan(0);
      }
    }
  });

  it("구버전(2024/v3.0.0) 문구가 남아 있지 않다", () => {
    // 이 문구들이 다시 보이면 명세 갱신이 코드에 반영되지 않은 것이다.
    const STALE = [
      "세상에서 가장 경제적인",
      "Most Economical",
      "世界一経済的な",
      "리테일 무인화 솔루션",
    ];
    const all = JSON.stringify(SITE_SEO);
    for (const stale of STALE) expect(all, `구버전 문구 잔존: ${stale}`).not.toContain(stale);
  });

  it("title은 브랜드명으로 끝난다 (검색결과 표기 통일)", () => {
    expect(SITE_SEO.ko.title.endsWith("파인더스에이아이")).toBe(true);
    expect(SITE_SEO.en.title.endsWith("Fainders.AI")).toBe(true);
    expect(SITE_SEO.ja.title.endsWith("Fainders.AI")).toBe(true);
  });

  it("알 수 없는 로케일은 ko로 폴백한다", () => {
    expect(getSiteSeo("zh")).toBe(SITE_SEO.ko);
    expect(getSiteSeo(undefined)).toBe(SITE_SEO.ko);
  });
});

describe("검색 키워드 (HOM-74 ③)", () => {
  it("로케일마다 충분한 키워드를 갖는다", () => {
    // 명세 기준 KO 27 / EN 34 / JA 50+ — 대폭 축소되면 명세 반영이 되돌아간 것이다.
    expect(SITE_SEO.ko.keywords.length).toBeGreaterThanOrEqual(25);
    expect(SITE_SEO.en.keywords.length).toBeGreaterThanOrEqual(30);
    expect(SITE_SEO.ja.keywords.length).toBeGreaterThanOrEqual(45);
  });

  it("키워드에 중복이 없다", () => {
    for (const l of SEO_LOCALES) {
      const k = SITE_SEO[l].keywords;
      expect(new Set(k).size, `${l} 키워드 중복`).toBe(k.length);
    }
  });

  it("로케일별로 키워드 집합이 다르다", () => {
    expect(SITE_SEO.ko.keywords).not.toEqual(SITE_SEO.en.keywords);
    expect(SITE_SEO.ja.keywords).not.toEqual(SITE_SEO.en.keywords);
  });
});

describe("페이지별 설명 (HOM-74 ④ 사이트 링크)", () => {
  it("모든 페이지 × 로케일 설명이 채워져 있다", () => {
    for (const page of ALL_PAGES) {
      for (const l of SEO_LOCALES) {
        expect(getPageDescription(page, l).trim().length, `${page}/${l}`).toBeGreaterThan(0);
      }
    }
  });

  it("페이지마다 설명이 서로 다르다 (사이트링크가 같은 문구로 뭉개지지 않도록)", () => {
    for (const l of SEO_LOCALES) {
      const descs = ALL_PAGES.map((p) => getPageDescription(p, l));
      expect(new Set(descs).size, `${l}: 페이지 설명 중복`).toBe(ALL_PAGES.length);
    }
  });
});

describe("Open Graph (HOM-74 ⑤)", () => {
  it("og 이미지가 실제로 존재하고 1200×630 규격이다", () => {
    for (const l of SEO_LOCALES) {
      const p = join(PUBLIC_DIR, OG_IMAGE[l]);
      expect(existsSync(p), `${l}: ${OG_IMAGE[l]} 없음`).toBe(true);
      expect(readJpegSize(p)).toEqual({ width: OG_IMAGE_SIZE.width, height: OG_IMAGE_SIZE.height });
    }
  });

  it("og 이미지 경로는 자체 호스팅 절대경로다", () => {
    for (const l of SEO_LOCALES) expect(getOgImage(l)).toMatch(/^\/images\/og\/.+\.jpg$/);
  });
});

describe("canonical · og:url 일관성 (HOM-74 — 명세가 지목한 버그)", () => {
  const ROUTES = ["", "about", "media", "contact", "products/vision-check-out"];

  it("og:url이 페이지마다 자기 경로를 가리킨다 (루트 고정 금지)", () => {
    for (const l of SEO_LOCALES) {
      const urls = ROUTES.map(
        (r) => pageMetadata({ locale: l, path: r, title: "t", description: "d" }).openGraph!.url,
      );
      // 전부 서로 달라야 한다 — 과거엔 모두 사이트 루트로 같았다.
      expect(new Set(urls.map(String)).size, `${l}: og:url이 중복`).toBe(ROUTES.length);
    }
  });

  it("canonical과 og:url이 같은 경로를 가리킨다", () => {
    for (const l of SEO_LOCALES) {
      for (const r of ROUTES) {
        const m = pageMetadata({ locale: l, path: r, title: "t", description: "d" });
        expect(String(m.openGraph!.url)).toBe(absoluteUrl(String(m.alternates!.canonical)));
      }
    }
  });

  it("기본 로케일이 아니어도 self-canonical을 부여한다", () => {
    // 과거엔 ko에만 canonical이 붙어 en/ja 하위 페이지가 로케일 루트를 정본으로 가리켰다.
    for (const l of SEO_LOCALES) {
      const m = pageMetadata({ locale: l, path: "about", title: "t", description: "d" });
      expect(m.alternates!.canonical).toBe(`/${l}/about/`);
    }
  });

  it("hreflang에 세 로케일과 x-default가 모두 있고 경로가 일치한다", () => {
    const m = pageMetadata({ locale: "en", path: "media", title: "t", description: "d" });
    const langs = m.alternates!.languages as Record<string, string>;
    for (const l of SEO_LOCALES) expect(langs[l]).toBe(`/${l}/media/`);
    expect(langs["x-default"]).toBe("/ko/media/");
  });

  it("경로는 항상 슬래시로 끝난다 (trailingSlash 설정과 일치)", () => {
    expect(localePath("ko", "")).toBe("/ko/");
    expect(localePath("ja", "about")).toBe("/ja/about/");
    expect(localePath("en", "/products/vision-check-out/")).toBe("/en/products/vision-check-out/");
  });
});
