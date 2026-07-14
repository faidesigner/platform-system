"use client";

import * as React from "react";

/** @internal DateInput 계열 공용 필드 셸 (라벨/설명/에러 + 트리거 + 팝오버) */

export function cnDate(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

export interface DateFieldShellProps {
  label: string;
  labelHidden?: boolean;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  /** 팝오버 열림 상태 */
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** 트리거에 표시할 텍스트 (없으면 placeholder) */
  displayValue: string | null;
  placeholder: string;
  /** 클리어 버튼 — 값이 있을 때만 표시 */
  hasClear?: boolean;
  onClear?: () => void;
  /** 팝오버 내용 (Calendar 등) */
  children: React.ReactNode;
  className?: string;
}

const CalendarIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 2v4" /><path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
  </svg>
);

export function DateFieldShell({
  label,
  labelHidden = false,
  description,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  isOpen,
  onOpenChange,
  displayValue,
  placeholder,
  hasClear = false,
  onClear,
  children,
  className,
}: DateFieldShellProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const labelId = React.useId();

  /* 바깥 클릭 / Escape로 팝오버 닫기 */
  React.useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div ref={rootRef} className={cnDate("relative inline-flex flex-col", className)}>
      {/* 라벨 */}
      <span
        id={labelId}
        className={cnDate(
          "text-body-s font-medium text-[var(--color-text-basic-primary)] pb-2xs",
          labelHidden && "sr-only"
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-[var(--color-text-basic-negative)]">
            {" *"}
          </span>
        )}
      </span>

      {/* 트리거 */}
      <div className="flex items-center">
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-labelledby={labelId}
          onClick={() => onOpenChange(!isOpen)}
          className={cnDate(
            "flex items-center gap-s h-3xl px-ms min-w-[220px]",
            "rounded-fai-s border bg-[var(--color-bg-100)] text-body-s text-left",
            "transition-colors cursor-pointer",
            disabled
              ? "bg-fill-disabled text-[var(--color-text-basic-disabled)] border-border-disabled cursor-not-allowed"
              : error
                ? "border-[var(--color-border-negative)]"
                : isOpen
                  ? "border-border-brand"
                  : "border-border-secondary hover:border-border-primary"
          )}
        >
          <span
            className={cnDate(
              "shrink-0",
              disabled
                ? "text-[var(--color-icon-basic-disabled)]"
                : "text-[var(--color-icon-basic-secondary)]"
            )}
          >
            {CalendarIcon}
          </span>
          <span
            className={cnDate(
              "flex-1 min-w-0 truncate",
              displayValue == null && "text-[var(--color-text-basic-tertiary)]"
            )}
          >
            {displayValue ?? placeholder}
          </span>
          {hasClear && displayValue != null && !disabled && (
            <span
              role="button"
              aria-label="지우기"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear?.();
                }
              }}
              className="inline-flex shrink-0 items-center justify-center w-l h-l rounded-fai-circle text-[var(--color-icon-basic-tertiary)] hover:bg-fill-faint"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </span>
          )}
        </button>
      </div>

      {/* 설명 / 에러 */}
      {error && errorMessage != null ? (
        <span className="pt-2xs text-caption-m text-[var(--color-text-basic-negative)]">
          {errorMessage}
        </span>
      ) : description != null ? (
        <span className="pt-2xs text-caption-m text-[var(--color-text-basic-tertiary)]">
          {description}
        </span>
      ) : null}

      {/* 팝오버 */}
      {isOpen && !disabled && (
        <div
          role="dialog"
          aria-label={label}
          className={cnDate(
            "absolute top-full left-0 z-50 mt-2xs",
            "rounded-fai-m border border-border-tertiary bg-[var(--color-bg-100)] shadow-M"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
