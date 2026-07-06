'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import GlobeIcon from '@fai/ui/components/common/Icon/GlobeIcon';
import ChevronIcon from '@fai/ui/components/common/Icon/ChevronIcon';
import { markLocaleSwitchScroll } from '@/lib/localeScroll';

/* ──────────────────────────────────────────
   상수
────────────────────────────────────────── */

const LANGUAGES = [
  { code: 'ko', label: 'KO' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JP' },
] as const;

/* ──────────────────────────────────────────
   드롭다운 스타일 객체
────────────────────────────────────────── */

/* [dropdown Container] */
const dropdownContainerStyle: React.CSSProperties = {
  display: 'flex',
  width: '94px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 'var(--cornerRadius-M, 16px)',
  border: '0.5px solid var(--color-border-tertiary)',
  background: 'var(--color-bg-100)',
  boxShadow: 'var(--shadow-XL)',
  position: 'absolute',
  top: 'calc(100% + var(--spacing-2XS, 4px))',
  right: 0,
  zIndex: 50,
};

/* [list] */
const listStyle: React.CSSProperties = {
  display: 'flex',
  padding: 'var(--padding-S, 8px) var(--size-8, 8px)',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--size-None, 0)',
  width: '100%',
  margin: 0,
  listStyle: 'none',
};

/* [menuItems] */
const menuItemsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  borderRadius: 'var(--cornerRadius-MS, 12px)',
  transition: 'background 0.2s ease',
};

/* [menuItem] */
const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  padding: 'var(--padding-S, 8px) var(--padding-L, 20px)',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
};

/* [label] */
const labelStyle: React.CSSProperties = {
  width: '29px',
  color: 'var(--color-text-basic-secondary)',
  textAlign: 'center',
  fontFamily: 'var(--font-family-Pretendard, Pretendard)',
  fontSize: 'var(--font-size-16, 16px)',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: 'var(--font-lineHeight-16, 24px)',
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
};

const labelActiveStyle: React.CSSProperties = {
  ...labelStyle,
  color: 'var(--color-text-basic-primary)',
};

/* ──────────────────────────────────────────
   Props
────────────────────────────────────────── */

interface LanguageSwitcherProps {
  isTransparent: boolean;
  variant?: 'desktop' | 'mobile';
}

/* ──────────────────────────────────────────
   컴포넌트
────────────────────────────────────────── */

export default function LanguageSwitcher({
  isTransparent,
  variant = 'desktop',
}: LanguageSwitcherProps) {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef   = useRef<HTMLDivElement>(null);
  const closeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLabel =
    LANGUAGES.find((l) => l.code === locale)?.label ?? locale.toUpperCase();

  /** next-intl locale 전환 — 경로 보존 */
  const handleSelect = (code: string) => {
    if (code === locale) { setOpen(false); return; }
    // 언어 전환은 [locale] 루트 세그먼트 변경 → SmoothScroll 리마운트로 최상단 이동됨.
    // 현재 위치를 저장해 두면 SmoothScroll가 새 마운트에서 복원한다(HOM-9).
    // scroll:false는 Next 자체 스크롤 리셋만 억제(리로드 방지)한다.
    markLocaleSwitchScroll();
    router.push(pathname, { locale: code, scroll: false });
    setOpen(false);
  };

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  /** hover: 마우스 진입 시 즉시 열기 */
  const handleMouseEnter = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  /** hover: 마우스 이탈 시 200ms 딜레이 후 닫기 (Dropdown 동일) */
  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setOpen(false), 200);
  }, []);

  /** 언마운트 시 타이머 정리 */
  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  /** Escape 키로 닫기 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  /** 외부 클릭 시 닫기 */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  /* ── 모바일: 수평 나열 버튼 (기존 구조 보존) ── */
  if (variant === 'mobile') {
    return (
      <>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => handleSelect(l.code)}
            className={[
              'text-body-s font-medium transition-colors cursor-pointer',
              locale === l.code ? 'text-primary' : 'text-tertiary',
            ].join(' ')}
          >
            {l.label}
          </button>
        ))}
      </>
    );
  }

  /* ── 데스크톱: 커스텀 드롭다운 ── */
  const textColor = isTransparent ? 'text-inverse' : 'text-primary';

  return (
    <div
      ref={containerRef}
      className="hidden desktop-s:flex items-center self-stretch relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        aria-label="언어 선택"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={[
          'inline-flex items-center',
          'h-3xl px-ms py-s gap-s',
          'rounded-fai-s',
          'text-body font-semibold',
          isTransparent
            ? 'hover:bg-interaction-light-white-hover'
            : 'hover:bg-interaction-light-black-hover',
          'transition-colors duration-200 cursor-pointer',
          textColor,
        ].join(' ')}
      >
        <GlobeIcon />
        <span>{currentLabel}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={dropdownContainerStyle}>
          <ul role="menu" style={listStyle}>
            {LANGUAGES.map((l) => (
              <li
                key={l.code}
                role="none"
                style={menuItemsStyle}
                className="hover:bg-interaction-light-black-hover"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(l.code)}
                  style={menuItemStyle}
                >
                  <span style={locale === l.code ? labelActiveStyle : labelStyle}>
                    {l.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
