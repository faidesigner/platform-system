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
  /** 가로 420px 이하에서 쓸 배경 영상(HOM-109). 없으면 videoSrc 하나로 모든 폭을 덮는다. */
  mobileVideoSrc?: string;
}

/** 모바일 영상 분기점. 타이틀 축소 분기(max-[421px])와 같은 경계 — 요구사항은 "420px 이하". */
const MOBILE_VIDEO_MEDIA = "(max-width: 420px)";

export default function ProductHero({
  subtitle,
  title,
  ctaLabel,
  videoSrc,
  mobileVideoSrc,
}: ProductHeroProps) {
  // 과거 폴백은 외부 사이트(w3schools)의 데모 mp4였다 — 운영 히어로가 제3자 호스팅에 의존하면
  // 그쪽이 링크를 내리는 순간 배경이 깨진다. 자체 호스팅 경로가 없으면 아예 렌더하지 않는다.
  const src = !videoSrc || videoSrc === "MISSING_FROM_DESIGN" ? null : videoSrc;

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
      {/* z-0: 배경 비디오 — 자체 호스팅 경로가 있을 때만 렌더 */}
      {src && (
        // `<source>`는 최초 로드 때만 선택된다 — 경로가 바뀌면(로케일 전환) key로 다시 마운트해 재선택시킨다.
        // 브라우저는 첫 번째로 일치하는 source를 쓰므로 모바일 source가 반드시 먼저 와야 한다.
        <video
          key={`${mobileVideoSrc ?? ""}|${src}`}
          className="absolute inset-0 w-full h-full z-0 object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          {mobileVideoSrc && (
            <source src={mobileVideoSrc} media={MOBILE_VIDEO_MEDIA} type="video/mp4" />
          )}
          <source src={src} type="video/mp4" />
        </video>
      )}

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
            <h1 className="text-title-xl max-[421px]:text-title-l tablet:text-display-s desktop:text-display-m font-bold text-text-basic-inverse">
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
