'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import Lenis from 'lenis';
import { consumeLocaleSwitchScroll } from '@/lib/localeScroll';
import {
  saveScrollPosition,
  readScrollPosition,
  classifyPop,
  decideScrollAction,
  clampScrollY,
  retryDone,
  applyScroll,
} from '@/lib/scrollPositions';

export const lenisRef: { current: Lenis | null } = { current: null };

// 고정 헤더(h-16 = 64px) 높이만큼 앵커 스크롤 오프셋 보정.
const HEADER_OFFSET = 64;
// SSG 하이드레이션·이미지 로드로 문서 높이가 뒤늦게 커지는 경우 대비 rAF 재시도 상한.
const RESTORE_MAX_TRIES = 10;

/** pathname + search + hash 전체 URL(스크롤 위치 키·pop 대상 판정용). */
const fullUrl = () =>
  window.location.pathname + window.location.search + window.location.hash;

/** 문서의 내비게이션 타입('navigate' | 'reload' | 'back_forward' | undefined). */
const navigationType = (): string | undefined =>
  (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // next-intl usePathname은 로케일 비종속(/products/vco). production(static export)에서는
  // 언어 전환 시 [locale] 루트 세그먼트가 바뀌어 이 컴포넌트가 리마운트된다.
  // dev(Turbopack) SPA 모드에서는 리마운트 없이 update로 처리되어 [pathname] 단독 deps로는
  // 언어 전환을 감지할 수 없다 → locale도 deps에 포함해 effect 재실행을 보장한다.
  const pathname = usePathname();
  const locale = useLocale();

  // 스크롤 이펙트가 마지막으로 처리한 전체 URL / 경로변경 pop이 지정한 복원 대상 URL.
  const handledUrlRef = useRef<string | null>(null);
  const pendingPopUrlRef = useRef<string | null>(null);
  const firstRunRef = useRef(true);

  /** 콘텐츠 높이가 목표에 도달할 때까지 rAF 재시도 후 복원(도달 가능 최댓값으로 클램프). */
  const restoreScroll = (y: number) => {
    let tries = 0;
    const step = () => {
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (retryDone(maxY, y, tries++, RESTORE_MAX_TRIES)) {
        applyScroll(clampScrollY(y, maxY), lenisRef.current, window);
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Lenis 스무스 스크롤 초기화.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
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

  // 뒤로/앞으로(SPA) 복원 배선 + 스크롤 위치 저장 — 마운트 시 1회 등록.
  useEffect(() => {
    // 브라우저 기본 복원을 끄고 직접 제어(항상 최상단으로 튀는 것 방지).
    history.scrollRestoration = 'manual';

    const onPop = () => {
      const target = fullUrl();
      if (
        handledUrlRef.current !== null &&
        classifyPop(target, handledUrlRef.current) === 'hash-only'
      ) {
        // 해시 전용 pop은 pathname이 안 바뀌어 [pathname] 이펙트가 안 돈다 → 리스너가 직접 복원.
        restoreScroll(readScrollPosition(target) ?? 0);
      } else {
        // 경로 변경 pop → [pathname] 이펙트가 pendingPop 일치로 복원 처리.
        pendingPopUrlRef.current = target;
      }
    };
    window.addEventListener('popstate', onPop);

    // 스크롤 위치 저장(rAF 스로틀). window.scrollY 기준(Lenis도 네이티브 스크롤 사용).
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        saveScrollPosition(fullUrl(), window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // 라우트 전환 시 스크롤 포커싱 결정(순수 판정 → 부수효과 실행).
  //  - 첫 마운트 back/forward(문서 리로드 왕복 복귀 포함) → 저장 위치 복원
  //  - 경로변경 pop(뒤로/앞으로) → 저장 위치 복원
  //  - 언어 전환 리마운트 → 저장 위치 복원(HOM-9)
  //  - 해시 앵커 → 해당 섹션 / 그 외 → 최상단
  useEffect(() => {
    const target = fullUrl();
    handledUrlRef.current = target;

    const isFirstRun = firstRunRef.current;
    firstRunRef.current = false;

    const pendingPopMatches = pendingPopUrlRef.current === target;
    if (pendingPopMatches) pendingPopUrlRef.current = null;

    const localeY = consumeLocaleSwitchScroll();
    const hash = window.location.hash;

    const action = decideScrollAction({
      isFirstRun,
      navType: navigationType(),
      pendingPopMatches,
      localeY,
      hash,
      savedY: readScrollPosition(target),
    });

    if (action.type === 'restore') {
      restoreScroll(action.y);
      return;
    }
    if (action.type === 'top') {
      // rAF으로 지연: SPA 이동 시 Lenis RAF 루프가 immediate scrollTo를 덮어쓰는 현상 방지.
      // production(static export)은 매 페이지가 fresh mount라 문제없으나 next dev에서 재발.
      requestAnimationFrame(() => applyScroll(0, lenisRef.current, window));
      return;
    }

    // action.type === 'anchor' — 해시 타겟이 마운트될 때까지 잠깐 재시도 후 스크롤.
    let tries = 0;
    const tryHash = () => {
      const el = document.querySelector(action.hash) as HTMLElement | null;
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
      else applyScroll(0, lenisRef.current, window);
    };
    requestAnimationFrame(tryHash);
  }, [pathname, locale]);

  return <>{children}</>;
}
