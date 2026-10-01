import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

/**
 * 사이트가 실제로 참조하는 배경 영상의 용량 상한.
 *
 * 2026-10-01: 홈 타임랩스(`home-efficiency-timelapse-3.mp4`)가 23.35MB로 홈 전체 전송량의 80%였고,
 * 모바일에서도 그대로 받았다. 영상 위를 어두운 막 + blur(4px)가 덮어서 540p CRF32(5.52MB)로도 차이가
 * 보이지 않았다. 새 영상을 넣을 때 압축을 빠뜨리면 여기서 걸린다.
 * 상한을 올려야 한다면 이유를 이 주석에 남길 것.
 */
const MAX_MB = 8;

const ROOT = path.resolve(__dirname, "..");
const SRC_DIRS = ["app", "components", "config"].map((d) => path.join(ROOT, d));
const UI_DIR = path.resolve(ROOT, "..", "..", "packages", "ui");

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|mjs)$/.test(name) && !/\.test\./.test(name)) yield full;
  }
}

const referenced = new Set<string>();
for (const dir of [...SRC_DIRS, UI_DIR]) {
  for (const file of walk(dir)) {
    for (const m of readFileSync(file, "utf8").matchAll(/["'`](\/videos\/[^"'`]+\.mp4)["'`]/g)) referenced.add(m[1]);
  }
}

describe("배경 영상 용량 상한", () => {
  it("참조 영상을 찾았다 (스캔이 비면 이 테스트가 무의미해진다)", () => {
    expect(referenced.size).toBeGreaterThanOrEqual(5);
  });

  for (const src of [...referenced].sort()) {
    it(`${src} ≤ ${MAX_MB}MB`, () => {
      const file = path.join(ROOT, "public", src);
      expect(existsSync(file), `${src} 파일 없음`).toBe(true);
      const mb = statSync(file).size / 1024 / 1024;
      expect(mb, `${src} = ${mb.toFixed(2)}MB — 압축 필요 (scripts/optimize-videos.mjs 참고, --dry 먼저)`).toBeLessThanOrEqual(MAX_MB);
    });
  }
});
