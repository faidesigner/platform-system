"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface HoverDropdownProps {
  /** 트리거 렌더 함수 — open 상태를 전달받아 ChevronDown 회전 등 처리 */
  trigger: (open: boolean) => ReactNode;
  /** 드롭다운 패널 */
  panel: ReactNode;
  className?: string;
  /**
   * motion.div 래퍼 className 오버라이드.
   * 미지정 시 기본 스타일(bg-surface, shadow, rounded) 적용.
   */
  panelClassName?: string;
  /**
   * 외부 wrapper div 의 className 을 완전히 대체.
   * 미지정 시 "relative" + className 조합.
   * 메가 메뉴처럼 패널 위치 기준을 상위 positioned 조상(<header> 등)으로 올릴 때
   * relative 를 제외한 값(e.g. "flex items-center")을 전달.
   */
  wrapperClassName?: string;
}

/**
 * Framer Motion 기반 호버 드롭다운 컴포넌트.
 * open 상태를 내부에서 관리하고, trigger 렌더 함수에 주입한다.
 * 패널 진입/퇴장 시 opacity + y 트랜지션.
 */
export function HoverDropdown({ trigger, panel, className, panelClassName, wrapperClassName }: HoverDropdownProps) {
  const [open, setOpen] = useState(false);

  const resolvedWrapperClass = wrapperClassName !== undefined
    ? wrapperClassName
    : ["relative", className].filter(Boolean).join(" ");

  return (
    <div
      className={resolvedWrapperClass}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {trigger(open)}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={panelClassName ?? "absolute top-full left-0 z-50 rounded-fai-s bg-surface shadow-[var(--shadow-L,0_10px_30px_rgba(0,0,0,0.08))]"}
          >
            {panel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
