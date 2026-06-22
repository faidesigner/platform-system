"use client";

import { useRef } from "react";
import Image from "next/image";
import { IconButton } from "@fai/ui";
import ReviewIcon, { type ReviewIconKey } from "@/assets/icon/ReviewIcon";
import type { QuoteSegment } from "@/config/site";

const SCROLL_STEP = 1164; // 카드 폭(1140) + gap(24)

interface Review {
  category: string;
  categoryColorVar: string;
  iconBgVar: string;
  icon: ReviewIconKey;
  store: string;
  role: string;
  image: string;
  quote: readonly QuoteSegment[];
}

interface ProductReviewsProps {
  title: string;
  reviews: Review[];
}

export default function ProductReviews({ title, reviews }: ProductReviewsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollByStep = (dir: 1 | -1) => {
    sliderRef.current?.scrollBy({ left: SCROLL_STEP * dir, behavior: "smooth" });
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="product-reviews" className="flex w-full flex-col items-center gap-4xl py-5xl bg-bg-100">
      {/* 타이틀 + 버튼 */}
      <div className="flex w-full max-w-[1440px] items-end justify-between gap-ms px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)]">
        <h2 className="text-title-l desktop:text-title-xl font-bold text-text-basic-primary">
          {title}
        </h2>
        <div className="flex shrink-0 gap-ms">
          <IconButton size="L" icon="arrowshapeLeft"  aria-label="이전" onClick={() => scrollByStep(-1)} />
          <IconButton size="L" icon="arrowshapeRight" aria-label="다음" onClick={() => scrollByStep(1)}  />
        </div>
      </div>

      {/* 가로 슬라이더 — 패딩 배분형 Full-bleed */}
      <div
        ref={sliderRef}
        className="flex w-full snap-x snap-mandatory items-start gap-[24px] overflow-x-auto pl-[var(--padding-XL)] min-[961px]:pl-[var(--padding-8XL)] desktop:pl-[calc((100vw_-_1440px)_/_2_+_var(--padding-8XL))] pr-0 scroll-pl-[var(--padding-XL)] min-[961px]:scroll-pl-[var(--padding-8XL)] desktop:scroll-pl-[calc((100vw_-_1440px)_/_2_+_var(--padding-8XL))] scrollbar-none"
      >
        {reviews.map((review, i) => (
          <article
            key={i}
            className="flex w-[calc(100%-var(--padding-XL))] min-[961px]:w-[calc(100%-var(--padding-8XL))] desktop:w-[1140px] shrink-0 snap-start flex-col items-start gap-xl rounded-fai-m p-xl tablet:flex-row tablet:items-end tablet:gap-2xl tablet:rounded-fai-xl tablet:py-3xl tablet:px-2xl bg-surface-alt"
          >
            {/* 좌: 텍스트 */}
            <div className="flex flex-col items-start self-stretch gap-3xl tablet:gap-5xl">
              <div className="flex flex-col items-start gap-l self-stretch">
                <span
                  className="flex shrink-0 items-center justify-center rounded-full p-ms"
                  style={{ backgroundColor: `var(${review.iconBgVar})` }}
                >
                  <ReviewIcon name={review.icon} />
                </span>
                <span
                  className="self-stretch text-title-s desktop:text-title-m font-semibold"
                  style={{ color: `var(${review.categoryColorVar})` }}
                >
                  {review.category}
                </span>
              </div>

              <div className="flex flex-col items-start gap-l">
                <p className="text-body desktop:text-body-l font-bold text-text-basic-secondary">
                  {review.store}
                  {review.role && (
                    <span style={{ padding: "0 8px", color: "var(--fai-color-quaternary)" }}>|</span>
                  )}
                  {review.role}
                </p>
                <p className="w-full tablet:w-[432px] text-body-l desktop:text-body-xl font-normal text-tertiary">
                  {review.quote.map((seg, j) =>
                    seg.emphasis ? (
                      <span
                        key={j}
                        className="font-medium"
                        style={{ color: `var(${review.categoryColorVar})` }}
                      >
                        {seg.text}
                      </span>
                    ) : (
                      <span key={j}>{seg.text}</span>
                    )
                  )}
                </p>
              </div>
            </div>

            {/* 우: 이미지 613×460 + 그라데이션 오버레이 */}
            {review.icon === "bakery" ? (
              <div className="relative flex w-full aspect-[613/460] flex-col items-start justify-end overflow-hidden rounded-fai-m bg-fill-faint tablet:flex-1 tablet:min-w-0 tablet:w-auto tablet:rounded-fai-xl">
                <Image
                  src={review.image}
                  alt={`${review.store} 전경`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 613px"
                  style={{ objectPosition: "center bottom" }}
                />
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(9, 9, 11, 0.50) 100%)" }}
                />
              </div>
            ) : (
              <div className="relative flex w-full aspect-[613/460] flex-col items-start justify-end overflow-hidden rounded-fai-m bg-fill-faint tablet:flex-1 tablet:min-w-0 tablet:w-auto tablet:rounded-fai-xl">
                <Image
                  src={review.image}
                  alt={`${review.store} 전경`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 613px"
                />
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(9, 9, 11, 0.50) 100%)" }}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
