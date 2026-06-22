'use client';

import { useParams } from 'next/navigation';
import { MegaMenuPanel } from '@fai/ui';
import { productMenu } from '@/config/site';

export default function ProductMegaMenu() {
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : '';

  const lhref = (path: string) =>
    path.startsWith('http') ? path : locale ? `/${locale}${path}` : path;

  const items = productMenu.map((item) => ({
    ...item,
    href: lhref(item.href),
  }));

  return <MegaMenuPanel title="Product" items={items} />;
}
