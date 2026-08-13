import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { getPageDescription } from "@/config/seo";
import { ContactUsSection } from "@/components/sections/contact/ContactUsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("contact.meta");
  // 설명은 노션 SEO 명세(④ 사이트 링크)의 페이지별 문구를 쓴다(HOM-74).
  return pageMetadata({
    locale,
    path: "contact",
    title: t("title"),
    description: getPageDescription("contact", locale),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[var(--color-bg-100,#ffffff)]">
      <ContactUsSection />
    </main>
  );
}
