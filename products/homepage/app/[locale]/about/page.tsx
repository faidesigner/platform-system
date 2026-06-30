import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutPartners } from "@/components/sections/about/AboutPartners";
import { AboutLogos } from "@/components/sections/about/AboutLogos";
import { AboutManagement } from "@/components/sections/about/AboutManagement";
import { AboutPeople } from "@/components/sections/about/AboutPeople";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "회사소개",
    description: "Fainders AI 회사 소개 — 멀티뷰 3D Vision AI로 매장 무인화를 실현합니다.",
    // 기본 로케일만 색인 대상이므로 self-canonical도 거기서만 부여(noindex 로케일과 신호 충돌 방지).
    ...(locale === routing.defaultLocale
      ? { alternates: { canonical: `/${locale}/about/` } }
      : {}),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <AboutHero />
      <AboutPartners />
      <AboutLogos />
      <AboutManagement />
      <AboutPeople />
    </main>
  );
}
