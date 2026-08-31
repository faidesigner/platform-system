import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { getPageDescription } from "@/config/seo";
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
  // 설명은 노션 SEO 명세(④ 사이트 링크)의 페이지별 문구를 쓴다(HOM-74).
  return pageMetadata({
    locale,
    path: "about",
    title: t("title"),
    description: getPageDescription("about", locale),
  });
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

  /**
   * 줄 배열은 **메시지 쪽 길이**를 따라야 한다 (HOM-75).
   *
   * 예전에는 `aboutConfig.<...>.map((_, i) => t(\`...\${i}\`))` 처럼 **ko 기준 config 길이**로
   * 반복했다. 로케일별로 줄 수가 다르면 없는 인덱스를 조회하게 되고, next-intl은 그때
   * **키 이름을 그대로 렌더**한다 — 화면에 `about.partners.description.1` 이 노출됐다
   * (2026-08-31, en 카피가 시트에서 두 줄 → 한 줄로 바뀐 직후 발생).
   *
   * 언어마다 줄 수가 다른 건 자연스럽다. 길이의 근거를 config가 아니라 메시지로 옮긴다.
   */
  const lines = (key: string): string[] => {
    const raw = t.raw(key);
    if (Array.isArray(raw)) return raw.map(String);
    // messages JSON이 배열을 객체({"0":…})로 담고 있는 경우도 있다 — 키 순서대로 펼친다.
    if (raw && typeof raw === "object") {
      return Object.keys(raw)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => String((raw as Record<string, unknown>)[k]));
    }
    return [String(raw)];
  };

  const heroTitle = lines("hero.title");

  const partnersDescription = lines("partners.description");

  const investorGroups = aboutConfig.investors.groups.map((group, i) => ({
    ...group,
    caption: t(`investors.groups.${i}.caption`),
  }));

  const managementMembers = aboutConfig.management.members.map((member, i) => {
    const name = t(`management.members.${i}.name`);
    return {
      ...member,
      name,
      // photo.alt는 config에 "<한글 이름> <role>"로 고정돼 있어 name만 치환하면 인명 로케일이 깨짐 → 번역된 이름으로 재조합.
      photo: { ...member.photo, alt: `${name} ${member.role}` },
      education: lines(`management.members.${i}.education`),
      career: lines(`management.members.${i}.career`),
    };
  });

  const peopleCards = aboutConfig.people.cards.map((card, i) => {
    const name = t(`people.cards.${i}.name`);
    const interviewAriaLabel = t("people.interviewAriaLabel", { name });
    return {
      ...card,
      name,
      title: t(`people.cards.${i}.title`),
      role: t(`people.cards.${i}.role`),
      // image.alt는 config에 "<한글 이름> ... 인터뷰"로 고정돼 있어 로케일이 깨짐 → 카드 링크에 이미 붙는
      // interviewAriaLabel(번역 완료)을 재사용해 대체(감싸는 <a>의 접근성 이름과 내용도 일치시킴).
      image: { ...card.image, alt: interviewAriaLabel },
      interviewAriaLabel,
    };
  });

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
