/**
 * SEO 콘텐츠 단일 소스 (HOM-74).
 *
 * 출처: Notion「SEO」페이지 > **2026 리뉴얼 버전** (업데이트 2026.08.05).
 * 문구를 바꿀 때는 반드시 그 문서를 먼저 갱신하고 여기로 옮긴다 — 코드가 원본이 아니다.
 *
 * 이전 구현은 2024/2026-v3.0.0 판 문구에 머물러 있었고, 키워드는 `<meta name="keywords">`에
 * 7개 수준으로만 들어가 있었다. 명세는 키워드를 **JSON-LD(Schema.org)** 로 넣도록 명시한다
 * (화면 카피·마크업은 그대로 두고, 봇만 읽는 구조화 데이터로 제공 → keyword stuffing 페널티 회피).
 */

export const SEO_LOCALES = ["ko", "en", "ja"] as const;
export type SeoLocale = (typeof SEO_LOCALES)[number];

export interface SiteSeoEntry {
  /** 검색결과 제목(①). 홈의 기본 title이자 하위 페이지 title 템플릿의 베이스. */
  title: string;
  /** 검색결과 설명(②). 권장 길이 — ko 60~90자 / en 150~160자 / ja 80~120자. */
  description: string;
  /** 검색 키워드(③) — JSON-LD로만 노출한다. meta keywords로 쓰지 않는다. */
  keywords: string[];
  /** 링크 미리보기 제목(⑤). */
  ogTitle: string;
  /** 링크 미리보기 설명(⑤). */
  ogDescription: string;
}

export const SITE_SEO: Record<SeoLocale, SiteSeoEntry> = {
  ko: {
    title: "AI 무인계산대·무인매장 솔루션 | 파인더스에이아이",
    description:
      "바코드 없는 빵·샐러드·구내식당 메뉴까지 3D Vision AI가 인식하는 무인계산대 VCO. 베이커리·카페·급식·리조트의 계산 대기시간과 인력 부담을 줄입니다. 도입 후기 확인하기.",
    keywords: [
      "파인더스에이아이", "파인더스AI", "Fainders.AI", "VCO", "비전체크아웃",
      "무인계산대", "AI 무인계산대", "셀프계산대", "무인결제", "무인매장", "무인점포",
      "베이커리 무인계산대", "빵집 무인계산대", "베이커리 키오스크", "구내식당 무인결제",
      "급식 셀프계산대", "바코드 없는 상품 결제", "베이커리 인건비 절감", "POS 연동",
      "간편결제 연동", "키오스크 교체", "베이커리 키오스크 추천", "빵집 포스기",
      "베이커리 자동화", "빵집 셀프계산대", "빵집 키오스크", "빵집 무인계산", "AI 스캐너",
    ],
    ogTitle: "바코드 없이 결제 가능한 AI 무인계산대",
    ogDescription:
      "빵 하나하나 바코드를 붙이지 않아도, 3D Vision AI가 알아서 인식합니다. 베이커리·급식·리조트의 계산을 무인화하는 파인더스에이아이 VCO.",
  },
  en: {
    title: "AI Self-Checkout & Unmanned Store Solutions | Fainders.AI",
    description:
      "VCO is an AI self-checkout powered by Vision AI. It rings up everything, even barcode-free pastries and meals, cutting wait times and staffing shortages.",
    keywords: [
      "Fainders.AI", "Fainders AI", "VCO", "Vision Check-Out", "vision checkout",
      "AI self-checkout", "AI checkout", "self-checkout kiosk", "cashierless checkout",
      "checkout-free store", "autonomous store", "unmanned store", "computer vision checkout",
      "AI-powered checkout", "barcode-free checkout", "bakery self-checkout",
      "bakery checkout system", "bakery kiosk", "bakery POS", "bakery automation",
      "cafeteria self-checkout", "cafeteria checkout system", "canteen self-checkout",
      "corporate cafeteria checkout", "resort self-checkout", "POS integration",
      "reduce checkout lines", "retail labor shortage", "AI retail", "retail AI",
      "retail automation", "self-service checkout", "frictionless checkout", "AI scanner",
    ],
    ogTitle: "AI Self-Checkout, No Barcodes Needed",
    ogDescription:
      "Vision AI reads barcode-free items on its own. Fainders.AI automates checkout for bakeries, cafeterias, hospitality, and more.",
  },
  ja: {
    title: "AIセルフレジ・無人店舗ソリューション | Fainders.AI",
    description:
      "3D画像認識AIがバーコードのないパンや青果、調理食品などを瞬時に認識するAIセルフレジ「VISION CHECK-OUT」。ベーカリー・社員食堂・リゾートなどの会計待ち時間を短縮し、省人化と売上向上を実現します。導入事例はこちら。",
    keywords: [
      "Fainders.AI", "ファインダーズAI", "ファインダーズＡＩ", "ファインダーズエーアイ",
      "株式会社ファインダーズＡＩジャパン", "ファインダーズＡＩジャパン",
      "VISION CHECK-OUT", "VCO", "AIセルフレジ", "セルフレジ", "無人レジ", "無人決済",
      "無人店舗", "画像認識AI", "3D画像認識", "バーコードレス決済", "人手不足",
      "レジ待ち 解消", "レジ待ち時間 短縮", "レジ業務 自動化", "会計業務 効率化",
      "省人化", "人件費削減", "ベーカリー セルフレジ", "ベーカリー 無人化",
      "社員食堂 セルフレジ", "社員食堂 自動精算", "社員食堂 無人決済",
      "コンビニ セルフレジ", "コンビニ 無人レジ", "スーパー セルフレジ",
      "フードコート セルフレジ", "ホテル セルフレジ", "ホテル 無人決済",
      "リゾート セルフレジ", "リゾート 無人決済", "売店 無人化",
      "レジャー施設 セルフレジ", "小売DX", "リテールDX", "店舗DX",
      "セルフレジ 導入", "セルフレジ 比較", "社食 セルフレジ", "社食 無人決済",
      "学食 セルフレジ", "学食 無人決済", "パン屋 セルフレジ", "パン屋 無人レジ",
      "無人コンビニ", "オフィスコンビニ", "無人売店", "店舗無人化", "24時間営業",
      "店舗運営 効率化", "店舗省人化",
    ],
    ogTitle: "レジに並ばない。バーコードもいらない。AIセルフレジ",
    ogDescription:
      "商品一つひとつにバーコードを付ける必要はありません。3D画像認識AIが商品を自動で識別し、会計までスムーズに完了します。ベーカリーや社員食堂、リゾートなど、さまざまな現場で導入が進むFainders.AIのAIセルフレジ「VISION CHECK-OUT」です。",
  },
};

/**
 * 페이지별 검색결과 설명(④ 사이트 링크).
 * 구글 사이트링크에 노출되는 문구라 페이지마다 다른 값을 준다.
 */
export type SeoPageKey =
  | "home"
  | "about"
  | "media"
  | "contact"
  | "vision-check-out"
  | "unmanned-store";

export const PAGE_SEO_DESCRIPTION: Record<SeoPageKey, Record<SeoLocale, string>> = {
  home: {
    ko: SITE_SEO.ko.description,
    en: SITE_SEO.en.description,
    ja: SITE_SEO.ja.description,
  },
  "vision-check-out": {
    ko: "트레이를 올려놓기만 하면 결제 완료. 바코드 없는 빵·샐러드·급식 메뉴까지 3D Vision AI가 인식하는 무인계산대.",
    en: "Place the tray and let AI check out. Vision AI reads barcode-free pastries, salads, cafeteria meals, and more.",
    ja: "商品を台に置くだけで、会計が完了。バーコードのないパンや青果、調理食品などにも対応する3D画像認識AI搭載のAIセルフレジです。",
  },
  "unmanned-store": {
    ko: "매장에 들어와 상품을 들고 나가면 결제가 끝나는 무인 매장 솔루션입니다.",
    en: "Customers walk in, shop, and walk out without checkout.",
    ja: "商品を手に取り、そのまま退店するだけ。レジもスタッフもいらない、ウォークスルー型無人店舗ソリューションです。",
  },
  contact: {
    ko: "도입 고민부터 커스텀 솔루션 제안까지, 전문가가 직접 답변해드립니다.",
    en: "Got any questions? Talk to us.",
    ja: "導入のご相談から最適なご提案まで、専門スタッフがサポートいたします。",
  },
  about: {
    ko: "반복되는 결제 업무를 AI로 자동화합니다. 고객이 리테일의 본질에 집중할 수 있도록, 파인더스에이아이는 비전 AI 무인화 기술을 만듭니다.",
    en: "AI automates checkout to allow retailers to focus on what really matters.",
    ja: "レジ業務をAIで自動化。Fainders.AIは、お客様がリテールの本質に集中できるよう、画像認識AIを活用した無人化ソリューションを提供しています。",
  },
  media: {
    ko: "파인더스에이아이의 언론 보도, 뉴스레터, SNS 채널, 리테일 테크 인사이트를 한곳에서 확인하세요.",
    en: "All updates on Fainders.AI in one place.",
    ja: "Fainders.AIのプレスリリース、SNS、リテールテックニュースレターなど、最新情報をご覧いただけます。",
  },
};

/**
 * 링크 미리보기 이미지(⑤) — 1200×630.
 *
 * ⚠️ 현재 값은 **임시본**이다. 명세에 첨부된 파일이 4032×3024 원본 사진(3.2MB, 회전 상태)이라
 * 규격(1200×630 / 텍스트 중앙 40% 배치)을 만족하지 않아 그대로 쓸 수 없었다.
 * 승인된 홈 히어로 컷(imageSection-hero-*)을 1200×630으로 크롭해 로케일별로 만들어 둔 것이며,
 * 디자인팀의 정식 OG 에셋이 나오면 이 파일들만 교체하면 된다.
 */
export const OG_IMAGE: Record<SeoLocale, string> = {
  ko: "/images/og/og-ko.jpg",
  en: "/images/og/og-en.jpg",
  ja: "/images/og/og-ja.jpg",
};

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export function isSeoLocale(locale: string | undefined): locale is SeoLocale {
  return !!locale && (SEO_LOCALES as readonly string[]).includes(locale);
}

/** 로케일별 사이트 SEO. 알 수 없는 로케일은 ko로 폴백. */
export function getSiteSeo(locale: string | undefined): SiteSeoEntry {
  return isSeoLocale(locale) ? SITE_SEO[locale] : SITE_SEO.ko;
}

/** 페이지·로케일별 설명. 알 수 없는 로케일은 ko로 폴백. */
export function getPageDescription(page: SeoPageKey, locale: string | undefined): string {
  const byLocale = PAGE_SEO_DESCRIPTION[page];
  return isSeoLocale(locale) ? byLocale[locale] : byLocale.ko;
}

/** 로케일별 OG 이미지. 알 수 없는 로케일은 ko로 폴백. */
export function getOgImage(locale: string | undefined): string {
  return isSeoLocale(locale) ? OG_IMAGE[locale] : OG_IMAGE.ko;
}
