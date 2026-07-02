#!/usr/bin/env node
/**
 * public/images 의 PNG를 webp로 변환하고, 코드의 해당 참조(.png → .webp)를 정밀 치환한다.
 *
 * 안전 원칙(기존 페이지 무변화 + 404 방지):
 *  - webp가 png보다 "작을 때만" 교체한다. 아니면 png 유지하고 참조도 건드리지 않는다.
 *  - 그라데이션류(파일명 'gradation')는 밴딩 방지를 위해 lossless webp.
 *  - 그 외(사진/그래픽, 알파 포함)는 고품질 lossy(q82). webp는 알파를 지원한다.
 *  - 참조 치환은 `/images/.../name.png` "정확 문자열" 기준 — /logos/*.png 등은 절대 안 건드림.
 *  - 원본 백업 `*_original.png` 는 그대로 둔다.
 *
 * 사용:  node scripts/convert-png-to-webp.mjs [--dry]
 */
import sharp from "sharp";
import { readdir, stat, unlink, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const IMG_ROOT = path.resolve(process.cwd(), "public/images");
const CODE_DIRS = ["config", "components", "app"].map((d) => path.resolve(process.cwd(), d));
const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css"]);
const DRY = process.argv.includes("--dry");
const fmtMB = (b) => (b / 1024 / 1024).toFixed(2) + "MB";

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}
const publicUrl = (abs) => "/" + path.relative(path.resolve(process.cwd(), "public"), abs);

async function run() {
  const wins = []; // { pngUrl, webpUrl }
  let before = 0, after = 0, kept = 0;

  for await (const file of walk(IMG_ROOT)) {
    if (path.extname(file).toLowerCase() !== ".png" || /_original\.[^.]+$/.test(file)) continue;

    const webp = file.slice(0, -path.extname(file).length) + ".webp";
    const lossless = /gradation/i.test(path.basename(file));
    const pngSize = (await stat(file)).size;
    const rel = path.relative(process.cwd(), file);

    if (DRY) {
      console.log(`[would convert] ${rel}  ${fmtMB(pngSize)}  (${lossless ? "lossless" : "q82"})`);
      continue;
    }

    await sharp(file)
      .webp(lossless ? { lossless: true, effort: 6 } : { quality: 82, effort: 6 })
      .toFile(webp);
    const webpSize = (await stat(webp)).size;

    if (webpSize >= pngSize) {
      // 이득 없음 → webp 폐기, png 유지, 참조도 그대로.
      await unlink(webp);
      kept++;
      console.log(`↩︎ keep png  ${rel}  (webp ${fmtMB(webpSize)} ≥ png ${fmtMB(pngSize)})`);
      continue;
    }

    await unlink(file); // 최적화 png 제거 (원본 _original.png 백업은 유지)
    wins.push({ pngUrl: publicUrl(file), webpUrl: publicUrl(webp) });
    before += pngSize;
    after += webpSize;
    console.log(`✓ ${rel} → .webp  ${fmtMB(pngSize)} → ${fmtMB(webpSize)}  (-${(((pngSize - webpSize) / pngSize) * 100).toFixed(0)}%, ${lossless ? "lossless" : "q82"})`);
  }

  if (DRY) return;

  // ── 코드 참조 정밀 치환 (정확 문자열) ──
  const rewritten = [];
  for (const dir of CODE_DIRS) {
    for await (const f of walk(dir)) {
      if (!CODE_EXT.has(path.extname(f))) continue;
      let txt = await readFile(f, "utf8");
      let changed = false;
      for (const { pngUrl, webpUrl } of wins) {
        if (txt.includes(pngUrl)) {
          txt = txt.split(pngUrl).join(webpUrl);
          changed = true;
        }
      }
      if (changed) {
        await writeFile(f, txt);
        rewritten.push(path.relative(process.cwd(), f));
      }
    }
  }

  console.log("\n──────── 요약 ────────");
  console.log(`변환: ${wins.length}개,  png 유지(이득없음): ${kept}개`);
  console.log(`용량: ${fmtMB(before)} → ${fmtMB(after)}  (-${before ? (((before - after) / before) * 100).toFixed(0) : 0}%)`);
  console.log(`참조 치환 파일: ${rewritten.length}개`);
  rewritten.forEach((f) => console.log(`  - ${f}`));
}

run().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
