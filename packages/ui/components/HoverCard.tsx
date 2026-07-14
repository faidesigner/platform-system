"use client";

import * as React from "react";

export type HoverCardPlacement = "top" | "bottom";

export interface HoverCardProps {
  /** 트리거 요소 — hover/focus 시 카드가 열림 */
  children: React.ReactNode;
  /** 카드 내용 (미리보기, 프로필 등 리치 콘텐츠) */
  content: React.ReactNode;
  /** 카드 위치 @default 'bottom' */
  placement?: HoverCardPlacement;
  /** 열림 지연(ms) — 스치는 hover에 안 뜨도록 @default 300 */
  delay?: number;
  /** 닫힘 지연(ms) — 트리거→카드 이동 시간 확보 @default 200 */
  hideDelay?: number;
  /** 비활성화 시 카드가 열리지 않음 @default true */
  enabled?: boolean;
  /** 열림 상태 알림 (선택) */
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 트리거에 hover/focus 시 리치 콘텐츠 카드를 띄우는 컴포넌트.
 * 프로필 미리보기, 링크 미리보기 등 "누르기 전 훑어보기" 용도.
 * 표면은 overlay-rules.md Level 1, z-index는 --z-popover(300).
 * 카드 위로 마우스를 옮겨도 유지된다 (hideDelay).
 * 스펙: root/components/web/ui/hover-card.md
 *
 * ⚠️ 텍스트 한 줄 힌트면 HoverCard 대신 Tooltip(추후)을 사용할 것.
 *
 * @example
 * <HoverCard content={<UserProfilePreview id={user.id} />}>
 *   <a href={`/users/${user.id}`}>@{user.name}</a>
 * </HoverCard>
 */
export function HoverCard({
  children,
  content,
  placement = "bottom",
  delay = 300,
  hideDelay = 200,
  enabled = true,
  onOpenChange,
  className,
}: HoverCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = (next: boolean) => {
    setIsOpen(next);
    onOpenChange?.(next);
  };

  const scheduleOpen = () => {
    if (!enabled) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), delay);
  };

  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), hideDelay);
  };

  React.useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  /* Escape 닫기 */
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={scheduleClose}
    >
      {children}

      {isOpen && (
        <div
          role="dialog"
          className={cn(
            "absolute left-0 z-[var(--z-popover,300)] w-max max-w-[320px]",
            placement === "top" ? "bottom-full mb-2xs" : "top-full mt-2xs",
            /* overlay-rules Level 1 표면 */
            "rounded-fai-m border border-[var(--color-border-tertiary)]",
            "bg-[var(--color-bg-100)] shadow-M p-m"
          )}
        >
          {content}
        </div>
      )}
    </span>
  );
}

export default HoverCard;
