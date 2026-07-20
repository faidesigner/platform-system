"use client";

import * as React from "react";

/** semantic + category 틴트 (Badge 카테고리 컬러와 동일 계열) */
export type CardVariant =
  | "default"
  | "transparent"
  | "muted"
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

export type CardPadding = "none" | "s" | "m" | "l";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 배경 변형 @default 'default' */
  variant?: CardVariant;
  /** 내부 패딩 @default 'm' */
  padding?: CardPadding;
  children?: React.ReactNode;
}

export function cnCard(
  ...values: Array<string | undefined | null | false>
) {
  return values.filter(Boolean).join(" ");
}

export const CARD_PADDING_CLASSES: Record<CardPadding, string> = {
  none: "p-0",
  s: "p-m", //  16px
  m: "p-xl", // 24px
  l: "p-2xl", // 32px (기존 CardItem과 동일)
};

/* 모든 variant에 transparent border 포함 — 변형 전환 시 레이아웃 밀림 방지 */
export const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
  default:
    "bg-[var(--color-bg-100)] border-border-tertiary",
  transparent: "bg-transparent border-transparent",
  muted: "bg-[var(--color-bg-200)] border-transparent",
  blue: "bg-[var(--color-filled-basic-info-secondary)] border-transparent",
  mint: "bg-[var(--color-filled-basic-positive-secondary)] border-transparent",
  orange:
    "bg-[var(--color-filled-basic-warning-secondary)] border-transparent",
  red: "bg-[var(--color-filled-basic-negative-secondary)] border-transparent",
  yellow:
    "bg-[var(--color-filled-tag-category-yellow-secondary)] border-transparent",
  green:
    "bg-[var(--color-filled-tag-category-green-secondary)] border-transparent",
  indigo:
    "bg-[var(--color-filled-tag-category-indigo-secondary)] border-transparent",
  purple:
    "bg-[var(--color-filled-tag-category-purple-secondary)] border-transparent",
  grape:
    "bg-[var(--color-filled-tag-category-grape-secondary)] border-transparent",
  gray: "bg-[var(--color-filled-tag-category-gray-secondary)] border-transparent",
};

export const CARD_BASE_CLASSES =
  "rounded-fai-m border text-[var(--color-text-basic-primary)]"; // radius 16px — 기존 CardItem과 동일

/**
 * 콘텐츠를 담는 기본 카드 컨테이너 (비인터랙티브).
 * 클릭 가능한 카드는 ClickableCard, 선택형은 SelectableCard 사용.
 * 스펙: root/components/web/ui/card.md
 *
 * @example
 * <Card><h3>제목</h3><p>내용</p></Card>
 * <Card variant="muted" padding="l">…</Card>
 */
export function Card({
  variant = "default",
  padding = "m",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cnCard(
        CARD_BASE_CLASSES,
        CARD_VARIANT_CLASSES[variant],
        CARD_PADDING_CLASSES[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
