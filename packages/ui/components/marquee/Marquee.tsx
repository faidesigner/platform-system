'use client';

import { Children, cloneElement, isValidElement } from 'react';
import type { CSSProperties } from 'react';

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(' ');
}

export interface MarqueeProps {
  children: React.ReactNode;
  /** 트랙 한 바퀴 소요 시간(초). @default 30 */
  speed?: number;
  /** 트랙 아이템 간격 Tailwind 클래스. @default gap-2xl */
  gapClassName?: string;
  ariaLabel?: string;
}

export function Marquee({
  children,
  speed = 30,
  gapClassName = 'gap-2xl',
  ariaLabel,
}: MarqueeProps) {
  const items = Children.toArray(children);
  /* 2벌 복제 → -50% keyframe 루프로 끊김 없는 롤링 */
  const track = [...items, ...items];

  return (
    /*
     * 풀블리드 래퍼: left-1/2 w-screen -translate-x-1/2 만 사용.
     * -mx-[50vw]를 함께 쓰면 transform offset과 중첩되어
     * 엘리먼트가 뷰포트 밖(왼쪽 -50vw)으로 벗어남 → 제거.
     */
    <div
      className="relative left-1/2 w-screen -translate-x-1/2"
      role="region"
      aria-label={ariaLabel}
    >
      <div className="relative w-full overflow-hidden">
        {/*
         * [--marquee-duration:${speed}s] 동적 클래스는
         * Tailwind가 빌드 타임에 스캔할 수 없어 CSS 미생성 → 애니메이션 무효.
         * CSS 변수는 inline style로 주입하고, 클래스는 정적으로 고정.
         */}
        <ul
          className={cn(
            'flex w-max items-center motion-reduce:animate-none animate-fai-marquee',
            gapClassName,
          )}
          style={{ '--marquee-duration': `${speed}s` } as CSSProperties}
          aria-label={ariaLabel ? `${ariaLabel} 목록` : undefined}
        >
          {track.map((child, i) => {
            const isDuplicate = i >= items.length;

            if (isValidElement<{ 'aria-hidden'?: boolean }>(child)) {
              return cloneElement(child, {
                key: i,
                ...(isDuplicate ? { 'aria-hidden': true as const } : {}),
              });
            }

            return (
              <li key={i} aria-hidden={isDuplicate || undefined} className="shrink-0">
                {child}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
