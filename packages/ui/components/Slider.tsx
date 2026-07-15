'use client';

import * as React from 'react';

export type SliderStatus = 'default' | 'error' | 'warning' | 'success';
export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps {
  label: string;
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: readonly SliderMark[];
  formatValue?: (value: number) => string;
  status?: SliderStatus;
  disabled?: boolean;
  disabledMessage?: string;
  labelHidden?: boolean;
}

const fillColor: Record<SliderStatus, string> = {
  default: 'bg-filled-optional-brand-primary',
  error: 'bg-filled-basic-negative',
  warning: 'bg-filled-basic-warning',
  success: 'bg-filled-basic-positive',
};

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks,
  formatValue,
  status = 'default',
  disabled = false,
  disabledMessage,
  labelHidden = false,
}: SliderProps) {
  const isRange = Array.isArray(value);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const fmt = (v: number) => (formatValue ? formatValue(v) : String(v));

  const lo = isRange ? value[0] : min;
  const hi = isRange ? value[1] : value;
  const fillLeft = isRange ? pct(lo) : 0;
  const fillRight = pct(hi);

  const valueText = isRange ? `${fmt(lo)} – ${fmt(hi)}` : fmt(hi);

  return (
    <div className="flex w-full flex-col gap-2xs" title={disabled ? disabledMessage : undefined}>
      <div className="flex items-center justify-between">
        {!labelHidden && <span className="text-body-s text-secondary">{label}</span>}
        <span className="text-body-s">{valueText}</span>
      </div>

      <div className={['relative flex h-l items-center', disabled ? 'opacity-50' : ''].join(' ')}>
        {/* 트랙 */}
        <div className="absolute inset-x-0 h-3xs rounded-fai-circle bg-quaternary" />
        {/* 채움 */}
        <div
          className={`absolute h-3xs rounded-fai-circle ${fillColor[status]}`}
          style={{ left: `${fillLeft}%`, right: `${100 - fillRight}%` }}
        />
        {/* 단일 값: native range */}
        {!isRange && (
          <input
            type="range"
            aria-label={label}
            min={min}
            max={max}
            step={step}
            value={hi}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-x-0 w-full cursor-pointer appearance-none bg-transparent"
          />
        )}
        {/* 범위: 두 개 range 겹침 */}
        {isRange && (
          <>
            <input
              type="range"
              aria-label={`${label} 최소`}
              min={min}
              max={max}
              step={step}
              value={lo}
              disabled={disabled}
              onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
              className="pointer-events-none absolute inset-x-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto"
            />
            <input
              type="range"
              aria-label={`${label} 최대`}
              min={min}
              max={max}
              step={step}
              value={hi}
              disabled={disabled}
              onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
              className="pointer-events-none absolute inset-x-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto"
            />
          </>
        )}
      </div>

      {/* marks */}
      {marks && marks.length > 0 && (
        <div className="relative h-l">
          {marks.map((m) => (
            <span
              key={m.value}
              className="absolute -translate-x-1/2 text-caption-s text-secondary"
              style={{ left: `${pct(m.value)}%` }}
            >
              {m.label ?? m.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
