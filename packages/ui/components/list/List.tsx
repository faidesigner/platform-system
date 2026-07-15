'use client';

import * as React from 'react';

export type ListMarker = 'none' | 'disc' | 'decimal';

export interface ListProps {
  children: React.ReactNode;
  /** 리스트 레이블 (스크린리더 컨텍스트) */
  header?: React.ReactNode;
  /** 마커 종류 @default 'none' */
  marker?: ListMarker;
  /** 항목 사이 구분선 @default false */
  hasDividers?: boolean;
  className?: string;
}

export interface ListItemProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const markerClass: Record<ListMarker, string> = {
  none: 'list-none',
  disc: 'list-disc pl-l',
  decimal: 'list-decimal pl-l',
};

export function List({
  children,
  header,
  marker = 'none',
  hasDividers = false,
  className = '',
}: ListProps) {
  const Tag = marker === 'decimal' ? 'ol' : 'ul';
  const headingId = React.useId();

  return (
    <div className={className}>
      {header && (
        <div id={headingId} className="px-m py-2xs text-body-s text-secondary">
          {header}
        </div>
      )}
      <Tag
        aria-labelledby={header ? headingId : undefined}
        className={[
          'flex flex-col',
          markerClass[marker],
          hasDividers ? 'divide-y divide-border-tertiary' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </Tag>
    </div>
  );
}

export function ListItem({
  label,
  description,
  startContent,
  endContent,
  href,
  onClick,
  className = '',
}: ListItemProps) {
  const interactive = Boolean(href || onClick);

  const inner = (
    <>
      {startContent && <span className="flex shrink-0 items-center">{startContent}</span>}
      <span className="flex min-w-0 flex-col">
        <span className="text-body">{label}</span>
        {description && <span className="text-body-s text-secondary">{description}</span>}
      </span>
      {endContent && <span className="ml-auto flex shrink-0 items-center">{endContent}</span>}
    </>
  );

  const base = [
    'flex items-center gap-s px-m py-s w-full text-left',
    interactive ? 'rounded-fai-s hover:bg-interaction-light-black-hover cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <li>
        <a href={href} onClick={onClick} className={base}>
          {inner}
        </a>
      </li>
    );
  }
  if (onClick) {
    return (
      <li>
        <button type="button" onClick={onClick} className={base}>
          {inner}
        </button>
      </li>
    );
  }
  return <li className={base}>{inner}</li>;
}
