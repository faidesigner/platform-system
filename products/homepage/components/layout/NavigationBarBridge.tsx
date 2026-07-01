'use client';

import { NavigationBar, LanguageSwitcher } from '@fai/ui';
import type { NavItem } from '@fai/ui';
import { useRouter, usePathname } from '@/i18n/navigation';
import HomepageLangSwitcher from '@/components/layout/LanguageSwitcher';
import ProductMegaMenu from '@/components/ui/ProductMegaMenu';
import { trackEvent } from '@/lib/analytics/track';

const NAV_ITEMS: readonly NavItem[] = [
  {
    label:         '제품',
    href:          '/products',
    dropdown:      true,
    megaMenuPanel: <ProductMegaMenu />,
  },
  { label: '회사소개', href: '/about' },
  { label: '미디어',   href: '/media' },
  {
    label:     '채용',
    href:      'https://faindersai.career.greetinghr.com/ko/home',
    external:  true,
    ariaLabel: '파인더스에이아이 채용 홈 바로가기(새창)',
  },
];

export default function NavigationBarBridge() {
  const router   = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (code: string) => {
    router.push(pathname, { locale: code });
  };

  return (
    <NavigationBar
      navItems={NAV_ITEMS}
      onItemClick={(item) => trackEvent('interest_click', { location: 'nav', label: item.label })}
      onContactClick={() => trackEvent('lead_acquisition_click', { location: 'nav', label: '문의하기' })}
      desktopLangSwitcher={(isTransparent) => (
        <HomepageLangSwitcher isTransparent={isTransparent} variant="desktop" />
      )}
      mobileLangSwitcher={(isDarkMode) => (
        <LanguageSwitcher isDarkMode={isDarkMode} onLocaleChange={handleLocaleChange} />
      )}
    />
  );
}
