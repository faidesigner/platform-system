'use client';

import * as React from 'react';
import Link from 'next/link';

/* ---------------- 레이아웃 & 스타일 객체 ---------------- */
const drawerMenuStyle: React.CSSProperties = {
  display: 'flex',
  paddingBottom: 'var(--padding-3-xl, 40px)',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  background: 'var(--color-bg-100, #FFFFFF)',
  width: '100%',
};

const listItemWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  borderRadius: 'var(--cornerRadius-S, 8px)',
  width: '100%',
};

const listItemDefaultStyle: React.CSSProperties = {
  display: 'flex',
  padding: 'var(--padding-m, 16px) var(--padding-3-xl, 40px)',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignSelf: 'stretch',
  width: '100%',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  textDecoration: 'none',
};

const listItemTextStyle: React.CSSProperties = {
  color: 'var(--color-text-basic-secondary, #3A3D40)',
  textAlign: 'center',
  fontFamily: 'var(--font-family-Pretendard, Pretendard)',
  fontSize: 'var(--font-size-16, 16px)',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'var(--font-lineHeight-16, 24px)',
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
};

/* ---------------- 공통 아이콘 컴포넌트 ---------------- */
export function DefaultListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <mask id="mask0_6187_14617" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1" y="1" width="14" height="14">
        <rect x="1.8026" y="1.80065" width="12.4" height="12.4" rx="2.2" stroke="black" strokeWidth="0.933333" strokeDasharray="1.6 1.6" />
      </mask>
      <g mask="url(#mask0_6187_14617)">
        <rect width="16" height="16" fill="#61646B" />
      </g>
    </svg>
  );
}

/* ---------------- 공통 Drawer 컨테이너 ---------------- */
export function DrawerMenu({ children }: { children: React.ReactNode }) {
  return (
    <nav style={drawerMenuStyle} aria-label="Drawer Navigation">
      {children}
    </nav>
  );
}

/* ---------------- 공통 List Item 컴포넌트 ---------------- */
export interface DrawerListItemProps {
  label: string;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function DrawerListItem({
  label,
  href,
  isExternal,
  onClick,
  rightIcon,
  children,
}: DrawerListItemProps) {
  const content = (
    <>
      <span style={listItemTextStyle}>{label}</span>
      {rightIcon && <div style={{ width: '16px', height: '16px' }}>{rightIcon}</div>}
    </>
  );

  // 1. 외부 링크 렌더링
  if (href && isExternal) {
    return (
      <div style={listItemWrapperStyle}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={listItemDefaultStyle}
          onClick={onClick}
        >
          {content}
        </a>
        {children}
      </div>
    );
  }

  // 2. 내부 링크 렌더링
  if (href) {
    return (
      <div style={listItemWrapperStyle}>
        <Link href={href} style={listItemDefaultStyle} onClick={onClick}>
          {content}
        </Link>
        {children}
      </div>
    );
  }

  // 3. 일반 버튼 (아코디언 토글 등) 렌더링
  return (
    <div style={listItemWrapperStyle}>
      <button type="button" onClick={onClick} style={listItemDefaultStyle}>
        {content}
      </button>
      {children}
    </div>
  );
}
