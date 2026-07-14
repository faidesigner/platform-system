"use client";

import * as React from "react";
import { Checkbox, type CheckboxState } from "./Checkbox";
import { useCheckboxList } from "./CheckboxList";

export interface CheckboxListItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onChange"> {
  /** 항목 라벨 (필수) */
  label: React.ReactNode;
  /** CheckboxList 그룹 모드 식별 값 */
  value?: string;
  /** 라벨 아래 보조 설명 */
  description?: string;
  /** 우측 끝 콘텐츠 (Badge, 카운트 등) */
  endContent?: React.ReactNode;
  /** 개별 비활성화 @default false */
  disabled?: boolean;
  /** 단독 모드 체크 상태 (그룹 안에서는 value 기준으로 그룹이 제어) */
  checked?: CheckboxState;
  /** 단독 모드 변경 콜백 */
  onCheck?: (checked: boolean) => void;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * CheckboxList의 개별 항목. 행 전체가 클릭 대상이며,
 * CheckboxList 안에서는 value 기준으로 선택이 그룹에 위임된다.
 * 단독으로도 checked/onCheck로 사용 가능.
 * 스펙: root/components/web/ui/checkbox.md
 *
 * @example
 * <CheckboxListItem value="sms" label="문자" description="중요 알림만" endContent={<Badge label="추천" />} />
 */
export function CheckboxListItem({
  label,
  value,
  description,
  endContent,
  disabled: disabledProp = false,
  checked: checkedProp,
  onCheck,
  className,
  ...rest
}: CheckboxListItemProps) {
  const group = useCheckboxList();

  const isGroupMode = group != null && value != null;
  const checked: CheckboxState = isGroupMode
    ? group.selectedValues.has(value)
    : (checkedProp ?? false);
  const disabled = (group?.disabled ?? false) || disabledProp;
  const error = group?.error ?? false;

  const handleChange = (next: boolean) => {
    if (disabled) return;
    if (isGroupMode) group.toggle(value);
    else onCheck?.(next);
  };

  return (
    <li className={cn("m-0", className)} {...rest}>
      <label
        className={cn(
          "flex items-start gap-s py-ms",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <Checkbox
          checked={checked}
          disabled={disabled}
          error={error}
          onChange={handleChange}
          value={value}
        />
        <span className="flex flex-col justify-center flex-1 min-w-0 min-h-[24px]">
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
        {endContent != null && (
          <span className="flex items-center shrink-0 self-center">
            {endContent}
          </span>
        )}
      </label>
    </li>
  );
}

export default CheckboxListItem;
