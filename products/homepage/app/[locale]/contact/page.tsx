import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ContactUsSection } from "@/components/sections/contact/ContactUsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("contact.meta");
  return {
    // 루트 title 템플릿(%s | FAI)이 접미사를 붙이므로 여기선 페이지명만.
    title: t("title"),
    description: t("description"),
    ...(locale === routing.defaultLocale
      ? { alternates: { canonical: `/${locale}/contact/` } }
      : {}),
  };
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
