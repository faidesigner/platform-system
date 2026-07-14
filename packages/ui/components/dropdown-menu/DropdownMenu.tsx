"use client";

import * as React from "react";

/* ── Context — 항목 클릭 시 메뉴 닫기 ── */
export type DropdownMenuSize = "s" | "m" | "l";

export const DropdownMenuContext = React.createContext<{
  close: () => void;
  size: DropdownMenuSize;
} | null>(null);

export type DropdownMenuPlacement = "bottom-start" | "bottom-end";

export interface DropdownMenuProps {
  /**
   * 트리거 렌더 함수 — 기존 Dropdown과 동일 컨벤션.
   * aria 속성은 내부에서 트리거 래퍼에 부여된다.
   */
  trigger: (open: boolean, toggle: () => void) => React.ReactNode;
  /** 메뉴 접근성 라벨 (필수) */
  label: string;
  /** DropdownMenuWithItem / Divider 목록 */
  children: React.ReactNode;
  /** 패널 정렬 @default 'bottom-start' */
  placement?: DropdownMenuPlacement;
  /** 항목 밀도 — 항목 패딩에 반영 @default 'm' */
  size?: DropdownMenuSize;
  /** 열림 상태 변경 알림 (선택) */
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 컨텍스트 액션 메뉴 — "더보기 ⋯", 테이블 행 액션, 카드 액션.
 * 항목은 onClick 액션이며 클릭 시 메뉴가 닫힌다.
 *
 * ⚠️ 역할 구분 (기존 Dropdown과의 충돌 방지 규칙):
 * - 링크(href) 이동 목록·내비게이션·메가 메뉴 → 기존 Dropdown 사용
 * - 현재 컨텍스트에 대한 액션(onClick) 목록 → DropdownMenu(이 컴포넌트)
 *
 * 표면은 overlay-rules.md Level 1, z-index는 --z-dropdown(200).
 * 키보드: ↑↓ 항목 이동(순환), Escape 닫기, 바깥 클릭 닫기.
 * 스펙: root/components/web/ui/dropdown-menu.md
 *
 * @example
 * <DropdownMenu label="게시글 액션" trigger={(open, toggle) => (
 *   <IconButton icon="more" label="더보기" onClick={toggle} />
 * )}>
 *   <DropdownMenuWithItem label="수정" onClick={onEdit} />
 *   <DropdownMenuWithItem label="복제" onClick={onDuplicate} />
 *   <Divider />
 *   <DropdownMenuWithItem label="삭제" onClick={onDelete} />
 * </DropdownMenu>
 */
export function DropdownMenu({
  trigger,
  label,
  children,
  placement = "bottom-start",
  size = "m",
  onOpenChange,
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      setIsOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  /* 바깥 클릭 / Escape 닫기 (overlay-rules Level 1) */
  React.useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  /* 열리면 첫 항목 포커스 */
  React.useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      menuRef.current
        ?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
        ?.focus();
    });
  }, [isOpen]);

  /* ↑↓ 항목 순환 이동 */
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])'
      ) ?? []
    );
    if (items.length === 0) return;
    e.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "ArrowDown"
        ? (current + 1) % items.length
        : (current - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const ctx = React.useMemo(() => ({ close, size }), [close, size]);

  return (
    <DropdownMenuContext.Provider value={ctx}>
      <div ref={rootRef} className={cn("relative inline-block", className)}>
        <span aria-haspopup="menu" aria-expanded={isOpen}>
          {trigger(isOpen, toggle)}
        </span>

        {isOpen && (
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            onKeyDown={handleMenuKeyDown}
            className={cn(
              "absolute top-full mt-2xs z-[var(--z-dropdown,200)] min-w-[200px]",
              placement === "bottom-end" ? "right-0" : "left-0",
              /* overlay-rules Level 1 표면 */
              "rounded-fai-m border border-[var(--color-border-tertiary)]",
              "bg-[var(--color-bg-100)] shadow-M p-s"
            )}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export default DropdownMenu;
