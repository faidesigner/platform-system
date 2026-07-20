"use client";
import * as React from "react";

export type LineInputProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  error?: boolean;
  helpText?: string;
  disabled?: boolean;
  maxLength?: number;
  onBlur?: () => void;
};

export const LineInput = React.forwardRef<HTMLDivElement, LineInputProps>(
  function LineInput(
    {
      label,
      placeholder,
      required = false,
      type = "text",
      value,
      onChange,
      name,
      error = false,
      helpText,
      disabled = false,
      maxLength,
      onBlur,
    },
    ref
  ) {
    return (
      <div ref={ref} className="flex flex-col py-[var(--padding-S,8px)] px-[var(--padding-none,0)] self-stretch w-full">

        {/* input item */}
        <div className="flex flex-col items-start gap-[var(--spacing-XS,6px)] self-stretch">

          {/* titleItem */}
          <div className="flex items-center gap-[var(--spacing-S,8px)]">
            <span
              className="text-[length:var(--font-size-18,18px)] font-medium leading-[1.5] text-[var(--color-text-basic-secondary,#3A3D40)]"
            >
              {label}
            </span>
            {required && (
              <span
                aria-hidden="true"
                className="shrink-0 text-[var(--color-text-basic-negative)] font-medium"
              >
                *
              </span>
            )}
          </div>

          {/* input field */}
          <div
            className={`flex flex-col items-start self-stretch py-[var(--padding-ms,12px)] px-[var(--padding-none,0)] border-b-[1.25px] transition-colors focus-within:border-[var(--color-border-brand,#39DB1F)] ${
              error
                ? "border-[var(--color-border-negative,#EA3B2A)]"
                : disabled
                  ? "border-border-disabled"
                  : "border-[var(--color-border-tertiary,#E4E6E7)]"
            }`}
          >
            <input
              name={name}
              type={type}
              value={value}
              required={required}
              disabled={disabled}
              maxLength={maxLength}
              placeholder={placeholder}
              aria-invalid={error || undefined}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              className="self-stretch w-full bg-transparent outline-none text-[length:var(--font-size-18,18px)] font-normal leading-[1.5] text-[var(--color-text-basic-primary,#1F2023)] placeholder:text-[var(--color-text-basic-fourth,#A1A5AA)] disabled:text-[var(--color-text-basic-disabled,#A1A5AA)] disabled:placeholder:text-[var(--color-text-basic-disabled,#A1A5AA)]"
            />
          </div>

        </div>

        {/* helpText item */}
        {error && helpText && (
          <div className="flex h-[18px] items-start self-stretch mt-[var(--spacing-2XS,4px)]">
            <span className="flex-1 text-[var(--color-text-basic-negative,#EA3B2A)] text-[length:var(--font-size-12,12px)] font-normal leading-[1.5]">
              {helpText}
            </span>
          </div>
        )}

      </div>
    );
  }
);
