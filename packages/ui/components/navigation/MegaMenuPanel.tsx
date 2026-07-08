'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';

/* ──────────────────────────────────────────
   Types
────────────────────────────────────────── */

export interface MegaMenuItemData {
  label:       string;
  description: string;
  href:        string;
  image:       string;
  bgStyle?: {
    backgroundPosition: string;
    backgroundSize:     string;
  };
}

export interface MegaMenuPanelProps {
  title: string;
  items: readonly MegaMenuItemData[];
}

/* ──────────────────────────────────────────
   Style objects (Architect's Protocol)
────────────────────────────────────────── */

/* [Container] */
const containerStyle: CSSProperties = {
  display:        'flex',
  width:          '100%',
  height:         '332px',
  padding:        'var(--padding-l, 20px) var(--padding-3-xl, 40px) var(--padding-3-xl, 40px) var(--padding-3-xl, 40px)',
  flexDirection:  'column',
  justifyContent: 'space-between',
  alignItems:     'flex-start',
  borderRadius:   'var(--cornerRadius-XL, 24px)',
  border:         '0.5px solid var(--color-border-tertiary)',
  background:     'var(--color-bg-100)',
  boxShadow:      'var(--shadow-XL)',
};

/* [contentsArea] */
const contentsAreaStyle: CSSProperties = {
  display:    'flex',
  alignItems: 'flex-start',
  gap:        'var(--spacing-XL, 24px)',
  alignSelf:  'stretch',
};

/* [titleWrapper] */
const titleWrapperStyle: CSSProperties = {
  display:       'flex',
  width:         'clamp(243px, 23%, 380px)',
  flexDirection: 'column',
  alignItems:    'flex-start',
  gap:           '8px',
  flexShrink:    0,
};

/* [heading] */
const headingStyle: CSSProperties = {
  color:         'var(--color-text-basic-primary)',
  fontFamily:    'var(--font-family-Pretendard, Pretendard)',
  fontSize:      'var(--font-size-24, 24px)',
  fontStyle:     'normal',
  fontWeight:    700,
  lineHeight:    'var(--font-lineHeight-24, 36px)',
  letterSpacing: 'var(--w-title-S-letterSpacing, 0.3px)',
};

/* [menuItemsWrapper] */
const menuItemsWrapperStyle: CSSProperties = {
  display:    'flex',
  alignItems: 'flex-start',
  gap:        'var(--spacing-6XL, 100px)',
  flex:       '1 0 0',
};

/* [menuItem] */
const menuItemStyle: CSSProperties = {
  display:        'inline-flex',
  height:         '272px',
  flexDirection:  'column',
  alignItems:     'flex-start',
  gap:            'var(--spacing-XL, 24px)',
  flex:           '1 0 0',
  textDecoration: 'none',
  cursor:         'pointer',
};

/* [textArea] */
const textAreaStyle: CSSProperties = {
  display:       'flex',
  flexDirection: 'column',
  alignItems:    'flex-start',
  alignSelf:     'stretch',
};

/* [itemTitle] — color는 hover 상태에 따라 동적으로 덮어씀 */
const itemTitleBaseStyle: CSSProperties = {
  fontFamily:    'var(--font-family-Pretendard, Pretendard)',
  fontSize:      'var(--font-size-18, 18px)',
  fontStyle:     'normal',
  fontWeight:    700,
  lineHeight:    'var(--font-lineHeight-18, 27px)',
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
  transition:    'color 0.2s ease-in-out',
};

/* [itemDesc] */
const itemDescStyle: CSSProperties = {
  color:         'var(--color-text-basic-secondary)',
  fontFamily:    'var(--font-family-Pretendard, Pretendard)',
  fontSize:      'var(--font-size-13, 13px)',
  fontStyle:     'normal',
  fontWeight:    400,
  lineHeight:    'var(--font-lineHeight-13, 20px)',
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
};

/* [imageFrame] 베이스 — 피그마 수치 통합 */
const baseImageFrameStyle: CSSProperties = {
  display:          'flex',
  width:            '267px',
  height:           '200px',
  flexDirection:    'column',
  justifyContent:   'flex-end',
  alignItems:       'flex-start',
  flexShrink:       0,
  aspectRatio:      '267 / 200',
  borderRadius:     'var(--cornerRadius-S, 8px)',
  backgroundColor:  'lightgray',
  backgroundRepeat: 'no-repeat',
  transition:       'transform 0.3s ease-out',
};

/* ──────────────────────────────────────────
   MenuItem (내부 컴포넌트)
────────────────────────────────────────── */

function MenuItem({ item }: { item: MegaMenuItemData }) {
  const [isHovered, setIsHovered] = useState(false);

  const dynamicTitleStyle: CSSProperties = {
    ...itemTitleBaseStyle,
    color: isHovered
      ? 'var(--color-text-optional-brand-primary, #36CD1E)'
      : 'var(--color-text-basic-secondary)',
    transition: 'color 0.2s ease-in-out',
  };

  const dynamicImageFrameStyle: CSSProperties = {
    ...baseImageFrameStyle,
    backgroundImage:    `url(${item.image})`,
    backgroundPosition: item.bgStyle?.backgroundPosition ?? '50%',
    backgroundSize:     item.bgStyle?.backgroundSize     ?? 'cover',
    transform:          isHovered ? 'scale(1.03)' : 'scale(1)',
  };

  return (
    <Link
      href={item.href}
      style={menuItemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 텍스트 (상단) */}
      <div style={textAreaStyle}>
        <span style={dynamicTitleStyle}>{item.label}</span>
        <span style={itemDescStyle}>{item.description}</span>
      </div>

      {/* 이미지 프레임 — 그라데이션 오버레이 + 배경 이미지 */}
      <div style={dynamicImageFrameStyle} />
    </Link>
  );
}

/* ──────────────────────────────────────────
   MegaMenuPanel
────────────────────────────────────────── */

export function MegaMenuPanel({ title, items }: MegaMenuPanelProps) {
  return (
    <div style={containerStyle}>
      <div style={contentsAreaStyle}>

        {/* 좌측: 섹션 타이틀 */}
        <div style={titleWrapperStyle}>
          <span style={headingStyle}>{title}</span>
        </div>

        {/* 우측: 아이템 리스트 */}
        <div style={menuItemsWrapperStyle}>
          {items.map((item) => (
            <MenuItem key={item.href} item={item} />
          ))}
        </div>

      </div>
    </div>
  );
}
