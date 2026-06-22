import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Footer } from "@fai/ui";
import NavigationBarBridge from "@/components/layout/NavigationBarBridge";
import SmoothScroll from "@/components/layout/SmoothScroll";

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
