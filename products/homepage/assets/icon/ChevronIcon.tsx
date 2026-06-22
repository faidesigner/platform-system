interface ChevronIconProps {
  open: boolean;
}

export default function ChevronIcon({ open }: ChevronIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
      focusable="false"
    >
      <mask
        id="mask0_6328_5385"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="1"
        y="5"
        width="14"
        height="7"
      >
        <path
          d="M2.66406 6L7.99731 11L13.3307 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_6328_5385)">
        <rect width="16" height="16" fill="currentColor" />
      </g>
    </svg>
  );
}
