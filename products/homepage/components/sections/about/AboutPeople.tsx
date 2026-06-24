"use client";

import { useRef, useEffect } from "react";
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

  const SCROLL_KEY = "aboutPeopleScrollY";

  // 뒤로가기 복귀 시 저장된 스크롤 위치 복원
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved === null) return;
    sessionStorage.removeItem(SCROLL_KEY);
    const y = parseInt(saved, 10);
    // setTimeout(0): Next.js hydration 후 scroll reset이 완료된 다음 실행
    const id = setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 0);
    return () => clearTimeout(id);
  }, []);

  const saveScroll = () => {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
  };

  return (
    <section className="w-full bg-surface py-5xl">

      {/* titleSection + buttonSection: 나란히 배치 */}
      <div className="max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex items-end justify-between gap-ms">
        <div className="flex flex-col gap-ms">
          <h2 className="text-title-l max-[420px]:text-title-m desktop:text-title-xl font-bold text-primary">{title}</h2>
          <p className="text-body-l desktop:text-body-xl text-tertiary">{subtitle}</p>
        </div>
        <div className="flex shrink-0 gap-ms max-[420px]:hidden">
          <IconButton size="L" icon="arrowshapeLeft"  aria-label="이전" onClick={() => scrollByStep(-1)} />
          <IconButton size="L" icon="arrowshapeRight" aria-label="다음" onClick={() => scrollByStep(1)}  />
        </div>
      </div>

      {/* cardSection: 좌측 패딩만 적용, 우측은 뷰포트까지 풀블리드 */}
      <div
        ref={scrollRef}
        className="mt-4xl flex snap-x snap-mandatory gap-xl overflow-x-auto scroll-smooth
          pl-[var(--padding-XL)] min-[961px]:pl-[var(--padding-8XL)] min-[1440px]:pl-[calc(((100vw-1440px)/2)+var(--padding-8XL))] pr-0
          scroll-pl-[var(--padding-XL)] min-[961px]:scroll-pl-[var(--padding-8XL)] min-[1440px]:scroll-pl-[calc(((100vw-1440px)/2)+var(--padding-8XL))]
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <a
            key={card.id}
            href={card.href}
            onClick={saveScroll}
            aria-label={`${card.name} 직무 인터뷰 보기`}
            className="block shrink-0 snap-start cursor-pointer"
          >
            <article className="flex flex-col gap-3xl">
              {/* img 720×400, radius16 + 상단 스크림(고정 승인) */}
              <div className="relative h-[400px] w-[720px] max-[960px]:h-[378px] max-[960px]:w-[680px] max-[420px]:h-[190px] max-[420px]:w-[342px] overflow-hidden rounded-fai-m">
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
              <div className="flex w-[720px] max-[960px]:w-[680px] max-[420px]:w-[342px] flex-col gap-ms">
                <h3 className="text-title-s max-[960px]:text-body-xl max-[420px]:text-body-l desktop:text-title-m font-bold text-primary">
                  {card.title}
                </h3>
                {/* description: 이름ㅣ직책 + 라벨, gap-ms */}
                <div className="flex items-center gap-ms">
                  <p className="text-body max-[420px]:text-body-s desktop:text-body-l text-primary">
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
