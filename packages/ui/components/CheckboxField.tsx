"use client";
import * as React from "react";
import { Checkbox, type CheckboxState } from "./Checkbox";

export type CheckboxFieldProps = {
  label: string;
  checked?: CheckboxState;
  disabled?: boolean;
  error?: boolean;
  onChange?: (checked: boolean) => void;
  value?: string;
  name?: string;
};

export function CheckboxField({ label, checked, disabled, error, onChange, value, name }: CheckboxFieldProps) {
  return (
    <label className="inline-flex flex-col justify-center items-center cursor-pointer">
      <div className="flex w-[360px] max-w-[360px] py-[var(--padding-MS,12px)] px-[var(--padding-none,0)] items-center gap-[var(--padding-S,8px)]">

        {/* 분리된 Checkbox 컴포넌트 마운트 */}
        <Checkbox
          checked={checked}
          disabled={disabled}
          error={error}
          onChange={onChange}
          value={value}
          name={name}
        />

        {/* 텍스트 라벨 영역 */}
        <span className="flex flex-col justify-center w-[300px] h-[24px] text-secondary text-[length:var(--font-size-16,16px)] font-normal leading-[1.5]">
          {label}
        </span>

      </div>
    </label>
  );
}
