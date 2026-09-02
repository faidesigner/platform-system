import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";

/**
 * 사례(caseStudies) 카드 제목은 `StoreCaseStudies.tsx`에서 **`brand / store`로 이어 붙여** 렌더된다.
 * 그래서 brand 안에 store와 같은 문구가 또 들어가면 화면에
 * "GS25 DX LAB Gasan Smart Store / Gasan Smart Store" 처럼 **매장명이 두 번** 나온다.
 * (2026-09-01 김성태 QA 피드백 — en/ja 두 로케일에서 동시 발생. ko는 처음부터 정상이었다.)
 *
 * 번역 시트를 일괄 반영할 때 brand 칸에 "브랜드+매장명"을 통째로 적어 넣으면 조용히 재발하는
 * 종류라, 문자열 규칙 자체를 테스트로 고정한다.
 */

type CaseStudy = { brand: string; store: string; description: string; date: string };
type Bundle = {
  products: { unmannedStore: { caseStudies: Record<string, Record<string, CaseStudy>> } };
};

const BUNDLES: Array<[string, Bundle]> = [
  ["ko", ko as unknown as Bundle],
  ["en", en as unknown as Bundle],
  ["ja", ja as unknown as Bundle],
];

/** brand는 줄바꿈(렌더 시 공백)으로 이어지므로, 각 줄과 전체를 모두 후보로 본다. */
function brandSegments(brand: string): string[] {
  return [brand, ...brand.split("\n")].map((s) => s.trim()).filter(Boolean);
}

describe("caseStudies brand/store 라벨", () => {
  for (const [locale, bundle] of BUNDLES) {
    const groups = bundle.products.unmannedStore.caseStudies;

    for (const [groupKey, items] of Object.entries(groups)) {
      for (const [index, item] of Object.entries(items)) {
        const path = `${locale} products.unmannedStore.caseStudies.${groupKey}.${index}`;

        it(`${path} — brand가 store를 중복해서 담지 않는다`, () => {
          const store = item.store.trim();
          expect(store).not.toBe("");
          expect(brandSegments(item.brand)).not.toContain(store);
        });
      }
    }
  }
});
