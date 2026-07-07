'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

const LOCALES = [
  { code: 'ko', label: 'KR' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JP' },
] as const;

/* ---------------- 구분선 컴포넌트 ---------------- */
const LineDivider = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1" height="14" viewBox="0 0 1 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M0.375 0V14" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.3" />
  </svg>
);

/* ---------------- 개별 언어 버튼 컴포넌트 (상태 관리) ---------------- */
function LocaleButton({
  localeInfo,
  isActive,
  isDarkMode,
  onClick,
}: {
  localeInfo: { code: string; label: string };
  isActive: boolean;
  isDarkMode: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  let fontWeight = 500;
  let background = 'transparent';
  let opacity = 0.5; // 비활성: 부모 색상을 50% 투명도로

  if (isActive) {
    fontWeight = 700;
    opacity = 1;
  } else if (isHovered) {
    fontWeight = 600;
    opacity = 1;
    background = isDarkMode
      ? 'var(--color-interaction-light-white-hover, rgba(255, 255, 255, 0.12))'
      : 'var(--color-interaction-light-black-hover, rgba(0, 0, 0, 0.03))';
  }

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 'var(--cornerRadius-S, 8px)',
    fontFamily: 'var(--font-family-Pretendard, Pretendard)',
    fontSize: 'var(--font-size-14, 14px)',
    fontStyle: 'normal',
    lineHeight: 'var(--font-lineHeight-14, 21px)',
    letterSpacing: 'var(--font-letterSpacing-0, 0)',
    background,
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    fontWeight,
    opacity,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-current={isActive ? 'true' : undefined}
      style={buttonStyle}
    >
      {localeInfo.label}
    </button>
  );
}

/* ---------------- 메인 스위처 컴포넌트 ---------------- */
export function LanguageSwitcher({
  isDarkMode = false,
  onLocaleChange,
}: {
  isDarkMode?: boolean;
  onLocaleChange: (code: string) => void;
}) {
  const locale = useLocale();

  const switchTo = (code: string) => {
    if (code === locale) return;
    onLocaleChange(code);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-XS, 6px)' }}>
      {LOCALES.map((l, i) => (
        <span key={l.code} className="flex items-center" style={{ gap: 'var(--spacing-XS, 6px)' }}>
          {i > 0 && <LineDivider />}
          <LocaleButton
            localeInfo={l}
            isActive={l.code === locale}
            isDarkMode={isDarkMode}
            onClick={() => switchTo(l.code)}
          />
        </span>
      ))}
    </div>
  );
}
