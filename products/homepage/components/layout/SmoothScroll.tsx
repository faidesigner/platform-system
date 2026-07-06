'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import Lenis from 'lenis';
import { consumeLocaleSwitchScroll } from '@/lib/localeScroll';

export const lenisRef: { current: Lenis | null } = { current: null };

// 고정 헤더(h-16 = 64px) 높이만큼 앵커 스크롤 오프셋 보정.
const HEADER_OFFSET = 64;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // next-intl usePathname은 로케일 비종속(/products/vco). 단, 언어 전환은 [locale]
  // 루트 세그먼트를 바꿔 이 컴포넌트를 리마운트시키므로 아래 이펙트가 마운트 시 실행된다
  // → 그 경우엔 저장된 스크롤 위치를 복원한다(consumeLocaleSwitchScroll).
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
  //  - 언어 전환 리마운트면 저장된 위치 복원(최상단 이동 방지) — HOM-9
  //  - URL 해시(#product-reviews 등)가 있으면 해당 섹션으로
  //  - 없으면 무조건 최상단으로 (이전 페이지 스크롤 위치 영향 제거)
  useEffect(() => {
    const scrollTo = (y: number) => {
      if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };
    const toTop = () => scrollTo(0);

    // 언어 전환으로 SmoothScroll가 리마운트된 경우: 전환 직전 위치로 복원한다.
    // 새 로케일은 카피 길이가 달라 문서 높이가 다르므로, 목표 지점까지 스크롤
    // 가능해질 때까지(=콘텐츠가 채워질 때까지) 몇 프레임 재시도 후 복원한다.
    const savedY = consumeLocaleSwitchScroll();
    if (savedY !== null) {
      let restoreTries = 0;
      const restore = () => {
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        if (maxY >= savedY || restoreTries++ >= 10) {
          lenisRef.current?.resize();
          scrollTo(Math.min(savedY, Math.max(0, maxY)));
          return;
        }
        requestAnimationFrame(restore);
      };
      requestAnimationFrame(restore);
      return;
    }

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
