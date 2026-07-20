"use client";

import * as React from "react";

/** 시맨틱 variant — 솔리드 배경, 주의가 필요한 시스템 상태 전용 */
export type BadgeSemanticVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

/** 카테고리 variant — 틴트 배경 + 컬러 텍스트, 분류/태깅 전용 */
export type BadgeCategoryVariant =
  | "blue"
  | "mint"
  | "orange"
  | "red"
  | "yellow"
  | "green"
  | "indigo"
  | "purple"
  | "grape"
  | "gray";

export type BadgeVariant = BadgeSemanticVariant | BadgeCategoryVariant;

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * 시각적 스타일 변형.
   * @default 'neutral'
   */
  variant?: BadgeVariant;
  /** 배지 텍스트 (필수, 1~2단어 권장) */
  label: React.ReactNode;
  /** 선택적 leading 아이콘 — 반드시 라벨과 함께 사용 */
  icon?: React.ReactNode;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/* 모든 색상은 foundation 시맨틱 토큰(CSS 변수)만 사용 */
const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  /* semantic — solid */
  neutral:
    "bg-[var(--color-filled-basic-tertiary)] text-[var(--color-text-basic-primary)]",
  info: "bg-[var(--color-filled-basic-info)] text-[var(--color-text-basic-inverse)]",
  success:
    "bg-[var(--color-filled-basic-positive)] text-[var(--color-text-basic-inverse)]",
  warning:
    "bg-[var(--color-filled-basic-warning)] text-[var(--color-text-basic-inverse)]",
  error:
    "bg-[var(--color-filled-basic-negative)] text-[var(--color-text-basic-inverse)]",
  /* category — tinted */
  blue: "bg-[var(--color-filled-basic-info-secondary)] text-[var(--color-text-basic-Info)]",
  mint: "bg-[var(--color-filled-basic-positive-secondary)] text-[var(--color-text-basic-positive)]",
  orange:
    "bg-[var(--color-filled-basic-warning-secondary)] text-[var(--color-text-basic-warning)]",
  red: "bg-[var(--color-filled-basic-negative-secondary)] text-[var(--color-text-basic-negative)]",
  yellow:
    "bg-[var(--color-filled-tag-category-yellow-secondary)] text-[var(--color-text-tag-category-yellow)]",
  green:
    "bg-[var(--color-filled-tag-category-green-secondary)] text-[var(--color-text-tag-category-green)]",
  indigo:
    "bg-[var(--color-filled-tag-category-indigo-secondary)] text-[var(--color-text-tag-category-indigo)]",
  purple:
    "bg-[var(--color-filled-tag-category-purple-secondary)] text-[var(--color-text-tag-category-purple)]",
  grape:
    "bg-[var(--color-filled-tag-category-grape-secondary)] text-[var(--color-text-tag-category-grape)]",
  gray: "bg-[var(--color-filled-tag-category-gray-secondary)] text-[var(--color-text-tag-category-gray)]",
};

/**
 * 상태 또는 카테고리를 한눈에 표시하는 읽기 전용 인디케이터.
 * 스펙: root/components/web/ui/badge.md
 *
 * @example
 * <Badge label="Active" />
 * <Badge variant="success" label="Active" />
 * <Badge variant="purple" label="Engineering" />
 */
export function Badge({
  variant = "neutral",
  label,
  icon,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "h-l gap-2xs px-s", // height 20px / gap 4px / padding-x 8px
        "rounded-fai-circle", // pill
        "text-caption-m font-medium whitespace-nowrap",
        VARIANT_CLASSES[variant],
        className
      )}
      {...rest}
    >
      {icon}
      {label}
    </span>
  );
}

export default Badge;
