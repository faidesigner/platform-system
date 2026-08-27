/**
 * CtaBanner — 풀블리드 CTA 배너 섹션
 *
 * 레이어 위계 (z-index):
 *   -z-20  → <Image /> 배경 사진 (object-cover)
 *   -z-10  → 라디알 그라데이션 스크림 div
 *    z-10  → 타이틀 + 버튼 콘텐츠 영역 (relative)
 *
 * dark 컨텍스트:
 *   배너 배경이 항상 어두우므로 콘텐츠 래퍼에 .dark 주입 →
 *   IcoTxtButton이 다크모드 토큰(그린 버튼)을 올바르게 발현.
 */

"use client";

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { IcoTxtButton } from '@fai/ui';
import { trackEvent } from '@/lib/analytics/track';
import type { GaLocation } from '@/lib/analytics/events';

export function CtaBanner({
  location = 'home_cta_banner',
}: {
  location?: Extract<GaLocation, 'home_cta_banner' | 'product_cta_banner'>;
}) {
  const router = useRouter();
  const t = useTranslations('home.ctaBanner');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const handleCta = () => {
    trackEvent('lead_acquisition_click', { location, label: tCommon('cta.requestDemo') });
    router.push('/contact');
  };

  return (
    <section className="relative left-1/2 right-1/2 flex w-screen -mx-[50vw] justify-center overflow-hidden">
      {/* Layer 1: 배경 이미지 */}
      <Image
        src="/images/main/cta-banner-gradation.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover -z-20 rotate-180"
        aria-hidden
      />

      {/* Layer 2: 그라데이션 스크림 */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60.92% 406.16% at 52.29% 247.01%, rgba(57,219,31,0.35) 0%, rgba(0,0,0,0.70) 100%)',
        }}
      />

      {/* Layer 3: 콘텐츠 — dark 컨텍스트 주입 (배너 배경 항상 어두움) */}
      <div className="dark relative z-10 flex flex-col items-center min-[961px]:flex-row min-[961px]:items-center justify-center gap-l min-[961px]:gap-[var(--size-48)] w-full h-[216px] py-5xl px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)]">
        <h2 className={`flex-1 text-center min-[961px]:text-left text-title-s min-[961px]:text-title-m desktop:text-title-l font-bold text-text-inverse${locale === 'ja' ? ' max-[419px]:text-body-xl' : ''}`}>
          {t('titleLine1')}<br className="min-[769px]:hidden" /> {t('titleLine2')}
        </h2>

        <IcoTxtButton
          variant="primary"
          size="XL"
          shape="square"
          className="shrink-0"
          style={{ textAlign: 'center' }}
          onClick={handleCta}
        >
          {tCommon('cta.requestDemo')}
        </IcoTxtButton>
      </div>
    </section>
  );
}
