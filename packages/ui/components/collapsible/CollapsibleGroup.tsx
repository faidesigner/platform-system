"use client";

import * as React from "react";
import { CollapsibleGroupContext } from "./CollapsibleGroupContext";

export interface CollapsibleGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  /** Collapsible 자식들 (각자 value 필수) */
  children: React.ReactNode;
  /**
   * 열림 모드 — single: 하나 열면 나머지 닫힘 (아코디언), multiple: 자유
   * @default 'single'
   */
  type?: "single" | "multiple";
  /** 비제어 초기 열림 값 — single이면 string, multiple이면 string[] */
  defaultValue?: string | string[];
  /** 제어 모드 열림 값 */
  value?: string | string[];
  /** 열림 값 변경 콜백 */
  onChange?: (value: string | string[]) => void;
  /** 항목 사이 구분선 @default true */
  hasDividers?: boolean;
}

function toSet(v: string | string[] | undefined): Set<string> {
  if (v == null) return new Set();
  return new Set(Array.isArray(v) ? v : [v]);
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * Collapsible들의 열림 상태를 관리하는 그룹 (아코디언).
 * single 모드(기본)는 하나를 열면 나머지가 닫히고, 열린 항목 재클릭 시 닫힘.
 * multiple 모드는 여러 개를 동시에 열 수 있다.
 * 스펙: root/components/web/ui/collapsible.md
 *
 * @example
 * <CollapsibleGroup defaultValue="faq-1">
 *   <Collapsible value="faq-1" trigger="배송은 얼마나 걸리나요?">…</Collapsible>
 *   <Collapsible value="faq-2" trigger="교환/환불 규정은?">…</Collapsible>
 * </CollapsibleGroup>
 */
export function CollapsibleGroup({
  children,
  type = "single",
  defaultValue,
  value: valueProp,
  onChange,
  hasDividers = true,
  className,
  ...rest
}: CollapsibleGroupProps) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState<Set<string>>(() =>
    toSet(defaultValue)
  );

  const openValues = isControlled ? toSet(valueProp) : internalValue;

  const toggle = React.useCallback(
    (itemValue: string) => {
      const next = new Set(openValues);
      if (next.has(itemValue)) {
        next.delete(itemValue);
      } else {
        if (type === "single") next.clear();
        next.add(itemValue);
      }
      if (!isControlled) setInternalValue(next);
      onChange?.(
        type === "single" ? (Array.from(next)[0] ?? "") : Array.from(next)
      );
    },
    [openValues, type, isControlled, onChange]
  );

  const contextValue = React.useMemo(
    () => ({ openValues, toggle }),
    [openValues, toggle]
  );

  return (
    <CollapsibleGroupContext.Provider value={contextValue}>
      <div
        className={cn(
          hasDividers &&
            "[&>*+*]:border-t [&>*+*]:border-[var(--color-border-tertiary)]",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </CollapsibleGroupContext.Provider>
  );
}

export default CollapsibleGroup;
