import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * 디자인 토큰 참조 무결성 (HOM-71 재발 방지).
 *
 * 코드가 `var(--token)`을 폴백 없이 참조하는데 그 변수가 어디에도 정의돼 있지 않으면,
 * CSS 선언 자체가 무효가 되어 **그 속성이 조용히 사라진다**. 화면에서는 "값이 0인 것처럼"
 * 보이므로 오타인지 의도인지 구분되지 않는다.
 *
 * 실제 사고(HOM-71): EfficiencySection이 `desktop-s:pl-[var(--padding-4XL)]`로
 * 961~1279px 구간의 좌우 패딩을 지정했는데 globals.css의 padding 토큰 목록에
 * `--padding-4XL`만 빠져 있었다(XS·MS·L·XL·2XL·3XL·5XL·8XL은 있음).
 * 그 결과 그 구간에서 좌우 패딩이 0px이 되어 콘텐츠가 화면 끝에 붙었다.
 * foundation 토큰(root/foundation/spacing.json)에는 padding.4XL = 56px로 존재했으므로
 * **정의 방출 누락**이었고, 브라우저는 아무 경고도 주지 않는다.
 *
 * 이 테스트는 순수 정적 검사라 jsdom 레이아웃이 필요 없다.
 * (레이아웃 자체의 회귀는 scripts/check-footer-layout.mjs 같은 배포 게이트가 담당한다.)
 */

const HOMEPAGE = path.resolve(__dirname, "..");
const REPO = path.resolve(HOMEPAGE, "../..");

/** CSS 변수 **정의**를 찾을 위치 */
const CSS_ROOTS = [
  path.join(HOMEPAGE, "app"),
  path.join(REPO, "root/foundation"),
  path.join(REPO, "root/web"),
  path.join(REPO, "packages/ui"),
  path.join(HOMEPAGE, "root"),
];

/** `var()` **사용**을 검사할 소스 위치 */
const SRC_ROOTS = [
  path.join(HOMEPAGE, "components"),
  path.join(HOMEPAGE, "app"),
  path.join(HOMEPAGE, "config"),
  path.join(REPO, "packages/ui"),
];

const SKIP_DIRS = new Set(["node_modules", ".next", "out", "dist", ".git"]);

function walk(dir: string, exts: string[]): string[] {
  let out: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) out = out.concat(walk(full, exts));
    else if (exts.some((e) => name.endsWith(e)) && !/\.(test|spec)\./.test(name)) out.push(full);
  }
  return out;
}

const read = (f: string) => {
  try {
    return readFileSync(f, "utf8");
  } catch {
    return "";
  }
};

/** CSS 파일에서 `--x:` 형태의 정의를 모은다. */
function collectCssDefinitions(): Set<string> {
  const defined = new Set<string>();
  for (const root of CSS_ROOTS) {
    for (const f of walk(root, [".css"])) {
      for (const m of read(f).matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) defined.add(m[1]);
    }
  }
  return defined;
}

/**
 * 같은 파일 안에서 변수를 직접 정의하는 두 패턴도 "정의"로 인정한다.
 *   1) 인라인 style 객체:  style={{ '--fai-card-img': `url(...)` }}
 *   2) Tailwind arbitrary property:  [--hero-title-clear:316px]
 * 이 둘은 전역 토큰이 아니라 컴포넌트 지역 변수이므로 globals.css에 있을 이유가 없다.
 */
function collectLocalDefinitions(source: string): Set<string> {
  const local = new Set<string>();
  for (const m of source.matchAll(/['"`](--[A-Za-z0-9_-]+)['"`]\s*:/g)) local.add(m[1]);
  for (const m of source.matchAll(/\[(--[A-Za-z0-9_-]+)\s*:/g)) local.add(m[1]);
  return local;
}

interface Usage {
  name: string;
  file: string;
  hasFallback: boolean;
}

function collectUsages(): Usage[] {
  const usages: Usage[] = [];
  for (const root of SRC_ROOTS) {
    for (const f of walk(root, [".tsx", ".ts", ".css"])) {
      const src = read(f);
      const local = collectLocalDefinitions(src);
      for (const m of src.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)\s*(,)?/g)) {
        const name = m[1];
        if (local.has(name)) continue; // 같은 파일에서 정의된 지역 변수
        usages.push({ name, file: path.relative(REPO, f), hasFallback: m[2] === "," });
      }
    }
  }
  return usages;
}

const DEFINED = collectCssDefinitions();
const USAGES = collectUsages();

describe("디자인 토큰 참조 무결성", () => {
  it("정의를 찾을 CSS 파일과 사용처를 실제로 수집했다", () => {
    // 수집이 0건이면 아래 단언들이 통과해도 아무것도 검사하지 않은 것이므로, 먼저 못박는다.
    expect(DEFINED.size).toBeGreaterThan(100);
    expect(USAGES.length).toBeGreaterThan(50);
  });

  // 폴백이 없으면 미정의 변수는 선언 전체를 무효화한다 — 속성이 조용히 사라진다.
  it("폴백 없이 참조하는 var(--token)은 모두 정의돼 있다", () => {
    const seen = new Map<string, Set<string>>();
    for (const u of USAGES) {
      if (u.hasFallback) continue;
      if (DEFINED.has(u.name)) continue;
      if (!seen.has(u.name)) seen.set(u.name, new Set());
      seen.get(u.name)!.add(u.file);
    }
    const missing = [...seen.entries()].map(
      ([name, files]) => `${name} ← ${[...files].join(", ")}`,
    );
    expect(missing).toEqual([]);
  });

  // HOM-71의 직접 원인. 토큰 목록에서 한 단계만 빠지면 그 구간 패딩이 0이 된다.
  it("padding 스케일 토큰이 연속으로 정의돼 있다", () => {
    const scale = ["XS", "MS", "L", "XL", "2XL", "3XL", "4XL", "5XL", "8XL"];
    const missing = scale.filter((s) => !DEFINED.has(`--padding-${s}`));
    expect(missing).toEqual([]);
  });
});
