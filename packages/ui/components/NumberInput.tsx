'use client';

import * as React from 'react';

export type NumberInputStatus = 'default' | 'error' | 'warning' | 'success';

export interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  status?: NumberInputStatus;
  helpText?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

const statusBorder: Record<NumberInputStatus, string> = {
  default: 'border-border-secondary',
  error: 'border-border-negative',
  warning: 'border-border-warning',
  success: 'border-border-positive',
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      label,
      value,
      onChange,
      min,
      max,
      step = 1,
      unit,
      status = 'default',
      helpText,
      disabled = false,
      required = false,
      name,
    },
    ref,
  ) {
    const clamp = (n: number) => {
      let next = n;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      return next;
    };

    const atMin = min !== undefined && value <= min;
    const atMax = max !== undefined && value >= max;
    const helpId = React.useId();

    return (
      <div className="flex w-full flex-col py-s">
        <div className="flex flex-col items-start gap-xs">
          <div className="flex items-center gap-s">
            <span className="text-body font-medium text-secondary">{label}</span>
            {required && (
              <span aria-hidden className="shrink-0 font-medium text-negative">
                *
              </span>
            )}
          </div>

          <div
            className={[
              'flex items-center gap-2xs rounded-fai-s border px-m py-xs',
              statusBorder[status],
              disabled ? 'opacity-50' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <input
              ref={ref}
              type="number"
              name={name}
              value={value}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              aria-invalid={status === 'error'}
              aria-describedby={helpText ? helpId : undefined}
              onChange={(e) => onChange(clamp(Number(e.target.value)))}
              className="w-full bg-transparent text-body outline-none"
            />
            {unit && <span className="shrink-0 text-body-s text-secondary">{unit}</span>}
            <div className="flex flex-col">
              <button
                type="button"
                aria-label="증가"
                disabled={disabled || atMax}
                onClick={() => onChange(clamp(value + step))}
                className="flex h-m w-l items-center justify-center text-caption-s hover:bg-interaction-light-black-hover disabled:opacity-40"
              >
                ▲
              </button>
              <button
                type="button"
                aria-label="감소"
                disabled={disabled || atMin}
                onClick={() => onChange(clamp(value - step))}
                className="flex h-m w-l items-center justify-center text-caption-s hover:bg-interaction-light-black-hover disabled:opacity-40"
              >
                ▼
              </button>
            </div>
          </div>

          {helpText && (
            <span
              id={helpId}
              className={[
                'text-body-s',
                status === 'error' ? 'text-negative' : 'text-secondary',
              ].join(' ')}
            >
              {helpText}
            </span>
          )}
        </div>
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
