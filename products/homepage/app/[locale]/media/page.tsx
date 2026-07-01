import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import MediaNewsSection from "@/components/sections/media/NewsSection";
import MediaShowcaseSection from "@/components/sections/media/ShowcaseSection";
import RetailTechLetterSection from "@/components/sections/media/RetailTechLetterSection";
// scripts/sync-youtube.mjs / sync-stibee.mjs 가 생성하는 외부 동기화 데이터(RSS/Stibee API 원문).
// 리싱크마다 목록이 바뀌는 외부 콘텐츠라 정적 messages 인덱스로 옮기지 않고 원문 그대로 사용.
import showcase from "@/config/youtube-showcase.json";
import letterData from "@/config/retail-tech-letter.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("media.meta");
  return {
    title: t("title"),
    description: t("description"),
    ...(locale === routing.defaultLocale
      ? { alternates: { canonical: `/${locale}/media/` } }
      : {}),
  };
}

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 텍스트는 messages(media.*)에서, 이미지/URL/구조는 config(siteConfig)·동기화 JSON에서.
  // 서버 컴포넌트에서 config 구조 + 번역 텍스트를 인덱스로 병합해 하위(클라이언트) 컴포넌트에 props로 주입.
  const t = await getTranslations("media");
  const tCommon = await getTranslations("common.cta");

  const newsItems = siteConfig.media.items.map((item, i) => ({
    ...item,
    title: t(`news.items.${i}.title`),
    description: t(`news.items.${i}.description`),
    thumbnailAlt: t(`news.items.${i}.thumbnailAlt`),
  }));

  return (
    <main>
      <MediaShowcaseSection
        title={t("showcase.title")}
        channelLabel={t("showcase.youtube.channelLabel")}
        ctaLabel={t("showcase.youtube.ctaLabel")}
        // showcase.videos는 sync-youtube.mjs가 RSS에서 그대로 받아오는 원문(로케일 혼재) —
        // 정적 messages 인덱스로 매핑 불가(영상 목록이 리싱크마다 바뀜). 원문 그대로 노출.
        videos={showcase.videos}
        socials={siteConfig.mediaShowcase.socials}
        // 클라 컴포넌트에는 함수를 props로 못 넘기므로(서버→클라 직렬화 제약),
        // {index}/{label} 플레이스홀더가 남은 템플릿 문자열을 그대로 전달해 클라에서 치환한다.
        a11y={{
          prevVideo: t("showcase.youtube.a11y.prevVideo"),
          nextVideo: t("showcase.youtube.a11y.nextVideo"),
          goToVideoTemplate: t.raw("showcase.youtube.a11y.goToVideo") as string,
          followAriaLabelTemplate: t.raw("showcase.socials.followAriaLabel") as string,
        }}
      />
      <MediaNewsSection
        title={t("news.title")}
        moreLabel={tCommon("more")}
        items={newsItems}
      />
      <RetailTechLetterSection
        title={t("retailTechLetter.title")}
        ctaLabel={t("retailTechLetter.ctaLabel")}
        moreLabel={tCommon("more")}
        url={siteConfig.retailTechLetter.url}
        letters={letterData.letters}
      />
    </main>
  );
}
