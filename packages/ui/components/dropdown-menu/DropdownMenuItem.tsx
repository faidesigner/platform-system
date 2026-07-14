"use client";

import * as React from "react";
import { DropdownMenuContext } from "./DropdownMenu";

export interface DropdownMenuItemProps {
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

/**
 * DropdownMenu의 개별 액션 항목 (role="menuitem").
 * 클릭 또는 Enter/Space로 실행되고 메뉴가 닫힌다.
 * 스펙: root/components/web/ui/dropdown-menu.md
 */
export function DropdownMenuItem({
  label,
  icon,
  description,
  endContent,
  onClick,
  disabled = false,
  className,
}: DropdownMenuItemProps) {
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
        "flex items-center gap-s px-ms py-s rounded-fai-s",
        "text-body-s outline-none",
        disabled
          ? "text-[var(--color-text-basic-disabled)] cursor-not-allowed"
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
            disabled
              ? "text-[var(--color-icon-basic-disabled)]"
              : "text-[var(--color-icon-basic-secondary)]"
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
              disabled
                ? "text-[var(--color-text-basic-disabled)]"
                : "text-[var(--color-text-basic-tertiary)]"
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

export default DropdownMenuItem;
