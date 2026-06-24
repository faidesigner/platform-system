'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedStatProps {
  /** 최종 목표 숫자 */
  target: number;
  /** 소수 자릿수 (예: 99.7 → 1) */
  decimals?: number;
  /** 숫자 앞 텍스트 (예: 통화기호) */
  prefix?: string;
  /** 숫자 뒤 텍스트 (예: '초', '%', '건') */
  suffix?: string;
  /** 랜덤 셔플 지속(ms) */
  shuffleDuration?: number;
  /** 목표값으로 정착하는 시간(ms) */
  settleDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedStat({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  shuffleDuration = 600,
  settleDuration = 1000,
  className,
  style,
}: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState('0');
  const startedRef = useRef(false);

  const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mounted = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(format(target));
      return () => { mounted = false; };
    }

    let rafId = 0;
    let startTime = 0;
    let lastShuffleTime = 0;
    const SHUFFLE_INTERVAL = 66; // ~15fps 로 셔플 속도 제한

    const animate = (now: number) => {
      if (!mounted) return;
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      if (elapsed < shuffleDuration) {
        // 1단계: 랜덤 숫자 셔플 (~15fps, target 기준 ±20% 범위)
        if (now - lastShuffleTime >= SHUFFLE_INTERVAL) {
          lastShuffleTime = now;
          const spread = Math.max(target * 0.2, 5);
          const rand = target - spread + Math.random() * spread * 2;
          setDisplay(format(Math.max(0, rand)));
        }
        rafId = requestAnimationFrame(animate);
      } else if (elapsed < shuffleDuration + settleDuration) {
        // 2단계: 목표값으로 ease-out 정착 (easeOutQuint)
        const t = (elapsed - shuffleDuration) / settleDuration;
        const eased = 1 - Math.pow(1 - t, 5);
        setDisplay(format(target * eased));
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplay(format(target)); // 최종 확정
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            rafId = requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      mounted = false;
      startedRef.current = false;
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, decimals, prefix, suffix, shuffleDuration, settleDuration]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
