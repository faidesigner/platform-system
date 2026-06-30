import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactUsSection } from "@/components/sections/contact/ContactUsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    // 루트 title 템플릿(%s | FAI)이 접미사를 붙이므로 여기선 페이지명만.
    title: "문의하기",
    description: "도입 고민부터 커스텀 솔루션 제안까지 전문가가 직접 답변해드립니다.",
    ...(locale === "ko" ? { alternates: { canonical: "/ko/contact/" } } : {}),
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
