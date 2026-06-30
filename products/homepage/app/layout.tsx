import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

// 기존 라이브 homepage와 동일한 GA4 속성. 측정 ID는 공개값이라 하드코딩(시크릿 아님).
const GA_MEASUREMENT_ID = "G-GCQKJ5TF6R";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.fullName,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: ["/images/hero-composite.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: ["/images/hero-composite.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// 검색엔진용 구조화 데이터(Organization). 리치 결과·지식 패널 노출에 도움.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fainders AI",
  alternateName: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logos/logoFaindersai-b.svg`,
  description: siteConfig.description,
  sameAs: [
    "https://www.instagram.com/fainders_ai",
    "https://www.linkedin.com/company/faindersai",
    "https://www.youtube.com/@faindersAI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html className={notoSansKR.variable} suppressHydrationWarning>
      <body className="font-base antialiased bg-surface text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
      {/* GA4: 클라이언트 네비게이션(next-intl)에서도 페이지뷰 자동 추적 */}
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
