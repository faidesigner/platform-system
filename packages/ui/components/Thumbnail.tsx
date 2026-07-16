'use client';

import * as React from 'react';
import { ImageIcon, X } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { Spinner } from './Spinner';

export interface ThumbnailProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  src?: string;
  alt?: string;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function Thumbnail({
  src,
  alt = '',
  label,
  onClick,
  onRemove,
  isLoading = false,
  isDisabled = false,
  className = '',
  style,
  ...restProps
}: ThumbnailProps) {
  const accessibleName = label || alt || 'Thumbnail';
  const content = (
    <>
      {src != null ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          draggable={false}
        />
      ) : isLoading ? (
        <Skeleton
          variant="rect"
          width="100%"
          height="100%"
          className="rounded-none"
        />
      ) : (
        <span className="flex size-full items-center justify-center text-tertiary">
          <ImageIcon aria-hidden="true" className="size-xl" />
        </span>
      )}

      {isLoading && src != null && (
        <span className="absolute inset-0 flex items-center justify-center bg-overlay">
          <Spinner size="sm" shade="onMedia" aria-label="Loading thumbnail" />
        </span>
      )}
    </>
  );

  return (
    <div
      role="group"
      aria-label={accessibleName}
      title={label}
      className={[
        'relative inline-flex size-thumbnail shrink-0 overflow-hidden rounded-fai-s border border-border-subtle bg-fill-faint',
        isDisabled ? 'cursor-not-allowed opacity-50' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...restProps}
    >
      {onClick != null ? (
        <button
          type="button"
          aria-label={accessibleName}
          disabled={isDisabled || isLoading}
          onClick={onClick}
          className="relative size-full overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-inset disabled:cursor-not-allowed"
        >
          {content}
        </button>
      ) : (
        <span className="relative size-full">{content}</span>
      )}

      {onRemove != null && !isDisabled && (
        <button
          type="button"
          aria-label={`Remove ${accessibleName}`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(event);
          }}
          className="absolute right-2xs top-2xs z-10 flex size-l items-center justify-center rounded-fai-s bg-surface text-secondary shadow-XS outline-none hover:bg-interaction-light-black-hover focus-visible:ring-2 focus-visible:ring-border-brand"
        >
          <X aria-hidden="true" className="size-m" />
        </button>
      )}
    </div>
  );
}
