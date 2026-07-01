'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MegaMenuPanel } from '@fai/ui';
import { productMenu } from '@/config/site';

export default function ProductMegaMenu() {
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : '';
  const t = useTranslations('products.productMenu');

  const lhref = (path: string) =>
    path.startsWith('http') ? path : locale ? `/${locale}${path}` : path;

  // label(제품 고유명사)·이미지·배경은 config 유지, description만 messages에서 주입.
  const items = productMenu.map((item, i) => ({
    ...item,
    href: lhref(item.href),
    description: t(`${i}.description`),
  }));

  return <MegaMenuPanel title="Product" items={items} />;
}
