"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export type DialogSize = "s" | "m" | "l" | "xl";

export interface DialogProps {
  /** 열림 상태 (제어형, 필수) */
  isOpen: boolean;
  /** 닫힘 요청 콜백 (스크림 클릭, Escape, 닫기 버튼) */
  onOpenChange: (isOpen: boolean) => void;
  /**
   * 다이얼로그 폭 — overlay-rules.md Level 2 (디자이너 확정)
   * s=400~480 / m=560~640 / l=720~800 / xl=960
   * @default 'm'
   */
  size?: DialogSize;
  /** 스크림 클릭·Escape로 닫기 허용 @default true (AlertDialog는 false 고정) */
  dismissable?: boolean;
  /** 접근성 라벨 — DialogHeader title이 없을 때 필수 */
  label?: string;
  /** role — AlertDialog는 'alertdialog' @default 'dialog' */
  role?: "dialog" | "alertdialog";
  children: React.ReactNode;
  className?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/* 폭 규칙(디자이너 확정): min~max 범위 — 모바일에서도 min-width 유지 */
const SIZE_CLASSES: Record<DialogSize, string> = {
  s: "min-w-[400px] max-w-[480px]",
  m: "min-w-[560px] max-w-[640px]",
  l: "min-w-[720px] max-w-[800px]",
  xl: "max-w-[960px]",
};

const FOCUSABLE =
  'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * 화면을 차단하는 모달 다이얼로그 (overlay-rules.md Level 2).
 * 스크림(bg.scrim) + 중앙 패널, 배경 스크롤 잠금, 포커스 트랩,
 * 닫히면 트리거로 포커스 복귀.
 * 선언적 사용이 번거로우면 useImperativeDialog 훅 사용.
 * 스펙: root/components/web/ui/dialog.md
 *
 * @example
 * <Dialog isOpen={open} onOpenChange={setOpen}>
 *   <DialogHeader title="설정" onOpenChange={setOpen} />
 *   <p>내용…</p>
 * </Dialog>
 */
export function Dialog({
  isOpen,
  onOpenChange,
  size = "m",
  dismissable = true,
  label,
  role = "dialog",
  children,
  className,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  /* SSR/hydration 안전장치 — 마운트 후에만 포털 렌더 (서버·클라 첫 렌더 일치) */
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  /* 배경 스크롤 잠금 + 포커스 이동/복귀 */
  React.useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 패널 안 첫 포커스 가능 요소(없으면 패널 자체)로
    requestAnimationFrame(() => {
      const first =
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
        panelRef.current;
      first?.focus();
    });
    return () => {
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  /* Escape + Tab 포커스 트랩 */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && dismissable) {
      e.stopPropagation();
      onOpenChange(false);
      return;
    }
    if (e.key !== "Tab") return;
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!mounted || !isOpen) return null;

  /* 포털로 body 직속 렌더 — 조상의 transform/overflow와 무관하게 항상 최상위 */
  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-dialog,600)] flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      {/* 스크림 — 기존 bg.scrim 토큰 */}
      <div
        aria-hidden="true"
        onClick={dismissable ? () => onOpenChange(false) : undefined}
        className="absolute inset-0 bg-[var(--color-bg-scrim)]"
      />
      {/* 패널 */}
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "relative w-full mx-l max-h-[85vh] overflow-y-auto",
          SIZE_CLASSES[size],
          "rounded-fai-m bg-[var(--color-bg-100)] shadow-XL p-xl",
          "outline-none",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Dialog;
