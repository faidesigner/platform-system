'use client';

import * as React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Spinner } from './Spinner';

export type TextAreaSize = 'sm' | 'md' | 'lg';
export type TextAreaStatusType = 'warning' | 'error' | 'success';

export interface TextAreaStatus {
  type: TextAreaStatusType;
  message?: string;
}

export interface TextAreaProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'onPaste' | 'onFocus' | 'onBlur'
  > {
  label: string;
  value: string;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  changeAction?: (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void | Promise<void>;
  description?: string;
  placeholder?: string;
  rows?: number;
  size?: TextAreaSize;
  status?: TextAreaStatus;
  maxLength?: number;
  startIcon?: React.ReactNode;
  isDisabled?: boolean;
  disabledMessage?: string;
  isLoading?: boolean;
  isLabelHidden?: boolean;
  isOptional?: boolean;
  isRequired?: boolean;
  hasSpellCheck?: boolean;
  hasAutoFocus?: boolean;
  htmlName?: string;
  width?: React.CSSProperties['width'];
  textareaRef?: React.Ref<HTMLTextAreaElement>;
  onPaste?: React.ClipboardEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
}

const sizeClass: Record<TextAreaSize, string> = {
  sm: 'gap-s px-s py-xs',
  md: 'gap-s px-ms py-s',
  lg: 'gap-s px-m py-ms',
};

const statusClass: Record<TextAreaStatusType, string> = {
  error: 'border-border-error focus-within:border-border-error text-error',
  warning: 'border-border-warning focus-within:border-border-warning text-warning',
  success: 'border-border-success focus-within:border-border-success text-success',
};

const statusTextClass: Record<TextAreaStatusType, string> = {
  error: 'text-error',
  warning: 'text-warning',
  success: 'text-success',
};

const StatusIcon = ({ type }: { type: TextAreaStatusType }) => {
  const iconClass = 'size-l';
  if (type === 'error') return <AlertCircle aria-hidden="true" className={iconClass} />;
  if (type === 'warning') return <AlertTriangle aria-hidden="true" className={iconClass} />;
  return <CheckCircle2 aria-hidden="true" className={iconClass} />;
};

export function TextArea({
  label,
  value,
  onChange,
  changeAction,
  description,
  placeholder,
  rows = 3,
  size = 'md',
  status,
  maxLength,
  startIcon,
  isDisabled = false,
  disabledMessage,
  isLoading = false,
  isLabelHidden = false,
  isOptional = false,
  isRequired = false,
  hasSpellCheck = true,
  hasAutoFocus = false,
  htmlName,
  width,
  textareaRef,
  onPaste,
  onFocus,
  onBlur,
  className = '',
  style,
  ...restProps
}: TextAreaProps) {
  const id = React.useId();
  const descriptionId = React.useId();
  const statusId = React.useId();
  const counterId = React.useId();
  const [isPending, setIsPending] = React.useState(false);
  const isBusy = isLoading || isPending;
  const keepsFocusWhenDisabled = isDisabled && disabledMessage != null;
  const isOverLimit = maxLength != null && value.length > maxLength;
  const isInvalid = status?.type === 'error' || isOverLimit;

  const handleChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isDisabled || isBusy) return;
    const nextValue = event.target.value;
    onChange?.(nextValue, event);
    if (changeAction != null && !event.defaultPrevented) {
      setIsPending(true);
      try {
        await changeAction(nextValue, event);
      } finally {
        setIsPending(false);
      }
    }
  };

  const describedBy = [
    description ? descriptionId : null,
    status?.message ? statusId : null,
    maxLength != null ? counterId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div
      title={keepsFocusWhenDisabled ? disabledMessage : undefined}
      className={['inline-flex w-full flex-col gap-2xs', className].filter(Boolean).join(' ')}
      style={{ ...style, width }}
      {...restProps}
    >
      <label
        htmlFor={id}
        className={[
          'flex items-center gap-2xs text-body-s font-medium',
          isDisabled ? 'text-disabled' : 'text-primary',
          isLabelHidden ? 'sr-only' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span>{label}</span>
        {isRequired && !isOptional && <span className="text-error">*</span>}
        {isOptional && !isRequired && <span className="text-caption-m font-normal text-tertiary">선택</span>}
      </label>

      {description != null && !isLabelHidden && (
        <span id={descriptionId} className="text-caption-m text-tertiary">
          {description}
        </span>
      )}

      <div
        className={[
          'relative flex items-start rounded-fai-s border bg-100 transition-colors',
          sizeClass[size],
          status != null
            ? statusClass[status.type]
            : isOverLimit
              ? 'border-border-error focus-within:border-border-error'
              : 'border-border-subtle hover:border-border focus-within:border-border-brand',
          isDisabled ? 'cursor-not-allowed bg-fill-disabled opacity-50' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ transitionDuration: 'var(--duration-fast)' }}
      >
        {startIcon != null && <span className="flex size-l shrink-0 items-center justify-center text-secondary">{startIcon}</span>}
        <textarea
          ref={textareaRef}
          id={id}
          name={htmlName}
          value={value}
          onChange={handleChange}
          onPaste={onPaste}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={isDisabled && !keepsFocusWhenDisabled}
          readOnly={keepsFocusWhenDisabled || isBusy || undefined}
          aria-disabled={keepsFocusWhenDisabled || undefined}
          aria-describedby={describedBy}
          aria-required={(isRequired && !isOptional) || undefined}
          aria-invalid={isInvalid || undefined}
          aria-busy={isBusy || undefined}
          spellCheck={hasSpellCheck}
          autoFocus={hasAutoFocus}
          className="min-w-0 flex-1 resize-y border-0 bg-transparent p-0 text-body text-primary outline-none placeholder:text-tertiary disabled:cursor-not-allowed"
        />
        {isBusy && <Spinner size="sm" shade="subtle" aria-label="Loading" />}
        {!isBusy && status != null && (
          <span className={`flex shrink-0 ${statusTextClass[status.type]}`}>
            <StatusIcon type={status.type} />
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-s">
        <span className="min-w-0 flex-1">
          {status?.message != null && (
            <span
              id={statusId}
              role={status.type === 'error' ? 'alert' : 'status'}
              className={`text-caption-m ${statusTextClass[status.type]}`}
            >
              {status.message}
            </span>
          )}
        </span>
        {maxLength != null && (
          <span
            id={counterId}
            aria-live="polite"
            className={`shrink-0 text-caption-m ${isOverLimit ? 'text-error' : 'text-secondary'}`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
