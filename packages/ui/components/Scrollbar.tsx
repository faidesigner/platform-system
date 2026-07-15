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
        className={`inline-flex justify-center items-start gap-0 overflow-auto py-s px-2xs ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
