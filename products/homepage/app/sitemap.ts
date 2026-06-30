import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const BASE = siteConfig.url; // https://www.fainders.ai
// 현재 색인 대상은 ko만(en·jp 미번역). 번역 완료 시 여기에 로케일을 추가한다.
const INDEXED_LOCALE = "ko";

// 정적 export 호환: 라우트를 정적으로 강제.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // playground(개발용)는 의도적으로 제외.
  const staticPaths = ["", "about", "media", "contact"];
  const productPaths = Object.keys(siteConfig.products).map(
    (slug) => `products/${slug}`,
  );

  return [...staticPaths, ...productPaths].map((path) => ({
    // trailingSlash:true 와 일치하도록 끝에 / 부여.
    url: `${BASE}/${INDEXED_LOCALE}${path ? `/${path}` : ""}/`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
