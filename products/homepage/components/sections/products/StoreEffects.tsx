"use client";

import { useState, useRef, useEffect } from "react";
import EffectGraphic from "@fai/ui/components/common/Icon/EffectGraphic";

interface EffectCard {
  title: string;
  description: string;
  icon: string;
}

interface EffectListItem {
  title: string;
  description: string;
}

interface StoreEffectsProps {
  title: string;
  cards: EffectCard[];
  list: EffectListItem[];
}

/* ── 메인 컴포넌트 ── */
export default function StoreEffects({ title, cards, list }: StoreEffectsProps) {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [cardsInView, setCardsInView] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 뷰포트 진입 누적만으로 열림 결정 (호버·클릭 제거)
  const isExpanded = (i: number) => revealedIndices.has(i);

  // 카드 영역이 뷰포트에 진입하면 cardsInView = true (1회)
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 뷰포트 진입 시 인덱스 오름차순 큐 → 350ms 간격 순차 오픈, 1회 고정
  useEffect(() => {
    const pendingQueue: number[] = [];
    let timer: ReturnType<typeof setTimeout> | null = null;

    const processNext = () => {
      if (pendingQueue.length === 0) { timer = null; return; }
      const i = pendingQueue.shift()!;
      setRevealedIndices(prev => { const next = new Set(prev); next.add(i); return next; });
      timer = setTimeout(processNext, 350);
    };

    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!pendingQueue.includes(i)) {
              // 큐를 인덱스 오름차순으로 유지한다 — 스크롤 방향과 무관하게 위→아래 순서로 등장시키기 위함
              const at = pendingQueue.findIndex((q) => q > i);
              if (at === -1) pendingQueue.push(i);
              else pendingQueue.splice(at, 0, i);
            }
            if (!timer) processNext();
            observer.disconnect();
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => { observers.forEach(obs => obs.disconnect()); if (timer) clearTimeout(timer); };
  }, [list.length]);

  if (!title && cards.length === 0 && list.length === 0) return null;

  return (
    <section className="flex flex-col items-center w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-7xl gap-2xl tablet:gap-3xl desktop-s:gap-4xl bg-surface">
      <h2 className="text-title-s tablet:text-title-m desktop-s:text-title-l desktop:text-title-xl font-bold text-center text-primary">
        {title}
      </h2>

      {/* 카드 + 아코디언 내부 컨테이너: 좌우 padding-6-xl, 1440 이상 max-width 고정 후 mx-auto */}
      <div className="flex flex-col w-full min-[961px]:px-[var(--padding-6-xl,100px)] desktop:max-w-[calc(1440px_-_2_*_var(--padding-8XL))] desktop:mx-auto gap-2xl tablet:gap-3xl desktop-s:gap-4xl">

      {/* 상단: 3열 카드 */}
      {cards.length > 0 && (
        <div ref={cardsRef} className="flex flex-row flex-wrap justify-center items-stretch gap-xl w-full">
          {cards.map((card, i) => (
            <article
              key={i}
              className="flex flex-col items-start w-full tablet:flex-1 p-xl desktop-s:p-4xl gap-[10px] rounded-fai-s bg-fill-faint"
            >
              <div className="flex flex-col items-center self-stretch gap-[var(--size-48)]">
                <h3
                className={`flex justify-center text-body tablet:text-body-xl desktop-s:text-title-s desktop:text-title-m font-semibold text-center text-primary h-[3rem] tablet:h-[3.75rem] desktop-s:h-[4.5rem] desktop:h-[4.875rem] ${i === 0 ? 'items-center -mx-xl desktop-s:-mx-4xl' : 'items-start'}`}
                style={i === 0 ? { whiteSpace: 'pre-wrap' } : undefined}
              >
                  {card.title}
                </h3>
                <div
                  className={`transition-all duration-700 ease-out ${
                    cardsInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 160}ms` }}
                >
                  <EffectGraphic name={card.icon as import('@fai/ui/components/common/Icon/EffectGraphic').EffectIconKey} />
                </div>
                <p className="text-body-xs tablet:text-body-ms desktop-s:text-body font-normal text-center text-tertiary">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 하단: 아코디언 리스트 */}
      {list.length > 0 && (
        <div className="flex flex-col items-start w-full gap-l">
          {list.map((item, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="flex flex-col items-center self-stretch p-3xl desktop-s:p-4xl rounded-fai-m bg-fill-faint"
            >
              <h4 className="text-body-l tablet:text-body-xl desktop-s:text-title-s desktop:text-title-m font-semibold text-left w-full text-primary">
                {item.title}
              </h4>
              <div
                className={`grid transition-all duration-500 ease-in-out w-full ${
                  isExpanded(i) ? 'grid-rows-[1fr] opacity-100 mt-3xl' : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}
              >
                <div className="overflow-hidden flex flex-col items-start self-stretch">
                  <p className="text-body-ms tablet:text-body desktop-s:text-body-l desktop:text-body-xl font-medium whitespace-pre-wrap text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      </div>
    </section>
  );
}
