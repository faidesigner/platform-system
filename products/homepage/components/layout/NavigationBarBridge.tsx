'use client';

import { NavigationBar, LanguageSwitcher } from '@fai/ui';
import type { NavItem } from '@fai/ui';
import HomepageLangSwitcher from '@/components/layout/LanguageSwitcher';
import ProductMegaMenu from '@/components/ui/ProductMegaMenu';

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
  return (
    <NavigationBar
      navItems={NAV_ITEMS}
      desktopLangSwitcher={(isTransparent) => (
        <HomepageLangSwitcher isTransparent={isTransparent} variant="desktop" />
      )}
      mobileLangSwitcher={(isDarkMode) => (
        <LanguageSwitcher isDarkMode={isDarkMode} />
      )}
    />
  );
}
