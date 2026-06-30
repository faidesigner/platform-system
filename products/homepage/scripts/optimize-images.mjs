#!/usr/bin/env node
/**
 * 홈페이지 이미지 웹 최적화 스크립트.
 *
 * 규칙:
 *  - public/images 하위의 jpg/jpeg/png/webp 를 대상으로 한다.
 *  - 긴 변이 MAX_EDGE 초과 또는 파일이 MIN_BYTES 초과인 것만 최적화(이미 가벼운 건 건너뜀).
 *  - 원본을 `name_original.ext` 로 보관하고, 최적화본을 원래 파일명으로 덮어쓴다(코드 참조 불변).
 *  - 이미 `_original` 형제가 있으면 처리 완료된 것으로 보고 건너뜀(재실행 안전 / 멱등).
 *  - 포맷은 유지(jpg→jpg, png→png, webp→webp). 업스케일은 하지 않는다.
 *
 * 사용:  node scripts/optimize-images.mjs [--dry]
 */
import sharp from "sharp";
import { readdir, stat, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "public/images");
const MAX_EDGE = 2560;
const QUALITY = 80;
const MIN_BYTES = 400 * 1024; // 400KB 이하 + 해상도 작으면 손대지 않음
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const DRY = process.argv.includes("--dry");

const fmtMB = (b) => (b / 1024 / 1024).toFixed(2) + "MB";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function isOriginal(file) {
  return /_original\.[^.]+$/.test(file);
}
function originalPath(file) {
  const ext = path.extname(file);
  return file.slice(0, -ext.length) + "_original" + ext;
}

async function run() {
  let totalBefore = 0,
    totalAfter = 0,
    processed = 0,
    skipped = 0;

  for await (const file of walk(ROOT)) {
    const ext = path.extname(file).toLowerCase();
    if (!EXT.has(ext) || isOriginal(file)) continue;

    // 이미 처리된 파일(원본 백업 존재)이면 건너뜀 — 멱등성.
    if (existsSync(originalPath(file))) {
      skipped++;
      continue;
    }

    const { size } = await stat(file);
    const meta = await sharp(file).metadata();
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
    const needs = longest > MAX_EDGE || size > MIN_BYTES;
    if (!needs) {
      skipped++;
      continue;
    }

    const rel = path.relative(process.cwd(), file);
    if (DRY) {
      console.log(
        `[would optimize] ${rel}  ${meta.width}x${meta.height} ${fmtMB(size)}`,
      );
      processed++;
      totalBefore += size;
      continue;
    }

    // 원본 백업 후 최적화본을 원래 이름으로 생성.
    const orig = originalPath(file);
    await rename(file, orig);
    let pipeline = sharp(orig).resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true, // 업스케일 금지
    });
    if (ext === ".png")
      pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9, palette: true });
    else if (ext === ".webp") pipeline = pipeline.webp({ quality: QUALITY });
    else pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });

    await pipeline.toFile(file);
    const after = (await stat(file)).size;
    totalBefore += size;
    totalAfter += after;
    processed++;
    console.log(
      `✓ ${rel}  ${fmtMB(size)} → ${fmtMB(after)}  (-${(((size - after) / size) * 100).toFixed(0)}%)`,
    );
  }

  console.log("\n──────── 요약 ────────");
  console.log(`처리: ${processed}개, 건너뜀: ${skipped}개`);
  if (!DRY)
    console.log(
      `용량: ${fmtMB(totalBefore)} → ${fmtMB(totalAfter)}  (-${totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0) : 0}%)`,
    );
  else console.log(`예상 처리 대상 합계: ${fmtMB(totalBefore)}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
