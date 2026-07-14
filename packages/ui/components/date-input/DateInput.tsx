"use client";

import * as React from "react";
import { Calendar, type ISODateString } from "../Calendar";
import { DateFieldShell } from "./DateField";

export interface DateInputProps {
  /** 라벨 (필수 — 접근성) */
  label: string;
  /** 라벨 시각 숨김 @default false */
  labelHidden?: boolean;
  /** 보조 설명 */
  description?: string;
  /** 필수 표시 (빨간 *) @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  /** 에러 상태 + 메시지 */
  error?: boolean;
  errorMessage?: string;
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
 * 달력 팝오버로 단일 날짜를 선택하는 입력 필드.
 * 박스형 트리거(신규 폼 트리거 규칙) + Calendar 재사용.
 * 스펙: root/components/web/ui/date-input.md
 *
 * @example
 * <DateInput label="예약일" value={date} onChange={setDate} min={today} />
 */
export function DateInput({
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
