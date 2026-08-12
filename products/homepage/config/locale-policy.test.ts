import { describe, it, expect } from "vitest";
import { localePolicy, LOCALE_POLICY, orderReviews, type ReviewKey } from "./locale-policy";

/**
 * 로케일별 노출·링크 정책 회귀 테스트.
 *
 * 이 파일의 존재 이유: HOM-67·68·70·72·76·80이 전부 "특정 로케일에서만 다르게"를 요구했다.
 * 컴포넌트마다 `if (locale === 'ja')`를 흩뿌리면 다음 요청에서 무너지므로 정책을 한 곳에 모았고,
 * 그 표를 로케일 전수로 고정해 규칙이 조용히 뒤집히는 것을 막는다.
 */

const ALL_LOCALES = ["ko", "en", "ja"] as const;

describe("localePolicy — 로케일 해석", () => {
  it("지원 로케일 3종에 대해 정책을 반환한다", () => {
    for (const l of ALL_LOCALES) {
      expect(localePolicy(l)).toBe(LOCALE_POLICY[l]);
    }
  });

  it("알 수 없는 로케일은 ko 정책으로 폴백한다", () => {
    // 정적 export + 미들웨어 조합에서 예기치 않은 세그먼트가 들어와도 화면이 비지 않아야 한다.
    expect(localePolicy("zh")).toBe(LOCALE_POLICY.ko);
    expect(localePolicy("")).toBe(LOCALE_POLICY.ko);
    expect(localePolicy(undefined)).toBe(LOCALE_POLICY.ko);
  });
});

describe("HOM-68 — 채용 메뉴는 ko 전용", () => {
  it("ko에서만 채용 메뉴를 노출한다", () => {
    expect(localePolicy("ko").showCareers).toBe(true);
    expect(localePolicy("en").showCareers).toBe(false);
    expect(localePolicy("ja").showCareers).toBe(false);
  });
});

describe("HOM-72 — 문의 토스트 채널", () => {
  it("ko는 카카오톡 채널로 연결한다", () => {
    const { contactChat } = localePolicy("ko");
    expect(contactChat.show).toBe(true);
    expect(contactChat.url).toBe("http://pf.kakao.com/_cZLcn");
    expect(contactChat.channel).toBe("kakao");
  });

  it("ja는 LINE 링크로 연결한다", () => {
    const { contactChat } = localePolicy("ja");
    expect(contactChat.show).toBe(true);
    expect(contactChat.url).toBe("https://lin.ee/7sWaw8t");
    // GA location이 contact_kakao로 남으면 ja 유입이 카카오로 잘못 집계된다.
    expect(contactChat.channel).toBe("line");
  });

  it("en은 토스트 자체를 노출하지 않는다", () => {
    const { contactChat } = localePolicy("en");
    expect(contactChat.show).toBe(false);
    expect(contactChat.url).toBeNull();
    expect(contactChat.channel).toBeNull();
  });

  it("노출하는 로케일은 반드시 링크와 채널 식별자를 가진다 (빈 버튼·오집계 방지)", () => {
    for (const l of ALL_LOCALES) {
      const { contactChat } = localePolicy(l);
      if (contactChat.show) {
        expect(contactChat.url).toBeTruthy();
        expect(contactChat.channel).toBeTruthy();
      }
    }
  });
});

describe("HOM-76 — 리테일테크레터 구독 CTA", () => {
  it("ja에서만 구독 CTA를 감춘다 (일본 BD팀 요청)", () => {
    expect(localePolicy("ko").showLetterSubscribeCta).toBe(true);
    expect(localePolicy("en").showLetterSubscribeCta).toBe(true);
    expect(localePolicy("ja").showLetterSubscribeCta).toBe(false);
  });
});

describe("HOM-67 — 푸터 로케일 대응", () => {
  it("ja는 이메일 행을 노출하고 사업자등록번호를 감춘다", () => {
    // 기존 hideEmail={locale === 'ja'} 를 뒤집는 변경 — ja 메일은 일본팀 주소로 노출한다.
    const ja = localePolicy("ja").footer;
    expect(ja.showEmail).toBe(true);
    expect(ja.showBizNo).toBe(false);
  });

  it("ko/en은 사업자등록번호를 노출한다", () => {
    expect(localePolicy("ko").footer.showBizNo).toBe(true);
    expect(localePolicy("en").footer.showBizNo).toBe(true);
  });

  it("ja에서만 일본 법인 정보 행(법인명·대표·전화)을 추가 노출한다", () => {
    expect(localePolicy("ja").footer.showJapanEntity).toBe(true);
    expect(localePolicy("ko").footer.showJapanEntity).toBe(false);
    expect(localePolicy("en").footer.showJapanEntity).toBe(false);
  });
});

describe("HOM-70 — VCO 히어로 영상 로케일 분기", () => {
  it("모든 로케일이 재생 가능한 영상 경로를 가진다", () => {
    for (const l of ALL_LOCALES) {
      const src = localePolicy(l).vcoHeroVideo;
      expect(src).toMatch(/^\/videos\/.+\.mp4$/);
    }
  });

  it("영상 경로는 외부 호스트를 참조하지 않는다", () => {
    // 운영 히어로가 외부 사이트(w3schools 데모 mp4)에 의존하던 회귀를 막는다.
    for (const l of ALL_LOCALES) {
      expect(localePolicy(l).vcoHeroVideo).not.toMatch(/^https?:\/\//);
    }
  });
});

describe("HOM-80 — VCO 도입 후기 카드 순서", () => {
  const REVIEWS: { key: ReviewKey }[] = [
    { key: "bakery" },
    { key: "cafeteria" },
    { key: "resort" },
    { key: "retail" }, // ja 전용 카드
  ];

  it("ja는 리조트 > 리테일 > 베이커리 > 급식 순으로 정렬한다", () => {
    const ordered = orderReviews(REVIEWS, "ja").map((r) => r.key);
    expect(ordered).toEqual(["resort", "retail", "bakery", "cafeteria"]);
  });

  it("ko/en은 config 기본 순서를 그대로 유지한다", () => {
    for (const l of ["ko", "en"] as const) {
      const ordered = orderReviews(REVIEWS, l).map((r) => r.key);
      expect(ordered).toEqual(["bakery", "cafeteria", "resort", "retail"]);
    }
  });

  it("정렬 규칙에 없는 카드는 뒤에 원래 순서로 남긴다", () => {
    const withUnknown = [...REVIEWS, { key: "unknown" as ReviewKey }];
    const ordered = orderReviews(withUnknown, "ja").map((r) => r.key);
    expect(ordered).toEqual(["resort", "retail", "bakery", "cafeteria", "unknown"]);
  });

  it("원본 배열을 변형하지 않는다", () => {
    const input = [...REVIEWS];
    orderReviews(input, "ja");
    expect(input.map((r) => r.key)).toEqual(["bakery", "cafeteria", "resort", "retail"]);
  });
});
