"use client";

import { useState } from "react";
import Image from "next/image";

interface CaseStudy {
  readonly brand: string;
  readonly date: string;
  readonly store: string;
  readonly description: string;
  readonly image: string;
}

interface StoreCaseStudiesProps {
  eyebrow: string;
  cases: readonly CaseStudy[] | CaseStudy[];
}

const ITEM_HEIGHT = 350;

export default function StoreCaseStudies({ eyebrow, cases }: StoreCaseStudiesProps) {
  const [active, setActive] = useState(0);

  if (!cases || cases.length === 0) return null;

  // cases가 교체되면 이전 인덱스가 범위를 벗어날 수 있다. 이를 effect의 setActive(0)로 처리하면
  // `cases`가 부모에서 매 렌더 새 배열로 오는 순간 **매 렌더 선택이 초기화**되는 잠재 버그가 된다
  // (참조 비교이므로 내용이 같아도 재실행). 렌더 중 클램프가 동일 목적을 부수효과 없이 만족한다.
  const activeIdx = Math.min(active, cases.length - 1);
  const current = cases[activeIdx] || cases[0];
  const hasValidImage = current.image && current.image !== "MISSING_FROM_DESIGN";

  const go = (dir: 1 | -1) => {
    setActive((prev) => (prev + dir + cases.length) % cases.length);
  };

  return (
    <section className="flex flex-col items-start w-full py-5xl px-0 bg-surface">

      {/* 배경 이미지 영역 */}
      <div className="relative flex flex-col justify-between items-start w-full h-[693px] px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-5xl overflow-hidden">

        {/* 배경 이미지 */}
        {hasValidImage && (
          <Image
            src={current.image}
            alt={current.brand}
            fill
            priority
            className="object-cover transition-opacity duration-500"
          />
        )}

        {/* 270도 좌측 집중형 암막 오버레이 */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, rgba(32, 28, 28, 0.00) 0%, rgba(32, 28, 28, 0.80) 100%)" }}
        />

        {/* eyebrow */}
        {eyebrow && (
          <p className="text-brand-text text-body font-normal self-stretch z-20">{eyebrow}</p>
        )}

        {/* 컨트롤러 래퍼 */}
        <div className="flex flex-col justify-between items-start self-stretch h-[444.667px] flex-shrink-0 z-20">

          {/* 위 화살표 */}
          <button
            type="button"
            onClick={() => go(-1)}
            className="w-2xl h-2xl flex-shrink-0 flex items-center justify-center text-brand-text transition-opacity hover:opacity-80"
            aria-label="이전 케이스"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M2 24L16 8L30 24" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>

          {/* 세로 슬라이더 윈도우 */}
          <div className="h-[350px] overflow-hidden">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${activeIdx * ITEM_HEIGHT}px)` }}
            >
              {cases.map((c, i) => {
                const isActive = i === activeIdx;
                const titleLabel = c.brand && c.store ? `${c.brand} / ${c.store}` : c.brand;
                return (
                  <div
                    key={i}
                    className="h-[350px] flex flex-col justify-center"
                    onClick={() => !isActive && setActive(i)}
                    style={{ cursor: isActive ? "default" : "pointer" }}
                  >
                    {isActive ? (
                      <div className="flex flex-col items-start gap-2xs">
                        <div className="flex items-baseline">
                          <span className="text-title-s desktop:text-title-m font-bold text-brand-text">{titleLabel}</span>
                          {c.date && (
                            <span className="text-caption-s font-normal text-brand-text ml-2 duration-300">{c.date}</span>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-body text-inverse duration-300 mt-1 whitespace-pre-line">{c.description}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2xs">
                        <span className="text-body text-inverse opacity-40 hover:opacity-100 transition-all cursor-pointer">{titleLabel}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 아래 화살표 */}
          <button
            type="button"
            onClick={() => go(1)}
            className="w-2xl h-2xl flex-shrink-0 flex items-center justify-center text-brand-text transition-opacity hover:opacity-80"
            aria-label="다음 케이스"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M2 9L16 23L30 9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>

        </div>

      </div>

    </section>
  );
}
