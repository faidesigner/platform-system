'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { NavItem } from './MegaNavMenu';

/* ──────────────────────────────────────────
   Props
────────────────────────────────────────── */

export interface TabletDrawerMenuProps {
  navItems: readonly NavItem[];
  langRow?: ReactNode;
  onClose: () => void;
}

/* ──────────────────────────────────────────
   스타일 토큰
────────────────────────────────────────── */

const menuContainerWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  borderRadius: 'var(--cornerRadius-S, 8px)',
  width: '100%',
};

const layerStyle: React.CSSProperties = {
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

const textStyle: React.CSSProperties = {
  color: 'var(--color-text-basic-secondary, #3A3D40)',
  textAlign: 'center',
  fontFamily: 'var(--font-family-Pretendard, Pretendard)',
  fontSize: 'var(--font-size-16, 16px)',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'var(--font-lineHeight-16, 24px)',
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
};

const subLayerWrapperStyle: React.CSSProperties = {
  display: 'flex',
  padding: 'var(--padding-ms, 12px) var(--padding-3-xl, 40px)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  background: 'var(--color-filled-basic-fourth, #F5F5F5)',
  boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.05) inset',
  width: '100%',
};

const subMenuItemBaseStyle: React.CSSProperties = {
  display: 'flex',
  padding: 'var(--padding-ms, 12px) var(--padding-l, 20px)',
  alignItems: 'center',
  alignSelf: 'stretch',
  borderRadius: 'var(--cornerRadius-S, 8px)',
  textDecoration: 'none',
  transition: 'background 0.2s ease',
};

/* ──────────────────────────────────────────
   아이콘
────────────────────────────────────────── */

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <mask id="mask0_6638_6191" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1" y="5" width="14" height="7">
        <path d="M2.66406 6L7.99731 11L13.3307 6" stroke="#1F2023" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask="url(#mask0_6638_6191)">
        <rect width="16" height="16" fill="#1F2023" />
      </g>
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <mask id="mask0_6624_5743" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="2" y="5" width="12" height="7">
        <path d="M13.3359 11L8.00269 6L2.66927 11" stroke="#1F2023" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask="url(#mask0_6624_5743)">
        <rect width="16" height="16" fill="#1F2023" />
      </g>
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#clip0_6638_6205)">
        <mask id="mask0_6638_6205" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="3" y="3" width="10" height="10">
          <path d="M12.2184 4.37577V11.9178C12.2183 12.2491 11.9496 12.5178 11.6183 12.5179C11.2874 12.5175 11.0192 12.2494 11.0189 11.9185L11.0196 5.82175L4.49958 12.3418C4.26528 12.576 3.88521 12.5767 3.65091 12.3425C3.41667 12.1082 3.41738 11.7281 3.65161 11.4938L10.1702 4.97516L4.07628 4.97585C3.74507 4.97578 3.47638 4.70696 3.47621 4.37577C3.47621 4.04444 3.74497 3.77577 4.07628 3.7757H12.2191L12.2184 4.37577Z" fill="black" />
        </mask>
        <g mask="url(#mask0_6638_6205)">
          <rect width="16" height="16" fill="#1F2023" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_6638_6205">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ──────────────────────────────────────────
   서브 메뉴 아이템
────────────────────────────────────────── */

function SubMenuItem({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...subMenuItemBaseStyle,
        background: isHovered ? 'var(--color-interaction-light-black-hover, rgba(0, 0, 0, 0.03))' : 'transparent',
      }}
    >
      <span style={textStyle}>{label}</span>
    </Link>
  );
}

/* ──────────────────────────────────────────
   Component
────────────────────────────────────────── */

export function TabletDrawerMenu({ navItems, langRow, onClose }: TabletDrawerMenuProps) {
  const [openLabels, setOpenLabels] = useState<Set<string>>(new Set());

  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : '';

  const lhref = (path: string) =>
    path.startsWith('http') ? path : locale ? `/${locale}${path}` : path;

  const toggle = (label: string) =>
    setOpenLabels((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  return (
    <>
      {/* ── 언어 선택 행 ── */}
      {langRow && (
        <div className="flex items-center gap-m px-m pt-2xl pb-l border-b border-border-subtle">
          {langRow}
        </div>
      )}

      {/* ── 네비 아이템 목록 ── */}
      <nav style={menuContainerWrapperStyle} aria-label="태블릿 드로어 네비게이션">

        {navItems.map((item) => {

          /* 1. 아코디언 드롭다운 */
          if (item.dropdown && item.dropdownItems?.length) {
            const isOpen = openLabels.has(item.label);
            return (
              <div key={item.label} style={{ width: '100%' }}>
                <button
                  type="button"
                  style={layerStyle}
                  aria-expanded={isOpen}
                  onClick={() => toggle(item.label)}
                >
                  <span style={textStyle}>{item.label}</span>
                  {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>

                {isOpen && (
                  <div style={subLayerWrapperStyle}>
                    {item.dropdownItems.map((sub) => (
                      <SubMenuItem
                        key={sub.href}
                        href={lhref(sub.href)}
                        label={sub.label}
                        onClick={onClose}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          /* 2. 외부 링크 */
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel ?? `${item.label} 바로가기`}
                style={layerStyle}
                onClick={onClose}
              >
                <span style={textStyle}>{item.label}</span>
                <ArrowUpRightIcon />
              </a>
            );
          }

          /* 3. 일반 내부 링크 */
          return (
            <Link
              key={item.label}
              href={lhref(item.href)}
              style={layerStyle}
              onClick={onClose}
            >
              <span style={textStyle}>{item.label}</span>
            </Link>
          );
        })}

        {/* 문의하기 CTA */}
        <Link href={lhref('/contact')} style={layerStyle} onClick={onClose}>
          <span style={textStyle}>문의하기</span>
        </Link>

      </nav>
    </>
  );
}
