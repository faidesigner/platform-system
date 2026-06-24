"use client";

import Image from "next/image";
import Tabs from "@/components/ui/Tabs";

interface StoreTypeCard {
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly wide: boolean;
  readonly objectPosition?: string;
}

interface StoreTypeTab {
  readonly key: string;
  readonly label: string;
  readonly subtitle: string;
  readonly description: string;
  readonly sectionTitle: string;
  readonly cards: readonly StoreTypeCard[];
}

interface StoreTypesProps {
  tabs: readonly StoreTypeTab[] | StoreTypeTab[];
  activeKey: string;
  onTabChange: (key: string) => void;
}

export default function StoreTypes({ tabs, activeKey, onTabChange }: StoreTypesProps) {
  if (!tabs || tabs.length === 0) return null;

  const current = tabs.find((t) => t.key === activeKey) || tabs[0];

  return (
    <section className="flex flex-col items-center w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] pb-5xl gap-7xl desktop:max-w-[1440px] desktop:mx-auto">

      {/* ── 탭 + 설명 래퍼 ── */}
      <div className="flex flex-col items-center gap-[50px] self-stretch w-full">
        <Tabs
          items={tabs.map((t) => ({ id: t.key, label: t.label }))}
          activeId={activeKey}
          onChange={onTabChange}
        />

        {/* ── 중앙 설명 ── */}
        <div className="flex flex-col items-center gap-2xs self-stretch text-center w-full">
          <p className="max-[420px]:text-body-s text-body-ms tablet:text-body-xl desktop-s:text-title-s desktop:text-title-m font-semibold text-secondary tracking-[0.3px] self-stretch">{current.subtitle}</p>
          <p className="max-[420px]:text-body-s text-body-ms tablet:text-body-xl desktop-s:text-title-s desktop:text-title-m font-normal text-secondary tracking-[0.3px] self-stretch whitespace-pre-line">{current.description}</p>
        </div>
      </div>

      {/* ── 카드 섹션 래퍼 ── */}
      {current.cards.length > 0 && (
        <div className="flex flex-col items-start gap-3xl self-stretch w-full">

          {/* ── 섹션 타이틀 ── */}
          <h2 className="max-[420px]:text-body-l text-body-xl tablet:text-title-s desktop-s:text-title-m desktop:text-title-l font-bold text-primary tracking-[0.3px] text-left">{current.sectionTitle}</h2>

          {/* ── 카드 그리드 ── */}
          <div className="grid max-[420px]:grid-cols-1 grid-cols-2 gap-xl w-full">
            {current.cards.map((card, i) => (
              <div
                key={i}
                className={`relative flex flex-col items-start max-[420px]:p-xl max-[768px]:p-3xl p-[var(--size-48)] gap-[10px] rounded-fai-m bg-sand-200 overflow-hidden w-full ${card.wide ? "max-[420px]:col-span-1 max-[420px]:h-[536px] col-span-2 h-auto tablet:h-[430px] max-[960px]:h-[320px]" : "col-span-1 max-[420px]:h-[536px] h-[520px] tablet:h-[640px] max-[960px]:h-[540px]"}`}
              >
                {/* 이미지 */}
                {card.image && card.image !== "MISSING_FROM_DESIGN" ? (
                  <Image src={card.image} alt={card.title} fill className="object-cover" style={{ objectPosition: card.objectPosition || "center" }} />
                ) : (
                  <div className="absolute inset-0 bg-filled-sand-tertiary" />
                )}

                {/* 암막 그레이디언트 */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, rgba(23, 25, 28, 0.50) 0%, rgba(23, 25, 28, 0.00) 100%)" }}
                />

                {/* 텍스트 — 좌상단 */}
                <div className="relative z-20 flex flex-col items-start gap-m self-stretch">
                  <h3 className="max-[420px]:text-body text-body-l tablet:text-body-xl desktop-s:text-title-s desktop:text-title-m font-semibold text-inverse tracking-[0.3px] text-left">{card.title}</h3>
                  <p className="max-[420px]:text-body-xs text-body-s tablet:text-body-ms desktop-s:text-body desktop:text-body-l font-normal text-text-basic-inverse-secondary text-left self-stretch">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </section>
  );
}
