'use client';

/**
 * WhyFaiSection — "Why FAI" 섹션
 *
 * 참조: root/components/web/sections/WhyFaiSection.tsx
 *
 * 색상·타이포 토큰 매핑 (인라인 스타일 0개):
 *   섹션 배경    → bg-sand-filled-primary
 *   헤더 타이틀  → text-display-s font-bold text-text-basic-primary text-center
 *                  (var(--w-display-S-size/lineHeight/letterSpacing))
 *   헤더 서브카피 → text-body-xl font-normal text-text-basic-tertiary text-center
 *                  (var(--w-text-XL-size/lineHeight/letterSpacing))
 *   카드 배경    → bg-sand-filled-tertiary
 *   카드 보더    → border border-sand-400
 *   카드 높이    → h-[var(--size-320)]              320px
 *   카드 패딩    → p-[var(--padding-3XL)]            40px
 *   카드 라운드  → rounded-[var(--cornerRadius-S)]   8px
 *   카드 바디 gap→ gap-[var(--spacing-MS)]            12px
 *   카드 타이틀  → text-title-m font-semibold text-sand-text-primary
 *   카드 본문    → text-body font-normal text-sand-text-tertiary
 *   호버 텍스트  → group-hover:text-inverse (글로벌 역상 토큰)
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

const scrollFadeInUp = {
  initial: { opacity: 0, y: 100, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

/* ──────────────────────────────────────────
   Types
────────────────────────────────────────── */

export interface WhyFaiItem {
  title: string;
  description: string;
  videoSrc?: string;
}

export interface WhyFaiSectionProps {
  headline?: string;
  subheadline?: string;
  items?: WhyFaiItem[];
}

/* ──────────────────────────────────────────
   Default data
────────────────────────────────────────── */

const DEFAULT_ITEMS: WhyFaiItem[] = [
  {
    title: '멈춤 없이 매끄러운 결제',
    description: '바코드 스캔 없이 쓱 올려두면 결제가 끝나요\n쾌적한 결제 경험이 우리 매장의 매출을 바꿔요',
    videoSrc: '/videos/home/home-why-fai-loop-1.mp4',
  },
  {
    title: '최소 인력으로 최대 효율을',
    description: '단순 계산 업무는 똑똑한 AI에 맡기고, 사장님은 더 가치 있는 매장 관리에 집중하세요',
    videoSrc: '/videos/home/home-why-fai-loop-2.mp4',
  },
  {
    title: '막힘없는 고객 경험',
    description: '대기 시간이 줄어든 만큼 기분 좋게 매장을 나선 손님들은 이곳을 다시 찾게 될 거예요',
    videoSrc: '/videos/home/home-why-fai-loop-3.mp4',
  },
];

/* ──────────────────────────────────────────
   Sub-component: WhyFaiCard
────────────────────────────────────────── */

function WhyFaiCard({ item, index }: { item: WhyFaiItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-start flex-1 h-[var(--size-320)] p-2xl rounded-fai-s border border-sand-400 bg-sand-filled-tertiary overflow-hidden"
      variants={scrollFadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 20, mass: 1, delay: index * 0.15 }}
    >
      {/* ── 배경 비디오 (항상 루프, 호버 시 표시) ── */}
      {item.videoSrc && (
        <video
          src={item.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover -z-10 transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* ── 카드 바디 ── */}
      <div className={`relative flex flex-col items-start gap-ms flex-1 self-stretch transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-body-xl desktop:text-title-s font-semibold text-sand-text-primary">
          {item.title}
        </h3>
        <p className="text-body font-normal text-sand-text-tertiary whitespace-pre-line">
          {item.description}
        </p>
      </div>
    </motion.li>
  );
}

/* ──────────────────────────────────────────
   Component
────────────────────────────────────────── */

export default function WhyFaiSection({
  headline    = 'Why FAI',
  subheadline = '멈춤 없이, 인건비 추가 없이, 대기줄 없이\n효율적인 매장 운영을 할 수 있습니다.',
  items       = DEFAULT_ITEMS,
}: WhyFaiSectionProps) {
  return (
    <section className="w-full bg-sand-filled-primary">
      <div className="w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-5xl">

        {/* ── 헤더 ── */}
        <header className="pb-3xl flex flex-col items-start gap-m">
          <h2 className="text-title-l desktop:text-title-xl font-bold text-text-basic-primary text-left whitespace-pre-line">
            {headline}
          </h2>
        </header>

        {/* ── 카드 그리드 ── */}
        <ul className="flex flex-col gap-xl tablet:flex-row tablet:items-stretch">
          {items.map((item, i) => (
            <WhyFaiCard key={item.title} item={item} index={i} />
          ))}
        </ul>

      </div>
    </section>
  );
}
