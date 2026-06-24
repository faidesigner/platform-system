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
import { useRouter } from 'next/navigation';
import { IcoTxtButton } from '@fai/ui';

export function CtaBanner() {
  const router = useRouter();

  return (
    <section className="relative left-1/2 right-1/2 flex w-screen -mx-[50vw] justify-center overflow-hidden">
      {/* Layer 1: 배경 이미지 */}
      <Image
        src="/images/main/cta-banner-gradation.png"
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
        <h2 className="flex-1 text-center min-[961px]:text-left text-title-s min-[961px]:text-title-m desktop:text-title-l font-bold text-text-inverse">
          지금 매장에 도입하고<br className="min-[769px]:hidden" /> 최대 효율을 경험을 해보세요
        </h2>

        {/* > 420px: XL */}
        <IcoTxtButton
          variant="primary"
          size="XL"
          shape="square"
          className="shrink-0 max-[420px]:hidden"
          style={{ textAlign: 'center' }}
          onClick={() => router.push('/contact')}
        >
          도입 문의하기
        </IcoTxtButton>
        {/* ≤ 420px: L (한 단계 축소) */}
        <IcoTxtButton
          variant="primary"
          size="L"
          shape="square"
          className="shrink-0 min-[421px]:hidden"
          style={{ textAlign: 'center' }}
          onClick={() => router.push('/contact')}
        >
          도입 문의하기
        </IcoTxtButton>
      </div>
    </section>
  );
}
