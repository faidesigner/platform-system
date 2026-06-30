import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import MediaNewsSection from "@/components/sections/media/NewsSection";
import MediaShowcaseSection from "@/components/sections/media/ShowcaseSection";
import RetailTechLetterSection from "@/components/sections/media/RetailTechLetterSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "미디어",
    description: "Fainders AI 뉴스, 보도자료, 쇼케이스 및 리테일 테크 소식.",
    ...(locale === "ko" ? { alternates: { canonical: "/ko/media/" } } : {}),
  };
}

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
