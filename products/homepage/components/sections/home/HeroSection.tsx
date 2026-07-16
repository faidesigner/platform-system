"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Snap from "lenis/snap";
import { LogoMarquee, IcoTxtButton } from "@fai/ui";
import type { LogoItem } from "@fai/ui";
import { trackEvent } from "@/lib/analytics/track";
import { lenisRef } from "@/components/layout/SmoothScroll";

interface HeroSectionProps {
  logos?: LogoItem[];
}

/** 펼침 snap 지점 — Hero 스크롤 구간(range) 대비 비율. 조절 노브. */
const EXPANDED_STOP = 0.5;

export default function HeroSection({ logos }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const expandedRef = useRef(false);
  const navExpandedRef = useRef(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      // 히어로 확장 상태
      const next = v >= 0.2;
      if (next !== expandedRef.current) {
        expandedRef.current = next;
        setIsExpanded(next);

        // nav 전환 — 비디오 박스 확장 애니메이션 90% 시점(540ms)에 색상 전환
        if (next && !navExpandedRef.current) {
          navTimerRef.current = setTimeout(() => {
            navExpandedRef.current = true;
            window.dispatchEvent(new CustomEvent("hero:expanded"));
          }, 540);
        } else if (!next && navExpandedRef.current) {
          if (navTimerRef.current) clearTimeout(navTimerRef.current);
          navExpandedRef.current = false;
          window.dispatchEvent(new CustomEvent("hero:collapsed"));
        }
      }
    });
  }, [scrollYProgress]);

  // cleanup
  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  /** Hero 내부 2단계 snap — 접힘(상단) ↔ 펼침(EXPANDED_STOP 지점) */
  useEffect(() => {
    let snap: Snap | null = null;
    let raf = 0;
    const build = () => {
      const lenis = lenisRef.current;
      const el = sectionRef.current;
      if (!lenis || !el) {
        raf = requestAnimationFrame(build);
        return;
      }
      snap?.destroy();
      snap = new Snap(lenis, {
        type: "proximity",
        distanceThreshold: "30%",
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      const range = el.offsetHeight - window.innerHeight;
      snap.add(el.offsetTop);
      snap.add(el.offsetTop + range * EXPANDED_STOP);
    };
    raf = requestAnimationFrame(build);
    const onResize = () => build();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      snap?.destroy();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[180vh] w-full">
      <div className="sticky top-0 relative h-screen w-full overflow-hidden bg-surface">

        {/* 상단 카피 — 확장 전에만 표시. z-40: 비디오 박스(z-30)보다 위에 그려 어떤 height에서도 텍스트가 가려지지 않도록 하는 안전망 (HOM-57) */}
        {!isExpanded && (
          <div className="absolute left-0 right-0 top-0 z-40 mx-auto flex flex-col items-center gap-s pt-[clamp(var(--padding-8XL),22.22vh,200px)] text-center pointer-events-none">
            <h2 className="text-title-xl max-[421px]:text-title-l tablet:text-display-s desktop:text-display-m font-bold tracking-tight text-primary">{t("title1")}</h2>
            <h2 className="text-title-xl max-[421px]:text-title-l tablet:text-display-s desktop:text-display-m font-bold tracking-tight text-primary">{t("title2")}</h2>
          </div>
        )}

        {/*
          비디오 박스 ― layout FLIP 으로 크기/위치 보간.
          축소 상태 높이는 고정 374px 대신 min(374px, 100vh - 타이틀 예약공간)으로 계산 (HOM-57).
          예약공간(--hero-title-clear)은 상단 pt 최대값(200px, 짧은 height에서는 var(--padding-8XL)=150px까지 축소) +
          브레이크포인트별 타이틀 2줄 높이(gap-s 포함)를 근사한 값이라, 정상 height에서는 100vh가 충분해 기존과 동일한
          374px로 귀결되고, height가 짧아질 때만 이미지가 줄어든다. pt가 축소되는 구간에서는 실제 예약공간이 이 근사치보다
          작아지므로(보수적 방향) 안전망(z-40)이 여전히 유효하다.
        */}
        <motion.div
          layout
          animate={{
            borderRadius: isExpanded ? "0" : "20px 20px 0 0",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={
            isExpanded
              ? "absolute inset-0 z-30 overflow-hidden bg-fill-strong"
              : "absolute bottom-0 left-[calc(50%-200px)] w-[400px] h-[min(374px,calc(100vh-var(--hero-title-clear)))] [--hero-title-clear:316px] min-[422px]:[--hero-title-clear:342px] tablet:[--hero-title-clear:364px] desktop:[--hero-title-clear:374px] z-30 overflow-hidden bg-fill-strong"
          }
        >
          {/* z-0: 비디오 */}
          <video
            className="absolute inset-0 z-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            src="/videos/home/home-hero-bg-2.mp4"
          />

          {/* z-10: Dim Overlay */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.25)_100%)] transition-opacity duration-1000 ease-in-out z-10 ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* z-20: Content layer */}
          <div className={`absolute inset-0 z-20 flex flex-col justify-end pb-3xl pointer-events-none ${isExpanded ? "opacity-100" : "opacity-0"}`}>
            <div className="flex flex-col gap-5xl w-full">
              {/* 타이틀+CTA 행 — 좌/우 정렬 */}
              <div className="flex flex-col tablet:flex-row w-full tablet:items-end tablet:justify-between gap-[var(--spacing-2XL,32px)] tablet:gap-0 px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)]">
                <div className="flex flex-col gap-s">
                  <p className="text-body-xl tablet:text-title-s font-medium text-inverse">
                    <span className="block overflow-hidden relative">
                      <span
                        className={`block transition-all duration-1000 delay-300 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
                          isExpanded ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"
                        }`}
                      >
                        {t("tagline")}
                      </span>
                    </span>
                  </p>
                  <h2 className="text-title-m tablet:text-title-l desktop:text-title-xl font-bold text-inverse">
                    <span className="block overflow-hidden relative">
                      <span
                        className={`block transition-all duration-1000 delay-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
                          isExpanded ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"
                        }`}
                      >
                        {t("subtitle")}
                      </span>
                    </span>
                  </h2>
                </div>
                <div
                  className={`transition-all duration-1000 delay-700 ease-out ${
                    isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Link href={locale ? `/${locale}/products/vision-check-out` : "/products/vision-check-out"}>
                    <IcoTxtButton
                      variant="secondary" size="L" shape="round" className="shrink-0"
                      onClick={() => trackEvent("interest_click", { location: "home_hero", label: tCommon("cta.learnMore") })}
                    >
                      {tCommon("cta.learnMore")}
                    </IcoTxtButton>
                  </Link>
                </div>
              </div>
              {/* LogoMarquee */}
              {logos && logos.length > 0 && (
                <div
                  className={`w-full px-2xl ease-out ${
                    isExpanded
                      ? "opacity-100 transition-opacity duration-1000 delay-300"
                      : "opacity-0 pointer-events-none transition-opacity duration-100"
                  }`}
                >
                  <LogoMarquee logos={logos} speed={30} />
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
