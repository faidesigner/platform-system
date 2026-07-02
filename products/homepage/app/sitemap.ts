import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

const BASE = siteConfig.url; // https://www.fainders.ai
// ko/en/ja 모두 번역 완료 → 전 로케일을 색인 대상으로 노출한다.
const INDEXED_LOCALES = routing.locales;

// 정적 export 호환: 라우트를 정적으로 강제.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // playground(개발용)는 의도적으로 제외.
  const staticPaths = ["", "about", "media", "contact"];
  const productPaths = Object.keys(siteConfig.products).map(
    (slug) => `products/${slug}`,
  );
  const paths = [...staticPaths, ...productPaths];

  return INDEXED_LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      // trailingSlash:true 와 일치하도록 끝에 / 부여.
      url: `${BASE}/${locale}${path ? `/${path}` : ""}/`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
  );
}
