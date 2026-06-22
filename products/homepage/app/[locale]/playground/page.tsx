"use client";

import { IcoTxtButton } from "@fai/ui";

/* ── 샘플 아이콘 (placeholder) ── */
function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-full h-full">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="w-full h-full">
      <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.124L8 10.5l-3.708 2.076L5 8.452 2 5.528l4.146-.772L8 1z" />
    </svg>
  );
}

/* ── 섹션 헬퍼 ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[13px] font-semibold text-[#A6A8AA] uppercase tracking-widest">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] px-10 py-16 flex flex-col gap-12">
      <h1 className="text-2xl font-bold text-[#1F2023]">IcoTxtButton — 사용 예시</h1>

      {/* ── Variant × Size ── */}
      <Section title="Variant × Size">
        <IcoTxtButton variant="primary"   size="XL">Primary XL</IcoTxtButton>
        <IcoTxtButton variant="primary"   size="L" >Primary L</IcoTxtButton>
        <IcoTxtButton variant="secondary" size="XL">Secondary XL</IcoTxtButton>
        <IcoTxtButton variant="secondary" size="L" >Secondary L</IcoTxtButton>
      </Section>

      {/* ── Shape ── */}
      <Section title="Shape">
        <IcoTxtButton variant="primary"   shape="square" size="L">Square (default)</IcoTxtButton>
        <IcoTxtButton variant="primary"   shape="round"  size="L">Round</IcoTxtButton>
        <IcoTxtButton variant="secondary" shape="square" size="L">Secondary Square</IcoTxtButton>
        <IcoTxtButton variant="secondary" shape="round"  size="L">Secondary Round</IcoTxtButton>
      </Section>

      {/* ── Icon + Text ── */}
      <Section title="Icon + Text">
        <IcoTxtButton variant="primary"   size="XL" icon={<ArrowRight />}>아이콘 우측 Primary XL</IcoTxtButton>
        <IcoTxtButton variant="primary"   size="L"  icon={<ArrowRight />}>아이콘 우측 Primary L</IcoTxtButton>
        <IcoTxtButton variant="secondary" size="XL" icon={<StarIcon />}>즐겨찾기 추가</IcoTxtButton>
        <IcoTxtButton variant="secondary" size="L"  icon={<StarIcon />}>즐겨찾기 추가</IcoTxtButton>
      </Section>

      {/* ── Impact ── */}
      <Section title="isImpact (border accent)">
        <IcoTxtButton variant="primary"   size="L" isImpact>Primary Impact</IcoTxtButton>
        <IcoTxtButton variant="secondary" size="L" isImpact>Secondary Impact</IcoTxtButton>
        <IcoTxtButton variant="primary"   size="L" isImpact icon={<StarIcon />}>아이콘 + Impact</IcoTxtButton>
      </Section>

      {/* ── Loading ── */}
      <Section title="isLoading">
        <IcoTxtButton variant="primary"   size="XL" isLoading>저장</IcoTxtButton>
        <IcoTxtButton variant="primary"   size="L"  isLoading>저장</IcoTxtButton>
        <IcoTxtButton variant="secondary" size="L"  isLoading>처리 중</IcoTxtButton>
      </Section>

      {/* ── Disabled ── */}
      <Section title="Disabled">
        <IcoTxtButton variant="primary"   size="XL" disabled>Primary Disabled</IcoTxtButton>
        <IcoTxtButton variant="primary"   size="L"  disabled>Primary Disabled</IcoTxtButton>
        <IcoTxtButton variant="secondary" size="L"  disabled>Secondary Disabled</IcoTxtButton>
        <IcoTxtButton variant="primary"   size="L"  disabled icon={<StarIcon />}>아이콘 Disabled</IcoTxtButton>
      </Section>

      {/* ── Full combination ── */}
      <Section title="Full Combination">
        <IcoTxtButton variant="primary"   shape="round" size="XL" icon={<ArrowRight />}>둥근 Primary XL</IcoTxtButton>
        <IcoTxtButton variant="secondary" shape="round" size="L"  icon={<StarIcon   />} isImpact>Impact Round</IcoTxtButton>
        <IcoTxtButton variant="primary"   shape="square" size="L" isLoading>로딩 중</IcoTxtButton>
      </Section>
    </main>
  );
}
