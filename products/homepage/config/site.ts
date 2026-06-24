import type {
  AboutConfig,
  SiteConfig,
  ClientLogoItem,
  EffectCard,
  EffectListItem,
  StoreTypeTab,
  CaseStudy,
  ProductFeature,
  ProductBenefit,
  ProductIndustry,
  ProductReview,
  MediaItem,
  MediaShowcaseConfig,
  RetailTechLetterConfig,
  ContactConfig,
} from "./types";

export const clientLogos = [
  { id: "samsung-welstory", name: "Samsung Welstory", src: "/logos/logo-samsung-welstory-white.png" },
  { id: "gs-retail",        name: "GS Retail",        src: "/logos/logo-gs-retail-white.png" },
  { id: "bgf-retail",       name: "BGF Retail",       src: "/logos/logo-bgf-retail-white.png" },
  { id: "spoany",           name: "SpoAny",            src: "/logos/logo-spoany-white.png" },
  { id: "changi",           name: "Changi Airport",    src: "/logos/logo-changi-white.png" },
  { id: "7eleven",          name: "7-Eleven",          src: "/logos/logo-7-eleven-white.png" },
  { id: "tokyu-land",       name: "Tokyu Land",        src: "/logos/logo-tokyu-land-white.png" },
  { id: "orange-planet",    name: "Orange Planet",     src: "/logos/logo-orange-planet-white-2.png" },
] satisfies ClientLogoItem[];

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
      heroType: "video",
      heroVideo: "/videos/product/vco-hero-bg.mp4",
      heroImage: "",
      heroSubtitle: "차세대 AI 무인 결제 솔루션",
      heroTitle: "VISION CHECK-OUT",
      ctaLabel: "도입 문의하기",
      featuresTitle: "VCO는 무엇이 다를까요?",
      features: [
        {
          title: "빈틈없이 스캔하는\n14대의 AI 카메라",
          description: "국내 유일 멀티뷰 3D 인식 기술을 적용했어요",
          image: "/images/products/vco/vco-feature-camera.png",
          imagePosition: "bottom",
        },
        {
          title: "장비 교체없이\n기존 POS 그대로",
          description: "사용 중인 POS 그대로 사용할 수 있어요",
          image: "/images/products/vco/vco-feature-pos.png",
          imagePosition: "bottom",
        },
        {
          title: "오차없이 정확한 99.9% 인식률",
          description: "타사 대비 월등한 성능으로 1초면 스캔 완료되는 압도적인 속도로 처리해요",
          image: "/images/products/vco/vco-feature-accuracy-2.png",
          imagePosition: "right",
        },
      ],
      benefitsTitle: "어떻게 달라질까요?",
      benefits: [
        {
          icon: "checkout-flow",
          eyebrow: "구매 과정의 간소화",
          title: "바코드 없는 상품까지\n매끄러운 결제",
          video: "/videos/product/vco-benefit-1-loop.mp4",
          poster: "MISSING_FROM_DESIGN",
          imagePosition: "left",
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
          icon: "staffing",
          eyebrow: "인력 리스크 관리",
          title: "구인 스트레스 없는 매장",
          video: "/videos/product/vco-benefit-2-loop.mp4",
          poster: "MISSING_FROM_DESIGN",
          imagePosition: "right",
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
          icon: "profitability",
          eyebrow: "수익성 개선",
          title: "안내가 필요없는\n직관적인 결제 과정",
          video: "/videos/product/vco-benefit-3-loop.mp4",
          poster: "MISSING_FROM_DESIGN",
          imagePosition: "left",
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
        { label: "Bakery&Cafe",       image: "/images/products/industries/vco-industry-bakery-cafe.png" },
        { label: "Cafeteria&Canteen", image: "/images/products/industries/vco-industry-cafeteria-canteen.png" },
        { label: "Hospitality",       image: "/images/products/industries/vco-industry-hospitality.png" },
      ],
      reviewsTitle: "고객사 도입 후기",
      reviews: [
        {
          category: "베이커리",
          categoryColorVar: "--color-text-tag-category-yellow",
          iconBgVar: "--color-filled-tag-category-yellow-secondary",
          icon: "bakery",
          store: "만나밀 베이커리",
          role: "총괄 매니저 송주희",
          image: "/images/products/review/vco-review-bakery.jpg",
          imageObjectPosition: "center top",
          quote: [
            { text: "\"추가로 직원을 뽑기에는 부담이 있어 VCO를 도입했어요. " },
            { text: "직원 1명 역할", emphasis: true },
            { text: "을 해주니 확실히 업무량이 줄었어요. 비슷하게 생긴 빵도 구분을 잘 해서 다른 매장에 추천하고 싶어요.\"" },
          ],
        },
        {
          category: "급식",
          categoryColorVar: "--color-text-basic-positive",
          iconBgVar: "--color-filled-basic-positive-secondary",
          icon: "cafeteria",
          store: "대형급식 W사 관리자",
          role: "",
          image: "/images/products/review/vco-review-cafeteria.jpg",
          quote: [
            { text: "\"점심 피크타임에 " },
            { text: "시간당 360명", emphasis: true },
            { text: " 결제 처리가 가능해져 대기줄이 대폭 줄었고, 솔루션 도입으로 결제 정확도가 높아졌습니다.\"" },
          ],
        },
        {
          category: "리조트",
          categoryColorVar: "--color-text-tag-category-grape",
          iconBgVar: "--color-filled-tag-category-grape-secondary",
          icon: "resort",
          store: "일본 홋카이도 Niseko 리조트 매니저",
          role: "",
          image: "/images/products/review/vco-review-resort.jpg",
          quote: [
            { text: "\"산속 리조트 특성상 인력 채용과 유지가 어려운데, VCO 도입으로 " },
            { text: "구인 걱정", emphasis: true },
            { text: "을 덜었습니다. 외국인 고객까지 응대 가능하니 업무 부담이 적어졌어요.\"" },
          ],
        },
      ],
      effectsTitle: "",
      effectCards: [] as EffectCard[],
      effectList: [] as EffectListItem[],
      storeTypes: [] as StoreTypeTab[],
      caseStudiesEyebrow: "",
      caseStudies: { standard: [], micro: [] } as Record<string, CaseStudy[]>,
    },
    "unmanned-store": {
      slug: "unmanned-store",
      label: "UNMANNED STORE",
      heroType: "image",
      heroVideo: "",
      heroImage: "/images/products/unmanned-store/store-hero.png",
      heroSubtitle: "세상에서 가장 경제적인 무인 매장 솔루션",
      heroTitle: "What is WALK-THROUGH?",
      ctaLabel: "",
      featuresTitle: "MISSING_FROM_DESIGN",
      features: [] as ProductFeature[],
      benefitsTitle: "MISSING_FROM_DESIGN",
      benefits: [] as ProductBenefit[],
      industriesTitle: "MISSING_FROM_DESIGN",
      industriesDescription: "MISSING_FROM_DESIGN",
      industries: [] as ProductIndustry[],
      reviewsTitle: "MISSING_FROM_DESIGN",
      reviews: [] as ProductReview[],
      effectsTitle: "WALK-THROUGH의 효과를 경험해 보세요",
      effectCards: [
        { title: "인건비 절감",    description: "최소 인력으로 운영해요",     icon: "MISSING_FROM_DESIGN" },
        { title: "결제 무인화",    description: "바코드를 찍을 필요 없어요",  icon: "MISSING_FROM_DESIGN" },
        { title: "원격 운영 가능", description: "실시간으로 현황을 알려줘요", icon: "MISSING_FROM_DESIGN" },
      ],
      effectList: [
        {
          title: "차별화된 VISION-AI 기술력",
          description: "다수의 카메라와 AI 기술을 통해,\n오프라인 매장에 세상에 없던 기술로 무인 매장 솔루션을 제공해요",
        },
        {
          title: "실시간 선반 현황 확인으로 상품 관리",
          description: "실시간 선반의 현황 확인을 통해 결품 관리가 가능해요\n빈 선반으로 인한 매출 손실에 즉시 대응 할 수 있어요",
        },
        {
          title: "오프라인 고객 데이터 분석",
          description: "고객이 선택한 상품을 카메라로 추적하고 자동으로 결제까기 이루어지는\n완전한 결제 무인화 시스템을 적용했어요",
        },
      ],
      storeTypes: [
        {
          key: "standard",
          label: "STANDARD STORE",
          subtitle: "30평 이하의 소형 매장 무인화",
          description: "어떤 형태의 매장에도 적용이 가능한, 높은 자유도를 바탕으로\n편의점, 소형 슈퍼마켓, 편집샵 등에 적용해 보세요",
          sectionTitle: "Walk-through는 무엇이 다를까요?",
          cards: [
            { title: "간편한 고객 경험", description: "결제줄 없이, 바코드 인식도 없이, 가장 간편한 고객 경험을 제공합니다.", image: "/images/products/unmanned-store/us-standard-experience.png", wide: false },
            { title: "검증된 정확도",   description: "실제 운영 중인 매장들에서 검증된 우수한 정확도를 바탕으로 새로운 매장을 시작해보세요",    image: "/images/products/unmanned-store/us-standard-accuracy.png",   wide: false },
            { title: "운영 효율성 증대", description: "오프라인도 온라인처럼 매장 내 데이터를 활용해 최적의 운영 방향성을 결정하세요",          image: "/images/products/unmanned-store/us-standard-efficiency.png", wide: true, objectPosition: "-0.033px -533.12px" },
          ],
        },
        {
          key: "micro",
          label: "MICRO STORE",
          subtitle: "5평 내외 유휴 공간에 무인 리테일샵 입점이 가능해요",
          description: "하루면 설치가 끝나는 선조립 공법의 무인샵을 시작하세요",
          sectionTitle: "Walk-through는 무엇이 다를까요?",
          cards: [
            { title: "저렴한 도입 비용", description: "규격화된 선조립 공법으로, 가장 저렴한 가격에 무인화 매장을 도입하세요",                                                                image: "/images/products/unmanned-store/us-micro-cost.jpg",    wide: false },
            { title: "빠른 설치",       description: "정해진 규격을 고르시면, 하루만에 설치 완료.\n다음날부터 판매를 시작하세요",                                                          image: "/images/products/unmanned-store/us-micro-speed.jpg",   wide: false },
            { title: "유휴 공간의 수익화", description: "마지막 한 평까지 알뜰하게.\n샵인샵, 로비, 스타디움 내부 등 어떤 형태의 공간이든 무인샵 도입이 가능해요", image: "/images/products/unmanned-store/us-micro-revenue.jpg", wide: true, objectPosition: "center" },
          ],
        },
      ],
      caseStudiesEyebrow: "Case Studies",
      caseStudies: {
        standard: [
          { brand: "GS25 DX LAB",     date: "`23.10", store: "가산스마트점",      description: "국내 최초 로드샵형 완전 무인화 편의점\n아시아 최초 통합로드셀 기술 도입", image: "/images/products/unmanned-store/us-case-standard-gs25.jpg" },
          { brand: "Super Swift",     date: "`23.06", store: "자체 운영 매장",    description: "자체 운영 매장\n국내 최초 후결제 CX도입",                               image: "/images/products/unmanned-store/us-case-standard-swift.jpg" },
          { brand: "나주 테크프렌들리", date: "`23.06", store: "CU 안심스마트점포", description: "KISA 본원 테스트 점포",                                                 image: "/images/products/unmanned-store/us-case-standard-cu.jpg" },
          { brand: "판교 Alphadom",    date: "`22.10", store: "\"Worker Shop\"",  description: "\"Shadow\" 편집샵",                                                      image: "/images/products/unmanned-store/us-case-standard-alphadom.jpg" },
        ],
        micro: [
          { brand: "PX24", date: "`24.08", store: "을지로점", description: "피트니스 센터 내 위치한\n24/7운영의 5평 규모 무인매장", image: "/images/products/unmanned-store/us-case-micro-px24-euljiro.jpg" },
          { brand: "PX24", date: "`25.02", store: "화곡점",   description: "피트니스 센터 내 위치한\n3.5평 규모 초소형 무인매장",  image: "/images/products/unmanned-store/us-case-micro-px24-hwagok.jpg" },
        ],
      },
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

  contact: {
    title: ["도입 고민부터", "커스텀 솔루션 제안까지", "전문가가 직접 답변해드립니다"],
    subCopy: {
      highlight: "맞춤형 솔루션 제안",
      rest: "을 위해 문의 폼을 작성해주시면",
      line2: "담당자가 빠르게 연락드릴게요",
    },
    form: {
      connectTitle: "연락드릴 정보를 입력해 주세요",
      requiredLabel: "필수 입력",
      selectTitle: "문의하고 싶은 정보를 선택해 주세요",
      privacyNotice: {
        before: "귀하의 문의에 답변하기 위해 수집된 데이터의 ",
        link: "개인정보 처리방침",
        href: "https://www.fainders.ai/contact-us/FaindersAI_%E1%84%80%E1%85%A2%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%87%E1%85%A9%E1%84%8E%E1%85%A5%E1%84%85%E1%85%B5%E1%84%87%E1%85%A1%E1%86%BC%E1%84%8E%E1%85%B5%E1%86%B7.pdf",
        after: "에 동의합니다",
      },
      submitLabel: "문의하기",
    },
    fields: [
      { key: "company",  label: "회사명",   placeholder: "회사명",           type: "text",  required: true,  errorMessage: "회사명을 입력해 주세요." },
      { key: "name",     label: "성함",     placeholder: "성함",             type: "text",  required: true,  errorMessage: "성함을 입력해 주세요." },
      { key: "email",    label: "이메일",   placeholder: "name@example.com", type: "text",  required: true,  errorMessage: "이메일을 입력해 주세요." },
      { key: "phone",    label: "전화번호", placeholder: "전화번호",         type: "tel",   required: false },
    ],
    interests: [
      {
        group: "VCO",
        multipleLabel: "(복수선택 가능)",
        options: [
          { value: "bakery",         label: "베이커리" },
          { value: "catering",       label: "급식" },
          { value: "special-venue",  label: "특수 입지(경기장/공연장/리조트)" },
          { value: "etc",            label: "기타" },
        ],
      },
      {
        group: "STORE",
        multipleLabel: "(복수선택 가능)",
        options: [
          { value: "standard-store", label: "STANDARD STORE" },
          { value: "micro-store",    label: "MICRO STORE" },
        ],
      },
    ],
    toast: {
      text:        "간단한 솔루션 문의는 카카오톡 채널을 이용해 주세요",
      buttonLabel: "빠른 상담하기",
      kakaoUrl:    "http://pf.kakao.com/_cZLcn",
    },
    complete: {
      title: "문의 주셔서 정말 감사합니다",
      subCopy: {
        before:    "내용을 확인하고 ",
        highlight: "평균 2~3일 이내",
        after:     " 담당자가 연락드리겠습니다",
      },
      buttonLabel:     "계속 둘러보기",
      backgroundAsset: "/images/contact/bg-gradation-confirm-n.png",
    },
    backgroundAsset: "/images/contact/bg-gradation-n.png",
  } satisfies ContactConfig,

  media: {
    title: "FAI News",
    moreLabel: "더보기",
    items: [
      {
        thumbnail:    "/images/news/vco-investment.avif",
        thumbnailAlt: "파인더스에이아이, 프리B 50억 투자 유치…AI 무인매장 솔루션 확대",
        tags:         ["VCO", "Investment"],
        date:         "2026-03-18",
        title:        "파인더스에이아이, 프리B 50억 투자 유치…AI 무인매장 솔루션 확대",
        description:  "AI 기반 리테일 솔루션 스타트업 파인더스에이아이가 프리 시리즈B 라운드에서 약 50억원 규모의 투자를 유치했다.",
        href:         "https://www.mt.co.kr/future/2026/03/18/2026031809191910251",
      },
      {
        thumbnail:    "/images/news/samsung-welstory.jpg",
        thumbnailAlt: "파인더스에이아이, 삼성웰스토리와 'AI 자동 계산대' 협업",
        tags:         ["VCO", "Partnership"],
        date:         "2026-01-13",
        title:        "파인더스에이아이, 삼성웰스토리와 'AI 자동 계산대' 협업…간편식 무인 결제 경험 고도화",
        description:  "AI 기반 리테일 솔루션 기업 주식회사 파인더스에이아이는 삼성웰스토리와 협업해 'AI 자동 계산대(이하 VCO)'를 삼성웰스토리의 간편식 무인 결제 시스템에 적용했다.",
        href:         "https://economist.co.kr/article/view/ecn202601130028",
      },
      {
        thumbnail:    "/images/news/singapore-7eleven.png",
        thumbnailAlt: "파인더스에이아이, 싱가포르 세븐일레븐에 AI 완전 무인 편의점 구현",
        tags:         ["Unmanned", "Global"],
        date:         "2025-12-24",
        title:        "파인더스에이아이, 싱가포르 세븐일레븐에 AI 완전 무인 편의점 구현",
        description:  "파인더스에이아이가 편의점 세븐일레븐의 싱가포르 매장의 AI 완전 무인 매장 기술을 제공, 운영을 시작했다고 밝혔다.",
        href:         "https://www.epnc.co.kr/news/articleView.html?idxno=320674",
      },
      {
        thumbnail:    "/images/news/japan-niseko-vco.jpg",
        thumbnailAlt: "파인더스에이아이, 日 대형 리조트 레스토랑에 AI 셀프 계산대 제공",
        tags:         ["VCO", "Japan"],
        date:         "2025-12-18",
        title:        "파인더스에이아이, 日 대형 리조트 레스토랑에 AI 셀프 계산대 제공",
        description:  "AI 기반 리테일 솔루션 기업 파인더스에이아이는 일본 법인을 통해 일본 홋카이도 니세코 지역의 대형 스키 리조트 레스토랑에 AI 셀프 계산대 'VCO'를 제공했다.",
        href:         "https://www.datanet.co.kr/news/articleView.html?idxno=208023",
      },
      {
        thumbnail:    "/images/news/tokyu-poc.jpg",
        thumbnailAlt: "도큐부동산 등, 니세코 도큐 그란 히라후 레스토랑 'NEST813'에서 AI 셀프 계산대 PoC 착수",
        tags:         ["VCO", "PoC"],
        date:         "2025-11-28",
        title:        "도큐부동산 등, 니세코 도큐 그란 히라후 레스토랑 'NEST813'에서 AI 셀프 계산대 PoC 착수",
        description:  "도큐부동산, 도큐리조트앤스테이, 파인더즈AI재팬은 신규 레스토랑 'NEST813'에서 AI 셀프 계산대 'VISION CHECK-OUT'의 도입을 위한 PoC에 착수했다.",
        href:         "https://www.nikkei.com/article/DGXZRSP700917_Y5A211C2000000/",
      },
      {
        thumbnail:    "/images/news/hfx-acceleration.jpg",
        thumbnailAlt: "파인더스AI, 글로벌 액셀러레이션 프로그램 'HFX' 최종 선정",
        tags:         ["Global", "Award"],
        date:         "2025-09-04",
        title:        "파인더스AI, 글로벌 액셀러레이션 프로그램 'HFX' 최종 선정",
        description:  "인공지능(AI) 매장 자동화 기업 파인더스에이아이는 일본 홋카이도에서 개최된 글로벌 액셀러레이션 프로그램 '홋카이도 F 빌리지 X(HFX)'에 최종 선정됐다.",
        href:         "https://view.asiae.co.kr/article/2025090410225408652",
      },
      {
        thumbnail:    "/images/news/toyonoma-poc.jpg",
        thumbnailAlt: "한국 리테일 AI 스타트업, 라이프스타일 랩 'TOYONOMA'에서 PoC 스토어 오픈",
        tags:         ["VCO", "Japan"],
        date:         "2025-08-27",
        title:        "한국 리테일 AI 스타트업, 라이프스타일 랩 'TOYONOMA'에서 PoC 스토어 오픈",
        description:  "도쿄 도요스의 라이프스타일 랩 '토요노마'에서 한국 스타트업 Fainders.AI가 차세대 AI 셀프 계산대를 적용한 일본 최초의 PoC 스토어를 정식 오픈했다.",
        href:         "https://www.jetro.go.jp/biznews/2025/11/b2f3bb7ea0b6024d.html",
      },
      {
        thumbnail:    "/images/news/spoany-2nd-store.jpg",
        thumbnailAlt: "파인더스에이아이 무인 스토어 2호점 오픈",
        tags:         ["Unmanned", "Store"],
        date:         "2025-02-11",
        title:        "\"물건 골라 나가면 바로 결제\"...파인더스에이아이 무인 스토어 2호점 오픈",
        description:  "파인더스에이아이는 AI 무인 마이크로 스토어 2호점을 스포애니 화곡점에 오픈하고 운영을 시작했다고 밝혔다.",
        href:         "https://www.techm.kr/news/articleView.html?idxno=135476",
      },
      {
        thumbnail:    "/images/news/micro-store-1st.jpeg",
        thumbnailAlt: "파인더스에이아이, AI 무인 마이크로 스토어 오픈",
        tags:         ["Unmanned", "Store"],
        date:         "2024-08-06",
        title:        "파인더스에이아이, AI 무인 마이크로 스토어 오픈",
        description:  "매장 자동화 AI 스타트업 파인더스에이아이는 국내 최초로 AI 무인 마이크로 스토어를 오픈했다고 공식 발표했다.",
        href:         "https://daily.hankooki.com/news/articleView.html?idxno=1114016",
      },
      {
        thumbnail:    "/images/news/baby-unicorn.png",
        thumbnailAlt: "파인더스AI, 중기부 '아기유니콘' 선정",
        tags:         ["Award", "Government"],
        date:         "2024-06-27",
        title:        "파인더스AI, 중기부 '아기유니콘' 선정…해외 진출 시동",
        description:  "파인더스AI가 인공지능(AI) 무인 매장 솔루션 분야 최초로 중소벤처기업부가 선정한 올해 '아기유니콘'에 선정됐다.",
        href:         "https://www.sedaily.com/article/13911945",
      },
      {
        thumbnail:    "/images/news/gs25-dx-lab.jpg",
        thumbnailAlt: "파인더스에이아이, GS리테일과 AI 완전 무인 편의점 구현",
        tags:         ["Unmanned", "Partnership"],
        date:         "2023-10-06",
        title:        "파인더스에이아이, GS리테일과 AI 완전 무인 편의점 구현",
        description:  "매장 자동화 AI 기술 기업 파인더스에이아이는 GS리테일의 미래형 편의점 GS25 DX LAB 2호점에 무인 매장 기술을 제공한다.",
        href:         "https://wowtale.net/2023/10/06/64254/",
      },
      {
        thumbnail:    "/images/news/series-a-investment.jpg",
        thumbnailAlt: "파인더스에이아이 71억원 규모 시리즈 A 투자 유치",
        tags:         ["Investment"],
        date:         "2022-07-18",
        title:        "AI 매장 무인화 스타트업 '파인더스에이아이', 71억원 규모 시리즈 A 투자 유치",
        description:  "AI 무인 매장 솔루션을 개발하는 '파인더스에이아이'가 71억원 규모 시리즈 A 라운드 투자를 유치하는 데 성공했다.",
        href:         "https://platum.kr/archives/189505",
      },
      {
        thumbnail:    "/images/news/seed-investment.jpg",
        thumbnailAlt: "파인더스에이아이 6억원 시드 투자 유치",
        tags:         ["Investment"],
        date:         "2021-07-14",
        title:        "AI 매장 무인화 스타트업 '파인더스에이아이' 6억원 투자 유치",
        description:  "AI기반 오프라인 유통매장 무인화 기술을 개발하는 '파인더스에이아이'가 끌림벤처스로부터 6억원 시드 투자를 유치했다.",
        href:         "https://www.joongang.co.kr/article/24105042",
      },
      {
        thumbnail:    "MISSING_FROM_DESIGN",
        thumbnailAlt: "",
        tags:         ["Test"],
        date:         "2024-01-01",
        title:        "[빈 이미지 폴백 UI 확인용 카드]",
        description:  "썸네일 이미지가 없는 경우 Empty Image Fallback UI가 정상 렌더링되는지 확인합니다.",
        href:         "#",
      },
    ] as MediaItem[],
  },

  mediaShowcase: {
    title: "Media",
    youtube: {
      channelLabel: "YouTube",
      ctaLabel: "더 알아보기",
      videos: [
        {
          thumbnail:    "MISSING_FROM_DESIGN",
          thumbnailAlt: "파인더스에이아이 VCO 소금빵 구별",
          title:        "파인더스에이아이 VCO는 뭐가 다른가요?②",
          description:  "비슷하게 생긴 빵도 정확하게 구별해요!",
          href:         "MISSING_FROM_DESIGN",
        },
        {
          thumbnail:    "MISSING_FROM_DESIGN",
          thumbnailAlt: "MISSING_FROM_DESIGN",
          title:        "MISSING_FROM_DESIGN",
          description:  "MISSING_FROM_DESIGN",
          href:         "MISSING_FROM_DESIGN",
        },
      ],
    },
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/fainders_ai" },
      { label: "LinkedIn",  href: "https://www.linkedin.com/company/faindersai" },
    ],
  } satisfies MediaShowcaseConfig,
  retailTechLetter: {
    title: "Retail Tech Letter",
    embed: {
      type: "iframe" as "iframe" | "script",
      src: "https://faindersai.stibee.com/",
      height: 608,
      scriptSrc: "MISSING_FROM_DESIGN",
      mountId: "retail-tech-letter-form",
    },
  } satisfies RetailTechLetterConfig,
} satisfies SiteConfig;

export type ProductSlug = keyof typeof siteConfig.products;

// 컴포넌트 backward-compat re-exports
export type {
  SiteConfig,
  QuoteSegment,
  ProductFeature,
  ProductIndustry,
  ProductReview,
  ProductBenefit,
  ManagementMember,
} from "./types";

export const aboutConfig = {
  hero: {
    eyebrow: "리테일 혁신",
    title: ["고객이 리테일의 본질에", "집중할 수 있도록"],
    image: {
      src: "/images/about/about-hero.png",
      alt: "Fainders.AI 오피스 전경",
    },
  },

  partners: {
    title: "Partners",
    description: ["글로벌 시장 리더들과", "기술 그 이상의 가치를 만들어가고 있습니다"],
    logoRows: [
      [
        { id: "samsung-welstory", name: "Samsung Welstory", src: "/logos/logo-samsung-welstory.png" },
        { id: "gs-retail",        name: "GS Retail",        src: "/logos/logo-gs-retail.png" },
        { id: "bgf-retail",       name: "BGF retail",       src: "/logos/logo-bgf-retail.png" },
        { id: "spoany",           name: "spoany",           src: "/logos/logo-spoany.png" },
      ],
      [
        { id: "changi",        name: "Changi Airport", src: "/logos/logo-changi.png" },
        { id: "7-eleven",      name: "7-Eleven",       src: "/logos/logo-7-eleven.png" },
        { id: "tokyu-land",    name: "Tokyu Land",     src: "/logos/logo-tokyu-land.png" },
        { id: "orange-planet", name: "Orange Planet",  src: "/logos/logo-orange-planet-2.png" },
      ],
    ],
  },

  investors: {
    groups: [
      {
        id: "investment",
        caption: "누적 127억원 투자 유치를 통해, 글로벌 사업성과 성장성을 인정받고 있습니다",
        logoRows: [
          [
            { id: "sunin",            name: "(주)선인",                src: "/logos/logo-sunin.png" },
            { id: "company-k",        name: "Company K Partners",     src: "/logos/logo-company-k.png" },
            { id: "crit-ventures",    name: "CRIT Ventures",          src: "/logos/logo-crit-ventures.png" },
          ],
          [
            { id: "sdb-investment",   name: "SDB Investment",         src: "/logos/logo-sdb-investment.png" },
            { id: "quantum-ventures", name: "Quantum Ventures Korea", src: "/logos/logo-quantum-ventures.png" },
            { id: "klim-ventures",    name: "Klim Ventures",          src: "/logos/logo-klim-ventures.png" },
          ],
        ],
      },
      {
        id: "government",
        caption: "정부의 주요 딥테크 육성 프로그램에 선정되며, 시장을 선도할 압도적인 기술력을 인정받았습니다.",
        logoRows: [
          [
            { id: "k-unicorn", name: "K-유니콘",       src: "/logos/logo-k-unicorn.png" },
            { id: "mss",       name: "중소벤처기업부", src: "/logos/logo-mss.png" },
            { id: "tips",      name: "TIPS",           src: "/logos/logo-tips.png" },
          ],
        ],
      },
    ],
  },

  management: {
    title: "Management",
    members: [
      {
        id: "ham",
        role: "CEO",
        name: "함명원",
        photo: { src: "/images/about/member-ceo-ham.png", alt: "함명원 CEO" },
        education: ["서울과학고", "KAIST 전산학 학사", "UCLA 컴퓨터공학 석사"],
        career: ["전 삼성전자", "전 프라이피 CTO (Co-founder)"],
      },
      {
        id: "wang",
        role: "CEO",
        name: "왕민권",
        photo: { src: "/images/about/member-ceo-wang.png", alt: "왕민권 CEO" },
        education: ["Boston Coll. 수학, 경제학 학사", "KAIST ITM 석사"],
        career: ["전 Funded 창업(CEO)&매각", "전 위메프 NBE TF"],
      },
      {
        id: "hong",
        role: "CTO",
        name: "홍석범",
        photo: { src: "/images/about/member-cto-hong.png", alt: "홍석범 CTO" },
        education: ["서울과학고", "서울대학교 전기컴퓨터공학 학사/박사(Ph.D)"],
        career: ["전 삼성전자", "전 프라이피 CTO (Co-founder)"],
      },
      {
        id: "lee",
        role: "CSO",
        name: "이현규",
        photo: { src: "/images/about/member-cso-lee.png", alt: "이현규 CSO" },
        education: ["연세대학교 건축공학 학사"],
        career: ["전 나이스평가정보 사업기획단", "전 BCG 컨설턴트"],
      },
    ],
  },

  people: {
    title: "People",
    subtitle: "파인더스에이아이의 멤버들을 만나보세요",
    cards: [
      {
        id: "hong",
        title: "AI로 세상을 더 이롭게 만드는 기술을 만드는 일",
        name: "홍석범",
        role: "CTO",
        label: "Fainders.AI",
        image: { src: "/images/about/people-hong.webp", alt: "홍석범 CTO 인터뷰" },
        href: "https://faindersai.career.greetinghr.com/ko/interview1",
      },
      {
        id: "wang",
        title: "문제를 피하지 않고 끝까지 해결하는 사람들과 함께",
        name: "왕민권",
        role: "CEO",
        label: "Fainders.AI",
        image: { src: "/images/about/people-wang.webp", alt: "왕민권 CEO 인터뷰" },
        href: "https://faindersai.career.greetinghr.com/ko/interview2",
      },
      {
        id: "park",
        title: "기술보다 문제, 속도보다 방향, 구현보다 경험을 고민해요",
        name: "박성빈",
        role: "BE 개발",
        label: "Fainders.AI",
        image: { src: "/images/about/people-park.webp", alt: "박성빈 BE 개발 인터뷰" },
        href: "https://faindersai.career.greetinghr.com/ko/interview3",
        _description: "card3 title 카피 — 디자인에서 미확인",
      },
      {
        id: "lee",
        title: "일본 리테일 시장의 새로운 미래를 만들고 있어요",
        name: "이지민",
        role: "CEO",
        label: "Fainders.AI JAPAN",
        image: { src: "/images/about/people-lee.webp", alt: "이지민 CEO 인터뷰" },
        href: "https://faindersai.career.greetinghr.com/ko/interview4",
        _description: "card4 title 카피 — 디자인에서 미확인",
      },
    ],
  },
} satisfies AboutConfig;

/* ──────────────────────────────────────────
   Product Mega Menu
────────────────────────────────────────── */

export const productMenu = [
  {
    label:       'VISION CHECK-OUT',
    description: '바코드 스캔이 필요없는 AI 자동 계산대',
    href:        '/products/vision-check-out',
    image:       '/images/products/vco/vco-nav-megamenu-thumb-1.jpg',
    bgStyle: {
      backgroundPosition: '-30.961px -48.48px',
      backgroundSize:     '111.5% 148.667%',
    },
  },
  {
    label:       'UNMANNED STORE',
    description: 'VISION AI 무인 매장 솔루션',
    href:        '/products/unmanned-store',
    image:       '/images/products/unmanned-store/ums-nav-megamenu-thumb-1.jpg',
    bgStyle: {
      backgroundPosition: '50%',
      backgroundSize:     'cover',
    },
  },
] as const;

export type ProductMenuItem = (typeof productMenu)[number];
