"use client";

import * as React from "react";

export interface IcoTxtButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   "primary" | "secondary" | "tertiary";
  shape?:     "square" | "round";
  size?:      "XL" | "L" | "M" | "S";
  isImpact?:     boolean;
  isLoading?:    boolean;
  icon?:         React.ReactNode;
  iconPosition?: "left" | "right";
  children:      React.ReactNode;
}

/* ── 사이즈 매트릭스 ── */
const sizeMap = {
  XL: {
    padding:    "px-xl py-m",
    contentGap: "gap-xs",
    font:       "text-body font-semibold",
    iconSize:   "w-[20px] h-[20px]",
  },
  L: {
    padding:    "px-m py-s",
    contentGap: "gap-2xs",
    font:       "text-[length:var(--font-size-15,15px)] font-semibold leading-[var(--font-lineHeight-15,22px)]",
    iconSize:   "w-[16px] h-[16px]",
  },
  M: {
    padding:    "px-s py-xs",
    contentGap: "gap-3xs",
    font:       "text-[length:var(--font-size-13,13px)] font-semibold leading-[var(--font-lineHeight-13,20px)]",
    iconSize:   "w-[16px] h-[16px]",
  },
  S: {
    padding:    "px-xs py-2xs",
    contentGap: "gap-3xs",
    font:       "text-caption-m font-semibold",
    iconSize:   "w-[14px] h-[14px]",
  },
};

/* ── 공통 베이스 ── */
const BASE =
  "inline-flex justify-center items-center transition-all duration-200 cursor-pointer " +
  "disabled:cursor-not-allowed relative overflow-hidden " +
  "after:absolute after:inset-0 after:transition-colors after:pointer-events-none group";

/* ── Variant 클래스 ── */
const PRIMARY =
  "bg-[var(--color-filled-optional-brand-primaryBtn)] text-[var(--color-text-optional-brand-primaryBtn)] " +
  "after:bg-transparent " +
  "hover:after:bg-[var(--color-interaction-light-white-hover,rgba(255,255,255,0.03))] hover:after:opacity-[var(--opacity-28,0.28)] " +
  "focus:after:bg-[var(--color-interaction-light-white-focus,rgba(255,255,255,0.05))] focus:after:opacity-[var(--opacity-35,0.35)] " +
  "active:after:bg-[var(--color-interaction-light-white-pressed,rgba(255,255,255,0.08))] active:after:opacity-100 " +
  "disabled:bg-fill-disabled disabled:text-disabled disabled:after:hidden " +
  "data-[impact=true]:border data-[impact=true]:border-solid data-[impact=true]:border-[var(--gradient-basic-light-accent-primary,#4A9DF7)]";

const SECONDARY =
  "bg-[var(--color-filled-optional-brand-secondaryBtn)] text-[var(--color-text-optional-brand-secondaryBtn)] " +
  "after:bg-transparent " +
  "hover:after:bg-transparent " +
  "focus:after:bg-[var(--color-interaction-light-black-focus,rgba(0,0,0,0.35))] focus:after:opacity-100 " +
  "active:after:bg-[var(--color-interaction-light-black-pressed,rgba(0,0,0,0.16))] active:after:opacity-100 " +
  "disabled:bg-fill-disabled disabled:text-disabled disabled:after:hidden " +
  "data-[impact=true]:border data-[impact=true]:border-solid data-[impact=true]:border-[var(--gradient-basic-light-accent-primary,#4A9DF7)]";

const TERTIARY =
  "bg-transparent text-primary " +
  "border border-solid border-border-faint " +
  "after:bg-transparent " +
  "hover:after:bg-[var(--color-interaction-light-black-hover,rgba(0,0,0,0.03))] " +
  "focus:after:bg-[var(--color-interaction-light-black-focus,rgba(0,0,0,0.05))] " +
  "active:after:bg-[var(--color-interaction-light-black-pressed,rgba(0,0,0,0.08))] active:after:opacity-100 " +
  "disabled:border-border-disabled disabled:bg-fill-disabled/40 disabled:text-disabled disabled:after:hidden " +
  "data-[impact=true]:border-[var(--gradient-basic-light-accent-primary,#4A9DF7)]";

const VARIANT_CLASS: Record<"primary" | "secondary" | "tertiary", string> = {
  primary:   PRIMARY,
  secondary: SECONDARY,
  tertiary:  TERTIARY,
};

/* ── 로딩 스피너 ── */
function Spinner({ className }: { className: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ── Component ── */
export const IcoTxtButton = React.forwardRef<HTMLButtonElement, IcoTxtButtonProps>(
  (
    {
      variant   = "primary",
      shape     = "square",
      size      = "L",
      isImpact      = false,
      isLoading     = false,
      icon,
      iconPosition  = "left",
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { padding, contentGap, font, iconSize } = sizeMap[size];

    /* S + square → 6px, 나머지 square → 8px, round → 999px */
    const isSquareSmall = shape === "square" && size === "S";
    const shapeClasses = shape === "round"
      ? "rounded-fai-circle after:rounded-fai-circle"
      : isSquareSmall
        ? "rounded-fai-xs after:rounded-fai-xs"
        : "rounded-fai-s after:rounded-fai-s";

    const classes = [
      BASE,
      VARIANT_CLASS[variant],
      shapeClasses,
      padding,
      isLoading ? "w-[150px]" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        data-impact={isImpact}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* contents 래퍼 — z-index로 after 오버레이 위에 노출 */}
        <span className={`relative z-10 flex items-center justify-center h-[24px] ${contentGap}`}>

          {/* 좌측 아이콘 or 스피너 */}
          {isLoading ? (
            <span className={`flex items-center justify-center ${iconSize}`}>
              <Spinner className={iconSize} />
            </span>
          ) : (icon && iconPosition === "left") ? (
            <span className={`flex items-center justify-center ${iconSize}`}>
              {icon}
            </span>
          ) : null}

          {/* 텍스트 */}
          <span className={font}>
            {isLoading ? "로딩 중…" : children}
          </span>

          {/* 우측 아이콘 */}
          {(!isLoading && icon && iconPosition === "right") && (
            <span className={`flex items-center justify-center ${iconSize}`}>
              {icon}
            </span>
          )}

        </span>
      </button>
    );
  },
);
IcoTxtButton.displayName = "IcoTxtButton";
