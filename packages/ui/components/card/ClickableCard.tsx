"use client";

import * as React from "react";
import {
  CARD_BASE_CLASSES,
  CARD_PADDING_CLASSES,
  CARD_VARIANT_CLASSES,
  cnCard,
  type CardPadding,
  type CardVariant,
} from "./Card";

export interface ClickableCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
  /** 접근성 라벨 (필수) — 카드 전체가 하나의 클릭 대상이 되므로 이름 필요 */
  label: string;
  /** 클릭 핸들러 */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** 제공 시 링크로 렌더 */
  href?: string;
  /** 링크 target — href 제공 시에만 적용 */
  target?: string;
  /** 링크 렌더 컴포넌트 (Next.js Link 등) @default 'a' */
  as?: React.ElementType;
  /** 비활성화 @default false */
  disabled?: boolean;
  variant?: CardVariant;
  padding?: CardPadding;
  children?: React.ReactNode;
}

const INTERACTIVE_CLASSES = cnCard(
  "block w-full text-left cursor-pointer transition-all duration-150",
  "hover:border-border-subtle hover:shadow-S",
  "active:shadow-XS",
  "focus-visible:outline-none focus-visible:border-border-brand"
);

/**
 * 카드 전체가 하나의 클릭 대상인 카드. onClick이면 <button>,
 * href면 링크로 렌더된다. 카드 내부에 별도의 링크/버튼을 넣지 말 것
 * (중첩 인터랙티브 요소는 접근성 위반).
 * 스펙: root/components/web/ui/card.md
 *
 * @example
 * <ClickableCard label="프로젝트 상세 보기" href="/projects/1">…</ClickableCard>
 */
export function ClickableCard({
  label,
  onClick,
  href,
  target,
  as: LinkComponent = "a",
  disabled = false,
  variant = "default",
  padding = "m",
  className,
  children,
  ...rest
}: ClickableCardProps) {
  const classes = cnCard(
    CARD_BASE_CLASSES,
    CARD_VARIANT_CLASSES[variant],
    CARD_PADDING_CLASSES[padding],
    disabled
      ? "opacity-50 cursor-not-allowed"
      : INTERACTIVE_CLASSES,
    className
  );

  if (href != null && !disabled) {
    return (
      <LinkComponent
        href={href}
        target={target}
        aria-label={label}
        onClick={onClick}
        className={cnCard(classes, "no-underline")}
        {...rest}
      >
        {children}
      </LinkComponent>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}

export default ClickableCard;
