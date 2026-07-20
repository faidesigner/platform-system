"use client";

import * as React from "react";
import { DropdownMenuContext, type DropdownMenuSize } from "./DropdownMenu";

export interface DropdownMenuWithItemProps {
  /** 항목 라벨 (필수) */
  label: React.ReactNode;
  /** 라벨 앞 아이콘 */
  icon?: React.ReactNode;
  /** 라벨 아래 보조 설명 */
  description?: React.ReactNode;
  /** 우측 끝 콘텐츠 (단축키 힌트, Badge 등 — 읽기 전용) */
  endContent?: React.ReactNode;
  /** 클릭 액션 — 실행 후 메뉴 자동 닫힘 */
  onClick?: () => void;
  /** @default false */
  disabled?: boolean;
  className?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/* 메뉴 size별 항목 패딩 */
const ITEM_SIZE_CLASSES: Record<DropdownMenuSize, string> = {
  s: "py-2xs px-s",
  m: "py-s px-ms",
  l: "py-ms px-ms",
};

/**
 * DropdownMenu의 개별 액션 항목 (role="menuitem").
 * 클릭 또는 Enter/Space로 실행되고 메뉴가 닫힌다.
 * 패딩은 부모 DropdownMenu의 size(s/m/l)를 따른다.
 * 스펙: root/components/web/ui/dropdown-menu-with-item.md
 */
export function DropdownMenuWithItem({
  label,
  icon,
  description,
  endContent,
  onClick,
  disabled = false,
  className,
}: DropdownMenuWithItemProps) {
  const menu = React.useContext(DropdownMenuContext);

  const run = () => {
    if (disabled) return;
    onClick?.();
    menu?.close();
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={run}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          run();
        }
      }}
      className={cn(
        "flex items-center gap-s rounded-fai-s",
        ITEM_SIZE_CLASSES[menu?.size ?? "m"],
        "text-body-s outline-none",
        disabled
          ? "opacity-50 cursor-not-allowed text-[var(--color-text-basic-primary)]"
          : cn(
              "text-[var(--color-text-basic-primary)] cursor-pointer",
              "hover:bg-fill-faint focus-visible:bg-fill-faint",
              "transition-colors duration-[var(--duration-instant,150ms)]"
            ),
        className
      )}
    >
      {icon != null && (
        <span
          className={cn(
            "flex shrink-0 items-center",
            "text-[var(--color-icon-basic-secondary)]"
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex flex-1 min-w-0 flex-col">
        <span className="truncate">{label}</span>
        {description != null && (
          <span
            className={cn(
              "text-caption-m",
              "text-[var(--color-text-basic-tertiary)]"
            )}
          >
            {description}
          </span>
        )}
      </span>
      {endContent != null && (
        <span className="flex shrink-0 items-center text-caption-m text-[var(--color-text-basic-tertiary)]">
          {endContent}
        </span>
      )}
    </div>
  );
}

export default DropdownMenuWithItem;
