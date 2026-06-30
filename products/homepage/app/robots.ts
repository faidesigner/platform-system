import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // playground는 개발용 → 색인 제외. en·jp는 차단하지 않는다:
      // 차단하면 크롤러가 페이지의 noindex 메타를 못 읽어 오히려 색인될 수 있다.
      disallow: ["/ko/playground/", "/en/playground/", "/jp/playground/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
