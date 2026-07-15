'use client';

import * as React from 'react';

interface RadioContextValue {
  value: string;
  name: string;
  onChange: (value: string) => void;
}
const RadioContext = React.createContext<RadioContextValue | null>(null);

export type RadioOrientation = 'vertical' | 'horizontal';

export interface RadioListProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  orientation?: RadioOrientation;
  error?: string;
  children: React.ReactNode;
}

export interface RadioListItemProps {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  endContent?: React.ReactNode;
  disabled?: boolean;
}

export function RadioList({
  value,
  onChange,
  name,
  label,
  description,
  orientation = 'vertical',
  error,
  children,
}: RadioListProps) {
  const labelId = React.useId();
  return (
    <div role="radiogroup" aria-labelledby={label ? labelId : undefined} className="flex flex-col gap-2xs">
      {label && (
        <div id={labelId} className="text-body font-medium">
          {label}
        </div>
      )}
      {description && <div className="text-body-s text-secondary">{description}</div>}
      <div
        className={[
          'flex gap-2xs',
          orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
        ].join(' ')}
      >
        <RadioContext.Provider value={{ value, name, onChange }}>{children}</RadioContext.Provider>
      </div>
      {error && <div className="text-body-s text-negative">{error}</div>}
    </div>
  );
}

export function RadioListItem({
  value,
  label,
  description,
  endContent,
  disabled = false,
}: RadioListItemProps) {
  const ctx = React.useContext(RadioContext);
  if (!ctx) throw new Error('RadioListItem must be used within RadioList');
  const checked = ctx.value === value;

  return (
    <label
      className={[
        'flex items-start gap-s rounded-fai-s px-m py-s',
        disabled ? 'opacity-50' : 'cursor-pointer hover:bg-interaction-light-black-hover',
      ].join(' ')}
    >
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => ctx.onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={[
          'mt-3xs flex h-l w-l shrink-0 items-center justify-center rounded-fai-circle border-2',
          checked ? 'border-border-brand-primary' : 'border-border-secondary',
        ].join(' ')}
      >
        {checked && <span className="h-2xs w-2xs rounded-fai-circle bg-filled-optional-brand-primary" />}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-body">{label}</span>
        {description && <span className="text-body-s text-secondary">{description}</span>}
      </span>
      {endContent && <span className="ml-auto shrink-0">{endContent}</span>}
    </label>
  );
}
