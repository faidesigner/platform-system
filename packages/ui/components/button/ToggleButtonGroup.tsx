"use client";

import * as React from "react";
import type { ButtonProps } from "./Button";

/* ── Context (ToggleButton이 그룹 모드 감지에 사용) ── */

export interface ToggleButtonGroupContextValue {
  selectedValues: Set<string>;
  toggle: (value: string) => void;
  size?: ButtonProps["size"];
  disabled?: boolean;
}

export const ToggleButtonGroupContext =
  React.createContext<ToggleButtonGroupContextValue | null>(null);

export function useToggleButtonGroup(): ToggleButtonGroupContextValue | null {
  return React.useContext(ToggleButtonGroupContext);
}

/* ── Props — single / multiple 판별 유니언 ── */

interface ToggleButtonGroupBaseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  /** ToggleButton 자식들 (각자 value 필수) */
  children: React.ReactNode;
  /** 그룹 접근성 라벨 (aria-label, 필수) */
  label: string;
  /** 배치 방향 @default 'horizontal' */
  orientation?: "horizontal" | "vertical";
  /** 그룹 기본 size — 개별 ToggleButton이 우선 */
  size?: ButtonProps["size"];
  /** 그룹 전체 비활성화 @default false */
  disabled?: boolean;
}

export interface ToggleButtonGroupSingleProps
  extends ToggleButtonGroupBaseProps {
  /** 단일 선택 — 활성 항목 재클릭 시 해제(null) @default 'single' */
  type?: "single";
  value: string | null;
  onChange: (value: string | null) => void;
}

export interface ToggleButtonGroupMultipleProps
  extends ToggleButtonGroupBaseProps {
  /** 다중 선택 */
  type: "multiple";
  value: string[];
  onChange: (value: string[]) => void;
}

export type ToggleButtonGroupProps =
  | ToggleButtonGroupSingleProps
  | ToggleButtonGroupMultipleProps;

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * ToggleButton들의 선택 상태를 관리하는 그룹.
 * single(단일 선택, 재클릭 해제) / multiple(다중 선택) 두 모드.
 * ButtonGroup과 달리 연결형이 아니라 gap으로 분리된 배치.
 * 스펙: root/components/web/ui/toggle-button.md
 *
 * @example
 * // 단일 선택 (뷰 모드 전환)
 * <ToggleButtonGroup label="보기 모드" value={view} onChange={setView}>
 *   <ToggleButton value="list" label="리스트" />
 *   <ToggleButton value="grid" label="그리드" />
 * </ToggleButtonGroup>
 *
 * // 다중 선택 (서식 토글)
 * <ToggleButtonGroup type="multiple" label="서식" value={formats} onChange={setFormats}>
 *   <ToggleButton value="bold" label="굵게" />
 *   <ToggleButton value="italic" label="기울임" />
 * </ToggleButtonGroup>
 */
export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  const {
    children,
    label,
    orientation = "horizontal",
    size,
    disabled = false,
    className,
    ...rest
  } = props;
  const isMultiple = props.type === "multiple";

  const selectedValues = React.useMemo(() => {
    if (isMultiple) return new Set(props.value as string[]);
    const single = props.value as string | null;
    return single != null ? new Set([single]) : new Set<string>();
  }, [isMultiple, props.value]);

  const toggle = React.useCallback(
    (itemValue: string) => {
      if (isMultiple) {
        const current = props.value as string[];
        const onChange = props.onChange as (v: string[]) => void;
        onChange(
          current.includes(itemValue)
            ? current.filter((v) => v !== itemValue)
            : [...current, itemValue]
        );
      } else {
        const current = props.value as string | null;
        const onChange = props.onChange as (v: string | null) => void;
        // 활성 항목 재클릭 → 해제
        onChange(current === itemValue ? null : itemValue);
      }
    },
    [isMultiple, props.value, props.onChange]
  );

  const contextValue = React.useMemo(
    () => ({ selectedValues, toggle, size, disabled }),
    [selectedValues, toggle, size, disabled]
  );

  // div rest에서 union 판별용 prop 제거
  const { type: _t, value: _v, onChange: _o, ...divRest } = rest as Record<
    string,
    unknown
  >;

  return (
    <ToggleButtonGroupContext.Provider value={contextValue}>
      <div
        role="group"
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={cn(
          "inline-flex items-center gap-2xs",
          orientation === "vertical" && "flex-col items-stretch",
          className
        )}
        {...(divRest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    </ToggleButtonGroupContext.Provider>
  );
}

export default ToggleButtonGroup;
