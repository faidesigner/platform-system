'use client';

import * as React from 'react';

export type PaginationVariant = 'pages' | 'count' | 'compact' | 'dots';

export interface PaginationProps {
  variant?: PaginationVariant;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (n: number) => void;
  ariaLabel?: string;
}

const navBtn =
  'flex h-2xl w-2xl items-center justify-center rounded-fai-s text-body-s hover:bg-interaction-light-black-hover disabled:opacity-40 disabled:cursor-not-allowed';

/** … 축약이 필요한 페이지 번호 배열 생성 */
function pageWindow(page: number, count: number): (number | '…')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(count - 1, page + 1);
  if (start > 2) out.push('…');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < count - 1) out.push('…');
  out.push(count);
  return out;
}

export function Pagination({
  variant = 'pages',
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  ariaLabel = '페이지 이동',
}: PaginationProps) {
  const go = (p: number) => {
    if (p >= 1 && p <= pageCount) onPageChange(p);
  };

  const prevNext = (
    <>
      <button type="button" className={navBtn} disabled={page <= 1} onClick={() => go(page - 1)} aria-label="이전">
        ‹
      </button>
      <button
        type="button"
        className={navBtn}
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
        aria-label="다음"
      >
        ›
      </button>
    </>
  );

  if (variant === 'dots') {
    return (
      <nav aria-label={ariaLabel} className="flex items-center justify-center gap-2xs">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            aria-label={`${p}페이지`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => go(p)}
            className={[
              'h-2xs w-2xs rounded-fai-circle',
              p === page ? 'bg-filled-optional-brand-primary' : 'bg-filled-basic-secondary',
            ].join(' ')}
          />
        ))}
      </nav>
    );
  }

  if (variant === 'compact') {
    return (
      <nav aria-label={ariaLabel} className="flex items-center gap-2xs">
        {prevNext}
        <span className="px-2xs text-body-s text-secondary">
          {page} / {pageCount}
        </span>
      </nav>
    );
  }

  if (variant === 'count') {
    const from = pageSize ? (page - 1) * pageSize + 1 : 0;
    const to = pageSize ? Math.min(page * pageSize, totalItems ?? page * pageSize) : 0;
    return (
      <nav aria-label={ariaLabel} className="flex items-center justify-between gap-m">
        {totalItems !== undefined && pageSize !== undefined && (
          <span className="text-body-s text-secondary">
            {from}–{to} / {totalItems}
          </span>
        )}
        <div className="flex items-center gap-2xs">
          {onPageSizeChange && pageSize !== undefined && (
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-fai-s border border-border-secondary px-2xs py-3xs text-body-s"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}개씩
                </option>
              ))}
            </select>
          )}
          {prevNext}
        </div>
      </nav>
    );
  }

  /* pages (default) */
  return (
    <nav aria-label={ariaLabel} className="flex items-center gap-2xs">
      {prevNext}
      {pageWindow(page, pageCount).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-2xs text-secondary">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => go(p)}
            className={[navBtn, p === page ? 'bg-filled-basic-secondary font-medium' : ''].join(' ')}
          >
            {p}
          </button>
        ),
      )}
    </nav>
  );
}
