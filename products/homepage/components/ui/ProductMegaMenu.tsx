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

  // 시트 nav 10행 지정값은 세 로케일 모두 "Products"(복수)다 — nav 2행의 "Products"와 맞춘다.
  // 하드코딩인 이유: ko·ja·en 값이 동일해 messages로 옮길 이유가 없다(2026-09-03 번역 리뷰).
  return <MegaMenuPanel title="Products" items={items} />;
}
