"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsExpanded(v >= 0.2);
  });

  return (
    <section ref={sectionRef} className="relative h-[400vh] w-full">
      <div className="sticky top-0 relative h-screen w-full overflow-hidden bg-surface">

        {/* 상단 카피 — 확장 전에만 표시 */}
        {!isExpanded && (
          <div className="absolute left-0 right-0 top-0 z-20 mx-auto flex flex-col items-center gap-s pt-[200px] text-center pointer-events-none">
            <h2 className="text-display-l font-bold leading-[6.5rem] tracking-tight text-primary">리테일의 미래</h2>
            <h2 className="text-display-l font-bold leading-[6.5rem] tracking-tight text-primary">한발 먼저 시작하세요</h2>
          </div>
        )}

        {/* 비디오 박스 ― layout FLIP 으로 크기/위치 보간 */}
        <motion.div
          layout
          animate={{
            borderRadius: isExpanded ? "0px 0px 0px 0px" : "20px 20px 0px 0px",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={
            isExpanded
              ? "absolute inset-0 overflow-hidden bg-gray-800"
              : "absolute bottom-0 left-0 right-0 mx-auto w-[400px] h-[344px] overflow-hidden bg-gray-800"
          }
        >
          {/* z-0: 비디오 */}
          <video
            className="absolute inset-0 z-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            src="https://www.w3schools.com/html/mov_bbb.mp4"
          />

          {/* z-20: 확장 후 텍스트 그룹 */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="container absolute bottom-10 left-1/2 z-20 -translate-x-1/2 flex w-full items-end justify-between"
            >
              <div className="flex flex-col gap-s">
                <p className="text-title-s font-medium text-inverse">No Staff, No Problem.</p>
                <h2 className="text-title-xl font-bold text-inverse">Next-Gen AI Retail Automation</h2>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-circle bg-fill-soft px-l py-s text-body-s font-medium text-primary transition-colors duration-200 hover:bg-fill-faint"
              >
                자세히 알아보기
              </button>
            </motion.div>
          )}
        </motion.div>

      </div>
      <div className="h-screen bg-transparent" />
    </section>
  );
}
