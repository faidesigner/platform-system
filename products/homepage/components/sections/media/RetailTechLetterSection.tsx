"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";

/* ── 외부 위젯 스크립트 임베드 ─────────────────────────── */
function ScriptEmbed({ scriptSrc, mountId }: { scriptSrc: string; mountId: string }) {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    if (!scriptSrc || scriptSrc === "MISSING_FROM_DESIGN") return;
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);
    loaded.current = true;
    return () => {
      script.remove();
    };
  }, [scriptSrc]);
  return <div id={mountId} className="w-full" />;
}

/* ── Section ─────────────────────────────────────────── */
export default function RetailTechLetterSection() {
  const { retailTechLetter } = siteConfig;
  const { embed } = retailTechLetter;
  const isIframe  = embed.type === "iframe";
  const hasIframe = isIframe && embed.src && embed.src !== "MISSING_FROM_DESIGN";
  const hasScript = !isIframe && embed.scriptSrc && embed.scriptSrc !== "MISSING_FROM_DESIGN";
  const ready     = hasIframe || hasScript;

  return (
    <section
      className="flex flex-col items-start w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] pt-[var(--padding-5XL,80px)] pb-[var(--padding-7-xl,120px)] gap-[var(--spacing-3XL,40px)] bg-surface"
    >
      <h2
        className="flex-1 w-full text-title-l desktop:text-title-xl font-bold text-primary"
      >
        {retailTechLetter.title}
      </h2>

      <div className="w-full h-[400px] min-[961px]:h-[608px] overflow-hidden rounded-[var(--cornerRadius-L,16px)]">
        {hasIframe && (
          <iframe
            src={embed.src}
            title={retailTechLetter.title}
            className="w-full h-full border-0"
            loading="lazy"
          />
        )}
        {hasScript && (
          <ScriptEmbed mountId={embed.mountId} scriptSrc={embed.scriptSrc} />
        )}

        {!ready && (
          <div
            className="flex w-full items-center justify-center rounded-[var(--cornerRadius-L,16px)]"
            style={{
              height:          `${embed.height}px`,
              backgroundColor: "var(--fai-bg-surface-alt)",
              color:           "var(--fai-color-tertiary)",
              fontSize:        "var(--font-size-16, 1rem)",
              lineHeight:      "var(--font-lineHeight-16, 1.5rem)",
            }}
          >
            구독 폼 임베드 정보가 필요합니다 (site.ts → retailTechLetter.embed)
          </div>
        )}
      </div>
    </section>
  );
}
