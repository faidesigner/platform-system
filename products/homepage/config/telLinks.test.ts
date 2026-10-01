import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

/**
 * `tel:` 링크 형식 검사.
 *
 * 2026-10-02: 베이커리 랜딩 "접수 완료" 화면의 전화 버튼이 `tel:+8202-0241-0049`였다.
 * 국제 번호(+82) 뒤에 국내 번호의 맨 앞 0을 남겨서 걸리지 않는 번호가 됐다. 이 버튼은 폼 전송 성공 후에만
 * 보이고 번호를 글자로 보여 주지 않아 화면 QA로는 잡히지 않았다. 그래서 소스에서 형식을 고정한다.
 *
 * 규칙: `tel:+82` 다음 숫자는 0이 아니어야 한다(E.164). 하이픈은 허용하되 숫자만 남겼을 때 판정한다.
 */
const ROOT = path.resolve(__dirname, "..");
const DIRS = ["public", "components", "app", "config", "messages"].map((d) => path.join(ROOT, d));
DIRS.push(path.resolve(ROOT, "..", "..", "packages", "ui"));

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "videos" || name === "images") continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(html|tsx?|json|mjs)$/.test(name) && !/\.test\./.test(name)) yield full;
  }
}

const links: { file: string; href: string }[] = [];
for (const dir of DIRS) {
  for (const file of walk(dir)) {
    for (const m of readFileSync(file, "utf8").matchAll(/tel:([+\d][\d\-\s()]*)/g)) {
      links.push({ file: path.relative(ROOT, file), href: m[1].trim() });
    }
  }
}

describe("tel: 링크 형식", () => {
  it("검사할 tel: 링크를 찾았다", () => {
    expect(links.length).toBeGreaterThan(0);
  });

  for (const { file, href } of links) {
    it(`${file}: tel:${href}`, () => {
      const digits = href.replace(/[^\d+]/g, "");
      if (digits.startsWith("+")) {
        expect(digits, "국제 번호는 +국가번호 뒤에 국내 번호 맨 앞 0을 빼야 한다").toMatch(/^\+82[1-9]\d{7,9}$/);
      } else {
        expect(digits, "국내 번호 형식").toMatch(/^0\d{8,10}$/);
      }
    });
  }
});
