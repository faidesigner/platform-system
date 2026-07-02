"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IcoTxtButton } from "@fai/ui";
import { trackEvent } from "@/lib/analytics/track";

interface ProductHeroProps {
  subtitle: string;
  title: string;
  ctaLabel: string;
  videoSrc?: string;
}

const FALLBACK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

export default function ProductHero({
  subtitle,
  title,
  ctaLabel,
  videoSrc,
}: ProductHeroProps) {
  const src = (!videoSrc || videoSrc === "MISSING_FROM_DESIGN")
    ? FALLBACK_VIDEO
    : videoSrc;

  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const lhref = (path: string) => (locale ? `/${locale}${path}` : path);
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* z-0: 배경 비디오 */}
      <video
        className="absolute inset-0 w-full h-full z-0 object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={src}
      />

      {/* z-10: Dim Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[linear-gradient(0deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.4)_100%)]"
      />

      {/* z-20: 콘텐츠 레이어 */}
      <div className="absolute inset-0 z-20 flex w-full flex-col justify-end px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] pb-8xl pointer-events-none">
        <div className="flex flex-col tablet:flex-row w-full tablet:items-end tablet:justify-between gap-[var(--spacing-2XL,32px)] tablet:gap-0">
          {/* 타이틀 */}
          <div className="flex flex-col items-start gap-m max-w-[1140px]">
            <p className="text-title-s tablet:text-title-m font-semibold text-text-basic-inverse">
              <span className="block overflow-hidden relative">
                <span
                  className={`block transition-all duration-1000 delay-300 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"
                  }`}
                >
                  {subtitle}
                </span>
              </span>
            </p>
            <h1 className="text-title-xl max-[420px]:text-title-l tablet:text-display-s desktop:text-display-m font-bold text-text-basic-inverse">
              <span className="block overflow-hidden relative">
                <span
                  className={`block transition-all duration-1000 delay-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"
                  }`}
                >
                  {title}
                </span>
              </span>
            </h1>
          </div>

          {/* CTA */}
          {ctaLabel && (
            <div
              className={`transition-all duration-1000 delay-700 ease-out ${
                isReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <IcoTxtButton
                variant="secondary"
                size="L"
                shape="round"
                className="shrink-0"
                onClick={() => {
                  trackEvent("lead_acquisition_click", { location: "product_hero", label: ctaLabel });
                  router.push(lhref("/contact"));
                }}
              >
                {ctaLabel}
              </IcoTxtButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
