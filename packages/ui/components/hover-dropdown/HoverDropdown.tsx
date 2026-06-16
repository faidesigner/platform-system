"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface HoverDropdownProps {
  /** 트리거 렌더 함수 — open 상태를 전달받아 ChevronDown 회전 등 처리 */
  trigger: (open: boolean) => ReactNode;
  /** 드롭다운 패널 */
  panel: ReactNode;
  className?: string;
}

/**
 * Framer Motion 기반 호버 드롭다운 컴포넌트.
 * open 상태를 내부에서 관리하고, trigger 렌더 함수에 주입한다.
 * 패널 진입/퇴장 시 opacity + y 트랜지션.
 */
export function HoverDropdown({ trigger, panel, className }: HoverDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={["relative", className].filter(Boolean).join(" ")}
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
            className="absolute top-full left-0 z-50 rounded-fai-s bg-surface shadow-[var(--shadow-L,0_10px_30px_rgba(0,0,0,0.08))]"
          >
            {panel}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
