'use client';

import * as React from 'react';

interface SegCtx {
  value: string;
  onChange: (value: string) => void;
  fill: boolean;
}
const SegmentedContext = React.createContext<SegCtx | null>(null);

export interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  fill?: boolean;
  children: React.ReactNode;
}

export interface SegmentedControlItemProps {
  value: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  labelHidden?: boolean;
  disabled?: boolean;
}

export function SegmentedControl({
  value,
  onChange,
  ariaLabel,
  fill = false,
  children,
}: SegmentedControlProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={[
        'inline-flex gap-3xs rounded-fai-s bg-filled-basic-secondary p-3xs',
        fill ? 'flex w-full' : '',
      ].join(' ')}
    >
      <SegmentedContext.Provider value={{ value, onChange, fill }}>
        {children}
      </SegmentedContext.Provider>
    </div>
  );
}

export function SegmentedControlItem({
  value,
  label,
  icon,
  labelHidden = false,
  disabled = false,
}: SegmentedControlItemProps) {
  const ctx = React.useContext(SegmentedContext);
  if (!ctx) throw new Error('SegmentedControlItem must be used within SegmentedControl');
  const selected = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={labelHidden && typeof label === 'string' ? label : undefined}
      disabled={disabled}
      onClick={() => ctx.onChange(value)}
      className={[
        'flex items-center justify-center gap-2xs rounded-fai-xs px-m py-2xs text-body-s',
        ctx.fill ? 'flex-1' : '',
        selected
          ? 'bg-bg-100 font-medium shadow-XS'
          : 'hover:bg-interaction-light-black-hover',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      {!labelHidden && label}
    </button>
  );
}
