"use client";
import * as React from "react";

export type CheckboxState = boolean | "partial";

export type CheckboxProps = {
  checked?: CheckboxState;
  disabled?: boolean;
  error?: boolean;
  onChange?: (checked: boolean) => void;
  value?: string;
  name?: string;
};

export function Checkbox({ checked = false, disabled = false, error = false, onChange, value, name }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.checked);
  };

  let boxStyle = "flex w-[18px] h-[18px] shrink-0 justify-center items-center rounded-[var(--cornerRadius-XXS,4px)] transition-colors ";

  if (disabled) {
    boxStyle += "border-[1.2px] border-[var(--color-border-disabled,#F5F5F5)] bg-[var(--filled-inverse,#FFF)]";
  } else if (error) {
    boxStyle += "border-[1.2px] border-[var(--color-border-negative,#EA3B2A)] bg-[var(--filled-inverse,#FFF)]";
  } else if (checked === true || checked === "partial") {
    boxStyle += "bg-[var(--filled-primary,#2C2D30)]";
  } else {
    boxStyle += "border-[1.2px] border-[var(--border-secondary,#D2D3D5)] bg-[var(--filled-inverse,#FFF)]";
  }

  const maskIdCheck = React.useId();
  const maskIdPartial = React.useId();

  return (
    <div className="relative flex w-[24px] h-[24px] justify-center items-center">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked === true}
        disabled={disabled}
        onChange={handleChange}
        className="peer sr-only"
      />
      <span aria-hidden className={boxStyle}>
        {checked === true && (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <mask id={maskIdCheck} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="4" y="6" width="10" height="8">
              <path d="M5 9L8.5 12.5L13 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </mask>
            <g mask={`url(#${maskIdCheck})`}>
              <rect width="18" height="18" fill="white"/>
            </g>
          </svg>
        )}
        {checked === "partial" && (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <mask id={maskIdPartial} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="8" width="12" height="2">
              <path d="M4 9L14 9" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
            </mask>
            <g mask={`url(#${maskIdPartial})`}>
              <rect width="18" height="18" fill="white"/>
            </g>
          </svg>
        )}
      </span>
    </div>
  );
}
