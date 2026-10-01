"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { IcoTxtButton } from "@fai/ui";
import { trackEvent } from "@/lib/analytics/track";

interface ProductHeroProps {
  subtitle: string;
  title: string;
  ctaLabel: string;
  videoSrc?: string;
  /** 모바일 폭(MOBILE_VIDEO_MEDIA)에서 쓸 배경 영상(HOM-109). 없으면 videoSrc 하나로 모든 폭을 덮는다. */
  mobileVideoSrc?: string;
}

/**
 * 모바일 영상 분기점 — **폰 세로 화면**(2026-10-01 결정).
 * 카드 요구사항은 "420px 이하"였지만 iPhone Plus·Pro Max(430~440px)가 빠져 QA에서 재신고됐다.
 * - 폭 767px: 폰은 Pro Max·폴더블까지 들어가고 태블릿(768~)은 빠진다. 세로 영상(584×1040)을
 *   iPad 폭으로 늘리면 흐려지므로 태블릿은 가로 영상을 쓴다.
 * - portrait: 폰을 가로로 눕히면(예: 844×390) 세로 영상은 가운데 일부만 보이므로 가로 영상을 쓴다.
 */
export const MOBILE_VIDEO_MEDIA = "(max-width: 767px) and (orientation: portrait)";

/**
 * 미디어 쿼리 일치 여부. 첫 렌더(정적 HTML·hydration)에는 판단할 수 없어 null을 돌려준다.
 * `enabled`가 false면 matchMedia를 부르지 않는다 — 분기할 영상이 없는 제품은 정적 HTML에 바로 src를 싣는다.
 */
function useMediaQuery(query: string, enabled: boolean): boolean | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!enabled) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query, enabled],
  );
  return useSyncExternalStore(
    subscribe,
    () => (enabled ? window.matchMedia(query).matches : null),
    () => null, // 정적 HTML·hydration: 폭을 모르므로 판단 보류
  );
}

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

  // ⚠️ `<source media>`로 분기하지 않는다 — iOS Safari(WebKit)는 video의 source media를 무시해
  // iPhone에서도 데스크톱 영상을 틀었다(2026-10-01 QA 신고, Playwright WebKit 실측).
  // matchMedia로 고른 경로를 src에 직접 건다. 판단 전(null)에는 video를 렌더하지 않아 두 파일을 다 받지 않는다.
  const isMobile = useMediaQuery(MOBILE_VIDEO_MEDIA, !!(src && mobileVideoSrc));
  const activeSrc = !src ? null : !mobileVideoSrc ? src : isMobile === null ? null : isMobile ? mobileVideoSrc : src;

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
      {activeSrc && (
        // 경로가 바뀌면(회전으로 경계를 넘거나 로케일 전환) key로 다시 마운트해 새 영상을 처음부터 재생한다.
        <video
          key={activeSrc}
          className="absolute inset-0 w-full h-full z-0 object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={activeSrc}
        />
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
