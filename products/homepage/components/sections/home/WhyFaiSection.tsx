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
import { useTranslations } from 'next-intl';

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
   Default assets — 텍스트는 messages(home.whyFai.items.N)에서, 구조/영상만 여기 유지
────────────────────────────────────────── */

const DEFAULT_VIDEO_SRCS = [
  '/videos/home/home-why-fai-loop-1.mp4',
  '/videos/home/home-why-fai-loop-2.mp4',
  '/videos/home/home-why-fai-loop-3.mp4',
] as const;

/* ──────────────────────────────────────────
   Sub-component: WhyFaiCard
────────────────────────────────────────── */

function WhyFaiCard({ item, index }: { item: WhyFaiItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-start h-[320px] tablet:flex-1 tablet:h-[var(--size-320)] min-[1600px]:h-[480px] p-2xl rounded-fai-s border border-sand-400 bg-sand-filled-tertiary overflow-hidden"
      variants={scrollFadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 20, mass: 1, delay: index * 0.15 }}
    >
      {/* ── 배경 비디오 (항상 루프, 호버 시 표시) ── */}
      {/* 전용 overflow-hidden 래퍼: Framer Motion GPU 레이어와 overflow-hidden+border-radius 충돌 방지 */}
      {item.videoSrc && (
        <div className="absolute inset-0 rounded-fai-s overflow-hidden">
          <video
            src={item.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full object-cover scale-[1.15] transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      )}

      {/* ── 카드 바디 ── */}
      <div className={`relative z-10 flex flex-col items-start gap-ms flex-1 self-stretch transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-body-l tablet:text-body-xl desktop:text-title-s font-semibold text-sand-text-primary">
          {item.title}
        </h3>
        <p className="text-body-ms tablet:text-body font-normal text-sand-text-tertiary whitespace-pre-line">
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
  headline,
  subheadline,
  items,
}: WhyFaiSectionProps) {
  const t = useTranslations('home.whyFai');
  const resolvedHeadline = headline ?? t('headline');
  // subheadline은 원본 컴포넌트에서도 JSX에 미노출인 레거시 prop — 하위호환을 위해 계약만 유지.
  void (subheadline ?? t('subheadline'));
  const resolvedItems: WhyFaiItem[] =
    items ??
    DEFAULT_VIDEO_SRCS.map((videoSrc, i) => ({
      title: t(`items.${i}.title`),
      description: t(`items.${i}.description`),
      videoSrc,
    }));

  return (
    <section className="w-full bg-sand-filled-primary">
      <div className="w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-5xl">

        {/* ── 헤더 ── */}
        <header className="pb-3xl flex flex-col items-start gap-m">
          <h2 className="text-title-l desktop:text-title-xl font-bold text-text-basic-primary text-left whitespace-pre-line">
            {resolvedHeadline}
          </h2>
        </header>

        {/* ── 카드 그리드 ── */}
        <ul className="flex flex-col gap-xl tablet:flex-row tablet:items-stretch">
          {resolvedItems.map((item, i) => (
            <WhyFaiCard key={item.title} item={item} index={i} />
          ))}
        </ul>

      </div>
    </section>
  );
}
