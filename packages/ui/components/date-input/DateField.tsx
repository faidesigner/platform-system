"use client";

import * as React from "react";
import { useField } from "../field/Field";

/**
 * @internal DateInput 계열 공용 트리거 + 팝오버 (셸 없음 — Field 방식 통일)
 * 라벨/설명/에러 텍스트는 Field가 담당하고, 여기는 박스와 팝오버만 그린다.
 * 트리거 시각은 input-button.md 규칙을 따른다 (에러 2px, pressed 오버레이).
 */

export function cnDate(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

export interface DateFieldShellProps {
  /** 단독 사용 시 접근성 라벨 (Field 안에서는 생략 — htmlFor 연결) */
  label?: string;
  disabled?: boolean;
  error?: boolean;
  /** 팝오버 열림 상태 */
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** 트리거에 표시할 텍스트 (없으면 placeholder) */
  displayValue: string | null;
  placeholder: string;
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
  disabled: disabledProp,
  error: errorProp,
  isOpen,
  onOpenChange,
  displayValue,
  placeholder,
  hasClear = false,
  onClear,
  children,
  className,
}: DateFieldShellProps) {
  const field = useField();
  const disabled = disabledProp || (field?.disabled ?? false);
  const error = errorProp || (field?.error ?? false);

  const rootRef = React.useRef<HTMLDivElement>(null);

  /* 바깥 클릭 / Escape로 팝오버 닫기 (overlay-rules Level 1) */
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
    <div ref={rootRef} className={cnDate("relative inline-flex", className)}>
      {/* 트리거 — input-button.md 시각 규칙 */}
      <button
        type="button"
        id={field?.inputId}
        aria-describedby={field?.describedById}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={field == null ? label : undefined}
        onClick={() => onOpenChange(!isOpen)}
        className={cnDate(
          "flex items-center gap-s h-3xl px-ms min-w-[220px] w-full",
          "rounded-fai-s text-body-s text-left border",
          "transition-colors duration-[var(--duration-instant,150ms)]",
          disabled
            ? "bg-fill-disabled text-[var(--color-text-basic-disabled)] border-border-disabled cursor-not-allowed"
            : error
              ? // 폼 에러 스트로크 2px 통일 (1px border + 1px inset shadow — 무밀림)
                "bg-[var(--color-bg-100)] border-[var(--color-border-negative)] shadow-[inset_0_0_0_1px_var(--color-border-negative)] cursor-pointer"
              : isOpen
                ? "bg-[var(--color-bg-100)] border-border-brand cursor-pointer"
                : cnDate(
                    "bg-[var(--color-bg-100)] border-border-secondary cursor-pointer",
                    "hover:border-border-primary",
                    "active:[background-image:linear-gradient(0deg,var(--color-interaction-light-black-pressed),var(--color-interaction-light-black-pressed))]"
                  )
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

      {/* 팝오버 — overlay-rules Level 1 */}
      {isOpen && !disabled && (
        <div
          role="dialog"
          aria-label={label ?? "날짜 선택"}
          className={cnDate(
            "absolute top-full left-0 z-[var(--z-popover,300)] mt-2xs",
            "rounded-fai-m border border-border-tertiary bg-[var(--color-bg-100)] shadow-M"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
