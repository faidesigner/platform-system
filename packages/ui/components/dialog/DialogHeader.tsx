"use client";

import * as React from "react";

export interface DialogHeaderProps {
  /** 다이얼로그 제목 (필수) */
  title: string;
  /** 제목 아래 부제 */
  subtitle?: string;
  /** 제공 시 우측에 닫기(X) 버튼 렌더 */
  onOpenChange?: (isOpen: boolean) => void;
  /** 제목 앞 콘텐츠 (아이콘 등) */
  startContent?: React.ReactNode;
  /** 닫기 버튼 앞 콘텐츠 (액션 등) */
  endContent?: React.ReactNode;
  /** 하단 구분선 @default false */
  hasDivider?: boolean;
  className?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * Dialog 상단 헤더 — 제목/부제 + 선택적 닫기 버튼.
 * 스펙: root/components/web/ui/dialog.md
 *
 * @example
 * <DialogHeader title="프로필 편집" subtitle="변경 사항은 즉시 반영됩니다" onOpenChange={setOpen} />
 */
export function DialogHeader({
  title,
  subtitle,
  onOpenChange,
  startContent,
  endContent,
  hasDivider = false,
  className,
}: DialogHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-s pb-m",
        hasDivider && "border-b border-[var(--color-border-tertiary)] mb-m",
        className
      )}
    >
      {startContent != null && (
        <span className="flex items-center shrink-0">{startContent}</span>
      )}
      <div className="flex flex-1 min-w-0 flex-col">
        <h2 className="m-0 text-body font-semibold text-[var(--color-text-basic-primary)]">
          {title}
        </h2>
        {subtitle != null && (
          <p className="m-0 text-caption-m text-[var(--color-text-basic-secondary)]">
            {subtitle}
          </p>
        )}
      </div>
      {endContent != null && (
        <span className="flex items-center shrink-0">{endContent}</span>
      )}
      {onOpenChange != null && (
        <button
          type="button"
          aria-label="닫기"
          onClick={() => onOpenChange(false)}
          className={cn(
            "inline-flex shrink-0 items-center justify-center p-2xs rounded-fai-xs",
            "bg-transparent border-none cursor-pointer",
            "text-[var(--color-icon-basic-secondary)]",
            "hover:bg-[var(--color-filled-basic-primaryOp-secondary)] transition-colors"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default DialogHeader;
