#!/usr/bin/env node
/**
 * 번역 키 노출 배포 게이트 (HOM-75 재발 방지).
 *
 * next-intl은 메시지를 찾지 못하면 **키 이름을 그대로 렌더한다.** 오류도 경고도 없고,
 * 화면에 `about.partners.description.1` 같은 문자열이 그냥 나온다.
 *
 * 실제 사고(2026-08-31): about 페이지가 줄 배열을 `aboutConfig.<...>.map((_, i) => t(...))`
 * 로 순회했다 — **ko 기준 config 길이**다. en 카피가 시트에서 두 줄 → 한 줄로 바뀌자
 * 없는 인덱스를 조회해 키 이름이 화면에 노출됐다. 빌드도 테스트도 전부 통과했고,
 * 사용자가 화면에서 발견했다.
 *
 * 이 게이트는 **산출 HTML의 텍스트 노드**에서 메시지 네임스페이스로 시작하는 점 표기
 * 문자열을 찾는다. 태그 속성(href·src·class 등)과 <script>는 제외한다 —
 * JSON 페이로드에는 키가 정상적으로 들어 있기 때문이다.
 *
 * 실행: node scripts/check-i18n-keys.mjs   (deploy.sh 빌드 직후 자동 호출)
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");

/** messages/ko.json의 최상위 키 = 네임스페이스. 이걸로 시작하는 점 표기만 키로 본다. */
function namespaces() {
  const ko = JSON.parse(readFileSync(path.resolve(process.cwd(), "messages/ko.json"), "utf8"));
  return Object.keys(ko);
}

function htmlFiles(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    if (name === "_next") continue;
    const full = path.join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) out = out.concat(htmlFiles(full));
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** <script>·<style>를 제거하고 태그를 벗겨 **보이는 텍스트**만 남긴다. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function run() {
  if (!existsSync(OUT)) {
    console.error("✗ out/ 없음 — 먼저 빌드하세요(pnpm build).");
    process.exit(1);
  }
  const ns = namespaces();
  // about.partners.description.1 / products.visionCheckout.heroTitle 처럼 2단 이상 점 표기
  const pattern = new RegExp(`\\b(?:${ns.join("|")})(?:\\.[A-Za-z0-9_]+){2,}\\b`, "g");

  const offenders = [];
  const files = htmlFiles(OUT);
  for (const file of files) {
    const text = visibleText(readFileSync(file, "utf8"));
    const found = [...new Set(text.match(pattern) ?? [])];
    if (found.length) offenders.push({ file: path.relative(OUT, file), found });
  }

  console.log(`  HTML ${files.length}개 검사 · 네임스페이스 ${ns.length}개`);
  if (offenders.length) {
    console.error(`\n✗ 화면에 번역 키가 노출된 페이지 ${offenders.length}개:`);
    for (const o of offenders) console.error(`  ${o.file}: ${o.found.join(", ")}`);
    console.error(
      "\n  next-intl은 메시지를 못 찾으면 키 이름을 그대로 렌더한다. 흔한 원인은 줄 배열을" +
        "\n  ko 기준 config 길이로 순회하는 것이다 — 길이의 근거를 메시지 쪽으로 옮길 것.",
    );
    process.exit(1);
  }
  console.log("\n✓ 번역 키 노출 없음.");
}

run();
