"use client";

import * as React from "react";
import { useCollapsible } from "./useCollapsible";

export interface CollapsibleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 항상 보이는 트리거 영역 콘텐츠 (제목 등) */
  trigger: React.ReactNode;
  /** 접히는 콘텐츠 */
  children?: React.ReactNode;
  /** 비제어 모드 초기 열림 상태 @default false */
  defaultIsOpen?: boolean;
  /** 제어 모드 열림 상태 */
  isOpen?: boolean;
  /** 열림 상태 변경 콜백 */
  onOpenChange?: (isOpen: boolean) => void;
  /** CollapsibleGroup 안에서의 식별 값 (그룹 모드 필수) */
  value?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 트리거 클릭으로 콘텐츠를 접고 펼치는 컴포넌트.
 * 트리거는 aria-expanded + 셰브론 인디케이터가 있는 전체 폭 버튼으로 렌더.
 * 단독(비제어/제어) 또는 CollapsibleGroup 안에서 value로 사용.
 * 상태 로직은 useCollapsible 훅과 공유 — 커스텀 UI가 필요하면 훅 직접 사용.
 * 스펙: root/components/web/ui/collapsible.md
 *
 * @example
 * <Collapsible trigger="자주 묻는 질문">
 *   <p>답변 내용…</p>
 * </Collapsible>
 */
export function Collapsible({
  trigger,
  children,
  defaultIsOpen = false,
  isOpen: isOpenProp,
  onOpenChange,
  value,
  className,
  ...rest
}: CollapsibleProps) {
  const { isOpen, toggle } = useCollapsible({
    isCollapsible: {
      defaultIsOpen,
      isOpen: isOpenProp,
      onOpenChange,
    },
    value,
  });

  const contentId = React.useId();

  return (
    <div className={className} {...rest}>
      {/* 트리거 — 전체 폭 버튼 */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggle}
        className={cn(
          "flex w-full items-center justify-between gap-s py-ms",
          "bg-transparent border-none cursor-pointer text-left",
          "text-body-s font-semibold text-[var(--color-text-basic-primary)]",
          "hover:text-[var(--color-text-basic-secondary)] transition-colors"
        )}
      >
        <span className="flex-1 min-w-0">{trigger}</span>
        {/* 셰브론 — 열림 시 180° 회전 */}
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex shrink-0 items-center text-[var(--color-icon-basic-secondary)]",
            "transition-transform duration-[var(--duration-fast,175ms)]",
            isOpen && "rotate-180"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* 콘텐츠 */}
      {isOpen && (
        <div
          id={contentId}
          className="pb-ms text-body-s text-[var(--color-text-basic-secondary)]"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Collapsible;
