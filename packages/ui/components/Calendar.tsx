"use client";

import * as React from "react";

/** 'YYYY-MM-DD' */
export type ISODateString = string;
export interface DateRange {
  start: ISODateString | null;
  end: ISODateString | null;
}

interface CalendarBaseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** 선택 가능 최소/최대 날짜 (포함) */
  min?: ISODateString;
  max?: ISODateString;
  /** true 반환 시 해당 날짜 비활성 */
  isDateDisabled?: (date: Date) => boolean;
  /** 주 시작 요일 — 0(일) ~ 6(토) @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** 요일/월 표기 로케일 @default 'ko-KR' */
  locale?: string;
  /** 이웃 달 날짜 표시 @default true */
  hasOutsideDays?: boolean;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** 선택 모드 @default 'single' */
  mode?: "single";
  value?: ISODateString | null;
  onChange?: (value: ISODateString, valueAsDate: Date) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  value?: DateRange;
  onChange?: (value: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/* ── date utils ── */
function toISO(d: Date): ISODateString {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function fromISO(s: ISODateString): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

/**
 * 월 그리드 달력. single(단일 날짜) / range(기간) 선택 모드.
 * min/max·isDateDisabled로 선택 제한, 방향키로 날짜 그리드 탐색.
 * 스펙: root/components/web/ui/calendar.md
 *
 * @example
 * <Calendar value={date} onChange={(iso) => setDate(iso)} />
 * <Calendar mode="range" value={range} onChange={setRange} />
 */
export function Calendar(props: CalendarProps) {
  const {
    min,
    max,
    isDateDisabled,
    weekStartsOn = 0,
    locale = "ko-KR",
    hasOutsideDays = true,
    className,
    ...rest
  } = props;
  const isRange = props.mode === "range";

  const selectedSingle = !isRange ? (props.value ?? null) : null;
  const selectedRange: DateRange = isRange
    ? (props.value ?? { start: null, end: null })
    : { start: null, end: null };

  /* 표시 중인 달 — 선택값 또는 오늘 기준 */
  const initialMonth = React.useMemo(() => {
    const base = isRange
      ? selectedRange.start
      : selectedSingle;
    return base ? fromISO(base) : new Date();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [viewYear, setViewYear] = React.useState(initialMonth.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initialMonth.getMonth());

  /* range 진행 상태 — start만 찍힌 상태 */
  const [pendingStart, setPendingStart] = React.useState<ISODateString | null>(
    null
  );

  const todayISO = toISO(new Date());

  const moveMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const isDisabled = (d: Date): boolean => {
    const iso = toISO(d);
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return isDateDisabled?.(d) ?? false;
  };

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    const iso = toISO(d);
    if (!isRange) {
      (props as CalendarSingleProps).onChange?.(iso, d);
      return;
    }
    const onChange = (props as CalendarRangeProps).onChange;
    if (pendingStart == null) {
      setPendingStart(iso);
      onChange?.({ start: iso, end: null });
    } else {
      const [start, end] =
        iso < pendingStart ? [iso, pendingStart] : [pendingStart, iso];
      setPendingStart(null);
      onChange?.({ start, end });
    }
  };

  /* 그리드 생성 — 6주 고정 */
  const cells = React.useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
    const start = new Date(viewYear, viewMonth, 1 - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [viewYear, viewMonth, weekStartsOn]);

  const weekdayLabels = React.useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 2023-01-01은 일요일 — weekStartsOn 기준 회전
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2023, 0, 1 + ((i + weekStartsOn) % 7)))
    );
  }, [locale, weekStartsOn]);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(viewYear, viewMonth, 1));

  /* 셀 상태 판정 */
  const rangeStart = isRange ? selectedRange.start : null;
  const rangeEnd = isRange ? selectedRange.end : null;

  const cellState = (d: Date) => {
    const iso = toISO(d);
    const outside = d.getMonth() !== viewMonth;
    const selected = isRange
      ? iso === rangeStart || iso === rangeEnd
      : iso === selectedSingle;
    const inRange =
      isRange &&
      rangeStart != null &&
      rangeEnd != null &&
      iso > rangeStart &&
      iso < rangeEnd;
    return { iso, outside, selected, inRange, disabled: isDisabled(d) };
  };

  /* 방향키 그리드 탐색 */
  const gridRef = React.useRef<HTMLDivElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const delta = deltas[e.key];
    if (delta == null) return;
    const active = document.activeElement as HTMLElement | null;
    const isoAttr = active?.getAttribute("data-iso");
    if (!isoAttr) return;
    e.preventDefault();
    const next = fromISO(isoAttr);
    next.setDate(next.getDate() + delta);
    if (next.getMonth() !== viewMonth) {
      setViewYear(next.getFullYear());
      setViewMonth(next.getMonth());
    }
    requestAnimationFrame(() => {
      gridRef.current
        ?.querySelector<HTMLElement>(`[data-iso="${toISO(next)}"]`)
        ?.focus();
    });
  };

  const navBtn =
    "inline-flex items-center justify-center w-2xl h-2xl rounded-fai-s " +
    "text-[var(--color-icon-basic-secondary)] hover:bg-fill-faint cursor-pointer " +
    "bg-transparent border-none transition-colors";

  return (
    <div
      className={cn("inline-block select-none", className)}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      {/* 헤더 — 월 이동 */}
      <div className="flex items-center justify-between pb-s">
        <button type="button" aria-label="이전 달" className={navBtn} onClick={() => moveMonth(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span
          aria-live="polite"
          className="text-body-s font-semibold text-[var(--color-text-basic-primary)]"
        >
          {monthLabel}
        </span>
        <button type="button" aria-label="다음 달" className={navBtn} onClick={() => moveMonth(1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7">
        {weekdayLabels.map((w) => (
          <span
            key={w}
            className="flex items-center justify-center h-2xl text-caption-m text-[var(--color-text-basic-tertiary)]"
          >
            {w}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div
        ref={gridRef}
        role="grid"
        aria-label={monthLabel}
        onKeyDown={handleKeyDown}
        className="grid grid-cols-7"
      >
        {cells.map((d) => {
          const { iso, outside, selected, inRange, disabled } = cellState(d);
          if (outside && !hasOutsideDays) {
            return <span key={iso} aria-hidden="true" />;
          }
          const isToday = iso === todayISO;
          return (
            <button
              key={iso}
              type="button"
              data-iso={iso}
              disabled={disabled}
              aria-pressed={selected}
              aria-label={iso}
              onClick={() => handleSelect(d)}
              className={cn(
                "flex items-center justify-center w-3xl h-3xl m-px",
                "text-body-s bg-transparent border border-transparent",
                "transition-colors cursor-pointer",
                inRange ? "rounded-none" : "rounded-fai-s",
                /* 상태별 스타일 — foundation 토큰만 사용 */
                selected
                  ? "!bg-[var(--color-filled-basic-primary)] !text-[var(--color-text-basic-inverse)] font-semibold"
                  : inRange
                    ? "bg-fill-faint text-[var(--color-text-basic-primary)]"
                    : outside
                      ? "text-[var(--color-text-basic-fourth)] hover:bg-fill-faint"
                      : "text-[var(--color-text-basic-primary)] hover:bg-fill-faint",
                isToday && !selected && "!border-border-primary",
                disabled &&
                  "!text-[var(--color-text-basic-disabled)] cursor-not-allowed hover:bg-transparent"
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
