'use client';

import Image from 'next/image';
import { Marquee } from './marquee/Marquee';

export interface LogoItem {
  src: string;
  alt: string;
}

export interface LogoMarqueeProps {
  logos: LogoItem[];
  /** @default 30 */
  speed?: number;
  /** @default 10 */
  tileOpacity?: number;
}

export function LogoMarquee({
  logos,
  speed = 30,
  tileOpacity = 10,
}: LogoMarqueeProps) {
  return (
    <Marquee speed={speed} gapClassName="gap-2xl" ariaLabel="협력사 로고">
      {logos.map((logo, i) => (
        <li
          key={i}
          className={[
            'flex flex-shrink-0 items-center justify-center',
            'py-ms w-[var(--size-180)]',
            'rounded-fai-s',
            `bg-[color-mix(in_srgb,var(--fai-bg-fill-inverse)_${tileOpacity}%,transparent)]`,
          ].join(' ')}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={140}
            height={40}
            className="h-auto w-auto object-contain brightness-0 invert opacity-80"
          />
        </li>
      ))}
    </Marquee>
  );
}
