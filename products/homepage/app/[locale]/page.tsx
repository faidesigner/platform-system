import { setRequestLocale, getTranslations } from "next-intl/server";
import HeroSection from "@/components/sections/home/HeroSection";
import { ImageSection } from "@/components/sections/home/ImageSection";
import type { LogoItem } from "@fai/ui";
import { clientLogos } from "@/config/site";
import { localePolicy } from "@/config/locale-policy";
import WhyFaiSection from "@/components/sections/home/WhyFaiSection";
import CustomersSection from "@/components/sections/home/CustomersSection";
import { EfficiencySection } from "@/components/sections/home/EfficiencySection";
import { CtaBanner } from "@/components/sections/CtaBanner";

const PARTNER_LOGOS: LogoItem[] = clientLogos.map(({ src, name }) => ({ src, alt: name }));

// title/description/canonical/hreflang는 [locale]/layout.tsx의 generateMetadata에서
// 로케일별로 일괄 제공한다(홈은 별도 오버라이드 불필요).

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.imageSection");
  return (
    <>
      <HeroSection logos={PARTNER_LOGOS} />
      {/* 키오스크 화면 문구가 렌더된 컷이라 로케일마다 이미지가 다르다(HOM-64) */}
      <ImageSection
        src={localePolicy(locale).homeHeroImage}
        alt={t("alt")}
        priority
      />
      <WhyFaiSection />
      {/* images는 config/site.ts의 customerImages가 단일 소스 — 여기서 다시 넘기지 않는다(HOM-69) */}
      <CustomersSection linkHref="/products/vision-check-out#product-reviews" />
      <EfficiencySection />
      <CtaBanner />
    </>
  );
}
