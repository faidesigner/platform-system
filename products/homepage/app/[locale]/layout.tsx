import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Footer } from "@fai/ui";
import NavigationBarBridge from "@/components/layout/NavigationBarBridge";
import SmoothScroll from "@/components/layout/SmoothScroll";

// 정적 export: 빌드 타임에 /ko, /en, /jp 를 프리렌더.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
        <Footer />
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
