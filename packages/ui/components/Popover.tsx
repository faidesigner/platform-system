'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useId } from 'react';

export type PopoverPlacement =
  | 'bottom'
  | 'top'
  | 'left'
  | 'right'
  | 'bottom-start'
  | 'bottom-end';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: PopoverPlacement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCloseButton?: boolean;
}

const placementClass: Record<PopoverPlacement, string> = {
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2xs',
  'bottom-start': 'top-full left-0 mt-2xs',
  'bottom-end': 'top-full right-0 mt-2xs',
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2xs',
  left: 'right-full top-0 mr-2xs',
  right: 'left-full top-0 ml-2xs',
};

export function Popover({
  trigger,
  children,
  placement = 'bottom',
  open: controlledOpen,
  onOpenChange,
  showCloseButton = false,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <span
        onClick={() => setOpen(!open)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        {trigger}
      </span>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          tabIndex={-1}
          className={`absolute z-30 min-w-[220px] rounded-fai-m border border-border-tertiary bg-bg-100 p-m shadow-M outline-none ${placementClass[placement]}`}
        >
          {showCloseButton && (
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className="absolute right-2xs top-2xs flex h-l w-l items-center justify-center rounded-fai-s text-secondary hover:bg-interaction-light-black-hover"
            >
              ✕
            </button>
          )}
          <div className="flex flex-col gap-s">{children}</div>
        </div>
      )}
    </div>
  );
}
