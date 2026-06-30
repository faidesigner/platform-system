import { setRequestLocale } from "next-intl/server";
import MediaNewsSection from "@/components/sections/media/NewsSection";
import MediaShowcaseSection from "@/components/sections/media/ShowcaseSection";
import RetailTechLetterSection from "@/components/sections/media/RetailTechLetterSection";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <MediaShowcaseSection />
      <MediaNewsSection />
      <RetailTechLetterSection />
    </main>
  );
}
