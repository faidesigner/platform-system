/**
 * 배포 게이트 공용 인프라 — 정적 export(out/)를 로컬 서빙하고 헤드리스 Chrome을 붙인다.
 *
 * jsdom(vitest)은 레이아웃을 계산하지 않아 getBoundingClientRect가 0을 돌려준다. 그래서
 * "폭에 따라 무너지는" 종류의 회귀는 단위 테스트로 못 잡고 실제 렌더 엔진이 필요하다.
 * 그 부트스트랩(정적 서버 + Chrome 탐색 + skip 정책 + 정리)이 게이트마다 동일하므로 여기 모았다.
 *
 * 추출 배경: check-mobile-overflow / check-footer-layout 두 게이트에 MIME 표·resolveFile·
 * startServer·findChrome이 **글자 단위로 중복**돼 있었다. 세 번째 게이트를 추가하는 시점에
 * 3중복이 되므로 추출했다. 서버 동작이 게이트마다 미묘하게 달라지면 "게이트는 통과하는데
 * 실제 배포물은 다르다"가 발생하므로, 서빙 규칙은 한 곳에만 있어야 한다.
 *
 * skip 정책: Chrome이나 puppeteer-core가 없으면 **경고만 하고 exit 0**이다. 개발자 로컬
 * 환경 문제로 배포 자체를 막지는 않는다. 다만 그 경우 검사는 실제로 수행되지 않았다.
 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

export const OUT = path.resolve(process.cwd(), "out");

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain",
  ".ico": "image/x-icon", ".mp4": "video/mp4", ".xml": "application/xml",
};

/** next.config의 trailingSlash 라우팅을 흉내낸다 — /ko/about → out/ko/about/index.html */
async function resolveFile(urlPath) {
  const p = decodeURIComponent(urlPath.split("?")[0]);
  let fp = path.join(OUT, p);
  try {
    const s = await stat(fp);
    if (s.isDirectory()) fp = path.join(fp, "index.html");
  } catch {
    if (existsSync(fp + ".html")) fp = fp + ".html";
    else fp = path.join(fp, "index.html");
  }
  return fp;
}

export function startServer(port) {
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
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

export function findChrome() {
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  return [
    envPath,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ].filter(Boolean).find((c) => existsSync(c)) || null;
}

/**
 * 게이트 본문을 실행한다. 서버·브라우저 수명과 skip/실패 종료코드를 여기서 책임진다.
 *
 * @param {{port:number, what:string}} opts  what = 검사 이름(경고 문구에 쓰인다)
 * @param {(ctx:{browser:import('puppeteer-core').Browser, origin:string}) => Promise<void>} body
 *        실패는 예외가 아니라 호출부가 모아서 직접 process.exit(1) 한다.
 */
export async function withPreview({ port, what }, body) {
  if (!existsSync(OUT)) {
    console.error("✗ out/ 없음 — 먼저 빌드하세요(pnpm build).");
    process.exit(1);
  }
  const executablePath = findChrome();
  if (!executablePath) {
    console.warn(`⚠ Chrome을 찾지 못해 ${what}를 건너뜁니다(배포는 계속). PUPPETEER_EXECUTABLE_PATH 설정 권장.`);
    process.exit(0);
  }
  let puppeteer;
  try {
    puppeteer = (await import("puppeteer-core")).default;
  } catch {
    console.warn(`⚠ puppeteer-core 미설치 — ${what} skip(배포 계속).`);
    process.exit(0);
  }

  const server = await startServer(port);
  const browser = await puppeteer.launch({ executablePath, headless: "new", args: ["--no-sandbox"] });
  try {
    await body({ browser, origin: `http://localhost:${port}` });
  } finally {
    await browser.close();
    server.close();
  }
}

/** 페이지를 열고 측정 함수를 실행한 뒤 닫는다. 정적 export라 networkidle2 + 소량 대기로 충분하다. */
export async function measurePage(browser, url, viewport, evaluateFn, arg) {
  const page = await browser.newPage();
  await page.setViewport({ height: 900, ...viewport });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 300));
  const result = await page.evaluate(evaluateFn, arg);
  await page.close();
  return result;
}
