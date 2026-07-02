// products/homepage/config/types.ts
// 단일 타입 계약 파일 — About / Products / Home / Site

// ─── About ───────────────────────────────────────────────────────────────────

/** 이미지 에셋 */
export interface AboutImage {
  src: string;
  alt: string;
}

/** Hero 섹션 */
export interface AboutHeroData {
  eyebrow: string;
  title: string[];
  image: AboutImage;
}

/** 로고 단일 항목 (Partners / Investors 공용) */
export interface LogoItem {
  id: string;
  name: string;
  src: string;
}

/** Partners 섹션 */
export interface AboutPartnersData {
  title: string;
  description: string[];
  logoRows: LogoItem[][];
}

/** Investors — 캡션 + 로고 그룹 */
export interface InvestorGroup {
  id: string;
  caption: string;
  logoRows: LogoItem[][];
}

export interface AboutInvestorsData {
  groups: InvestorGroup[];
}

/** Management — 경영진 멤버 */
export interface ManagementMember {
  id: string;
  role: string;
  name: string;
  photo: AboutImage;
  education: string[];
  career: string[];
}

export interface AboutManagementData {
  title: string;
  members: ManagementMember[];
}

/** People (인터뷰) 섹션 */
export interface PeopleCard {
  id: string;
  title: string;
  name: string;
  role: string;
  label: string;
  image: AboutImage;
  href: string;
  /** 디자인 미확정 항목에 대한 작업 메모 */
  _description?: string;
}

export interface AboutPeopleData {
  title: string;
  subtitle: string;
  cards: PeopleCard[];
}

/** About 페이지 전체 데이터 계약 */
export interface AboutConfig {
  hero: AboutHeroData;
  partners: AboutPartnersData;
  investors: AboutInvestorsData;
  management: AboutManagementData;
  people: AboutPeopleData;
}

// ─── Products ────────────────────────────────────────────────────────────────

export type HeroType        = "video" | "image";
export type ImagePosition   = "left"  | "right";
export type BenefitIconType = "staffing" | "checkout-flow" | "profitability";
export type ReviewIconType  = "bakery"   | "cafeteria"     | "resort";

/** 강조 텍스트 포함 인라인 인용 */
export interface QuoteSegment {
  text: string;
  emphasis?: boolean;
}

/** Features */
export interface ProductFeature {
  title: string;
  description: string;
  image: string;
  imagePosition: "bottom" | "right";
}

/** Benefits */
export interface BenefitItem {
  subtitle: string;
  description: string;
}

export interface ProductBenefit {
  icon: BenefitIconType;
  eyebrow: string;
  title: string;
  video: string;
  poster: string;
  imagePosition: ImagePosition;
  items: BenefitItem[];
}

/** Industries */
export interface ProductIndustry {
  label: string;
  image: string;
}

/** Reviews */
export interface ProductReview {
  category: string;
  categoryColorVar: string;
  iconBgVar: string;
  iconColorVar: string;
  icon: ReviewIconType;
  store: string;
  role: string;
  image: string;
  imageObjectPosition?: string;
  quote: QuoteSegment[];
}

/** Effects */
export interface EffectCard {
  title: string;
  description: string;
  icon: string;
}

export interface EffectListItem {
  title: string;
  description: string;
}

/** Store Types */
export interface StoreTypeCard {
  title: string;
  description: string;
  image: string;
  wide: boolean;
  objectPosition?: string;
}

export interface StoreTypeTab {
  key: string;
  label: string;
  subtitle: string;
  description: string;
  sectionTitle: string;
  cards: StoreTypeCard[];
}

/** Case Studies */
export interface CaseStudy {
  brand: string;
  date: string;
  store: string;
  description: string;
  image: string;
}

/** 제품 단일 계약 */
export interface ProductConfig {
  slug: string;
  label: string;
  heroType: HeroType;
  heroVideo: string;
  heroImage: string;
  heroSubtitle: string;
  heroTitle: string;
  ctaLabel: string;
  featuresTitle: string;
  features: ProductFeature[];
  benefitsTitle: string;
  benefits: ProductBenefit[];
  industriesTitle: string;
  industriesDescription: string;
  industries: ProductIndustry[];
  reviewsTitle: string;
  reviews: ProductReview[];
  effectsTitle: string;
  effectCards: EffectCard[];
  effectList: EffectListItem[];
  storeTypes: StoreTypeTab[];
  caseStudiesEyebrow: string;
  caseStudies: Record<string, CaseStudy[]>;
}

/** 제품 맵 (slug → ProductConfig) */
export type ProductsConfig = Record<string, ProductConfig>;

// ─── Home ─────────────────────────────────────────────────────────────────────

/** 파트너/클라이언트 로고 아이템 */
export interface ClientLogoItem {
  id: string;
  name: string;
  src: string;
}

export interface CustomerImage {
  name: string;
  src: string;
  alt: string;
}

/** Home 페이지 전체 데이터 계약 */
export interface HomeConfig {
  clientLogos: readonly ClientLogoItem[];
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaItem {
  thumbnail: string;
  thumbnailAlt: string;
  href: string;
  tags: string[];
  date: string;
  title: string;
  description: string;
}

export interface MediaConfig {
  title: string;
  moreLabel: string;
  items: MediaItem[];
}

export interface YoutubeVideo {
  thumbnail: string;
  thumbnailAlt: string;
  title: string;
  description: string;
  href: string;
}

export interface YoutubeShowcase {
  channelLabel: string;
  ctaLabel: string;
  videos: YoutubeVideo[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface MediaShowcaseConfig {
  title: string;
  youtube: YoutubeShowcase;
  socials: SocialLink[];
}

// Stibee는 외부 도메인 iframe 임베드를 차단(X-Frame-Options)하므로,
// 임베드 대신 새 탭으로 레터 사이트를 여는 링크아웃 방식으로 구성한다.
export interface RetailTechLetterConfig {
  title: string;
  description: string;
  ctaLabel: string;
  url: string;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactField {
  key: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  errorMessage?: string;
}

export interface ContactInterestOption {
  value: string;
  label: string;
}

export interface ContactInterestGroup {
  group: string;
  multipleLabel: string;
  options: readonly ContactInterestOption[];
}

export interface ContactSubCopy {
  highlight: string;
  rest: string;
  line2: string;
}

export interface ContactPrivacyNotice {
  before: string;
  link: string;
  href: string;
  after: string;
}

export interface ContactFormConfig {
  connectTitle: string;
  requiredLabel: string;
  selectTitle: string;
  privacyNotice: ContactPrivacyNotice;
  submitLabel: string;
}

export interface ContactToast {
  text: string;
  buttonLabel: string;
  kakaoUrl: string;
}

export interface ContactComplete {
  title: string;
  subCopy: {
    before: string;
    highlight: string;
    after: string;
  };
  buttonLabel: string;
  backgroundAsset: string;
}

export interface ContactConfig {
  title: readonly string[];
  subCopy: ContactSubCopy;
  form: ContactFormConfig;
  fields: readonly ContactField[];
  interests: readonly ContactInterestGroup[];
  toast: ContactToast;
  complete: ContactComplete;
  backgroundAsset: string;
}

// ─── Site ─────────────────────────────────────────────────────────────────────

/** 네비게이션 링크 */
export interface NavItem {
  label: string;
  href: string;
}

/** 소셜/연락처 */
export interface SocialConfig {
  email: string;
  linkedin: string;
  github: string;
}

/** 사업자 정보 */
export interface CompanyConfig {
  address: string;
  businessNumber: string;
  representative: string;
}

/** 사이트 전체 데이터 계약 */
export interface SiteConfig {
  name: string;
  url: string;
  description: string;
  keywords: string[];
  nav: NavItem[];
  products: ProductsConfig;
  social: SocialConfig;
  company: CompanyConfig;
  media: MediaConfig;
  mediaShowcase: MediaShowcaseConfig;
  retailTechLetter: RetailTechLetterConfig;
  contact: ContactConfig;
}
