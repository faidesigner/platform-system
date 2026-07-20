import * as React from 'react';

export interface KbdProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** 키 라벨 (예: "⌘", "K", "Esc") */
  children: React.ReactNode;
  /** 배지 크기 @default 'm' */
  size?: 's' | 'm';
}

const sizeClass: Record<'s' | 'm', string> = {
  s: 'text-caption-s px-3xs py-3xs',
  m: 'text-caption-m px-2xs py-3xs',
};

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { children, size = 'm', className = '', ...props },
  ref,
) {
  const classes = [
    'inline-flex items-center justify-center',
    'font-mono font-medium',
    'bg-filled-basic-secondary',
    'border border-border-secondary',
    'rounded-fai-xs',
    'min-w-[1.5em]',
    sizeClass[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <kbd ref={ref} className={classes} {...props}>
      {children}
    </kbd>
  );
});

Kbd.displayName = 'Kbd';
