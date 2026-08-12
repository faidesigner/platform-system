import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getOgImage, OG_IMAGE_SIZE } from "@/config/seo";

/** OG 로케일 코드 매핑(BCP-47 → Open Graph locale). */
export const OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

/**
 * 경로를 `/{locale}/{path}/` 형태로 정규화한다.
 * next.config의 trailingSlash:true 와 일치시켜야 canonical/og:url/sitemap이 서로 어긋나지 않는다.
 */
export function localePath(locale: string, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

export interface PageMetadataInput {
  locale: string;
  /** 로케일 세그먼트를 제외한 경로. 홈은 "" (예: "about", "products/vision-check-out") */
  path: string;
  /** 검색결과 제목. 하위 페이지는 루트 title 템플릿이 접미사를 붙인다. */
  title: string;
  description: string;
  /** 링크 미리보기 제목. 미지정 시 title 사용. */
  ogTitle?: string;
  /** 링크 미리보기 설명. 미지정 시 description 사용. */
  ogDescription?: string;
}

/**
 * 페이지 메타데이터 생성기 (HOM-74).
 *
 * 이 헬퍼를 두는 이유는 두 가지 결함을 구조적으로 막기 위함이다.
 *
 * 1) **og:url이 전 페이지 루트로 고정돼 있었다** — 명세가 직접 "= 버그"로 지목한 항목이다.
 *    루트 레이아웃의 openGraph.url을 하위 페이지가 덮지 않아 모든 페이지가 같은 URL을 공유했고,
 *    공유 링크의 미리보기가 전부 홈으로 뭉개졌다.
 * 2) **canonical이 기본 로케일(ko)에만 붙어 있었다** — en/ja 하위 페이지는 alternates를 지정하지
 *    않아 루트 레이아웃의 `/{locale}/`를 상속했고, 결과적으로 `/en/about/`이 `/en/`을 정본으로
 *    가리켰다. sitemap은 en/ja를 색인 대상으로 넣고 있어 신호가 서로 모순됐다.
 *
 * 두 값 모두 여기서 **같은 경로에서 파생**시키므로 어긋날 수 없다.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  ogTitle,
  ogDescription,
}: PageMetadataInput): Metadata {
  const self = localePath(locale, path);
  const ogImage = getOgImage(locale);

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localePath(l, path)]),
  ) as Record<string, string>;
  languages["x-default"] = localePath(routing.defaultLocale, path);

  return {
    title,
    description,
    alternates: { canonical: self, languages },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? OG_LOCALE.ko,
      url: absoluteUrl(self),
      siteName: "Fainders.AI",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [{ url: ogImage, ...OG_IMAGE_SIZE }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [ogImage],
    },
  };
}
