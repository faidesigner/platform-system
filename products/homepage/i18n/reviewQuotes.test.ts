import { describe, expect, it } from "vitest";
import ko from "@/messages/ko.json";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";

/**
 * 리뷰 인용문 조각 무결성 (HOM-75 회귀 방지).
 *
 * 리뷰 인용문은 강조 표시를 위해 `quote.0 / quote.1 / quote.2` 세 조각으로 나뉘어 있고,
 * 렌더 시 **그대로 이어붙여** 한 문단이 된다(ProductReviews.tsx). 즉 조각들은 한 문장을
 * 쪼갠 것이지 각각이 완결된 문장이 아니다.
 *
 * 실제 사고(2026-08-25 번역 반영): 시트의 en·ja 인용문은 **완결된 한 문장**인데, 이를
 * 조각 구조를 고려하지 않고 `quote.2.text`에 통째로 넣었다. 앞 조각(구버전 번역)은 그대로
 * 남아 있어서, 화면에는 이렇게 나갔다.
 *
 *   "Hiring extra staff was a burden, so we adopted VCO. It does the work of one employee
 *    "Additional staffing just wasn't viable for us, so we brought in VCO instead. …"
 *    ^^^^ 구버전 조각                                    ^^^^ 신버전 전문이 다시 시작
 *
 * ko만 정상이었고 en·ja 6개 리뷰에서 문장이 두 번 반복됐다. 키 단위로만 대조하면
 * 각 조각은 "시트 어딘가와 비슷"해서 눈에 띄지 않는다 — **이어붙인 결과**를 봐야 잡힌다.
 */

type Segment = { text?: string };
type Review = { quote?: Segment[] | Record<string, Segment>; store?: string };

/** 메시지 번들은 로케일마다 구조가 같지만 JSON import 타입이 달라, 접근용 최소 타입으로 좁힌다. */
interface MessageBundle {
  products?: { visionCheckout?: { reviews?: Review[] | Record<string, Review> } };
}
const LOCALES: Record<string, MessageBundle> = { ko, en, ja };

/**
 * 인용부호. `"` 는 여닫이가 같은 문자라 "중간에 다시 나온다"로는 판정할 수 없다 —
 * 정상 문장도 끝에 한 번 더 나온다. 그래서 **개수**로 판정한다.
 *   - 대칭 부호(`"`): 정상이면 2개(여는 것 + 닫는 것). 문장이 두 번이면 4개가 된다.
 *   - 비대칭 부호(`「`): 여는 부호가 2개 이상이면 문장이 두 번 시작한 것이다.
 * 인용부호를 아예 쓰지 않는 리뷰(ja의 자사 직영점 소개문)도 있어 그 경우는 검사 대상이 아니다.
 */
const SYMMETRIC = ['"'];
const OPEN_CLOSE: [string, string][] = [
  ["\u300c", "\u300d"], // 「 」
  ["\u201c", "\u201d"], // “ ”
];

function reviewsOf(msg: MessageBundle): Review[] {
  const rv = msg?.products?.visionCheckout?.reviews;
  if (!rv) return [];
  return Array.isArray(rv) ? rv : Object.values(rv);
}

function segmentsOf(r: Review): Segment[] {
  const q = r.quote;
  if (!q) return [];
  return Array.isArray(q) ? q : Object.values(q);
}

const joined = (r: Review) => segmentsOf(r).map((s) => s.text ?? "").join("");
const countOf = (s: string, ch: string) => s.split(ch).length - 1;

describe("리뷰 인용문 조각 무결성", () => {
  it("검사할 리뷰를 실제로 수집했다", () => {
    // 0건이면 아래 단언이 통과해도 아무것도 검사하지 않은 것이므로 먼저 못박는다.
    for (const [loc, msg] of Object.entries(LOCALES)) {
      expect(reviewsOf(msg).length, `${loc} 리뷰 수`).toBeGreaterThan(0);
    }
  });

  for (const [loc, msg] of Object.entries(LOCALES)) {
    it(`${loc}: 조각을 이어붙인 인용문에 문장이 두 번 들어 있지 않다`, () => {
      const broken: string[] = [];
      reviewsOf(msg).forEach((r, i) => {
        const text = joined(r).trim();
        if (!text) return;
        for (const ch of SYMMETRIC) {
          const n = countOf(text, ch);
          if (n > 2) broken.push(`reviews.${i}: ${ch} ${n}개(정상 2개) → ${text.slice(0, 80)}…`);
        }
        for (const [open] of OPEN_CLOSE) {
          const n = countOf(text, open);
          if (n > 1) broken.push(`reviews.${i}: ${open} ${n}개(정상 1개) → ${text.slice(0, 80)}…`);
        }
      });
      expect(broken).toEqual([]);
    });

    it(`${loc}: 모든 인용문이 인용부호로 감싸여 있다`, () => {
      // 어제(2026-08-31) 이 검사를 "인용부호를 **쓴** 문장은 열고 닫힌다"로 좁게 만들었고,
      // 인용부호가 아예 없는 ja reviews.3을 오탐이라 판단해 통과시켰다. 실제로는 결함이었다 —
      // 시트에는 「」가 있는데 코드에서 빠져 있었고, 일본팀이 화면에서 발견했다.
      // 리뷰는 사람의 말을 옮긴 것이라 **예외 없이** 인용부호로 감싼다.
      const bare: string[] = [];
      reviewsOf(msg).forEach((r, i) => {
        const text = joined(r).trim();
        if (!text) return;
        const wrapped =
          SYMMETRIC.some((ch) => text.startsWith(ch) && text.endsWith(ch)) ||
          OPEN_CLOSE.some(([open, close]) => text.startsWith(open) && text.endsWith(close));
        if (!wrapped) bare.push(`reviews.${i}: ${text.slice(0, 60)}… (끝: ${text.slice(-16)})`);
      });
      expect(bare).toEqual([]);
    });

    it(`${loc}: 인용부호를 쓴 문장은 열고 닫힌다`, () => {
      const bad: string[] = [];
      reviewsOf(msg).forEach((r, i) => {
        const text = joined(r).trim();
        if (!text) return;
        for (const ch of SYMMETRIC) {
          const n = countOf(text, ch);
          if (n % 2 !== 0) bad.push(`reviews.${i}: ${ch} 개수 ${n} (홀수 — 닫히지 않았다)`);
        }
        for (const [open, close] of OPEN_CLOSE) {
          if (countOf(text, open) !== countOf(text, close)) {
            bad.push(`reviews.${i}: ${open}${close} 짝이 맞지 않는다 → ${text.slice(0, 60)}…`);
          }
        }
      });
      expect(bad).toEqual([]);
    });
  }
});
