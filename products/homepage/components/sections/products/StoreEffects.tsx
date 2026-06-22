"use client";

import { useState, useRef, useEffect } from "react";
import EffectIcon from "@/assets/icon/EffectIcon";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [cardsInView, setCardsInView] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 우선순위: 호버 > 클릭 잠금 > 뷰포트 노출 누적
  const isExpanded = (i: number) => {
    if (hoveredIndex !== null) return hoveredIndex === i;
    if (lockedIndex !== null) return lockedIndex === i;
    return revealedIndices.has(i);
  };

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

  // 각 리스트 항목이 뷰포트에 진입하면 revealedIndices에 누적 추가 (닫히지 않음)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealedIndices(prev => {
              const next = new Set(prev);
              next.add(i);
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [list.length]);

  if (!title && cards.length === 0 && list.length === 0) return null;

  return (
    <section className="flex flex-col items-center w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-7xl gap-4xl bg-surface">
      <h2 className="text-title-l desktop:text-title-xl font-bold text-center text-primary">
        {title}
      </h2>

      {/* 상단: 3열 카드 */}
      {cards.length > 0 && (
        <div ref={cardsRef} className="flex flex-row justify-center items-start gap-xl w-full">
          {cards.map((card, i) => (
            <article
              key={i}
              className="flex flex-col items-start w-[292px] p-4xl gap-[10px] rounded-fai-s bg-fill-faint"
            >
              <div className="flex flex-col items-center self-stretch gap-[var(--size-48)]">
                <h3 className="text-title-s desktop:text-title-m font-semibold text-center text-primary">
                  {card.title}
                </h3>
                <div
                  className={`transition-all duration-700 ease-out ${
                    cardsInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 160}ms` }}
                >
                  <EffectIcon name={card.title as import('@/assets/icon/EffectIcon').EffectIconKey} />
                </div>
                <p className="text-body font-normal text-center text-tertiary">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 하단: 아코디언 리스트 */}
      {list.length > 0 && (
        <div className="flex flex-col items-start w-[924px] gap-l">
          {list.map((item, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="flex flex-col items-center self-stretch p-4xl rounded-fai-m bg-fill-faint cursor-pointer transition-colors duration-300 hover:bg-surface-sunken"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setLockedIndex(lockedIndex === i ? null : i)}
            >
              <h4 className="text-title-s desktop:text-title-m font-semibold text-left w-full text-primary">
                {item.title}
              </h4>
              <div
                className={`grid transition-all duration-500 ease-in-out w-full ${
                  isExpanded(i) ? 'grid-rows-[1fr] opacity-100 mt-3xl' : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}
              >
                <div className="overflow-hidden flex flex-col items-start self-stretch">
                  <p className="text-body-l desktop:text-body-xl font-medium whitespace-pre-wrap text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
