"use client";

import * as React from "react";
import { Calendar, type ISODateString } from "../Calendar";
import { DateFieldShell, cnDate } from "./DateField";

/** 'YYYY-MM-DDTHH:mm' */
export type ISODateTimeString = string;

export interface DateTimeInputProps {
  /** 라벨 (필수 — 접근성) */
  label: string;
  labelHidden?: boolean;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  /** 선택 값 (제어형) — 'YYYY-MM-DDTHH:mm' */
  value?: ISODateTimeString | null;
  onChange?: (value: ISODateTimeString | null) => void;
  /** 날짜 선택 범위 (날짜 부분 기준) */
  min?: ISODateString;
  max?: ISODateString;
  isDateDisabled?: (date: Date) => boolean;
  /** 시간 목록 간격(분) @default 30 */
  timeIncrement?: number;
  /** @default '날짜·시간 선택' */
  placeholder?: string;
  hasClear?: boolean;
  locale?: string;
  className?: string;
}

/**
 * 날짜 + 시간을 함께 선택하는 입력 필드.
 * 팝오버 좌측 달력 + 우측 시간 목록(timeIncrement 간격).
 * 날짜와 시간이 모두 선택되면 팝오버가 닫힌다.
 * 스펙: root/components/web/ui/date-input.md
 *
 * @example
 * <DateTimeInput label="회의 시작" value={dt} onChange={setDt} timeIncrement={15} />
 */
export function DateTimeInput({
  label,
  labelHidden,
  description,
  required,
  disabled,
  error,
  errorMessage,
  value = null,
  onChange,
  min,
  max,
  isDateDisabled,
  timeIncrement = 30,
  placeholder = "날짜·시간 선택",
  hasClear = false,
  locale = "ko-KR",
  className,
}: DateTimeInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const datePart: ISODateString | null = value?.split("T")[0] ?? null;
  const timePart: string | null = value?.split("T")[1] ?? null;

  const timeOptions = React.useMemo(() => {
    const out: string[] = [];
    for (let m = 0; m < 24 * 60; m += timeIncrement) {
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      out.push(`${hh}:${mm}`);
    }
    return out;
  }, [timeIncrement]);

  const displayValue = React.useMemo(() => {
    if (datePart == null) return null;
    const [y, m, d] = datePart.split("-").map(Number);
    const dateText = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
    }).format(new Date(y, m - 1, d));
    return timePart != null ? `${dateText} ${timePart}` : dateText;
  }, [datePart, timePart, locale]);

  const commit = (nextDate: ISODateString | null, nextTime: string | null) => {
    if (nextDate == null) {
      onChange?.(null);
      return;
    }
    onChange?.(nextTime != null ? `${nextDate}T${nextTime}` : `${nextDate}T00:00`);
    if (nextTime != null) setIsOpen(false);
  };

  return (
    <DateFieldShell
      label={label}
      labelHidden={labelHidden}
      description={description}
      required={required}
      disabled={disabled}
      error={error}
      errorMessage={errorMessage}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      displayValue={displayValue}
      placeholder={placeholder}
      hasClear={hasClear}
      onClear={() => onChange?.(null)}
      className={className}
    >
      <div className="flex">
        <Calendar
          value={datePart}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          locale={locale}
          onChange={(iso) => commit(iso, timePart)}
        />
        {/* 시간 목록 */}
        <ul
          aria-label="시간 선택"
          className="list-none m-0 py-s px-2xs border-l border-[var(--color-border-tertiary)] max-h-[320px] overflow-y-auto min-w-[96px]"
        >
          {timeOptions.map((t) => (
            <li key={t}>
              <button
                type="button"
                disabled={datePart == null}
                aria-pressed={t === timePart}
                onClick={() => commit(datePart, t)}
                className={cnDate(
                  "w-full text-center px-ms py-2xs rounded-fai-s",
                  "bg-transparent border-none cursor-pointer text-body-s",
                  t === timePart
                    ? "!bg-[var(--color-filled-basic-primary)] !text-[var(--color-text-basic-inverse)] font-semibold"
                    : "text-[var(--color-text-basic-secondary)] hover:bg-fill-faint",
                  datePart == null && "text-[var(--color-text-basic-disabled)] cursor-not-allowed"
                )}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </DateFieldShell>
  );
}

export default DateTimeInput;
