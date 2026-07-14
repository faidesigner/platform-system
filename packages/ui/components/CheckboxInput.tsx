"use client";

import * as React from "react";
import { Checkbox, type CheckboxState } from "./Checkbox";

export interface CheckboxInputProps {
  /** 라벨 (필수 — 접근성). 시각적으로 숨기려면 labelHidden */
  label: string;
  /** 라벨을 시각적으로 숨김 (스크린리더에는 유지) @default false */
  labelHidden?: boolean;
  /** 라벨 아래 보조 설명 */
  description?: string;
  /** 체크 상태 — true / false / 'partial'(indeterminate) @default false */
  checked?: CheckboxState;
  /** 변경 콜백 */
  onChange?: (checked: boolean) => void;
  /** @default false */
  disabled?: boolean;
  /** 에러 상태 (border negative) @default false */
  error?: boolean;
  /** 폼 제출용 */
  name?: string;
  value?: string;
  className?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 체크박스 + 라벨 + 설명 단일 입력. 기존 Checkbox 프리미티브(18px 박스,
 * partial 지원)를 그대로 사용하며 라벨/설명 영역을 유연하게 배치한다.
 * 고정폭 폼 레이아웃이 필요하면 기존 CheckboxField 사용.
 * 여러 개를 목록으로 묶을 땐 CheckboxList 사용.
 * 스펙: root/components/web/ui/checkbox.md
 *
 * @example
 * <CheckboxInput label="이용약관 동의" checked={agreed} onChange={setAgreed} />
 * <CheckboxInput label="마케팅 수신" description="이벤트·혜택 소식을 받아요" checked={mkt} onChange={setMkt} />
 */
export function CheckboxInput({
  label,
  labelHidden = false,
  description,
  checked = false,
  onChange,
  disabled = false,
  error = false,
  name,
  value,
  className,
}: CheckboxInputProps) {
  return (
    <label
      className={cn(
        "inline-flex items-start gap-s",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        error={error}
        onChange={onChange}
        name={name}
        value={value}
      />
      <span
        className={cn(
          "flex flex-col justify-center min-h-[24px]",
          labelHidden && "sr-only"
        )}
      >
        <span
          className={cn(
            "text-body-s",
            disabled
              ? "text-[var(--color-text-basic-disabled)]"
              : "text-[var(--color-text-basic-primary)]"
          )}
        >
          {label}
        </span>
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
    </label>
  );
}

export default CheckboxInput;
