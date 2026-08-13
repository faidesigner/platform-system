import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { customerImages } from "@/config/site";

/**
 * HOM-69 회귀 방지 — 홈 고객사 롤링 이미지.
 *
 * 두 가지를 고정한다.
 * 1) 인물 얼굴이 노출된 니세코 원본이 다시 들어오지 않을 것 (블러 처리본만 사용)
 * 2) 이 목록이 다시 두 벌로 복제되지 않을 것
 *    — 과거 app/[locale]/page.tsx와 CustomersSection.tsx에 동일 배열이 복제돼 있어,
 *      한쪽만 교체하면 조용히 어긋나는 상태였다. config/site.ts를 단일 소스로 강제한다.
 */

const HOMEPAGE_ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(HOMEPAGE_ROOT, "public");
const CONFIG_SOURCE = join(HOMEPAGE_ROOT, "config/site.ts");

/** 얼굴이 노출돼 교체된 원본 — 어디에서도 다시 참조되면 안 된다. */
const REMOVED_UNBLURRED_SRC = "/images/customers/04-foodCourt-niseko-1.jpg";
const BLURRED_REPLACEMENT_SRC = "/images/products/review/vco-review-resort-final.webp";

/** 소스 트리를 훑어 고객사 이미지 경로를 하드코딩한 파일을 찾는다(빌드 산출물·의존성 제외). */
function sourceFilesReferencingCustomerImages(): string[] {
  const hits: string[] = [];
  const skipDirs = new Set(["node_modules", "out", ".next", "public", "docs"]);

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (!skipDirs.has(entry)) walk(full);
        continue;
      }
      if (!/\.(ts|tsx)$/.test(entry)) continue;
      if (full === CONFIG_SOURCE) continue; // 단일 소스는 당연히 포함한다
      if (full.endsWith(".test.ts") || full.endsWith(".test.tsx")) continue; // 이 파일 포함, 테스트는 제외

      const src = readFileSync(full, "utf-8");
      if (/["'`]\/images\/customers\/\d/.test(src)) hits.push(relative(HOMEPAGE_ROOT, full));
    }
  };

  walk(HOMEPAGE_ROOT);
  return hits;
}

describe("customerImages 단일 소스 (HOM-69)", () => {
  it("니세코 컷은 블러 처리본을 쓴다", () => {
    const srcs = customerImages.map((i) => i.src);
    expect(srcs).toContain(BLURRED_REPLACEMENT_SRC);
    expect(srcs).not.toContain(REMOVED_UNBLURRED_SRC);
  });

  it("목록의 모든 이미지 파일이 실제로 존재한다", () => {
    for (const { name, src } of customerImages) {
      expect(existsSync(join(PUBLIC_DIR, src)), `${name}: ${src} 파일 없음`).toBe(true);
    }
  });

  it("항목 식별자(name)가 중복되지 않는다", () => {
    const names = customerImages.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("config/site.ts 밖에서 고객사 이미지 경로를 하드코딩하지 않는다", () => {
    // 여기 파일이 잡히면 목록이 또 복제된 것이다 — config/site.ts의 customerImages를 import해서 쓸 것.
    expect(sourceFilesReferencingCustomerImages()).toEqual([]);
  });
});
