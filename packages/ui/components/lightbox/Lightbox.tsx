'use client';

import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';

export interface LightboxItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
}

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: readonly LightboxItem[];
  index?: number;
  onIndexChange?: (index: number) => void;
  /** 이미지 줌·팬 활성화 @default false */
  enableZoom?: boolean;
}

export function Lightbox({
  isOpen,
  onClose,
  items,
  index = 0,
  onIndexChange,
  enableZoom = false,
}: LightboxProps) {
  const [internalIndex, setInternalIndex] = useState(index);
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  const current = internalIndex;
  const isGallery = items.length > 1;

  const goTo = useCallback(
    (next: number) => {
      const clamped = (next + items.length) % items.length;
      setInternalIndex(clamped);
      setZoomed(false);
      onIndexChange?.(clamped);
    },
    [items.length, onIndexChange],
  );

  useEffect(() => {
    setInternalIndex(index);
  }, [index]);

  /* body scroll lock + 포커스 관리 */
  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    containerRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      (triggerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen]);

  /* 키보드: Esc 닫기, ←/→ 내비게이션 */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (isGallery && e.key === 'ArrowLeft') goTo(current - 1);
      else if (isGallery && e.key === 'ArrowRight') goTo(current + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isGallery, current, goTo, onClose]);

  if (!isOpen) return null;

  const item = items[current];

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="미디어 뷰어"
      tabIndex={-1}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.85)] p-xl outline-none"
    >
      {/* 닫기 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-xl right-xl z-10 flex h-2xl w-2xl items-center justify-center rounded-fai-circle bg-[rgba(255,255,255,0.12)] text-white hover:bg-[rgba(255,255,255,0.2)]"
      >
        ✕
      </button>

      {/* 이전 */}
      {isGallery && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goTo(current - 1);
          }}
          aria-label="이전"
          className="absolute left-xl z-10 flex h-2xl w-2xl items-center justify-center rounded-fai-circle bg-[rgba(255,255,255,0.12)] text-white hover:bg-[rgba(255,255,255,0.2)]"
        >
          ‹
        </button>
      )}

      {/* 미디어 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full max-w-full items-center justify-center"
      >
        {item.type === 'image' ? (
          <img
            src={item.src}
            alt={item.alt ?? ''}
            onClick={() => enableZoom && setZoomed((z) => !z)}
            className={[
              'max-h-[90vh] max-w-[90vw] rounded-fai-m object-contain transition-transform duration-200',
              enableZoom ? 'cursor-zoom-in' : '',
              zoomed ? 'scale-150 cursor-zoom-out' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ) : (
          <video
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            className="max-h-[90vh] max-w-[90vw] rounded-fai-m"
          />
        )}
      </div>

      {/* 다음 */}
      {isGallery && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goTo(current + 1);
          }}
          aria-label="다음"
          className="absolute right-xl z-10 flex h-2xl w-2xl items-center justify-center rounded-fai-circle bg-[rgba(255,255,255,0.12)] text-white hover:bg-[rgba(255,255,255,0.2)]"
        >
          ›
        </button>
      )}

      {/* 인덱스 표시 */}
      {isGallery && (
        <div className="absolute bottom-xl left-1/2 -translate-x-1/2 rounded-fai-s bg-[rgba(0,0,0,0.5)] px-m py-2xs text-caption-m text-white">
          {current + 1} / {items.length}
        </div>
      )}
    </div>
  );
}
