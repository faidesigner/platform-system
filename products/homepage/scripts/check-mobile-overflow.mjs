#!/usr/bin/env node
/**
 * 모바일 가로 오버플로우 배포 게이트 (재발 방지).
 *
 * 정적 export(out/)를 로컬 서빙하고, 전 라우트 × 로케일을 모바일 폭(390px)으로 로드해
 * document.scrollWidth > viewport 이면 실패(exit 1)한다.
 *
 * 왜 필요한가: 가로 오버플로우가 생기면 iOS Safari에서 position:fixed; width:100% 헤더가
 * 넓어진 레이아웃 뷰포트 폭으로 렌더돼 모바일 우측 메뉴가 화면 밖으로 밀린다(About EN 사례).
 * CJK는 어디서나 줄바꿈돼 안 넘치지만 영문은 넘칠 수 있어 로케일별로 다르게 드러난다.
 *
 * 실행: node scripts/check-mobile-overflow.mjs   (deploy.sh 빌드 직후 자동 호출)
 * 사전조건: out/ 존재, 시스템 Chrome(또는 PUPPETEER_EXECUTABLE_PATH). Chrome 없으면 경고 후 skip.
 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const OUT = path.resolve(process.cwd(), "out");
const PORT = 43219;
const VIEWPORT = { width: 390, height: 844 };
const LOCALES = ["ko", "en", "ja"];
const PATHS = ["", "about", "contact", "media", "products", "products/vision-check-out", "products/unmanned-store"];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain",
  ".ico": "image/x-icon", ".mp4": "video/mp4", ".xml": "application/xml",
};

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  let fp = path.join(OUT, p);
  try {
    const s = await stat(fp);
    if (s.isDirectory()) fp = path.join(fp, "index.html");
  } catch {
    if (existsSync(fp + ".html")) fp = fp + ".html";
    else fp = path.join(fp, "index.html"); // trailingSlash 라우트
  }
  return fp;
}

function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const fp = await resolveFile(req.url);
      const buf = await readFile(fp);
      res.setHeader("Content-Type", MIME[path.extname(fp)] || "application/octet-stream");
      res.end(buf);
    } catch {
      res.statusCode = 404;
      res.end("not found");
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function findChrome() {
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  const candidates = [
    envPath,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((c) => existsSync(c)) || null;
}

async function run() {
  if (!existsSync(OUT)) {
    console.error("✗ out/ 없음 — 먼저 빌드하세요(pnpm build).");
    process.exit(1);
  }
  const executablePath = findChrome();
  if (!executablePath) {
    console.warn("⚠ Chrome을 찾지 못해 오버플로우 검사를 건너뜁니다(배포는 계속). PUPPETEER_EXECUTABLE_PATH 설정 권장.");
    process.exit(0);
  }

  let puppeteer;
  try {
    puppeteer = (await import("puppeteer-core")).default;
  } catch {
    console.warn("⚠ puppeteer-core 미설치 — 검사 skip(배포 계속).");
    process.exit(0);
  }

  const server = await startServer();
  const browser = await puppeteer.launch({ executablePath, headless: "new", args: ["--no-sandbox"] });
  const offenders = [];
  try {
    for (const loc of LOCALES) {
      for (const rt of PATHS) {
        const url = `http://localhost:${PORT}/${loc}/${rt ? rt + "/" : ""}`;
        const page = await browser.newPage();
        await page.setViewport(VIEWPORT);
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }).catch(() => {});
        await new Promise((r) => setTimeout(r, 400));
        const info = await page.evaluate(() => {
          const vw = window.innerWidth;
          const sw = document.documentElement.scrollWidth;
          let worst = null;
          if (sw > vw) {
            const isClipped = (el) => { let p = el.parentElement; while (p) { if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowX)) return true; p = p.parentElement; } return false; };
            document.querySelectorAll("*").forEach((el) => {
              const r = el.getBoundingClientRect();
              if (r.right > vw + 1 && !isClipped(el) && (!worst || r.right > worst.right)) {
                worst = { right: Math.round(r.right), cls: (el.className?.toString?.() || "").slice(0, 60), tag: el.tagName };
              }
            });
          }
          return { vw, sw, worst };
        });
        await page.close();
        const over = info.sw > info.vw;
        console.log(`${over ? "✗" : "✓"} /${loc}/${rt}  (scrollWidth ${info.sw} / vw ${info.vw})`);
        if (over) offenders.push({ url: `/${loc}/${rt}`, ...info });
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (offenders.length) {
    console.error(`\n✗ 가로 오버플로우 ${offenders.length}건 — 모바일에서 우측 메뉴가 밀릴 수 있음:`);
    offenders.forEach((o) => console.error(`  ${o.url}: scrollWidth=${o.sw} > ${o.vw}  worst=${JSON.stringify(o.worst)}`));
    process.exit(1);
  }
  console.log(`\n✓ 오버플로우 없음 — ${LOCALES.length}×${PATHS.length}개 라우트 통과.`);
}

run().catch((e) => { console.error("검사 실패:", e.message || e); process.exit(1); });
