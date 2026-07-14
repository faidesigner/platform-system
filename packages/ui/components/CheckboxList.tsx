"use client";

import * as React from "react";

/* ── Context — CheckboxListItem이 그룹 모드 감지에 사용 ── */

export interface CheckboxListContextValue {
  selectedValues: Set<string>;
  toggle: (value: string) => void;
  disabled: boolean;
  error: boolean;
}

export const CheckboxListContext =
  React.createContext<CheckboxListContextValue | null>(null);

export function useCheckboxList(): CheckboxListContextValue | null {
  return React.useContext(CheckboxListContext);
}

export interface CheckboxListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  /** CheckboxListItem들 (각자 value 필수) */
  children: React.ReactNode;
  /** 그룹 라벨 (필수 — 접근성) */
  label: string;
  /** 라벨을 시각적으로 숨김 @default false */
  labelHidden?: boolean;
  /** 그룹 아래 보조 설명 */
  description?: string;
  /** 선택된 값들 (제어형) */
  value?: string[];
  /** 선택 변경 콜백 */
  onChange?: (values: string[]) => void;
  /** 항목 사이 구분선 @default false */
  hasDividers?: boolean;
  /** 그룹 전체 비활성화 @default false */
  disabled?: boolean;
  /** 그룹 에러 상태 @default false */
  error?: boolean;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 다중 선택 체크박스 목록. value(string[])로 선택 상태를 관리하고
 * 자식 CheckboxListItem이 컨텍스트로 그룹을 자동 감지한다.
 * 스펙: root/components/web/ui/checkbox.md
 *
 * @example
 * <CheckboxList label="알림 설정" value={values} onChange={setValues}>
 *   <CheckboxListItem value="email" label="이메일" />
 *   <CheckboxListItem value="sms" label="문자" description="중요 알림만 발송" />
 * </CheckboxList>
 */
export function CheckboxList({
  children,
  label,
  labelHidden = false,
  description,
  value = [],
  onChange,
  hasDividers = false,
  disabled = false,
  error = false,
  className,
  ...rest
}: CheckboxListProps) {
  const selectedValues = React.useMemo(() => new Set(value), [value]);

  const toggle = React.useCallback(
    (itemValue: string) => {
      onChange?.(
        value.includes(itemValue)
          ? value.filter((v) => v !== itemValue)
          : [...value, itemValue]
      );
    },
    [value, onChange]
  );

  const contextValue = React.useMemo(
    () => ({ selectedValues, toggle, disabled, error }),
    [selectedValues, toggle, disabled, error]
  );

  const labelId = React.useId();

  return (
    <CheckboxListContext.Provider value={contextValue}>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-disabled={disabled || undefined}
        className={className}
        {...rest}
      >
        <span
          id={labelId}
          className={cn(
            "block text-body-s font-semibold text-[var(--color-text-basic-primary)]",
            labelHidden && "sr-only"
          )}
        >
          {label}
        </span>
        {description != null && !labelHidden && (
          <span className="block text-caption-m text-[var(--color-text-basic-tertiary)]">
            {description}
          </span>
        )}
        <ul
          className={cn(
            "list-none m-0 p-0",
            (!labelHidden || description != null) && "mt-2xs",
            hasDividers && "divide-y divide-[var(--color-border-tertiary)]"
          )}
        >
          {children}
        </ul>
      </div>
    </CheckboxListContext.Provider>
  );
}

export default CheckboxList;
