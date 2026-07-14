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

export interface SelectableCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 접근성 라벨 (필수) */
  label: string;
  /** 선택 상태 (제어형, 필수) */
  selected: boolean;
  /** 선택 변경 콜백 (필수) */
  onChange: (selected: boolean) => void;
  /** 비활성화 @default false */
  disabled?: boolean;
  variant?: CardVariant;
  padding?: CardPadding;
  children?: React.ReactNode;
}

/**
 * 체크박스처럼 선택/해제할 수 있는 카드. role="checkbox" + aria-checked,
 * 클릭·Space·Enter로 토글. 선택 시 브랜드 컬러 border + 체크 인디케이터.
 * 여러 장 중 다중 선택 UI에 사용 — 단일 선택 라디오형이 필요하면
 * 그룹 쪽에서 하나만 selected가 되도록 관리할 것.
 * 스펙: root/components/web/ui/card.md
 *
 * @example
 * <SelectableCard label="베이직 플랜" selected={sel} onChange={setSel}>…</SelectableCard>
 */
export function SelectableCard({
  label,
  selected,
  onChange,
  disabled = false,
  variant = "default",
  padding = "m",
  className,
  children,
  ...rest
}: SelectableCardProps) {
  const toggle = () => {
    if (!disabled) onChange(!selected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-label={label}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      className={cnCard(
        CARD_BASE_CLASSES,
        CARD_VARIANT_CLASSES[variant],
        CARD_PADDING_CLASSES[padding],
        "relative transition-all duration-[var(--duration-fast,175ms)]",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : cnCard(
              "cursor-pointer",
              "hover:border-border-subtle hover:shadow-S",
              "focus-visible:outline-none focus-visible:border-border-brand"
            ),
        /* 선택 상태 — 브랜드 border (foundation 토큰) */
        selected && "!border-border-brand",
        className
      )}
      {...rest}
    >
      {/* 체크 인디케이터 — 우상단, 선택 시에만 표시 */}
      <span
        aria-hidden="true"
        className={cnCard(
          "absolute top-s right-s inline-flex items-center justify-center",
          "w-l h-l rounded-fai-circle transition-opacity duration-[var(--duration-fast,175ms)]",
          "bg-[var(--color-filled-optional-brand-primary)] text-[var(--color-text-optional-brand-primaryBtn)]",
          selected ? "opacity-100" : "opacity-0"
        )}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      {children}
    </div>
  );
}

export default SelectableCard;
