'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Marquee } from '@fai/ui';
import { trackEvent } from '@/lib/analytics/track';

export interface CustomerImage {
  name: string;
  src: string;
  alt: string;
}

export interface CustomersSectionProps {
  title?: string;
  linkLabel?: string;
  linkHref?: string;
  images?: CustomerImage[];
  /** @default 40 */
  speed?: number;
}

const DEFAULT_IMAGES: CustomerImage[] = [
  { name: 'bakery-mannamil',    src: '/images/customers/01-bakery-mannamil.jpg',    alt: '베이커리 만나밀' },
  { name: 'bakery-hansangmin',  src: '/images/customers/02-bakery-hansangmin.jpg',  alt: '베이커리 한상민' },
  { name: 'foodCourt-niseko-1', src: '/images/customers/03-foodCourt-niseko-2.jpg', alt: '푸드코트 니세코 1' },
  { name: 'foodCourt-niseko-2', src: '/images/customers/04-foodCourt-niseko-1.jpg', alt: '푸드코트 니세코 2' },
  { name: 'retail-hibinoma',    src: '/images/customers/05-retail-hibinoma.jpg',    alt: '리테일 히비노마' },
  { name: 'retail-wellstory',   src: '/images/customers/06-retail-wellstory.jpeg',  alt: '리테일 웰스토리' },
  { name: 'retail-shokunoma',   src: '/images/customers/07-retail-shokunoma.jpg',   alt: '리테일 쇼쿠노마' },
  { name: 'bakery-toujours',    src: '/images/customers/08-bakery-toujours.jpg',    alt: '뚜쥬루 베이커리' },
];

export default function CustomersSection({
  title,
  linkLabel,
  linkHref  = '/customers',
  images    = DEFAULT_IMAGES,
  speed     = 40,
}: CustomersSectionProps) {
  const t = useTranslations('home.customers');
  const tCommon = useTranslations('common');
  const resolvedTitle = title ?? t('title');
  const resolvedLinkLabel = linkLabel ?? tCommon('cta.reviewsMore');

  return (
    <section className="bg-bg-100 py-5xl overflow-hidden">
      {/* 헤더 — container 내부에서 좌우 정렬 */}
      <div className="w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)]">
        <div className="pb-4xl flex w-full justify-between items-end">
          <h2 className="text-title-l desktop:text-title-xl font-bold text-sand-text-primary">
            {resolvedTitle}
          </h2>
          {/*
           * btn/icoTxt/assistive 사양
           * 외부 래퍼: flex-col / py-s(8px) px-m(16px) / gap-0 / rounded-fai-s(8px)
           * 내부 영역: flex items-center / px-2xs(4px) / gap-2xs(4px)
           * 타이포: text-body-ms(15px/22px) font-semibold / text-text-basic-primary
           */}
          <Link
            href={linkHref}
            onClick={() => trackEvent('interest_click', { location: 'home_customers', label: resolvedLinkLabel })}
            className={[
              'shrink-0',
              'flex flex-col justify-center items-center',
              'py-s px-m gap-0',
              'rounded-fai-s',
              'text-text-basic-primary text-center',
              'transition-colors duration-200',
            ].join(' ')}
          >
            <span className="flex items-center justify-center px-2xs gap-2xs">
              <span className="text-body-ms font-semibold">{resolvedLinkLabel}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                focusable="false"
              >
                <mask
                  id="mask0_6333_4062"
                  style={{ maskType: 'alpha' }}
                  maskUnits="userSpaceOnUse"
                  x="4"
                  y="2"
                  width="8"
                  height="12"
                >
                  <path
                    d="M5 13.334L11 8.00073L5 2.66732"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </mask>
                <g mask="url(#mask0_6333_4062)">
                  <rect width="16" height="16" fill="currentColor" />
                </g>
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/*
       * Marquee — container 밖에서 렌더링하여 섹션 전체 폭 확보.
       * 풀블리드는 Marquee 내부의 left-1/2 w-screen -translate-x-1/2 로 처리.
       * 섹션에 overflow-hidden 적용해 마스크 밖 영역 클리핑.
       */}
      <Marquee speed={speed} gapClassName="gap-2xl" ariaLabel="고객사 이미지">
        {images.map((image) => (
          /*
           * li에 반드시 shrink-0 + 고정 w/h 적용.
           * flex 컨테이너(ul) 안에서 카드가 압축되지 않도록 강제.
           */
          <li key={image.name} className="shrink-0 rounded-fai-m">
            <div className="relative overflow-hidden w-[369px] h-[420px] rounded-fai-m bg-fill-faint">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="369px"
                style={
                  image.name === 'bakery-toujours'
                    ? { objectPosition: '-47.738px 0px' }
                    : { objectPosition: 'center center' }
                }
              />
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(9, 9, 11, 0.25) 0%, rgba(0, 0, 0, 0.00) 100%)' }}
              />
            </div>
          </li>
        ))}
      </Marquee>
    </section>
  );
}
