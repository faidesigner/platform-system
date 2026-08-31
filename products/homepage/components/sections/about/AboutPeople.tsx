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
              {/* 비율 9/5(=1.8) 고정 — 720×400 / 680×378 / 342×190 이 모두 1.8:1이라 기존 디자인 비율 그대로다.
                  높이를 폭에서 파생시켜야 폭이 줄 때 사진이 찌그러지지 않는다.
                  min()으로 뷰포트 상한을 걸어 422~703px 구간에서 카드가 화면을 벗어나는 것을 막는다(캐러셀 좌우 패딩 24px×2). */}
              <div className="relative aspect-[9/5] w-[720px] max-[961px]:w-[min(680px,calc(100vw_-_2_*_var(--padding-XL)))] max-[421px]:w-[min(342px,calc(100vw_-_2_*_var(--padding-XL)))] overflow-hidden rounded-fai-m">
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
              <div className="flex w-[720px] max-[961px]:w-[min(680px,calc(100vw_-_2_*_var(--padding-XL)))] max-[421px]:w-[min(342px,calc(100vw_-_2_*_var(--padding-XL)))] flex-col gap-ms">
                <h3 className="text-title-s max-[961px]:text-body-xl max-[421px]:text-body-l desktop:text-title-m font-bold text-primary">
                  {card.title}
                </h3>
                {/* description: `이름 ㅣ 직책` + 라벨.
                    라벨은 카드 우측에 고정한다(justify-between). 라벨을 인라인 흐름에 두면
                    앞 텍스트 길이만큼 밀려 사람마다 위치가 달라진다 — ja 1440px 실측 편차 227px
                    (홍석범 379 / 왕민권 408 / 박성빈 534 / 이지민 307). HOM-99가 그 건이다.

                    ⚠️ PR #11의 "ㅣ 구분선 간격 통일"(직책↔라벨 사이에도 ㅣ를 넣어 간격을 맞추는 것)과는
                    한 줄에서 양립하지 않는다. 라벨이 인라인에 있어야 간격이 고정되고,
                    우측 정렬이어야 위치가 고정된다. 둘 다 만족하려면 라벨을 다음 줄로 내려야 한다
                    (그러면 ㅣ가 하나만 남아 간격 문제가 사라지고 라벨 x도 0으로 일정) — 디자인 판단 대기. */}
                <p className="flex items-center justify-between gap-ms text-body max-[421px]:text-body-s desktop:text-body-l text-primary">
                  <span>{card.name} ㅣ {card.role}</span>
                  <span className="inline-flex shrink-0 items-center bg-mint-400 px-s text-body-xs font-medium text-primary">{card.label}</span>
                </p>
              </div>
            </article>
          </a>
        ))}
      </div>

    </section>
  );
}
