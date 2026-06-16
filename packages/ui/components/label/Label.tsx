"use client";

import * as React from "react";

export interface LabelProps {
  shape?: "square" | "round";
  size?:  "L" | "M" | "S";
  children: React.ReactNode;
  className?: string;
}

export function Label({
  shape     = "square",
  size      = "L",
  children,
  className = "",
}: LabelProps) {
  const radius =
    shape === "round"
      ? "rounded-[var(--cornerRadius-circle,999px)]"
      : "rounded-[var(--cornerRadius-XXS,4px)]";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "px-[var(--padding-ms,12px)] py-[var(--padding-2XS,4px)]",
        "bg-fill-faint",
        "text-tertiary",
        "text-[length:var(--w-caption-M-size,0.6875rem)]",
        "leading-[var(--w-caption-M-lineHeight,1rem)]",
        "tracking-[var(--w-caption-M-letterSpacing,-0.1px)]",
        "font-medium whitespace-nowrap",
        radius,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
