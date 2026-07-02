'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import Lenis from 'lenis';

export const lenisRef: { current: Lenis | null } = { current: null };

// 고정 헤더(h-16 = 64px) 높이만큼 앵커 스크롤 오프셋 보정.
const HEADER_OFFSET = 64;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // next-intl usePathname은 로케일 비종속(/products/vco) → 언어 전환 시 값이 그대로라
  // 아래 스크롤 초기화 이펙트가 트리거되지 않아 현재 스크롤 위치가 보존된다.
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,       // 스크롤 지속 시간 (길수록 천천히)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 라우트 전환 시 스크롤 포커싱:
  //  - URL 해시(#product-reviews 등)가 있으면 해당 섹션으로
  //  - 없으면 무조건 최상단으로 (이전 페이지 스크롤 위치 영향 제거)
  useEffect(() => {
    const toTop = () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    };

    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (!hash) {
      toTop();
      return;
    }

    // 해시 타겟이 마운트될 때까지 잠깐 재시도 후 스크롤.
    let tries = 0;
    const tryHash = () => {
      const el = document.querySelector(hash) as HTMLElement | null;
      if (el) {
        lenisRef.current?.resize();
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { immediate: true, offset: -HEADER_OFFSET });
        } else {
          el.scrollIntoView();
        }
        return;
      }
      if (tries++ < 10) setTimeout(tryHash, 60);
      else toTop();
    };
    requestAnimationFrame(tryHash);
  }, [pathname]);

  return <>{children}</>;
}
