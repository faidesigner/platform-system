"use client";

import { useRef } from "react";
import Image from "next/image";
import { IconButton } from "@fai/ui";
import { aboutConfig } from "@/config/site";

// 카드 폭(720) + gap(24) = 744 — ProductReviews와 동일한 1카드 단위 스크롤
const SCROLL_STEP = 744;

export function AboutPeople() {
  const { title, subtitle, cards } = aboutConfig.people;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByStep = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: SCROLL_STEP * dir, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-surface py-5xl">

      {/* titleSection + buttonSection: 나란히 배치 */}
      <div className="px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex items-end justify-between gap-ms">
        <div className="flex flex-col gap-ms">
          <h2 className="text-title-l desktop:text-title-xl font-bold text-primary">{title}</h2>
          <p className="text-body-l desktop:text-body-xl text-tertiary">{subtitle}</p>
        </div>
        <div className="flex shrink-0 gap-ms">
          <IconButton size="L" icon="arrowshapeLeft"  aria-label="이전" onClick={() => scrollByStep(-1)} />
          <IconButton size="L" icon="arrowshapeRight" aria-label="다음" onClick={() => scrollByStep(1)}  />
        </div>
      </div>

      {/* cardSection: 좌측 패딩만 적용, 우측은 뷰포트까지 풀블리드 */}
      <div
        ref={scrollRef}
        className="mt-4xl flex snap-x snap-mandatory gap-xl overflow-x-auto scroll-smooth
          pl-[var(--padding-XL)] min-[961px]:pl-[var(--padding-8XL)] pr-0
          scroll-pl-[var(--padding-XL)] min-[961px]:scroll-pl-[var(--padding-8XL)]
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <article key={card.id} className="flex shrink-0 snap-start flex-col gap-4xl">
            {/* img 720×400, radius16 + 상단 스크림(고정 승인) */}
            <div className="relative h-[400px] w-[720px] overflow-hidden rounded-fai-m">
              <Image
                src={card.image.src}
                alt={card.image.alt}
                fill
                sizes="720px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-[rgba(9,9,11,0.25)] to-[rgba(0,0,0,0)]"
              />
            </div>

            {/* textBox: 세로 gap-ms */}
            <div className="flex w-[720px] flex-col gap-ms">
              <h3 className="text-title-s desktop:text-title-m font-bold text-primary">
                {card.title}
              </h3>
              {/* description: 이름ㅣ직책 + 라벨, gap-ms */}
              <div className="flex items-center gap-ms">
                <p className="text-body desktop:text-body-l text-primary">
                  {card.name} ㅣ {card.role}
                </p>
                {/* 라벨: mint-400 배경 고정 승인, px-s */}
                <span className="flex items-center justify-center bg-mint-400 px-s text-body-xs font-medium text-primary">
                  {card.label}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
