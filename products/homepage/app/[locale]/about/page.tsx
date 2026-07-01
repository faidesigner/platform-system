import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { aboutConfig } from "@/config/site";
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
  const t = await getTranslations("about.meta");
  return {
    title: t("title"),
    description: t("description"),
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

  // 텍스트는 messages(about.*)에서, 이미지/URL/구조는 config(aboutConfig)에서.
  // 서버 컴포넌트에서 config 구조 + 번역 텍스트를 인덱스로 병합해 하위 컴포넌트에 props로 주입.
  const t = await getTranslations("about");
  const tA11y = await getTranslations("common.a11y");

  const heroTitle = aboutConfig.hero.title.map((_, i) => t(`hero.title.${i}`));

  const partnersDescription = aboutConfig.partners.description.map((_, i) =>
    t(`partners.description.${i}`),
  );

  const investorGroups = aboutConfig.investors.groups.map((group, i) => ({
    ...group,
    caption: t(`investors.groups.${i}.caption`),
  }));

  const managementMembers = aboutConfig.management.members.map((member, i) => ({
    ...member,
    education: member.education.map((_, j) => t(`management.members.${i}.education.${j}`)),
    career: member.career.map((_, j) => t(`management.members.${i}.career.${j}`)),
  }));

  const peopleCards = aboutConfig.people.cards.map((card, i) => ({
    ...card,
    title: t(`people.cards.${i}.title`),
    role: t(`people.cards.${i}.role`),
    interviewAriaLabel: t("people.interviewAriaLabel", { name: card.name }),
  }));

  return (
    <main>
      <AboutHero eyebrow={t("hero.eyebrow")} title={heroTitle} image={aboutConfig.hero.image} />
      <AboutPartners
        title={t("partners.title")}
        description={partnersDescription}
        logoRows={aboutConfig.partners.logoRows}
      />
      <AboutLogos groups={investorGroups} />
      <AboutManagement title={t("management.title")} members={managementMembers} />
      <AboutPeople
        title={t("people.title")}
        subtitle={t("people.subtitle")}
        cards={peopleCards}
        a11yPrev={tA11y("prev")}
        a11yNext={tA11y("next")}
      />
    </main>
  );
}
