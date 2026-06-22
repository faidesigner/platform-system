"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { IcoTxtButton, Label } from "@fai/ui";

type MediaItem = (typeof siteConfig.media.items)[number];

/* ── Card ────────────────────────────────────────────── */
function MediaCard({ item }: { item: MediaItem }) {
  const hasThumb = item.thumbnail && item.thumbnail !== "MISSING_FROM_DESIGN";

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card flex min-w-0 w-full flex-1 flex-col gap-[var(--spacing-3XL,40px)]"
    >
      {/* image */}
      {hasThumb ? (
        <div className="relative h-[240px] tablet:h-[300px] laptop:h-[367px] w-full overflow-hidden rounded-[var(--cornerRadius-M,16px)]">
          <Image
            src={item.thumbnail}
            alt={item.thumbnailAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 768px) 100vw, 550px"
          />
          {/* top→bottom 그라데이션 오버레이 */}
          <div
            aria-hidden
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(9,9,11,0.25) 0%, rgba(0,0,0,0.00) 100%)",
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center self-stretch h-[367px] rounded-[var(--cornerRadius-M,16px)] bg-fill-faint">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 96 96"
            fill="none"
            className="w-[96px] h-[96px] shrink-0"
            aria-hidden="true"
          >
            <path d="M28.2578 47.554C24.0625 52.064 16.4323 60.3064 12.4998 64.8007L12.7006 70.5841C12.9757 78.5076 19.604 84.7183 27.5287 84.4778L68.8349 83.2242C76.6141 82.9881 82.798 76.6136 82.798 68.8308V64.8004L73.6053 54.6884C72.1264 53.0616 69.5475 53.1288 68.1553 54.8304L59.998 64.8004C53.1912 60.6571 40.6914 51.4777 34.6488 46.9824C32.6787 45.5167 29.9303 45.7561 28.2578 47.554Z" fill="#D2D3D5"/>
            <path d="M68.2808 54.6545L45.3356 82.5331C44.9465 83.0059 45.2876 83.7177 45.8999 83.7106L70.294 83.4285C78.1815 83.3372 84.5275 76.9174 84.5275 69.0294V65.2638L73.5996 54.3903C72.0953 52.8935 69.6293 53.016 68.2808 54.6545Z" fill="#E4E6E7"/>
            <circle cx="62.3953" cy="33.6004" r="7.2" fill="#D2D3D5"/>
            <path d="M83 26.4004C83 18.9998 77.0002 13 69.5996 13H26.4004C18.9998 13 13 18.9998 13 26.4004V69.5996C13 77.0002 18.9998 83 26.4004 83H69.5996C77.0002 83 83 77.0002 83 69.5996V26.4004ZM85 69.5996C85 78.1048 78.1048 85 69.5996 85H26.4004C17.8952 85 11 78.1048 11 69.5996V26.4004C11 17.8952 17.8952 11 26.4004 11H69.5996C78.1048 11 85 17.8952 85 26.4004V69.5996Z" fill="#D2D3D5"/>
          </svg>
        </div>
      )}

      {/* textBox */}
      <div className="flex flex-col gap-[var(--spacing-MS,12px)]">
        {/* labelSection */}
        <div className="flex items-center gap-[var(--spacing-S,8px)]">
          <div className="flex items-start gap-[var(--spacing-S,8px)]">
            {item.tags.map((tag) => (
              <Label
                key={tag}
                shape="square"
                size="M"
                className="text-[length:var(--w-caption-M-size,12px)] font-medium leading-[var(--w-caption-M-lineHeight,18px)] tracking-[var(--w-caption-M-letterSpacing,-0.1px)] text-tertiary"
              >
                {tag}
              </Label>
            ))}
          </div>
          <span
            className="whitespace-nowrap text-center text-[length:var(--font-size-15,15px)] font-normal leading-[var(--font-lineHeight-15,22px)] tracking-[var(--font-letterSpacing-0,0)] text-secondary"
          >
            | {item.date}
          </span>
        </div>

        {/* card title */}
        <h3
          className="self-stretch text-body-xl desktop:text-title-s font-bold text-primary"
        >
          {item.title}
        </h3>

        {/* description */}
        <p
          className="text-[length:var(--font-size-15,15px)] font-normal leading-[var(--font-lineHeight-15,22px)] tracking-[var(--font-letterSpacing-0,0)] text-tertiary"
        >
          {item.description}
        </p>
      </div>
    </a>
  );
}

/* ── MediaCardSkeleton ───────────────────────────────── */
export function MediaCardSkeleton() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-[var(--spacing-3XL,40px)]">
      {/* image skeleton */}
      <div className="h-[367px] w-full rounded-[var(--cornerRadius-M,16px)] bg-fill-faint" />
      {/* textBox skeleton */}
      <div
        className="flex flex-col items-start gap-[var(--spacing-MS,12px)] self-stretch animate-pulse"
        aria-hidden="true"
      >
        {/* labelSection */}
        <div className="flex items-center w-[202px] h-[26px] rounded-[var(--cornerRadius-default,4px)] bg-fill-faint" />
        {/* title */}
        <div className="flex justify-center items-center self-stretch h-[36px] rounded-[var(--cornerRadius-default,4px)] bg-fill-faint" />
        {/* description */}
        <div className="flex items-center gap-[12px] self-stretch h-[22px] rounded-[var(--cornerRadius-default,4px)] bg-fill-faint" />
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────── */
export default function MediaNewsSection() {
  const { media } = siteConfig;
  const [visibleCount, setVisibleCount] = useState(6);

  if (!media.items.length) return null;

  const handleMoreClick = () => {
    setVisibleCount((prev) => Math.min(prev + 6, media.items.length));
  };

  const hasMore = visibleCount < media.items.length;

  return (
    <section
      className="
        flex w-full flex-col items-start
        bg-surface
        gap-[var(--spacing-4XL,56px)]
        px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)]
        pt-[var(--padding-5XL,80px)] pb-5xl
      "
    >
      {/* title */}
      <h2
        className="text-title-l desktop:text-title-xl font-bold text-primary"
      >
        {media.title}
      </h2>

      {/* cardSection */}
      <div className="flex w-full flex-col items-center self-stretch gap-[var(--spacing-6XL,100px)]">
        {/* cardRow — 반응형 CSS Grid */}
        <div
          className="
            grid w-full
            grid-cols-1 gap-y-[var(--spacing-6XL,100px)] gap-x-[var(--spacing-3XL,40px)]
            min-[961px]:grid-cols-2
            desktop:gap-x-[var(--spacing-5XL,80px)] desktop:gap-y-[var(--spacing-5XL,80px)]
          "
        >
          {media.items.slice(0, visibleCount).map((item, idx) => (
            <MediaCard key={`${item.date}-${idx}`} item={item} />
          ))}
        </div>

        {/* 더보기 — 모든 아이템 노출 후 숨김 */}
        {hasMore && (
          <IcoTxtButton
            variant="tertiary"
            size="XL"
            shape="round"
            iconPosition="right"
            onClick={handleMoreClick}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <mask id="mask0_6532_4690" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                  <path d="M10.0039 2.95898C10.3904 2.95909 10.7041 3.27265 10.7041 3.65918V9.30176H16.3477C16.734 9.3021 17.0469 9.61557 17.0469 10.002C17.0468 10.3883 16.7339 10.7018 16.3477 10.7021H10.7041V16.3457C10.7038 16.7319 10.3902 17.0448 10.0039 17.0449C9.61752 17.0449 9.30405 16.732 9.30371 16.3457V10.7021H3.66113C3.2746 10.7021 2.96104 10.3885 2.96094 10.002C2.96094 9.61535 3.27453 9.30176 3.66113 9.30176H9.30371V3.65918C9.30371 3.27258 9.61731 2.95898 10.0039 2.95898Z" fill="black"/>
                </mask>
                <g mask="url(#mask0_6532_4690)">
                  <rect width="20" height="20" fill="currentColor"/>
                </g>
              </svg>
            }
          >
            {media.moreLabel}
          </IcoTxtButton>
        )}
      </div>
    </section>
  );
}
