'use client';

import * as React from 'react';

export type LinearProgressVariant = 'accent' | 'success' | 'warning' | 'error';

export interface LinearProgressProps {
  /** 접근성 레이블 (필수 — 숨겨도 스크린리더가 읽음) */
  label: string;
  /** 0~max. 미지정(undefined)이면 indeterminate */
  value?: number;
  /** @default 100 */
  max?: number;
  /** 색상 변형 @default 'accent' */
  variant?: LinearProgressVariant;
  /** 값 라벨 표시 여부 @default false */
  showValueLabel?: boolean;
  /** 값 라벨 커스텀 포맷 (예: v => `${v}GB`) */
  formatValue?: (value: number, max: number) => string;
  /** 라벨 시각적 숨김 @default false */
  labelHidden?: boolean;
  className?: string;
}

const fillColor: Record<LinearProgressVariant, string> = {
  accent: 'bg-filled-optional-brand-primary',
  success: 'bg-filled-basic-positive',
  warning: 'bg-filled-basic-warning',
  error: 'bg-filled-basic-negative',
};

export function LinearProgress({
  label,
  value,
  max = 100,
  variant = 'accent',
  showValueLabel = false,
  formatValue,
  labelHidden = false,
  className = '',
}: LinearProgressProps) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  const valueText = indeterminate
    ? undefined
    : formatValue
      ? formatValue(value, max)
      : `${Math.round(pct)}%`;

  return (
    <div className={`flex w-full flex-col gap-2xs ${className}`}>
      {(!labelHidden || showValueLabel) && (
        <div className="flex items-center justify-between">
          {!labelHidden && <span className="text-body-s text-secondary">{label}</span>}
          {showValueLabel && valueText && (
            <span className="text-body-s text-secondary">{valueText}</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="relative h-2xs w-full overflow-hidden rounded-fai-s bg-quaternary"
      >
        <style>{`@keyframes fai-indeterminate { 0% { left: -40% } 100% { left: 100% } }`}</style>
        {indeterminate ? (
          <div
            className={`absolute inset-y-0 w-2/5 rounded-fai-s ${fillColor[variant]}`}
            style={{ animation: 'fai-indeterminate 1.2s ease-in-out infinite' }}
          />
        ) : (
          <div
            className={`absolute inset-y-0 left-0 rounded-fai-s transition-[width] duration-300 ${fillColor[variant]}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}
