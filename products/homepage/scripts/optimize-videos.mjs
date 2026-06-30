#!/usr/bin/env node
/**
 * 홈페이지 영상 웹 최적화 스크립트 (ffmpeg 필요).
 *
 * 규칙:
 *  - public/videos 하위 .mp4 대상.
 *  - 세로 1080 초과면 1080p로 다운스케일(가로 자동, 짝수 보정). 이하이면 해상도 유지.
 *  - H.264(libx264) CRF 28, preset slow, 오디오 제거(-an: 배경 루프),
 *    +faststart(웹 스트리밍 시 첫 프레임 빠르게).
 *  - 원본을 `name_original.mp4` 로 보관하고 최적화본을 원래 파일명으로 생성(코드 참조 불변).
 *  - 이미 `_original` 형제가 있으면 건너뜀(멱등 / 재실행 안전).
 *
 * 사용:  node scripts/optimize-videos.mjs [--dry]
 */
import { execFileSync } from "node:child_process";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "public/videos");
const MAX_HEIGHT = 1080;
const CRF = 28;
const DRY = process.argv.includes("--dry");
const fmtMB = (b) => (b / 1024 / 1024).toFixed(2) + "MB";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}
const isOriginal = (f) => /_original\.[^.]+$/.test(f);
const originalPath = (f) => {
  const ext = path.extname(f);
  return f.slice(0, -ext.length) + "_original" + ext;
};

function probeHeight(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=height", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  );
  return parseInt(out.trim(), 10) || 0;
}

async function run() {
  let totalBefore = 0,
    totalAfter = 0,
    processed = 0,
    skipped = 0;

  for await (const file of walk(ROOT)) {
    if (path.extname(file).toLowerCase() !== ".mp4" || isOriginal(file)) continue;
    if (existsSync(originalPath(file))) {
      skipped++;
      continue;
    }

    const { size } = await stat(file);
    const height = probeHeight(file);
    const rel = path.relative(process.cwd(), file);
    const willScale = height > MAX_HEIGHT;

    if (DRY) {
      console.log(`[would optimize] ${rel}  h=${height}${willScale ? `→${MAX_HEIGHT}` : ""}  ${fmtMB(size)}`);
      processed++;
      totalBefore += size;
      continue;
    }

    const orig = originalPath(file);
    await rename(file, orig);
    const args = ["-i", orig];
    if (willScale) args.push("-vf", `scale=-2:${MAX_HEIGHT}`);
    args.push(
      "-c:v", "libx264",
      "-crf", String(CRF),
      "-preset", "slow",
      "-pix_fmt", "yuv420p", // 폭넓은 호환성
      "-an", // 배경 루프 → 오디오 제거
      "-movflags", "+faststart",
      "-y",
      file,
    );
    execFileSync("ffmpeg", args, { stdio: ["ignore", "ignore", "ignore"] });

    const after = (await stat(file)).size;
    // 이미 효율적으로 인코딩된 원본(고모션 타임랩스 등)은 재인코딩이 더 커질 수 있다.
    // 이득이 없으면 화질 손실까지 감수할 이유가 없으므로 원본을 그대로 유지.
    if (after >= size) {
      await unlink(file);
      await rename(orig, file);
      skipped++;
      console.log(`↩︎ keep original ${rel}  (재인코딩 ${fmtMB(after)} ≥ 원본 ${fmtMB(size)})`);
      continue;
    }
    totalBefore += size;
    totalAfter += after;
    processed++;
    console.log(`✓ ${rel}  ${fmtMB(size)} → ${fmtMB(after)}  (-${(((size - after) / size) * 100).toFixed(0)}%)`);
  }

  console.log("\n──────── 요약 ────────");
  console.log(`처리: ${processed}개, 건너뜀: ${skipped}개`);
  if (!DRY)
    console.log(`용량: ${fmtMB(totalBefore)} → ${fmtMB(totalAfter)}  (-${totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0) : 0}%)`);
}

run().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
