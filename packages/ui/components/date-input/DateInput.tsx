"use client";

import * as React from "react";
import { Calendar, type ISODateString } from "../Calendar";
import { DateFieldShell } from "./DateField";

export interface DateInputProps {
  /** 단독 사용 시 접근성 라벨 (Field 안에서는 생략) */
  label?: string;
  /** @default false — Field 컨텍스트가 있으면 그 값을 이어받음 */
  disabled?: boolean;
  error?: boolean;
  /** 선택 값 (제어형) */
  value?: ISODateString | null;
  /** 선택 콜백 — 선택 시 팝오버 자동 닫힘 */
  onChange?: (value: ISODateString | null) => void;
  /** 선택 가능 범위 */
  min?: ISODateString;
  max?: ISODateString;
  /** 개별 날짜 비활성 */
  isDateDisabled?: (date: Date) => boolean;
  /** @default '날짜 선택' */
  placeholder?: string;
  /** 클리어 버튼 @default false */
  hasClear?: boolean;
  /** 표기 로케일 @default 'ko-KR' */
  locale?: string;
  className?: string;
}

/**
 * 달력 팝오버로 단일 날짜를 선택하는 입력 필드 (셸 없음 — Field 방식).
 * 라벨/설명/에러 텍스트는 Field가 담당. 트리거 시각은 input-button.md 규칙.
 * 스펙: root/components/web/ui/date-input.md
 *
 * @example
 * <Field label="예약일" required><DateInput value={d} onChange={setD} /></Field>
 *
 * @example
 * <DateInput label="예약일" value={date} onChange={setDate} min={today} />
 */
export function DateInput({
  label,
  disabled,
  error,
  value = null,
  onChange,
  min,
  max,
  isDateDisabled,
  placeholder = "날짜 선택",
  hasClear = false,
  locale = "ko-KR",
  className,
}: DateInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const displayValue = React.useMemo(() => {
    if (value == null) return null;
    const [y, m, d] = value.split("-").map(Number);
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(y, m - 1, d)
    );
  }, [value, locale]);

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
      onClear={() => onChange?.(null)}
      className={className}
    >
      <Calendar
        value={value}
        min={min}
        max={max}
        isDateDisabled={isDateDisabled}
        locale={locale}
        onChange={(iso) => {
          onChange?.(iso);
          setIsOpen(false);
        }}
      />
    </DateFieldShell>
  );
}

export default DateInput;
