"use client";
import * as React from "react";

export type ScrollbarProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  function Scrollbar({ children, className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`inline-flex py-[var(--padding-S,8px)] px-[var(--padding-2XS,4px)] justify-center items-start gap-[var(--padding-None,0)] overflow-auto ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
