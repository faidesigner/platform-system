import * as React from "react";

export function IcRequiredDot({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="4" cy="4" r="4" fill="var(--fai-bg-brand)" />
    </svg>
  );
}
