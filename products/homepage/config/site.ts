export type QuoteSegment = {
  text: string;
  emphasis?: boolean;
};

export const siteConfig = {
  name: "FAI",
  fullName: "FAI | Fainders AI",
  url: "https://fainders.ai",
  description: "AI 기반 솔루션으로 비즈니스의 미래를 함께 만들어갑니다.",
  keywords: ["AI", "인공지능", "솔루션", "FAI", "Fainders"],

  nav: [
    { label: "서비스", href: "/services" },
    { label: "회사 소개", href: "/about" },
    { label: "문의", href: "/contact" },
  ],

  products: {
    "vision-check-out": {
      slug: "vision-check-out",
      label: "VISION CHECK-OUT",
      heroSubtitle: "차세대 AI 무인 결제 솔루션",
      heroTitle: "VISION CHECK-OUT",
      ctaLabel: "도입 문의하기",
      featuresTitle: "VCO는 무엇이 다를까요?",
      features: [
        {
          title: "빈틈없이 스캔하는\n14대의 AI 카메라",
          description: "국내 유일 멀티뷰 3D 인식 기술을 적용했어요",
          image: "/images/products/vco/vco-feature-camera.png",
          imagePosition: "bottom" as const,
        },
        {
          title: "장비 교체없이\n기존 POS 그대로",
          description: "사용 중인 POS 그대로 사용할 수 있어요",
          image: "/images/products/vco/vco-feature-pos.png",
          imagePosition: "bottom" as const,
        },
        {
          title: "오차없이 정확한 99.9% 인식률",
          description: "타사 대비 월등한 성능으로 1초면 스캔 완료되는 압도적인 속도로 처리해요",
          image: "/images/products/vco/vco-feature-accuracy.png",
          imagePosition: "right" as const,
        },
      ],
      benefitsTitle: "어떻게 달라질까요?",
      benefits: [
        {
          icon: "checkout-flow" as const,
          eyebrow: "구매 과정의 간소화",
          title: "바코드 없는 상품까지\n매끄러운 결제",
          video: "MISSING_FROM_DESIGN",
          poster: "MISSING_FROM_DESIGN",
          imagePosition: "left" as const,
          items: [
            {
              subtitle: "쉬운 사용법",
              description: "바코드를 직접 스캔할 필요 없이 트레이를 올려놓기만 하면 끝!",
            },
            {
              subtitle: "품목 제한 없는 AI 인식 기술",
              description: "바코드가 없는 상품인 빵, 샐러드, 구내식당 메뉴, 부품까지 3D Vision AI가 정확히 인식하여 품목 제한 없이 무인화가 가능해요",
            },
          ],
        },
        {
          icon: "staffing" as const,
          eyebrow: "인력 리스크 관리",
          title: "구인 스트레스 없는 매장",
          video: "MISSING_FROM_DESIGN",
          poster: "MISSING_FROM_DESIGN",
          imagePosition: "right" as const,
          items: [
            {
              subtitle: "인건비 절감",
              description: "VCO가 단순 계산 업무를 대신하여 사장님의 인건비 부담이 줄어 합리적인 매장 운영이 가능해요",
            },
            {
              subtitle: "근무자 채용 및 교육 부담 해소",
              description: "복잡한 직원 관리와 업무 교육에서 벗어날 수 있어요\n사람을 구하기 힘든 환경에서도 최소 인원으로 안정적으로 운영하세요",
            },
          ],
        },
        {
          icon: "profitability" as const,
          eyebrow: "수익성 개선",
          title: "안내가 필요없는\n직관적인 결제 과정",
          video: "MISSING_FROM_DESIGN",
          poster: "MISSING_FROM_DESIGN",
          imagePosition: "left" as const,
          items: [
            {
              subtitle: "빠른 회전율",
              description: "신속한 결제로 대기줄이 줄어들어 피크 타임 매출을 높일 수 있어요",
            },
            {
              subtitle: "디지털 소외 없는 언택트 환경",
              description: "키오스크 사용을 어려워하는 고객부터 셀프 결제를 원하는 고객까지\n누구에게나 쉽고, 모두에게 빠른 결제",
            },
          ],
        },
      ],
      industriesTitle: "주요 적용 산업",
      industriesDescription: "짧은 시간에 많은 사람이 몰리는 공간에서 바코드 없는 물건도 빠르게 결제할 수 있어요",
      industries: [
        { label: "Bakery&Cafe", image: "/images/products/industries/vco-industry-bakery-cafe.png" },
        { label: "Cafeteria&Canteen", image: "/images/products/industries/vco-industry-cafeteria-canteen.png" },
        { label: "Hospitality", image: "/images/products/industries/vco-industry-hospitality.png" },
      ],
      reviewsTitle: "고객사 도입 후기",
      reviews: [
        {
          category: "베이커리",
          categoryColorVar: "--color-text-tag-category-yellow",
          iconBgVar: "--color-filled-tag-category-yellow-secondary",
          icon: "bakery" as const,
          store: "만나밀 베이커리",
          role: "총괄 매니저 송주희",
          image: "/products/reviews/vco-review-bakery.png",
          quote: [
            { text: "\"추가로 직원을 뽑기에는 부담이 있어 VCO를 도입했어요. " },
            { text: "직원 1명 역할", emphasis: true },
            { text: "을 해주니 확실히 업무량이 줄었어요. 비슷하게 생긴 빵도 구분을 잘 해서 다른 매장에 추천하고 싶어요.\"" },
          ],
        },
        {
          category: "급식",
          categoryColorVar: "--color-text-tag-category-green",
          iconBgVar: "--color-filled-tag-category-green-secondary",
          icon: "cafeteria" as const,
          store: "대형급식 W사 관리자",
          role: "",
          image: "/products/reviews/vco-review-cafeteria.png",
          quote: [
            { text: "\"점심 피크타임에 " },
            { text: "시간당 360명", emphasis: true },
            { text: " 결제 처리가 가능해져 대기줄이 대폭 줄었고, 솔루션 도입으로 결제 정확도가 높아졌습니다.\"" },
          ],
        },
        {
          category: "리조트",
          categoryColorVar: "--color-text-tag-category-purple",
          iconBgVar: "--color-filled-tag-category-purple-secondary",
          icon: "resort" as const,
          store: "일본 홋카이도 Niseko 리조트 매니저",
          role: "",
          image: "/products/reviews/vco-review-resort.png",
          quote: [
            { text: "\"산속 리조트 특성상 인력 채용과 유지가 어려운데, VCO 도입으로 " },
            { text: "구인 걱정", emphasis: true },
            { text: "을 덜었습니다. 외국인 고객까지 응대 가능하니 업무 부담이 적어졌어요.\"" },
          ],
        },
      ],
    },
    "unmanned-store": {
      slug: "unmanned-store",
      label: "UNMANNED STORE",
      heroSubtitle: "MISSING_FROM_DESIGN",
      heroTitle: "UNMANNED STORE",
      ctaLabel: "도입 문의하기",
      featuresTitle: "MISSING_FROM_DESIGN",
      features: [] as {
        title: string;
        description: string;
        image: string;
        imagePosition?: "bottom" | "right";
      }[],
      benefitsTitle: "MISSING_FROM_DESIGN",
      benefits: [] as {
        icon: "staffing" | "checkout-flow" | "profitability";
        eyebrow: string;
        title: string;
        video: string;
        poster: string;
        imagePosition: "left" | "right";
        items: { subtitle: string; description: string }[];
      }[],
      industriesTitle: "MISSING_FROM_DESIGN",
      industriesDescription: "MISSING_FROM_DESIGN",
      industries: [] as { label: string; image: string }[],
      reviewsTitle: "MISSING_FROM_DESIGN",
      reviews: [] as {
        category: string;
        categoryColorVar: string;
        iconBgVar: string;
        icon: "bakery" | "cafeteria" | "resort";
        store: string;
        role: string;
        image: string;
        quote: QuoteSegment[];
      }[],
    },
  },

  social: {
    email: "hello@fainders.ai",
    linkedin: "",
    github: "",
  },

  company: {
    address: "",
    businessNumber: "",
    representative: "",
  },
} as const;

export type SiteConfig  = typeof siteConfig;
export type ProductSlug = keyof typeof siteConfig.products;
export type ProductFeature = {
  title: string;
  description: string;
  image: string;
  imagePosition?: "bottom" | "right";
};

export type ProductIndustry = {
  label: string;
  image: string;
};

export type ProductReview = {
  category: string;
  categoryColorVar: string;
  iconBgVar: string;
  icon: "bakery" | "cafeteria" | "resort";
  store: string;
  role: string;
  image: string;
  quote: QuoteSegment[];
};

export type ProductBenefit = {
  icon: "staffing" | "checkout-flow" | "profitability";
  eyebrow: string;
  title: string;
  video: string;
  poster: string;
  imagePosition: "left" | "right";
  items: { subtitle: string; description: string }[];
};
