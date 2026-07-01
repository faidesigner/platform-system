import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig, getSeo } from "@/config/site";
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

// OG 로케일 코드 매핑(BCP-47 → Open Graph locale).
const OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

// 로케일별 색인 정책: 현재 본문이 한국어뿐이라 ko만 색인하고
// en·ja는 noindex(번역 완료 시 해제). 미번역 페이지의 중복 색인 방지.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const s = getSeo(locale);
  const indexable = locale === routing.defaultLocale; // ko
  return {
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
    title: { default: s.title, template: `%s | ${siteConfig.name}` },
    description: s.description,
    keywords: s.keywords,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? OG_LOCALE.ko,
      url: siteConfig.url,
      siteName: "Fainders.AI",
      title: s.ogTitle,
      description: s.ogDescription,
      images: [{ url: "/images/og/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.ogTitle,
      description: s.ogDescription,
      images: ["/images/og/og-default.jpg"],
    },
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ko: "/ko/",
        en: "/en/",
        ja: "/ja/",
        "x-default": "/ko/",
      },
    },
    robots: { index: indexable, follow: true },
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

  // 검색엔진용 구조화 데이터(Organization). 리치 결과·지식 패널 노출에 도움.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fainders AI",
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logos/logoFaindersai-b.png`,
    description: getSeo("ko").description,
    sameAs: [
      "https://www.instagram.com/fainders_ai",
      "https://www.linkedin.com/company/faindersai",
      "https://www.youtube.com/@faindersAI",
    ],
  };

  return (
    <html lang={locale} className={notoSansKR.variable} suppressHydrationWarning>
      <body className="font-base antialiased bg-surface text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
