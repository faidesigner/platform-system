'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const LOCALES = [
  { code: 'ko', label: 'KR' },
  { code: 'en', label: 'EN' },
  { code: 'jp', label: 'JP' },
] as const;

/* ---------------- 스타일 객체 ---------------- */

const listWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const baseStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family-Pretendard, Pretendard)',
  fontSize: 'var(--font-size-14, 14px)',
  fontStyle: 'normal',
  lineHeight: 'var(--font-lineHeight-14, 21px)',
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: 'var(--cornerRadius-S, 8px)',
  transition: 'all 0.2s ease',
  textAlign: 'center',
};

/* ---------------- 구분선 ---------------- */

function LineDivider() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1"
      height="14"
      viewBox="0 0 1 14"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path d="M0.375 0V14" stroke="var(--color-border-secondary, #D2D3D5)" strokeWidth="0.75" />
    </svg>
  );
}

/* ---------------- 컴포넌트 ---------------- */

export function LanguageSwitcher({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (code: string) => {
    if (code === locale) return;
    // next/navigation pathname includes the locale prefix (e.g. /ko/products)
    // Replace first occurrence of current locale segment with the new one
    const newPath = pathname.replace(`/${locale}`, `/${code}`);
    router.push(newPath);
  };

  return (
    <div style={listWrapperStyle}>
      {LOCALES.map((l, i) => {
        const active = l.code === locale;

        const activeColor = isDarkMode
          ? 'var(--color-text-basic-primary, #FFF)'
          : 'var(--color-text-basic-primary, #1F2023)';
        const inactiveColor = isDarkMode
          ? 'var(--color-text-basic-secondary, #D2D3D5)'
          : 'var(--color-text-basic-tertiary, #61646B)';

        const color = active ? activeColor : inactiveColor;
        const fontWeight = active ? 700 : 500;

        return (
          <React.Fragment key={l.code}>
            {i > 0 && <LineDivider />}
            <button
              type="button"
              onClick={() => switchTo(l.code)}
              aria-current={active ? 'true' : undefined}
              style={{ ...baseStyle, color, fontWeight }}
            >
              {l.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
