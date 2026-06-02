"use client";

import * as React from "react";

type ButtonSize = "xl" | "l" | "m" | "s";
type ButtonTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "assistive"
  | "brandAssistive";
type ButtonShape = "square" | "round";

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  never
> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Force "impact" visual (e.g. high-attention CTA) */
  impact?: boolean;
  /** Shows spinner + disables interactions */
  loading?: boolean;
  /** Optional leading icon */
  icon?: React.ReactNode;
};

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function getSizeClasses(size: ButtonSize, tone: ButtonTone) {
  switch (size) {
    case "xl":
      // default XL spec comes from icoTxt/square/tertiary
      // assistive XL spec differs in horizontal padding (20px)
      return cn(
        "py-m",
        tone === "assistive" || tone === "brandAssistive" ? "px-l" : "px-xl",
        "text-body"
      );
    case "l":
      return cn(
        "h-3xl",
        "px-l",
        "text-body-s"
      );
    case "m":
      return cn(
        "py-s",
        "px-m",
        "text-body-xs"
      );
    case "s":
      // 26px target: line-height(18px) + py(4px*2) = 26px
      return cn(
        "py-2xs",
        "px-ms",
        "text-caption-m"
      );
  }
}

function getToneClasses(tone: ButtonTone, impact: boolean) {
  if (impact) {
    return cn(
      "bg-brand text-on-brand border border-border-brand",
      "hover:bg-brand-subtle hover:text-brand-text hover:border-border-brand-sub",
      "active:bg-brand-subtle active:text-brand-text active:border-border-brand-sub"
    );
  }

  switch (tone) {
    case "primary":
      return cn(
        "bg-fill-strong dark:bg-brand text-inverse border border-border-faint",
        "hover:bg-fill hover:border-border-subtle",
        "active:bg-fill-soft active:text-primary active:border-border-subtle"
      );
    case "secondary":
      return cn(
        "bg-surface text-primary border border-border-subtle",
        "hover:bg-fill-faint hover:border-border",
        "active:bg-surface-sunken active:border-border-subtle"
      );
    case "tertiary":
      return cn(
        "bg-surface text-secondary border border-border-faint",
        "hover:bg-surface-alt hover:text-primary hover:border-border-subtle",
        "active:bg-surface-sunken active:text-primary active:border-border-subtle",
        "focus-visible:border-border-brand"
      );
    case "assistive":
      return cn(
        "bg-fill-soft text-secondary border border-border-faint",
        "hover:bg-surface-alt hover:text-primary hover:border-border-subtle",
        "active:bg-surface-sunken active:text-primary active:border-border-subtle",
        "focus-visible:border-border"
      );
    case "brandAssistive":
      return cn(
        "bg-brand-subtle text-brand-text border border-border-brand-sub",
        "hover:bg-brand-subtle hover:border-border-brand",
        "active:bg-brand-subtle active:border-border-brand",
        "focus-visible:border-border-brand"
      );
  }
}

export function Button({
  tone = "primary",
  size = "m",
  shape = "square",
  impact = false,
  loading = false,
  icon,
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const ariaDisabled = props["aria-disabled"] === "true";
  const trulyDisabled = Boolean(props.disabled || ariaDisabled || loading);

  return (
    <button
      {...props}
      type={type ?? "button"}
      disabled={trulyDisabled}
      aria-busy={loading || undefined}
      className={cn(
        "flex flex-col justify-center items-center gap-0",
        shape === "round" ? "rounded-circle" : "rounded-[8px]",
        "whitespace-nowrap",
        "transition-colors",
        // assistive specs: flex-direction column, gap none (omit gap classes)
        tone === "assistive" || tone === "brandAssistive" ? "flex-col" : undefined,
        // focus: avoid numeric ring utilities; rely on semantic border token
        "focus-visible:outline-none focus-visible:border-border-brand",
        trulyDisabled
          ? "bg-fill-disabled text-disabled border border-border-disabled cursor-not-allowed"
          : getToneClasses(tone, impact),
        getSizeClasses(size, tone),
        className
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2xs">
          <span
            className={cn(
              "inline-block",
              "w-ms h-ms",
              "rounded-circle",
              "border border-current border-t-transparent",
              "animate-spin"
            )}
            aria-hidden="true"
          />
          <span>{children}</span>
        </span>
      ) : (
        <>
          {icon ? <span className="inline-flex">{icon}</span> : null}
          {children}
        </>
      )}
    </button>
  );
}

