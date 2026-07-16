'use client';

import * as React from 'react';
import { Spinner } from './Spinner';

export type SwitchLabelPosition = 'start' | 'end';
export type SwitchLabelSpacing = 'hug' | 'spread';
export type SwitchStatusType = 'error' | 'warning' | 'success';

export interface SwitchStatus {
  type: SwitchStatusType;
  message?: string;
}

export interface SwitchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label: string;
  value: boolean;
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  changeAction?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void | Promise<void>;
  description?: string;
  isDisabled?: boolean;
  disabledMessage?: string;
  isLoading?: boolean;
  isLabelHidden?: boolean;
  isOptional?: boolean;
  isRequired?: boolean;
  labelIcon?: React.ReactNode;
  labelPosition?: SwitchLabelPosition;
  labelSpacing?: SwitchLabelSpacing;
  htmlName?: string;
  status?: SwitchStatus;
  inputRef?: React.Ref<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const statusTextClass: Record<SwitchStatusType, string> = {
  error: 'text-error',
  warning: 'text-warning',
  success: 'text-success',
};

export function Switch({
  label,
  value,
  onChange,
  changeAction,
  description,
  isDisabled = false,
  disabledMessage,
  isLoading = false,
  isLabelHidden = false,
  isOptional = false,
  isRequired = false,
  labelIcon,
  labelPosition = 'end',
  labelSpacing = 'hug',
  htmlName,
  status,
  inputRef,
  onFocus,
  onBlur,
  className = '',
  ...restProps
}: SwitchProps) {
  const id = React.useId();
  const descriptionId = React.useId();
  const statusId = React.useId();
  const [isPending, setIsPending] = React.useState(false);
  const isBusy = isLoading || isPending;
  const keepsFocusWhenDisabled = isDisabled && disabledMessage != null;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled || isBusy) return;
    const checked = event.target.checked;
    onChange?.(checked, event);
    if (changeAction != null && !event.defaultPrevented) {
      setIsPending(true);
      try {
        await changeAction(checked, event);
      } finally {
        setIsPending(false);
      }
    }
  };

  const control = (
    <span className="relative flex h-xl w-3xl shrink-0 items-center">
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        role="switch"
        name={isDisabled ? undefined : htmlName}
        checked={value}
        disabled={isDisabled && !keepsFocusWhenDisabled}
        aria-disabled={keepsFocusWhenDisabled || undefined}
        aria-busy={isBusy || undefined}
        aria-invalid={status?.type === 'error' || undefined}
        aria-describedby={
          [description ? descriptionId : null, status?.message ? statusId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        required={isRequired && !isOptional}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      <span
        aria-hidden="true"
        className={[
          'flex h-xl w-3xl items-center rounded-fai-circle p-2xs transition-colors',
          value ? 'justify-end bg-brand' : 'justify-start bg-fill',
          isDisabled ? 'opacity-50' : '',
          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-brand',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ transitionDuration: 'var(--duration-fast)' }}
      >
        <span
          className={[
            'flex shrink-0 items-center justify-center rounded-fai-circle bg-100 shadow-XS transition-all',
            value ? 'size-l' : 'size-m',
          ].join(' ')}
          style={{ transitionDuration: 'var(--duration-fast)' }}
        >
          {isBusy && <Spinner size="sm" shade="inherit" aria-label="Loading" />}
        </span>
      </span>
    </span>
  );

  const labelContent = (
    <span className={isLabelHidden ? 'sr-only' : 'flex min-h-xl flex-col justify-center gap-3xs'}>
      <span className="flex items-center gap-2xs text-body-s font-medium text-primary">
        {labelIcon != null && <span className="flex shrink-0 text-secondary">{labelIcon}</span>}
        <span>{label}</span>
        {isRequired && !isOptional && <span className="text-error">*</span>}
        {isOptional && !isRequired && <span className="text-caption-m text-tertiary">선택</span>}
      </span>
      {description != null && (
        <span id={descriptionId} className="text-caption-m text-tertiary">
          {description}
        </span>
      )}
    </span>
  );

  return (
    <div
      title={keepsFocusWhenDisabled ? disabledMessage : undefined}
      className={['flex flex-col gap-s', labelSpacing === 'spread' ? 'w-full' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...restProps}
    >
      <label
        htmlFor={id}
        className={[
          'flex items-center gap-s',
          labelSpacing === 'spread' ? 'w-full justify-between' : '',
          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {labelPosition === 'start' ? (
          <>
            {labelContent}
            {control}
          </>
        ) : (
          <>
            {control}
            {labelContent}
          </>
        )}
      </label>
      {status?.message != null && (
        <span id={statusId} role={status.type === 'error' ? 'alert' : 'status'} className={`text-caption-m ${statusTextClass[status.type]}`}>
          {status.message}
        </span>
      )}
    </div>
  );
}
