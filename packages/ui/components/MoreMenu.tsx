'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';

export interface MoreMenuItem {
  label: string;
  onSelect?: () => void;
  icon?: React.ReactNode;
  tone?: 'default' | 'danger';
  dividerBefore?: boolean;
  section?: string;
}

export interface MoreMenuProps {
  items: readonly MoreMenuItem[];
  /** @default 'bottom-end' */
  placement?: 'bottom-end' | 'bottom-start';
  /** @default '더보기' */
  ariaLabel?: string;
}

export function MoreMenu({
  items,
  placement = 'bottom-end',
  ariaLabel = '더보기',
}: MoreMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const menuAlign = placement === 'bottom-start' ? 'left-0' : 'right-0';

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-2xl w-2xl items-center justify-center rounded-fai-s text-secondary hover:bg-interaction-light-black-hover"
      >
        <span aria-hidden className="text-body">⋯</span>
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute ${menuAlign} z-20 mt-2xs min-w-[180px] rounded-fai-m border border-border-tertiary bg-bg-100 py-2xs shadow-M`}
        >
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {item.dividerBefore && (
                <div className="my-2xs border-t border-border-tertiary" />
              )}
              {item.section && (
                <div className="px-m py-3xs text-caption-s text-tertiary">{item.section}</div>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
                className={[
                  'flex w-full items-center gap-s px-m py-xs text-left text-body-s',
                  'hover:bg-interaction-light-black-hover',
                  item.tone === 'danger' ? 'text-negative' : 'text-primary',
                ].join(' ')}
              >
                {item.icon && <span className="flex shrink-0 items-center">{item.icon}</span>}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
