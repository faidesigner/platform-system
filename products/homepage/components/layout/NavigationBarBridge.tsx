'use client';

import { NavigationBar, LanguageSwitcher } from '@fai/ui';
import type { NavItem, DrawerLabels } from '@fai/ui';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import HomepageLangSwitcher from '@/components/layout/LanguageSwitcher';
import ProductMegaMenu from '@/components/ui/ProductMegaMenu';
import { trackEvent } from '@/lib/analytics/track';

export default function NavigationBarBridge() {
  const router   = useRouter();
  const pathname = usePathname();
  const t        = useTranslations('nav');

  const navItems: readonly NavItem[] = [
    {
      label:         t('products'),
      href:          '/products',
      dropdown:      true,
      megaMenuPanel: <ProductMegaMenu />,
    },
    { label: t('about'), href: '/about' },
    { label: t('media'), href: '/media' },
    {
      label:     t('careers'),
      href:      'https://faindersai.career.greetinghr.com/ko/home',
      external:  true,
      ariaLabel: '파인더스에이아이 채용 홈 바로가기(새창)',
    },
  ];

  const drawerLabels: DrawerLabels = {
    products: t('products'),
    about:    t('about'),
    media:    t('media'),
    careers:  t('careers'),
    contact:  t('contact'),
  };

  const handleLocaleChange = (code: string) => {
    // scroll:false → 언어 전환 시 최상단 이동/리로드 없이 현재 화면 유지
    router.push(pathname, { locale: code, scroll: false });
  };

  return (
    <NavigationBar
      navItems={navItems}
      contactLabel={t('contact')}
      drawerLabels={drawerLabels}
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
