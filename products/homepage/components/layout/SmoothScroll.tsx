'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import Lenis from 'lenis';
import { peekLocaleScroll, clearLocaleScroll } from '@/lib/localeScroll';

export const lenisRef: { current: Lenis | null } = { current: null };

// 고정 헤더(h-16 = 64px) 높이만큼 앵커 스크롤 오프셋 보정.
const HEADER_OFFSET = 64;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // next-intl usePathname은 로케일 비종속(/products/vco) → 언어 전환 시 값이 그대로라
  // 아래 스크롤 초기화 이펙트가 트리거되지 않아 현재 스크롤 위치가 보존된다.
  const pathname = usePathname();

  // 브라우저 뒤로/앞으로 가기 감지용 플래그
  const isPopStateRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  //  - 뒤로/앞으로 가기: toTop() 생략, 브라우저 복원 후 Lenis 내부 상태만 동기화
  //  - 언어 전환: sessionStorage에 저장된 scrollY 복원 (콘텐츠 높이 확보될 때까지 rAF 재시도)
  //  - URL 해시(#product-reviews 등)가 있으면 해당 섹션으로
  //  - 그 외 일반 네비게이션: 무조건 최상단으로
  useEffect(() => {
    // 뒤로/앞으로 가기: 브라우저/Next.js가 스크롤을 복원하므로
    // toTop()을 호출하지 않고, 복원된 위치로 Lenis 내부 targetScroll을 맞춘다.
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      const rafId = requestAnimationFrame(() => {
        lenisRef.current?.scrollTo(window.scrollY, { immediate: true });
      });
      return () => cancelAnimationFrame(rafId);
    }

    // 언어 전환: LanguageSwitcher가 전환 직전 저장한 scrollY를 복원.
    // peekLocaleScroll()은 삭제하지 않음 → React StrictMode 이중 실행 시 1차(가짜)
    // 마운트가 rAF 취소 후 2차(실제)에서도 값을 재사용할 수 있도록 함.
    // clearLocaleScroll()은 rAF 콜백 내부에서 실제 복원 직전에만 호출.
    const savedY = peekLocaleScroll();
    if (savedY !== null) {
      let tries = 0;
      let rafId: number;
      const tryRestore = () => {
        const canScroll = document.body.scrollHeight > savedY + window.innerHeight * 0.5;
        if (canScroll || tries >= 20) {
          clearLocaleScroll(); // 실제 복원 직전에 삭제(1회성)
          if (lenisRef.current) lenisRef.current.scrollTo(savedY, { immediate: true });
          else window.scrollTo(0, savedY);
          return;
        }
        tries++;
        rafId = requestAnimationFrame(tryRestore);
      };
      rafId = requestAnimationFrame(tryRestore);
      return () => cancelAnimationFrame(rafId);
    }

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
