'use client';

import * as React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerShade = 'default' | 'onMedia' | 'subtle' | 'inherit';

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Spinner size. @default 'md' */
  size?: SpinnerSize;
  /** Color treatment for the surrounding surface. @default 'default' */
  shade?: SpinnerShade;
  /** Visible content displayed below the spinner. */
  label?: React.ReactNode;
}

const sizeClass: Record<SpinnerSize, string> = {
  sm: 'size-m',
  md: 'size-l',
  lg: 'size-xl',
};

const strokeWidth: Record<SpinnerSize, number> = {
  sm: 2,
  md: 3,
  lg: 3,
};

const shadeClass: Record<
  SpinnerShade,
  { active: string; track: string }
> = {
  default: { active: 'text-brand-text', track: 'text-quaternary' },
  onMedia: { active: 'text-inverse', track: 'text-inverse-subtle' },
  subtle: { active: 'text-secondary', track: 'text-quaternary' },
  inherit: { active: 'text-inherit', track: 'text-inherit opacity-30' },
};

export function Spinner({
  size = 'md',
  shade = 'default',
  label,
  className = '',
  'aria-label': ariaLabel,
  ...restProps
}: SpinnerProps) {
  const resolvedAriaLabel =
    ariaLabel ?? (typeof label === 'string' ? label : undefined) ?? 'Loading';
  const colors = shadeClass[shade];

  return (
    <span
      {...restProps}
      role="status"
      aria-live="polite"
      aria-label={resolvedAriaLabel}
      data-size={size}
      data-shade={shade}
      className={[
        'inline-flex flex-col items-center gap-s align-middle',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <style>{`
        @keyframes fai-spinner-rotation {
          to { transform: rotate(360deg); }
        }
        .fai-spinner-ring {
          animation: fai-spinner-rotation var(--duration-slow-min) linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .fai-spinner-ring { animation-duration: var(--duration-slow-max); }
        }
      `}</style>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`fai-spinner-ring shrink-0 ${sizeClass[size]}`}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          className={colors.track}
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          pathLength="100"
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          strokeDasharray="75 25"
          strokeLinecap="round"
          className={colors.active}
        />
      </svg>
      {label != null && (
        <span aria-hidden="true" className="text-center text-body font-semibold text-primary">
          {label}
        </span>
      )}
    </span>
  );
}

