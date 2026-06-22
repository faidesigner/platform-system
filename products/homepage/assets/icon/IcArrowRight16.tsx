import * as React from "react";

export function IcArrowRight16({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <mask
        id="mask0_6333_4062"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="4"
        y="2"
        width="8"
        height="12"
      >
        <path
          d="M5 13.334L11 8.00073L5 2.66732"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_6333_4062)">
        <rect width="16" height="16" fill="currentColor" />
      </g>
    </svg>
  );
}
