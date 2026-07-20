'use client';

import * as React from 'react';

export type LinkUnderline = 'always' | 'hover' | 'none';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** 목적지 URL */
  href: string;
  children: React.ReactNode;
  /** 밑줄 방식 @default 'hover' */
  underline?: LinkUnderline;
  /** 외부 링크 — 새 탭 + 외부 아이콘 */
  isExternal?: boolean;
  /** 인라인 텍스트 밖에 놓일 때 — 본문 폰트 사이징 적용 */
  isStandalone?: boolean;
  /** 아이콘 전용 링크의 접근성 이름 (텍스트 링크엔 사용 금지) */
  label?: string;
}

const underlineClass: Record<LinkUnderline, string> = {
  always: 'underline',
  hover: 'no-underline hover:underline',
  none: 'no-underline',
};

/** 외부 링크 표시 아이콘 (↗) */
function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <path
        d="M4 3h7v7M11 3L3.5 10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    children,
    underline = 'hover',
    isExternal = false,
    isStandalone = false,
    label,
    className = '',
    ...props
  },
  ref,
) {
  const classes = [
    'inline-flex items-center gap-3xs',
    'text-optional-brand-primary',
    'transition-colors duration-200',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    underlineClass[underline],
    isStandalone ? 'text-body' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const externalAttrs = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      aria-label={label}
      {...externalAttrs}
      {...props}
    >
      {children}
      {isExternal && <ExternalIcon />}
    </a>
  );
});

Link.displayName = 'Link';
