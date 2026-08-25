import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";

type Tree = { [key: string]: string | Tree };

/** 중첩 messages 객체를 `a.b.c` → 값 형태의 flat map으로 펼친다. */
function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") acc[path] = value;
    else Object.assign(acc, flatten(value, path));
    return acc;
  }, {});
}

const KO = flatten(ko as Tree);
const EN = flatten(en as Tree);
const JA = flatten(ja as Tree);

/**
 * 서로 다른 ko 원문인데 번역문이 같아도 되는 키 묶음(의도된 중복).
 * 스프레드시트 일괄 반영 시 "다른 키의 번역이 잘못 복사되는" 사고를 잡기 위한 화이트리스트이므로,
 * 새 항목을 추가할 때는 반드시 의도된 중복인지 확인하고 근거를 주석으로 남긴다.
 */
const INTENTIONAL_DUPLICATE_GROUPS: string[][] = [
  // "자세히 알아보기" / "더 알아보기" — 링크 CTA는 en/ja에서 한 표현으로 통일
  ["common.cta.learnMore", "common.cta.mediaMore", "media.showcase.youtube.ctaLabel"],
  // "문의하기" / "도입 문의하기" — nav·CTA·폼 제출 버튼 모두 Contact 하나로 통일
  [
    "common.cta.contact",
    "common.cta.requestDemo",
    "nav.contact",
    "contact.meta.title",
    "contact.form.submitLabel",
  ],
  // "미디어" / "Media" — 섹션 제목이 ko에서만 영문 표기
  ["nav.media", "media.meta.title", "media.showcase.title"],
  // "대표이사" / "CEO"
  ["footer.labels.ceo", "about.people.cards.1.role", "about.people.cards.3.role"],
  // "이메일 문의" / "이메일"
  ["footer.labels.email", "contact.fields.email.label"],
  // 같은 영상의 ko 제목 표기만 다름(무인매장/무인 매장)
  [
    "media.showcase.videoOverrides.VJSlS3ujdEo.title",
    "media.showcase.videoOverrides.20XzJavnjyY.title",
  ],
  // "급식" ↔ "Cafeteria&Canteen" — 일본어권에서는 사내·학생 식당으로 풀어 쓰는 것이 마케팅 확정안
  [
    "products.visionCheckout.industries.1.label",
    "products.visionCheckout.reviews.1.category",
    "contact.interests.vco.options.catering",
  ],
  // 아래 3그룹은 번역 시트(2026-08-12)가 en만 같은 표현으로 통일한 건이다(HOM-75).
  // 판별 근거: 세 건 모두 **ja는 서로 다른 번역**이라 오배치가 아니라 en 카피 의도다.
  //
  // "실제 도입 후기 더보기"(MA01/19) / "고객사 도입 후기"(PR01/41) → en 둘 다 "Case Studies"
  //   ja는 導入事例を見る / 導入事例・お客様の声 로 구분됨
  ["common.cta.reviewsMore", "products.visionCheckout.reviewsTitle"],
  // "막힘없는 고객 경험"(MA01/16) / "간편한 고객 경험"(PR02/26) → en 둘 다 "Seamless Shopping"
  //   ja는 また訪れたくなる店舗体験 / 簡単な顧客体験 로 구분됨
  ["home.whyFai.items.2.title", "products.unmannedStore.storeTypes.0.cards.0.title"],
  // "리테일의 미래"(MA01/7 앞부분) / "리테일 혁신"(IN01/1) → en 둘 다 "Retail AI"
  //   시트 MA01/7은 "Retail AI  At Your Store" 한 행이고 코드가 title1/title2로 쪼개 쓴다.
  //   ja는 リテールの未来を / リテールイノベーション 로 구분됨
  ["home.hero.title1", "about.hero.eyebrow"],
];

function allowedDuplicate(keys: string[]): boolean {
  return INTENTIONAL_DUPLICATE_GROUPS.some((group) => keys.every((k) => group.includes(k)));
}

describe("messages 로케일 정합성", () => {
  it("ko/en/ja 키 집합이 동일하다", () => {
    const koKeys = Object.keys(KO);
    // ja 전용 콘텐츠는 렌더 시점에 로케일로 가드된다.
    // - products.visionCheckout.reviews.3.*: 일본 시장용 추가 도입사례 (page.tsx가 locale === 'ja'로 가드)
    // - footer.japanEntity.*: 일본 법인 정보(법인명·대표·전화) (HOM-67, locale-policy의 showJapanEntity로 가드)
    const jaOnlyAllowed = /^(products\.visionCheckout\.reviews\.3\.|footer\.japanEntity\.)/;
    expect(Object.keys(EN).filter((k) => !(k in KO))).toEqual([]);
    expect(koKeys.filter((k) => !(k in EN))).toEqual([]);
    expect(Object.keys(JA).filter((k) => !(k in KO) && !jaOnlyAllowed.test(k))).toEqual([]);
    expect(koKeys.filter((k) => !(k in JA))).toEqual([]);
  });

  // 스프레드시트 일괄 번역 반영 시 다른 키의 번역문이 잘못 복사돼 들어오는 사고를 구조적으로 차단한다.
  // (실제 사고: reviews.0.category "베이커리" ← industries.0.label "Bakery&Cafe"의 ja 번역이 유입)
  for (const [locale, MESSAGES] of [
    ["en", EN],
    ["ja", JA],
  ] as const) {
    it(`${locale}: 서로 다른 ko 원문이 같은 번역문을 공유하지 않는다`, () => {
      const byTranslation = new Map<string, string[]>();
      for (const [key, value] of Object.entries(MESSAGES)) {
        if (!(key in KO)) continue;
        if (value.trim().length < 2) continue;
        if (value.startsWith("MISSING_FROM_DESIGN")) continue;
        byTranslation.set(value, [...(byTranslation.get(value) ?? []), key]);
      }

      const collisions = [...byTranslation.entries()]
        .filter(([, keys]) => keys.length > 1)
        .filter(([, keys]) => new Set(keys.map((k) => KO[k])).size > 1)
        .filter(([, keys]) => !allowedDuplicate(keys))
        .map(([value, keys]) => `${value} ← ${keys.map((k) => `${k}(ko: ${KO[k]})`).join(" / ")}`);

      expect(collisions).toEqual([]);
    });
  }
});
