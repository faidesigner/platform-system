import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import NavigationBarBridge from "@/components/layout/NavigationBarBridge";
import FooterBridge from "@/components/layout/FooterBridge";
import SmoothScroll from "@/components/layout/SmoothScroll";

// 정적 export: 빌드 타임에 /ko, /en, /jp 를 프리렌더.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 로케일별 색인 정책: 현재 본문이 한국어뿐이라 ko만 색인하고
// en·jp는 noindex(번역 완료 시 해제). 미번역 페이지의 중복 색인 방지.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const indexable = locale === routing.defaultLocale; // ko
  return {
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

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll>
        <NavigationBarBridge />
        <main>{children}</main>
        <FooterBridge />
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
