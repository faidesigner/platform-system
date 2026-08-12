/**
 * 로케일별 노출·링크 정책 단일 선언 지점.
 *
 * 왜 한 곳에 모으는가: QA 티켓 HOM-67·68·70·72·76·80이 전부 "특정 로케일에서만 다르게 보여라"였다.
 * 컴포넌트마다 `if (locale === 'ja')`를 넣으면 규칙이 코드 전역에 흩어져 다음 요청에서 무너지고,
 * "지금 ja에서 뭐가 보이는가"를 답하려면 파일을 전수 조사해야 한다.
 * 여기서 표로 선언하고 locale-policy.test.ts가 로케일 전수로 고정한다.
 *
 * 이 파일이 담는 것: **노출 여부 / 링크 대상**(구조).
 * 이 파일이 담지 않는 것: **표시 문구와 로케일별 실데이터 값**(주소·전화·이메일 등) — messages/*.json 담당.
 * config/site.ts가 구조·URL, messages/*.json이 표시 텍스트라는 기존 분리를 그대로 따른다.
 */

export const LOCALES = ["ko", "en", "ja"] as const;
export type PolicyLocale = (typeof LOCALES)[number];

/** VCO 도입 후기 카드 식별자 — 정렬 규칙의 안정 키(HOM-80). */
export type ReviewKey = "bakery" | "cafeteria" | "resort" | "retail";

export interface LocalePolicy {
  /** 채용 메뉴 노출(HOM-68). 채용 정보는 한국 채용 페이지뿐이라 ko에서만 노출한다. */
  showCareers: boolean;

  /** 문의 페이지 하단 상담 토스트(HOM-72). show=false면 토스트 영역 자체를 렌더하지 않는다. */
  contactChat: {
    show: boolean;
    /** 상담 채널 URL. show=false일 때만 null이 될 수 있다. */
    url: string | null;
  };

  /** 리테일테크레터 구독 CTA 노출(HOM-76). 일본 BD팀 요청으로 ja만 숨긴다. */
  showLetterSubscribeCta: boolean;

  footer: {
    /** 이메일 문의 행 노출. ja는 일본팀 주소(contact_jp@)로 노출한다(HOM-67). */
    showEmail: boolean;
    /** 사업자등록번호 행 노출. 한국 사업자번호라 ja에서는 숨긴다(HOM-67). */
    showBizNo: boolean;
    /** 일본 법인 정보(법인명·대표·전화) 추가 행. ja 전용(HOM-67). */
    showJapanEntity: boolean;
  };

  /**
   * VCO 제품 히어로 배경 영상(HOM-70).
   * 반드시 자체 호스팅 경로여야 한다 — 과거 외부 데모 mp4(w3schools)를 폴백으로 쓰던 회귀가 있었다.
   *
   * TODO(HOM-70): ja/en 자막 버전 영상 대기 중. 원본이 각각 46MB·123MB로 히어로 루프에 그대로 쓸 수 없어
   * 기존 vco-hero-bg.mp4와 동일한 압축 단계(원본 24MB → 6.2MB)를 거쳐야 한다.
   * 압축본이 public/videos/product/에 들어오면 아래 경로만 교체하면 된다.
   */
  vcoHeroVideo: string;

  /**
   * VCO 도입 후기 카드 정렬 순서(HOM-80). null이면 config 기본 순서를 유지한다.
   * ja는 일본 고객사(리조트·리테일)를 앞세운다.
   */
  reviewOrder: readonly ReviewKey[] | null;
}

const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_cZLcn";
const LINE_CHANNEL_URL = "https://lin.ee/7sWaw8t";
const VCO_HERO_VIDEO_KO = "/videos/product/vco-hero-bg.mp4";

export const LOCALE_POLICY: Record<PolicyLocale, LocalePolicy> = {
  ko: {
    showCareers: true,
    contactChat: { show: true, url: KAKAO_CHANNEL_URL },
    showLetterSubscribeCta: true,
    footer: { showEmail: true, showBizNo: true, showJapanEntity: false },
    vcoHeroVideo: VCO_HERO_VIDEO_KO,
    reviewOrder: null,
  },
  en: {
    showCareers: false,
    // en 상담 채널이 없어 토스트를 노출하지 않는다 — 빈 CTA를 띄우지 않기 위함.
    contactChat: { show: false, url: null },
    showLetterSubscribeCta: true,
    footer: { showEmail: true, showBizNo: true, showJapanEntity: false },
    vcoHeroVideo: VCO_HERO_VIDEO_KO, // TODO(HOM-70): 영어 자막 버전 압축본으로 교체
    reviewOrder: null,
  },
  ja: {
    showCareers: false,
    contactChat: { show: true, url: LINE_CHANNEL_URL },
    showLetterSubscribeCta: false,
    footer: { showEmail: true, showBizNo: false, showJapanEntity: true },
    vcoHeroVideo: VCO_HERO_VIDEO_KO, // TODO(HOM-70): 일본어 자막 버전 압축본으로 교체
    reviewOrder: ["resort", "retail", "bakery", "cafeteria"],
  },
};

function isPolicyLocale(locale: string | undefined): locale is PolicyLocale {
  return !!locale && (LOCALES as readonly string[]).includes(locale);
}

/**
 * 현재 로케일의 정책을 반환한다. 알 수 없는 로케일은 ko로 폴백한다.
 * (정적 export 라우팅에서 예기치 않은 세그먼트가 들어와도 화면이 비지 않아야 한다.)
 */
export function localePolicy(locale: string | undefined): LocalePolicy {
  return isPolicyLocale(locale) ? LOCALE_POLICY[locale] : LOCALE_POLICY.ko;
}

/**
 * 도입 후기 카드를 로케일 정책 순서로 재배열한다(HOM-80).
 * 정렬 규칙에 없는 카드는 원래 상대 순서를 유지한 채 뒤에 남긴다(신규 카드 추가 시 사라지지 않도록).
 * 원본 배열은 변형하지 않는다.
 */
export function orderReviews<T extends { key: ReviewKey }>(
  reviews: readonly T[],
  locale: string | undefined,
): T[] {
  const order = localePolicy(locale).reviewOrder;
  if (!order) return [...reviews];

  const rank = new Map<string, number>(order.map((key, i) => [key, i]));
  const fallbackRank = order.length;

  return [...reviews].sort(
    (a, b) => (rank.get(a.key) ?? fallbackRank) - (rank.get(b.key) ?? fallbackRank),
  );
}
