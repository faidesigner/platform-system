"use client";

import { useRef } from "react";
import Image from "next/image";
import { IconButton } from "@fai/ui";
import type { PeopleCard } from "@/config/types";

// 카드 폭(720) + gap(24) = 744 — ProductReviews와 동일한 1카드 단위 스크롤
const SCROLL_STEP = 744;

/** 카드별로 치환 완료된 interview aria-label을 포함한 렌더용 카드 데이터 */
type AboutPeopleCard = PeopleCard & { interviewAriaLabel: string };

interface AboutPeopleProps {
  title: string;
  subtitle: string;
  cards: AboutPeopleCard[];
  a11yPrev: string;
  a11yNext: string;
}

export function AboutPeople({
  title,
  subtitle,
  cards,
  a11yPrev,
  a11yNext,
}: AboutPeopleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByStep = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: SCROLL_STEP * dir, behavior: "smooth" });
  };

  // 카드 링크는 외부 URL(인터뷰 페이지)이라 클릭 시 전체 문서 리로드가 일어난다.
  // 뒤로가기 복귀(back_forward) 시 스크롤 복원은 SmoothScroll의 마운트 경로가 전담한다.
  return (
    <section className="w-full bg-surface py-5xl">

      {/* titleSection + buttonSection: 나란히 배치 */}
      <div className="max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex items-end justify-between gap-ms">
        <div className="flex flex-col gap-ms">
          <h2 className="text-title-l max-[421px]:text-title-m desktop:text-title-xl font-bold text-primary">{title}</h2>
          <p className="text-body-l desktop:text-body-xl text-tertiary">{subtitle}</p>
        </div>
        <div className="flex shrink-0 gap-ms max-[421px]:hidden">
          <IconButton size="L" icon="arrowshapeLeft"  aria-label={a11yPrev} onClick={() => scrollByStep(-1)} />
          <IconButton size="L" icon="arrowshapeRight" aria-label={a11yNext} onClick={() => scrollByStep(1)}  />
        </div>
      </div>

      {/* cardSection: 좌측 패딩만 적용, 우측은 뷰포트까지 풀블리드 */}
      <div
        ref={scrollRef}
        className="mt-4xl flex snap-x snap-mandatory gap-xl overflow-x-auto scroll-smooth
          pl-[var(--padding-XL)] min-[961px]:pl-[var(--padding-8XL)] min-[1440px]:pl-[calc(((100vw-1440px)/2)+var(--padding-8XL))] pr-[var(--padding-XL)] min-[961px]:pr-[var(--padding-8XL)] min-[1440px]:pr-[calc(((100vw-1440px)/2)+var(--padding-8XL))]
          scroll-pl-[var(--padding-XL)] min-[961px]:scroll-pl-[var(--padding-8XL)] min-[1440px]:scroll-pl-[calc(((100vw-1440px)/2)+var(--padding-8XL))]
          scroll-pr-[var(--padding-XL)] min-[961px]:scroll-pr-[var(--padding-8XL)] min-[1440px]:scroll-pr-[calc(((100vw-1440px)/2)+var(--padding-8XL))]
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <a
            key={card.id}
            href={card.href}
            aria-label={card.interviewAriaLabel}
            className={`block shrink-0 ${i === cards.length - 1 ? "snap-end" : "snap-start"} cursor-pointer`}
          >
            <article className="flex flex-col gap-3xl">
              {/* img 720×400, radius16 + 상단 스크림(고정 승인) */}
              <div className="relative h-[400px] w-[720px] max-[961px]:h-[378px] max-[961px]:w-[680px] max-[421px]:h-[190px] max-[421px]:w-[342px] overflow-hidden rounded-fai-m">
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
              <div className="flex w-[720px] max-[961px]:w-[680px] max-[421px]:w-[342px] flex-col gap-ms">
                <h3 className="text-title-s max-[961px]:text-body-xl max-[421px]:text-body-l desktop:text-title-m font-bold text-primary">
                  {card.title}
                </h3>
                {/* description: 이름ㅣ직책 + 라벨, gap-ms */}
                <div className="flex items-center gap-ms">
                  <p className="text-body max-[421px]:text-body-s desktop:text-body-l text-primary">
                    {card.name} ㅣ {card.role}
                  </p>
                  {/* 라벨: mint-400 배경 고정 승인, px-s */}
                  <span className="flex items-center justify-center bg-mint-400 px-s text-body-xs font-medium text-primary">
                    {card.label}
                  </span>
                </div>
              </div>
            </article>
          </a>
        ))}
      </div>

    </section>
  );
}
