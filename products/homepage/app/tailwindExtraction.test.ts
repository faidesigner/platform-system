import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Tailwind 클래스 추출 안전성 (HOM-100 재발 방지).
 *
 * ⚠️ 이 파일에 **실제 Tailwind 클래스명을 쓰지 마라.** 테스트 파일도 Tailwind 스캔에
 *    포함되므로(아래 참조) 여기 적은 클래스가 프로덕션 CSS로 새어, 이 테스트가 지키려는
 *    바로 그 회귀를 되살린다. 예시는 `bg-EXAMPLE-200` 처럼 존재하지 않는 이름으로 쓴다.
 *
 * Tailwind는 **소스 텍스트를 정적으로 스캔**해 클래스 후보를 뽑는다. 템플릿 리터럴 안에서
 * 클래스 문자 바로 뒤에 공백 없이 `${...}` 보간이 붙으면, 추출기가 보는 토큰은
 * `bg-EXAMPLE-200${wideCompact` 같은 형태가 되어 **그 클래스의 유틸리티가 생성되지 않는다.**
 *
 *   ✗  className={`w-full bg-EXAMPLE-200${wide ? ' x-y' : ''}`}    ← bg-EXAMPLE-200 유실
 *   ✓  className={`w-full bg-EXAMPLE-200 ${wide ? 'x-y' : ''}`}
 *
 * 왜 위험한가: 타입 오류도, 빌드 경고도, 런타임 오류도 없다. 클래스는 HTML에 그대로 붙어
 * 있고 CSS 규칙만 없으므로 **해당 스타일이 조용히 사라진다.** 게다가 같은 클래스를 다른
 * 파일에서 쓰고 있으면 우연히 생성돼 통과하다가, 그 다른 사용처가 사라지는 순간 터진다.
 *
 * 실제 사고(HOM-100, Critical): Footer 최상위의 배경 유틸리티(bg-bg-<숫자>)가 이 형태였다.
 * footer 배경색이 통째로 사라졌다.
 * footer 배경색이 통째로 사라진 채 dev에 배포됐고, vitest 213개·배포 게이트 4종 모두
 * 통과했다. 같은 스캔에서 StoreEffects의 desktop 높이 유틸 1건도 함께 유실돼 있었다 —
 * 1440px 이상에서 3열 카드 제목 높이 통일이 작동하지 않았다.
 *
 * 나머지 4건은 다른 파일이 같은 클래스를 써서 "우연히" 살아 있었다. 즉 이 패턴은 존재 자체가
 * 지뢰이므로, 유실 여부와 무관하게 **패턴을 금지**한다. (사후에 산출 CSS를 대조하는 방식은
 * variant 이스케이프 때문에 오탐이 많아 원인 쪽을 막는 것이 확실하다.)
 */

const HOMEPAGE = path.resolve(__dirname, "..");
const REPO = path.resolve(HOMEPAGE, "../..");

const SCAN_ROOTS = [
  path.join(HOMEPAGE, "components"),
  path.join(HOMEPAGE, "app"),
  path.join(REPO, "packages/ui"),
];
const SKIP_DIRS = new Set(["node_modules", ".next", "out", "dist", ".git"]);

function walk(dir: string): string[] {
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
    if (s.isDirectory()) out = out.concat(walk(full));
    else if (/\.(tsx|ts)$/.test(name) && !/\.(test|spec)\./.test(name)) out.push(full);
  }
  return out;
}

/** className={`...`} 템플릿 안에서 클래스 문자 바로 뒤에 붙은 `${` 를 찾는다. */
const TEMPLATE = /className=\{`([^`]*)`/g;
const ADJACENT = /([A-Za-z0-9\])%._-]+)\$\{/g;

interface Offender {
  file: string;
  line: number;
  truncated: string;
}

function findOffenders(): Offender[] {
  const found: Offender[] = [];
  for (const root of SCAN_ROOTS) {
    for (const file of walk(root)) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(TEMPLATE)) {
        for (const inner of m[1].matchAll(ADJACENT)) {
          found.push({
            file: path.relative(REPO, file),
            line: src.slice(0, m.index).split("\n").length,
            truncated: inner[1],
          });
        }
      }
    }
  }
  return found;
}

describe("Tailwind 클래스 추출 안전성", () => {
  it("스캔 대상 파일을 실제로 수집했다", () => {
    // 0건이면 아래 단언이 통과해도 아무것도 검사하지 않은 것이므로 먼저 못박는다.
    const count = SCAN_ROOTS.reduce((n, r) => n + walk(r).length, 0);
    expect(count).toBeGreaterThan(50);
  });

  it("템플릿 리터럴에서 클래스 뒤에 공백 없이 ${...} 보간이 붙지 않는다", () => {
    const offenders = findOffenders().map(
      (o) => `${o.file}:${o.line} — \`...${o.truncated}\${\` (공백을 클래스 뒤로 옮길 것)`,
    );
    expect(offenders).toEqual([]);
  });
});
