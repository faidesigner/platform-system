import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/sections/home/HeroSection";
import { ImageSection } from "@/components/sections/home/ImageSection";
import type { LogoItem } from "@fai/ui";
import { clientLogos } from "@/config/site";
import WhyFaiSection from "@/components/sections/home/WhyFaiSection";
import CustomersSection from "@/components/sections/home/CustomersSection";
import type { CustomerImage } from "@/components/sections/home/CustomersSection";
import { EfficiencySection } from "@/components/sections/home/EfficiencySection";
import { CtaBanner } from "@/components/sections/CtaBanner";

const CUSTOMER_IMAGES: CustomerImage[] = [
  { name: 'bakery-mannamil',    src: '/images/customers/01-bakery-mannamil.jpg',    alt: '베이커리 만나밀' },
  { name: 'bakery-hansangmin',  src: '/images/customers/02-bakery-hansangmin.jpg',  alt: '베이커리 한상민' },
  { name: 'foodCourt-niseko-1', src: '/images/customers/03-foodCourt-niseko-2.jpg', alt: '푸드코트 니세코 1' },
  { name: 'foodCourt-niseko-2', src: '/images/customers/04-foodCourt-niseko-1.jpg', alt: '푸드코트 니세코 2' },
  { name: 'retail-hibinoma',    src: '/images/customers/05-retail-hibinoma.jpg',    alt: '리테일 히비노마' },
  { name: 'retail-wellstory',   src: '/images/customers/06-retail-wellstory.jpeg',  alt: '리테일 웰스토리' },
  { name: 'retail-shokunoma',   src: '/images/customers/07-retail-shokunoma.jpg',   alt: '리테일 쇼쿠노마' },
  { name: 'bakery-toujours',    src: '/images/customers/08-bakery-toujours.jpg',    alt: '뚜쥬루 베이커리' },
];

const PARTNER_LOGOS: LogoItem[] = clientLogos.map(({ src, name }) => ({ src, alt: name }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // 홈 title은 루트 기본값(siteConfig.fullName) 유지, ko에만 self-canonical 부여.
  return locale === "ko" ? { alternates: { canonical: "/ko/" } } : {};
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <HeroSection logos={PARTNER_LOGOS} />
      <ImageSection
        src="/images/main/imageSection-hero-2.png"
        alt="FAI Platform Fullscreen Overview"
        priority
      />
      <WhyFaiSection />
      <CustomersSection images={CUSTOMER_IMAGES} linkHref="/products/vision-check-out#product-reviews" />
      <EfficiencySection />
      <CtaBanner />
    </>
  );
}
