import { describe, expect, it } from "vitest";

import ja from "@/messages/ja.json";

/**
 * ja 외래어 표기 오기 차단.
 *
 * 배경(2026-09-02): `products.unmannedStore.storeTypes.1.description`에 `プレファブ工法`이
 * 들어가 있었다. 같은 페이지 5줄 아래 `cards.0.description`은 `プレハブ工法`으로 **맞게** 적혀
 * 있었으니, 한 화면에 같은 단어가 두 표기로 공존한 셈이다. 시트(product-store 46행)도
 * `プレハブ`가 정답이었다 — 시트 셀을 subtitle/description으로 쪼개 옮기는 과정의 전사 오류다.
 *
 * 왜 대조 도구가 못 잡았나: `scripts/sync-messages.mjs`는 ko 원문으로 조인하는데, 이 행은
 * **시트 한 셀(3줄)을 코드가 두 키로 쪼개** 갖는다. 어느 키도 셀 전체와 같지 않으므로 조인이
 * 실패하고 "ko 미매칭 65행"에 묻힌다(실측: 리포트에 이 키가 0건 등장). 즉 이 자리는 도구의
 * 사각지대이고, 그래서 표기 규칙만이라도 여기서 못박는다.
 *
 * 이건 카피 취향이 아니라 **표준 표기** 문제다(prefab = プレハブ). 그래서 blocklist로 둔다 —
 * 문구가 정당하게 바뀌어도 오탐하지 않는다. 새 오기를 발견하면 확인 후 아래에 추가할 것.
 */
const FORBIDDEN: Array<{ wrong: string; right: string; note: string }> = [
  { wrong: "プレファブ", right: "プレハブ", note: "prefab의 표준 표기는 プレハブ (2026-09-02 QA)" },
];

/** 중첩 messages를 `a.b.c` → 문자열 flat map으로 펼친다. */
function flatten(tree: unknown, prefix = ""): Record<string, string> {
  if (typeof tree === "string") return { [prefix]: tree };
  if (!tree || typeof tree !== "object") return {};
  return Object.entries(tree as Record<string, unknown>).reduce<Record<string, string>>(
    (acc, [key, value]) => Object.assign(acc, flatten(value, prefix ? `${prefix}.${key}` : key)),
    {},
  );
}

const JA = flatten(ja);

describe("ja 외래어 표기", () => {
  for (const { wrong, right, note } of FORBIDDEN) {
    it(`\`${wrong}\` 를 쓰지 않는다 (→ \`${right}\`)`, () => {
      const hits = Object.entries(JA)
        .filter(([, v]) => v.includes(wrong))
        .map(([k, v]) => `${k}: ${v.replace(/\n/g, "⏎")}`);
      expect(hits, `${note} — \`${wrong}\` → \`${right}\` 로 고칠 것`).toEqual([]);
    });
  }

  it("blocklist가 썩지 않는다 — 올바른 표기가 실제로 쓰이고 있다", () => {
    // 정답 표기가 코드에서 사라졌다면 그 항목은 더 이상 지킬 대상이 아니다(또는 키가 사라졌다).
    // 규칙만 남아 의미를 잃는 것을 막는다.
    for (const { right } of FORBIDDEN) {
      expect(
        Object.values(JA).some((v) => v.includes(right)),
        `\`${right}\` 가 ja messages에 없다 — blocklist 항목이 유효한지 확인할 것`,
      ).toBe(true);
    }
  });
});
