"use client";

import * as React from "react";

export type DividerVariant = "subtle" | "strong";
export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 방향 @default 'horizontal' */
  orientation?: DividerOrientation;
  /** 구분선 강도 @default 'subtle' */
  variant?: DividerVariant;
  /** 가운데 라벨 (horizontal 전용) — "또는", 날짜 구분 등 */
  label?: React.ReactNode;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

const VARIANT_COLOR: Record<DividerVariant, string> = {
  subtle: "border-[var(--color-border-tertiary)]",
  strong: "border-[var(--color-border-secondary)]",
};

/**
 * 콘텐츠 영역을 시각적으로 구분하는 선.
 * 시맨틱 구분이 목적이면 role="separator"가 자동 부여된다 (label 있으면 장식 아님).
 * 스펙: root/components/web/ui/divider.md
 *
 * @example
 * <Divider />
 * <Divider label="또는" />
 * <Divider orientation="vertical" />
 */
export function Divider({
  orientation = "horizontal",
  variant = "subtle",
  label,
  className,
  ...rest
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "self-stretch border-l",
          VARIANT_COLOR[variant],
          className
        )}
        {...rest}
      />
    );
  }

  if (label != null) {
    return (
      <div
        role="separator"
        className={cn("flex items-center gap-ms w-full", className)}
        {...rest}
      >
        <span className={cn("flex-1 border-t", VARIANT_COLOR[variant])} />
        <span className="shrink-0 text-caption-m text-[var(--color-text-basic-tertiary)]">
          {label}
        </span>
        <span className={cn("flex-1 border-t", VARIANT_COLOR[variant])} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={cn("w-full border-t", VARIANT_COLOR[variant], className)}
      {...rest}
    />
  );
}

export default Divider;
