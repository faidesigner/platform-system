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
  // "베이커리" ↔ "Bakery&Cafe" — 업종 라벨과 문의 폼 관심분야가 같은 업종을 가리킨다.
  // ja는 둘 다 ベーカリー・カフェ(카페 포함)로 통일. 아래 급식 그룹과 같은 구조다.
  // 판별 근거: 시트 contactUs 13행 ja = ベーカリー・カフェ (product-vco 42행 reviews.0.category는
  // ベーカリー로 별개 값이라 이 그룹에 넣지 않는다 — 탭이 다르면 값도 다르다).
  [
    "products.visionCheckout.industries.0.label",
    "contact.interests.vco.options.bakery",
  ],
  // "급식" ↔ "Cafeteria&Canteen" — 일본어권에서는 사내·학생 식당으로 풀어 쓰는 것이 마케팅 확정안
  [
    "products.visionCheckout.industries.1.label",
    "products.visionCheckout.reviews.1.category",
    "contact.interests.vco.options.catering",
  ],
  // 아래 2그룹은 번역 시트의 en 카드 재구성(2026-08-26 마케팅 확정)이 만든 중복이다.
  // 오배치가 아니라는 판별 근거: **시트 자체가 양쪽 행에 같은 en을 배정**하고 있다.
  //
  // "어떻게 달라질까요?"(product-vco 17) / "WALK-THROUGH의 효과를 경험해 보세요"(product-store 9)
  //   → 시트 en 둘 다 "What Can You Expect?"
  ["products.visionCheckout.benefitsTitle", "products.unmannedStore.effectsTitle"],
  // "인력 리스크 관리"(product-vco 24) / "최소 인력으로 최대 효율을"(main 14)
  //   → 시트 en 둘 다 "Smarter Staffing"
  ["products.visionCheckout.benefits.1.eyebrow", "home.whyFai.items.1.title"],

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
  // 시트 contactUs 1행 ja(`導入のご相談から最適なご提案まで専門スタッフが丁寧にサポートいたします`)가
  // 화면 타이틀과 SEO 설명 두 자리에 같은 문구로 지정돼 있다. ko·en은 서로 다르다
  // (ko 타이틀은 3줄, meta.description은 한 줄 요약). ja만 시트가 같은 문장을 쓴다 (2026-08-31).
  ["contact.title.0", "contact.meta.description"],
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

    // ja에서 **의도적으로 제거한** 키. 값을 비우거나 남겨두면 안 되는 것만 여기 넣는다.
    // - footer.emailValue / footer.labels.email (HOM-101, 2026-08-28 JP-BD 요청):
    //   ja는 메일 행을 노출하지 않는다. 화면에서 감추는 것만으로는 부족한데, next-intl이
    //   메시지 번들을 HTML script 페이로드로 직렬화하므로 키가 남으면 **주소 문자열이
    //   페이지 소스에 그대로 실린다**(실측: dev 배포본 /ja/ 소스에 남아 있었다).
    //   스팸 크롤러는 렌더 결과가 아니라 소스를 긁으므로 번들에서 빼야 한다.
    //   FooterBridge가 showEmail일 때만 t()를 호출한다 — 미노출 로케일에서 t()를 부르면
    //   MISSING_MESSAGE가 나고, 그게 이 결정이 깨졌다는 신호다.
    const jaIntentionallyOmitted = new Set(["footer.emailValue", "footer.labels.email"]);

    // 줄 배열은 로케일마다 줄 수가 달라도 된다. AboutPartners는 description 배열의 각 요소를
    // <span class="block"> 한 줄로 렌더하므로, 요소 수 = 줄 수다.
    // en 카피는 시트에서 한 줄로 재편됐고(`Serve global market leaders`), ko·ja는 두 줄이다
    // (2026-08-31 시트 aboutUs 4행). 억지로 두 줄로 쪼개면 어색한 줄바꿈이 생긴다.
    // ⚠️ 예외는 **키를 명시**한다 — "배열이면 길이 달라도 됨"으로 일반화하면 한 줄이 통째로
    //    누락된 진짜 사고를 못 잡는다.
    const lineCountMayDiffer = new Set([
      "about.partners.description.1",
      // ja는 세 줄이다(ko·en보다 한 줄 많다) — 2026-09-01 김성태 요청으로
      // "グローバル市場をリードする / パートナーとともに / 技術を超えた価値を創造しています"로 끊었다.
      // 즉 이 예외는 **양방향**이다: ko에 없는 줄이 ja에 있을 수도 있다.
      "about.partners.description.2",
      // 시트 contactUs 1행: ko·en은 3줄, ja는 **한 문장**이다. ContactUsSection이 배열 요소마다
      // 한 줄을 렌더하므로 ja를 억지로 3줄로 쪼개면 어색한 줄바꿈이 생긴다 (2026-08-31).
      "contact.title.1",
      "contact.title.2",
    ]);

    expect(Object.keys(EN).filter((k) => !(k in KO))).toEqual([]);
    expect(koKeys.filter((k) => !(k in EN) && !lineCountMayDiffer.has(k))).toEqual([]);
    expect(
      Object.keys(JA).filter(
        (k) => !(k in KO) && !jaOnlyAllowed.test(k) && !lineCountMayDiffer.has(k),
      ),
    ).toEqual([]);
    expect(koKeys.filter((k) => !(k in JA) && !jaIntentionallyOmitted.has(k) && !lineCountMayDiffer.has(k))).toEqual([]);

    // 예외 목록이 썩는 것을 막는다 — 키가 ko에서 사라졌는데 예외만 남으면 의미가 없다.
    expect([...jaIntentionallyOmitted].filter((k) => !(k in KO))).toEqual([]);
    // lineCountMayDiffer는 양방향 예외라 ko에 없을 수도 있다(ja가 더 긴 경우).
    // "어느 로케일에도 없는" 키만 썩은 예외로 본다.
    expect(
      [...lineCountMayDiffer].filter((k) => !(k in KO) && !(k in EN) && !(k in JA)),
    ).toEqual([]);
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
