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
};

export function LineInput({
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
}: LineInputProps) {
  const borderClass = error
    ? "border-border-error"
    : disabled
      ? "border-border-disabled"
      : "border-border-faint focus-within:border-border-brand";

  return (
    <div className="flex w-full flex-col py-s self-stretch">
      <div className="flex w-full flex-col gap-[10px] self-stretch">

        {/* titleItem */}
        <div className="flex items-center gap-s">
          <span className="text-body-l font-medium leading-[1.5] text-secondary">
            {label}
          </span>
          {required && (
            <span aria-hidden className="size-s shrink-0 rounded-fai-circle bg-brand" />
          )}
        </div>

        {/* input field */}
        <div className={`flex w-full flex-col items-start py-ms border-b-[1.25px] ${borderClass}`}>
          <input
            name={name}
            type={type}
            value={value}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={error || undefined}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[27px] bg-transparent text-body-l font-normal leading-[1.5] text-primary
              outline-none placeholder:text-quaternary
              disabled:text-disabled disabled:placeholder:text-disabled"
          />
        </div>

        {error && helpText && (
          <p className="px-2.5 text-caption-m font-normal leading-[1.5] text-error">
            {helpText}
          </p>
        )}

      </div>
    </div>
  );
}
