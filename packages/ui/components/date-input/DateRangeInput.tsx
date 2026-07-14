"use client";

import * as React from "react";
import { Calendar, type DateRange, type ISODateString } from "../Calendar";
import { DateFieldShell, cnDate } from "./DateField";

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

export interface DateRangeInputProps {
  /** 단독 사용 시 접근성 라벨 (Field 안에서는 생략) */
  label?: string;
  disabled?: boolean;
  error?: boolean;
  /** 선택 기간 (제어형) */
  value: DateRange | null;
  /** start·end 모두 선택되면 팝오버 자동 닫힘 */
  onChange: (value: DateRange | null) => void;
  min?: ISODateString;
  max?: ISODateString;
  isDateDisabled?: (date: Date) => boolean;
  /** 빠른 선택 프리셋 (오늘, 최근 7일 등) */
  presets?: ReadonlyArray<DateRangePreset>;
  /** @default '기간 선택' */
  placeholder?: string;
  hasClear?: boolean;
  locale?: string;
  className?: string;
}

/**
 * 달력 팝오버로 기간(start~end)을 선택하는 입력 필드.
 * 프리셋(최근 7일 등) 목록을 팝오버 좌측에 배치 가능.
 * 스펙: root/components/web/ui/date-input.md
 *
 * @example
 * <DateRangeInput label="조회 기간" value={range} onChange={setRange}
 *   presets={[{ label: '최근 7일', range: last7Days }]} />
 */
export function DateRangeInput({
  label,
  disabled,
  error,
  value,
  onChange,
  min,
  max,
  isDateDisabled,
  presets,
  placeholder = "기간 선택",
  hasClear = false,
  locale = "ko-KR",
  className,
}: DateRangeInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const fmt = React.useCallback(
    (iso: ISODateString) => {
      const [y, m, d] = iso.split("-").map(Number);
      return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date(y, m - 1, d)
      );
    },
    [locale]
  );

  const displayValue =
    value?.start != null
      ? `${fmt(value.start)} ~ ${value.end != null ? fmt(value.end) : ""}`
      : null;

  return (
    <DateFieldShell
      label={label}
      disabled={disabled}
      error={error}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      displayValue={displayValue}
      placeholder={placeholder}
      hasClear={hasClear}
      onClear={() => onChange(null)}
      className={className}
    >
      <div className="flex">
        {/* 프리셋 목록 */}
        {presets != null && presets.length > 0 && (
          <ul className="list-none m-0 py-s px-2xs border-r border-[var(--color-border-tertiary)] min-w-[120px]">
            {presets.map((preset) => (
              <li key={preset.label}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(preset.range);
                    setIsOpen(false);
                  }}
                  className={cnDate(
                    "w-full text-left px-ms py-2xs rounded-fai-s",
                    "bg-transparent border-none cursor-pointer",
                    "text-body-s text-[var(--color-text-basic-secondary)]",
                    "hover:bg-fill-faint hover:text-[var(--color-text-basic-primary)]"
                  )}
                >
                  {preset.label}
                </button>
              </li>
            ))}
          </ul>
        )}
        <Calendar
          mode="range"
          value={value ?? undefined}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          locale={locale}
          onChange={(range) => {
            onChange(range);
            if (range.start != null && range.end != null) setIsOpen(false);
          }}
        />
      </div>
    </DateFieldShell>
  );
}

export default DateRangeInput;
