"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LogoMarquee, IcoTxtButton } from "@fai/ui";
import type { LogoItem } from "@fai/ui";

interface HeroSectionProps {
  logos?: LogoItem[];
}

export default function HeroSection({ logos }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setIsExpanded(v >= 0.2);
    });
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative h-[400vh] w-full">
      <div className="sticky top-0 relative h-screen w-full overflow-hidden bg-surface">

        {/* 상단 카피 — 확장 전에만 표시 */}
        {!isExpanded && (
          <div className="absolute left-0 right-0 top-0 z-20 mx-auto flex flex-col items-center gap-s pt-[200px] text-center pointer-events-none">
            <h2 className="text-title-xl max-[420px]:text-title-l tablet:text-display-s desktop:text-display-m font-bold tracking-tight text-primary">리테일의 미래</h2>
            <h2 className="text-title-xl max-[420px]:text-title-l tablet:text-display-s desktop:text-display-m font-bold tracking-tight text-primary">한발 먼저 시작하세요</h2>
          </div>
        )}

        {/* 비디오 박스 ― layout FLIP 으로 크기/위치 보간 */}
        <motion.div
          layout
          animate={{
            borderRadius: isExpanded ? "0" : "20px 20px 0 0",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={
            isExpanded
              ? "absolute inset-0 z-30 overflow-hidden bg-fill-strong"
              : "absolute bottom-0 left-[calc(50%-200px)] w-[400px] h-[374px] z-30 overflow-hidden bg-fill-strong"
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
            className={`absolute inset-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.4)_100%)] transition-opacity duration-1000 ease-in-out z-10 ${
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
                        No Staff, No Problem.
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
                        Next-Gen AI Retail Automation
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
                    <IcoTxtButton variant="secondary" size="L" shape="round" className="shrink-0">
                      자세히 알아보기
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
      <div className="h-screen bg-transparent" />
    </section>
  );
}
