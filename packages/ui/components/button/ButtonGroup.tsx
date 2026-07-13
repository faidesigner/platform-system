"use client";

import * as React from "react";
import type { ButtonProps } from "./Button";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Button 자식들 (2~4개 권장) */
  children: React.ReactNode;
  /** 그룹 접근성 라벨 (aria-label, 필수) */
  label: string;
  /** 배치 방향 @default 'horizontal' */
  orientation?: ButtonGroupOrientation;
  /**
   * 그룹 기본 size — 자식 Button에 size가 없으면 이 값 적용.
   * 개별 Button의 size prop이 우선.
   * @default 'm'
   */
  size?: ButtonProps["size"];
  /** 그룹 기본 tone — 자식 Button에 tone이 없으면 이 값 적용 */
  tone?: ButtonProps["tone"];
  /** 바깥 모서리 radius — Button shape와 동일 규칙 @default 'square' */
  shape?: "square" | "round";
  /** 그룹 전체 비활성화 @default false */
  disabled?: boolean;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/* 연결 스타일 — 안쪽 모서리 제거 + 인접 border 겹침(-1px), 바깥 모서리만 radius */
const CONNECT_CLASSES: Record<
  ButtonGroupOrientation,
  Record<"square" | "round", string>
> = {
  horizontal: {
    square: cn(
      "[&>*]:!rounded-none",
      "[&>*:first-child]:!rounded-l-fai-s",
      "[&>*:last-child]:!rounded-r-fai-s",
      "[&>*:not(:first-child)]:-ml-px"
    ),
    round: cn(
      "[&>*]:!rounded-none",
      "[&>*:first-child]:!rounded-l-fai-circle",
      "[&>*:last-child]:!rounded-r-fai-circle",
      "[&>*:not(:first-child)]:-ml-px"
    ),
  },
  vertical: {
    square: cn(
      "[&>*]:!rounded-none",
      "[&>*:first-child]:!rounded-t-fai-s",
      "[&>*:last-child]:!rounded-b-fai-s",
      "[&>*:not(:first-child)]:-mt-px"
    ),
    round: cn(
      "[&>*]:!rounded-none",
      "[&>*:first-child]:!rounded-t-fai-circle",
      "[&>*:last-child]:!rounded-b-fai-circle",
      "[&>*:not(:first-child)]:-mt-px"
    ),
  },
};

/**
 * 관련 액션 버튼들을 하나의 연결된 단위로 묶는 그룹.
 * 안쪽 모서리는 제거되고 바깥 모서리에만 radius가 적용되며,
 * 인접한 border는 1px 겹쳐서 이중 테두리를 방지한다.
 *
 * - 방향키(가로: ←→ / 세로: ↑↓)와 Home/End로 버튼 간 포커스 이동
 * - 그룹 size/tone/disabled는 자식 Button의 기본값으로 주입 (개별 prop 우선)
 * - 스펙: root/components/web/ui/button-group.md
 *
 * @example
 * <ButtonGroup label="Actions" tone="secondary">
 *   <Button>Copy</Button>
 *   <Button>Cut</Button>
 *   <Button>Paste</Button>
 * </ButtonGroup>
 */
export function ButtonGroup({
  children,
  label,
  orientation = "horizontal",
  size,
  tone,
  shape = "square",
  disabled = false,
  className,
  onKeyDown,
  ...rest
}: ButtonGroupProps) {
  const groupRef = React.useRef<HTMLDivElement>(null);

  /* 방향키/Home/End 포커스 이동 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    if (![nextKey, prevKey, "Home", "End"].includes(e.key)) return;

    const root = groupRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]")
    );
    if (items.length === 0) return;

    const current = items.indexOf(document.activeElement as HTMLElement);
    let next = current;
    if (e.key === nextKey) next = (current + 1) % items.length;
    else if (e.key === prevKey)
      next = (current - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;

    if (next !== current) {
      e.preventDefault();
      items[next]?.focus();
    }
  };

  /* 그룹 기본값(size/tone/disabled)을 자식 Button에 주입 — 개별 prop 우선 */
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement<ButtonProps>(child)) return child;
    return React.cloneElement(child, {
      size: child.props.size ?? size,
      tone: child.props.tone ?? tone,
      disabled: disabled || child.props.disabled,
    });
  });

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-stretch",
        orientation === "vertical" && "flex-col",
        CONNECT_CLASSES[orientation][shape],
        className
      )}
      {...rest}
    >
      {items}
    </div>
  );
}

export default ButtonGroup;
