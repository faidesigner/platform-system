'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useId, useMemo } from 'react';

export interface MultiSelectorOption {
  value: string;
  label: string;
  section?: string;
  disabled?: boolean;
}

export type MultiSelectorDisplay = 'count' | 'labels' | 'badges';

export interface MultiSelectorProps {
  label?: string;
  values: readonly string[];
  onChange: (values: string[]) => void;
  options: readonly MultiSelectorOption[];
  display?: MultiSelectorDisplay;
  searchable?: boolean;
  selectAll?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelector({
  label,
  values,
  onChange,
  options,
  display = 'count',
  searchable = false,
  selectAll = false,
  placeholder = '선택',
  disabled = false,
}: MultiSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

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

  const filtered = useMemo(
    () =>
      searchable && query
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options,
    [options, query, searchable],
  );

  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  };

  const allSelected = options.length > 0 && values.length === options.length;
  const toggleAll = () => onChange(allSelected ? [] : options.map((o) => o.value));

  const triggerText = () => {
    if (values.length === 0) return placeholder;
    if (display === 'labels' || display === 'badges') {
      return options.filter((o) => values.includes(o.value)).map((o) => o.label).join(', ');
    }
    return `${values.length}개 선택`;
  };

  const sections = new Map<string, MultiSelectorOption[]>();
  for (const o of filtered) {
    const key = o.section ?? '';
    if (!sections.has(key)) sections.set(key, []);
    sections.get(key)!.push(o);
  }

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-xs">
      {label && (
        <span id={labelId} className="text-body font-medium text-secondary">
          {label}
        </span>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex items-center justify-between gap-s rounded-fai-s border border-border-secondary px-m py-xs text-left text-body',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ].join(' ')}
      >
        {display === 'badges' && values.length > 0 ? (
          <span className="flex flex-wrap gap-2xs">
            {options
              .filter((o) => values.includes(o.value))
              .map((o) => (
                <span key={o.value} className="rounded-fai-xs bg-filled-basic-secondary px-2xs py-3xs text-caption-s">
                  {o.label}
                </span>
              ))}
          </span>
        ) : (
          <span className={values.length ? '' : 'text-tertiary'}>{triggerText()}</span>
        )}
        <span aria-hidden className="text-secondary">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 right-0 top-full z-30 mt-2xs max-h-[300px] overflow-auto rounded-fai-m border border-border-tertiary bg-bg-100 py-2xs shadow-M"
        >
          {searchable && (
            <div className="border-b border-border-tertiary px-m py-2xs">
              <input
                type="text"
                value={query}
                placeholder="검색"
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-body-s outline-none"
              />
            </div>
          )}
          {selectAll && (
            <label className="flex cursor-pointer items-center gap-s px-m py-xs text-body-s hover:bg-interaction-light-black-hover">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              전체 선택
            </label>
          )}
          {[...sections.entries()].map(([section, opts]) => (
            <React.Fragment key={section || 'default'}>
              {section && <div className="px-m py-3xs text-caption-s text-tertiary">{section}</div>}
              {opts.map((o) => (
                <label
                  key={o.value}
                  role="option"
                  aria-selected={values.includes(o.value)}
                  className={[
                    'flex items-center gap-s px-m py-xs text-body-s',
                    o.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-interaction-light-black-hover',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={values.includes(o.value)}
                    disabled={o.disabled}
                    onChange={() => toggle(o.value)}
                  />
                  {o.label}
                </label>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
