'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useId } from 'react';

export type SelectorStatus = 'default' | 'error' | 'warning' | 'success';

export interface SelectorOption {
  value: string;
  label: string;
  description?: string;
  section?: string;
  disabled?: boolean;
}

export interface SelectorProps {
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  options: readonly SelectorOption[];
  placeholder?: string;
  status?: SelectorStatus;
  helpText?: string;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const statusBorder: Record<SelectorStatus, string> = {
  default: 'border-border-secondary',
  error: 'border-border-negative',
  warning: 'border-border-warning',
  success: 'border-border-positive',
};

export function Selector({
  label,
  value,
  onChange,
  options,
  placeholder = '선택',
  status = 'default',
  helpText,
  clearable = false,
  disabled = false,
  required = false,
}: SelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const helpId = useId();

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* 섹션별 그룹핑 */
  const sections = new Map<string, SelectorOption[]>();
  for (const o of options) {
    const key = o.section ?? '';
    if (!sections.has(key)) sections.set(key, []);
    sections.get(key)!.push(o);
  }

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-xs">
      {label && (
        <span id={labelId} className="flex items-center gap-s text-body font-medium text-secondary">
          {label}
          {required && <span aria-hidden className="text-negative">*</span>}
        </span>
      )}

      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={helpText ? helpId : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex items-center justify-between gap-s rounded-fai-s border px-m py-xs text-left text-body',
          statusBorder[status],
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ].join(' ')}
      >
        <span className={selected ? '' : 'text-tertiary'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="flex items-center gap-2xs">
          {clearable && selected && (
            <span
              role="button"
              aria-label="선택 해제"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="text-secondary hover:text-primary"
            >
              ✕
            </span>
          )}
          <span aria-hidden className="text-secondary">▾</span>
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2xs max-h-[280px] overflow-auto rounded-fai-m border border-border-tertiary bg-bg-100 py-2xs shadow-M"
        >
          {[...sections.entries()].map(([section, opts]) => (
            <React.Fragment key={section || 'default'}>
              {section && (
                <li className="px-m py-3xs text-caption-s text-tertiary" role="presentation">
                  {section}
                </li>
              )}
              {opts.map((o) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => {
                    if (o.disabled) return;
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={[
                    'flex flex-col px-m py-xs text-body-s',
                    o.disabled
                      ? 'cursor-not-allowed opacity-40'
                      : 'cursor-pointer hover:bg-interaction-light-black-hover',
                    o.value === value ? 'font-medium' : '',
                  ].join(' ')}
                >
                  <span>{o.label}</span>
                  {o.description && <span className="text-caption-s text-secondary">{o.description}</span>}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}

      {helpText && (
        <span id={helpId} className={['text-body-s', status === 'error' ? 'text-negative' : 'text-secondary'].join(' ')}>
          {helpText}
        </span>
      )}
    </div>
  );
}
