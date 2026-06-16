"use client";

import { useState, type ReactNode } from "react";

interface HoverDropdownProps {
  /** 트리거 렌더 함수 — open 상태를 전달받아 ChevronDown 회전 등 처리 */
  trigger: (open: boolean) => ReactNode;
  /** 드롭다운 패널 */
  panel: ReactNode;
  className?: string;
}

/**
 * 호버 트리거 → 드롭다운 패널 뼈대 컴포넌트.
 * open 상태를 내부에서 관리하고, trigger 렌더 함수에 주입한다.
 */
export function HoverDropdown({ trigger, panel, className }: HoverDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {trigger(open)}
      {open && panel}
    </li>
  );
}
