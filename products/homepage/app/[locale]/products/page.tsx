'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

// /[locale]/products/ 에 해당하는 인덱스 페이지가 없어 404가 발생하는 것을 방지.
// 내비게이션 'Products' 항목은 mega menu로 동작하지만, 직접 URL 입력 시 첫 번째 제품으로 리다이렉트.
export default function ProductsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/products/vision-check-out');
  }, [router]);

  return null;
}
