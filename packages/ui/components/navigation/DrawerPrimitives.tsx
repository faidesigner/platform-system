'use client';

import * as React from 'react';
import Link from 'next/link';

/* ---------------- 레이아웃 & 스타일 클래스 ---------------- */
const drawerMenuClassName = 'flex w-full flex-col items-start self-stretch bg-100 pb-3xl';
const listItemWrapperClassName = 'flex w-full flex-col items-start self-stretch rounded-fai-s';
const listItemDefaultClassName =
  'flex w-full cursor-pointer items-center justify-between self-stretch border-none bg-transparent px-3xl py-m no-underline';
const listItemTextClassName = 'text-center text-body font-medium text-secondary';

/* ---------------- 공통 아이콘 컴포넌트 ---------------- */
export function DefaultListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <mask id="mask0_6187_14617" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1" y="1" width="14" height="14">
        <rect x="1.8026" y="1.80065" width="12.4" height="12.4" rx="2.2" stroke="black" strokeWidth="0.933333" strokeDasharray="1.6 1.6" />
      </mask>
      <g mask="url(#mask0_6187_14617)">
        <rect width="16" height="16" fill="currentColor" />
      </g>
    </svg>
  );
}

/* ---------------- 공통 Drawer 컨테이너 ---------------- */
export function DrawerMenu({ children }: { children: React.ReactNode }) {
  return (
    <nav className={drawerMenuClassName} aria-label="Drawer Navigation">
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
      <span className={listItemTextClassName}>{label}</span>
      {rightIcon && <div className="h-m w-m">{rightIcon}</div>}
    </>
  );

  // 1. 외부 링크 렌더링
  if (href && isExternal) {
    return (
      <div className={listItemWrapperClassName}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={listItemDefaultClassName}
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
      <div className={listItemWrapperClassName}>
        <Link href={href} className={listItemDefaultClassName} onClick={onClick}>
          {content}
        </Link>
        {children}
      </div>
    );
  }

  // 3. 일반 버튼 (아코디언 토글 등) 렌더링
  return (
    <div className={listItemWrapperClassName}>
      <button type="button" onClick={onClick} className={listItemDefaultClassName}>
        {content}
      </button>
      {children}
    </div>
  );
}
