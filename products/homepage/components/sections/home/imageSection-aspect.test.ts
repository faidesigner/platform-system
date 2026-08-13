import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_POLICY, LOCALES } from "@/config/locale-policy";

/**
 * HOM-64 / HOM-58 회귀 방지 — imageSection 폭 상한 상수와 실제 에셋 종횡비의 동기화.
 *
 * ImageSection은 와이드+짧은 뷰포트에서 object-cover가 세로를 과도하게 크롭하는 것을 막으려고
 * 이미지 폭에 상한을 둔다: 100dvh × (W / (H × 0.8)) — 세로가 최소 80%는 보이도록 하는 폭이다.
 *
 * 이 상수는 **에셋의 종횡비에서 유도**되므로 이미지를 교체하면 반드시 함께 갱신해야 한다.
 * 주석으로만 적어두면 다음 교체 때 조용히 어긋나므로(HOM-64에서 3120×2048 → 1472×800으로 바뀜),
 * 소스의 상수와 실제 webp 헤더를 직접 대조해 기계로 강제한다.
 */

const PUBLIC_DIR = join(__dirname, "../../../public");
const IMAGE_SECTION_SRC = join(__dirname, "ImageSection.tsx");

/** 세로가 최소 이만큼은 보이도록 폭 상한을 잡는다 — ImageSection 주석의 0.8과 같은 값. */
const MIN_VISIBLE_HEIGHT_RATIO = 0.8;

/** WebP(VP8X) 캔버스 크기: 24바이트 오프셋부터 (width-1), (height-1)이 각각 24비트 LE. */
function readWebpSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  expect(buf.subarray(0, 4).toString("ascii")).toBe("RIFF");
  expect(buf.subarray(8, 12).toString("ascii")).toBe("WEBP");
  expect(buf.subarray(12, 16).toString("ascii")).toBe("VP8X");
  const width = (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1;
  const height = (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1;
  return { width, height };
}

/** ImageSection.tsx의 `calc(100dvh*A/B)` 상한 상수를 읽는다. */
function readWidthCapRatio(): number {
  const src = readFileSync(IMAGE_SECTION_SRC, "utf-8");
  const m = src.match(/w-\[min\(100%,calc\(100dvh\*(\d+)\/(\d+)\)\)\]/);
  expect(m, "ImageSection의 폭 상한 클래스를 찾지 못했다 — 클래스 형태가 바뀌면 이 테스트도 갱신하라").toBeTruthy();
  return Number(m![1]) / Number(m![2]);
}

const heroImages = LOCALES.map((locale) => ({
  locale,
  src: LOCALE_POLICY[locale].homeHeroImage,
  path: join(PUBLIC_DIR, LOCALE_POLICY[locale].homeHeroImage),
}));

describe("imageSection 히어로 에셋 (HOM-64)", () => {
  it("로케일마다 서로 다른 이미지를 쓴다", () => {
    const srcs = heroImages.map((h) => h.src);
    expect(new Set(srcs).size).toBe(LOCALES.length);
  });

  it("모든 로케일 이미지가 실제로 존재한다", () => {
    for (const { locale, path, src } of heroImages) {
      expect(existsSync(path), `${locale}: ${src} 파일 없음`).toBe(true);
    }
  });

  it("경로는 자체 호스팅 절대경로다 (외부 호스트 금지)", () => {
    for (const { src } of heroImages) {
      expect(src).toMatch(/^\/images\/.+\.webp$/);
    }
  });

  it("로케일별 이미지의 크기가 모두 동일하다", () => {
    // 크기가 다르면 로케일마다 크롭량이 달라져 같은 화면에서 다른 구도로 보인다.
    const sizes = heroImages.map(({ path }) => readWebpSize(path));
    for (const size of sizes) {
      expect(size).toEqual(sizes[0]);
    }
  });

  it("폭 상한 상수가 실제 에셋 종횡비에서 유도한 값과 일치한다", () => {
    const { width, height } = readWebpSize(heroImages[0].path);
    const expected = width / (height * MIN_VISIBLE_HEIGHT_RATIO);
    const actual = readWidthCapRatio();

    // 소스에는 약분된 정수비로 적히므로 미세 오차만 허용한다.
    expect(actual).toBeCloseTo(expected, 3);
  });
});
