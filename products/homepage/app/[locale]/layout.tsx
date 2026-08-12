import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { getSiteSeo } from "@/config/seo";
import { pageMetadata, absoluteUrl, localePath } from "@/lib/seo";
import NavigationBarBridge from "@/components/layout/NavigationBarBridge";
import FooterBridge from "@/components/layout/FooterBridge";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "../globals.css";

// 기존 라이브 homepage와 동일한 GA4 속성. 측정 ID는 공개값이라 하드코딩(시크릿 아님).
const GA_MEASUREMENT_ID = "G-GCQKJ5TF6R";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

// Next 16(App Router)에서 <html lang>은 [locale] 동적 세그먼트를 루트 레이아웃으로 두고
// 파라미터로 설정하는 것이 공식 패턴(next docs: layout.md §Root Layout L146, internationalization).
// 따라서 이 레이아웃이 <html>/<body>를 소유하는 유일한 루트 레이아웃이다(app/layout.tsx 제거됨).

// 정적 export: 빌드 타임에 /ko, /en, /ja 를 프리렌더.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 로케일별 색인 정책: ko/en/ja 모두 번역 완료 → 전 로케일 색인 허용.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const s = getSiteSeo(locale);

  // canonical·og:url·hreflang은 pageMetadata가 같은 경로에서 파생시킨다(HOM-74).
  // 하위 페이지가 각자 pageMetadata로 자기 경로를 덮으므로 og:url 루트 고정 버그가 재발하지 않는다.
  const base = pageMetadata({
    locale,
    path: "",
    title: s.title,
    description: s.description,
    ogTitle: s.ogTitle,
    ogDescription: s.ogDescription,
  });

  return {
    ...base,
    metadataBase: new URL(siteConfig.url),
    // FAI 브랜드 파비콘 세트(app/favicon.ico + public PNG/Apple/PWA manifest).
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
      other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg" }],
    },
    manifest: "/site.webmanifest",
    // 하위 페이지 title에 브랜드 접미사를 자동 부착.
    title: { default: s.title, template: "%s | Fainders.AI" },
    // keywords 메타 태그는 쓰지 않는다 — 명세(③)가 JSON-LD로만 노출하도록 정했다.
    robots: { index: true, follow: true },
    // Meta(Facebook) 도메인 인증. 루트(/)가 서빙하는 public/index.html 에도 동일 태그가 있고,
    // Meta가 리다이렉트를 따라온 경우까지 커버하기 위해 로케일 페이지에도 심는다.
    // 삭제하면 인증이 풀려 iOS 사용자 전환이 광고 성과에서 누락된다.
    verification: {
      other: { "facebook-domain-verification": "tulmodqt0xe5lzjhkn95q89kd6cuqv" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // 정적 렌더링 활성화(미들웨어 없이 로케일 컨텍스트 확정). 모든 next-intl 호출보다 먼저.
  setRequestLocale(locale);

  const messages = await getMessages();

  // 검색엔진용 구조화 데이터. Organization + WebSite를 @graph로 묶는다.
  //
  // 키워드(명세 ③)는 여기에만 넣는다. 화면 카피·마크업은 그대로 두고 봇만 읽는 JSON-LD로 제공해
  // keyword stuffing 페널티를 피하라는 것이 명세의 요구다. 로케일에 따라 키워드가 바뀐다.
  const seoForLocale = getSiteSeo(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: "Fainders AI",
        alternateName: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logos/logoFaindersai-b.png`,
        description: seoForLocale.description,
        sameAs: [
          "https://www.instagram.com/fainders_ai",
          "https://www.linkedin.com/company/faindersai",
          "https://www.youtube.com/@faindersAI",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: absoluteUrl(localePath(locale, "")),
        name: seoForLocale.title,
        description: seoForLocale.description,
        inLanguage: locale,
        keywords: seoForLocale.keywords.join(", "),
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} className={notoSansKR.variable} suppressHydrationWarning>
      <body className="font-base antialiased bg-surface text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <NavigationBarBridge />
            <main>{children}</main>
            <FooterBridge />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
      {/* GA4: 클라이언트 네비게이션(next-intl)에서도 페이지뷰 자동 추적 */}
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
