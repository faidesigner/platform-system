'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ---------------- Props ---------------- */

export interface TabletNavigationBarProps {
  logo: React.ReactNode;
  isDarkMode?: boolean;
  /** 드로어가 열렸을 때 렌더링할 콘텐츠. close 콜백을 전달받아 드로어를 닫을 수 있습니다. */
  renderDrawer?: (close: () => void) => React.ReactNode;
}

/* ---------------- 아이콘 ---------------- */

function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 6H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 18H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- 컴포넌트 ---------------- */

export function TabletNavigationBar({
  logo,
  isDarkMode = false,
  renderDrawer,
}: TabletNavigationBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* 라우트 변경 시 드로어 닫기 */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const headerBgColor = isDarkMode ? 'transparent' : 'var(--color-bg-surface, #FFFFFF)';
  const iconColor = isDarkMode ? '#FFFFFF' : 'var(--color-icon-basic-primary, #1F2023)';

  const close = () => setOpen(false);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          width: '100%',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--padding-xl, 24px)',
          background: headerBgColor,
          transition: 'background 0.3s ease-in-out',
        }}
      >
        {/* 로고 */}
        <div style={{ flexShrink: 0 }}>
          {logo}
        </div>

        {/* 우측: 햄버거/닫기 토글 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            style={{
              display: 'flex',
              width: '40px',
              height: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--cornerRadius-S, 8px)',
              padding: '8px',
            }}
          >
            {open ? <XIcon color={iconColor} /> : <HamburgerIcon color={iconColor} />}
          </button>
        </div>
      </header>

      {/* Drawer 렌더링 영역 */}
      {open && renderDrawer && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            zIndex: 49,
            width: '100%',
            background: 'var(--color-bg-surface, #FFFFFF)',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}
        >
          {renderDrawer(close)}
        </div>
      )}
    </>
  );
}
