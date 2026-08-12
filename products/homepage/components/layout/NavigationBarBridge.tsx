'use client';

import { NavigationBar, LanguageSwitcher } from '@fai/ui';
import type { DrawerLabels } from '@fai/ui';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import HomepageLangSwitcher from '@/components/layout/LanguageSwitcher';
import { markLocaleSwitchScroll } from '@/lib/localeScroll';
import ProductMegaMenu from '@/components/ui/ProductMegaMenu';
import { trackEvent } from '@/lib/analytics/track';
import { buildNavItems } from '@/components/layout/navItems';
import { localePolicy } from '@/config/locale-policy';

export default function NavigationBarBridge() {
  const router   = useRouter();
  const pathname = usePathname();
  const t        = useTranslations('nav');
  const locale   = useLocale();

  // 채용 메뉴는 ko 전용(HOM-68) — 데스크톱은 navItems에서 제외하고,
  // 드로어는 자체 렌더라 showCareers로 별도 전달한다.
  const { showCareers } = localePolicy(locale);

  const navItems = buildNavItems(
    {
      products: t('products'),
      about:    t('about'),
      media:    t('media'),
      careers:  t('careers'),
    },
    { showCareers, megaMenuPanel: <ProductMegaMenu /> },
  );

  const drawerLabels: DrawerLabels = {
    products: t('products'),
    about:    t('about'),
    media:    t('media'),
    careers:  t('careers'),
    contact:  t('contact'),
  };

  const handleLocaleChange = (code: string) => {
    // 전환 직전 scrollY 저장 → SmoothScroll 리마운트 후 복원 (HOM-9)
    markLocaleSwitchScroll();
    router.push(pathname, { locale: code, scroll: false });
  };

  return (
    <NavigationBar
      navItems={navItems}
      contactLabel={t('contact')}
      drawerLabels={drawerLabels}
      showCareers={showCareers}
      onItemClick={(item) => trackEvent('interest_click', { location: 'nav', label: item.label })}
      onContactClick={() => trackEvent('lead_acquisition_click', { location: 'nav', label: t('contact') })}
      desktopLangSwitcher={(isTransparent) => (
        <HomepageLangSwitcher isTransparent={isTransparent} variant="desktop" />
      )}
      mobileLangSwitcher={(isDarkMode) => (
        <LanguageSwitcher isDarkMode={isDarkMode} onLocaleChange={handleLocaleChange} />
      )}
    />
  );
}
