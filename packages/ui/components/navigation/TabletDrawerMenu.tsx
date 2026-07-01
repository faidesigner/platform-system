'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productMenu } from '@/config/site';
import { DrawerMenu, DrawerListItem } from './DrawerPrimitives';
import type { NavItem } from './MegaNavMenu';

/* ---------------- 하위 아코디언 스타일 및 컴포넌트 ---------------- */
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

function SubMenuItem({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onNavigate}
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

/* ---------------- SVG 아이콘 ---------------- */
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

/* ---------------- Tablet Drawer 메인 컨텐츠 ---------------- */

/**
 * 드로어 nav 라벨 세트 — i18n 비결합(@fai/ui는 next-intl을 import하지 않음).
 * 소비자(homepage 브릿지)가 번역 문자열을 주입하며, 미지정 값은 한국어 기본값을 사용한다.
 */
export interface DrawerLabels {
  products?: string;
  about?:    string;
  media?:    string;
  careers?:  string;
  contact?:  string;
}

const DEFAULT_DRAWER_LABELS: Required<DrawerLabels> = {
  products: '제품',
  about:    '회사소개',
  media:    '미디어',
  careers:  '채용',
  contact:  '문의하기',
};

export interface TabletDrawerMenuProps {
  onNavigate?: () => void;
  /**
   * 최상위 nav 항목 활성화(클릭) 시 호출되는 콜백 (analytics 등 소비자 계측용).
   * 데스크톱 MegaNavMenu의 onItemClick과 동일한 계약: 외부 링크(채용)·제품 하위 항목은 호출되지 않는다.
   * 제품은 아코디언 헤더(토글) 클릭 시 1회 호출된다.
   */
  onItemClick?: (item: NavItem) => void;
  /**
   * 문의하기 CTA 클릭 시 호출되는 콜백 (analytics 등 소비자 계측용).
   * 기존 라우팅(/contact 이동) 동작 및 onNavigate(드로어 닫힘)는 그대로 유지되며 콜백이 함께 호출된다.
   */
  onContactClick?: () => void;
  /** nav 라벨 오버라이드(번역 주입용). 미지정 값은 한국어 기본값. */
  labels?: DrawerLabels;
}

export function TabletDrawerMenu({ onNavigate, onItemClick, onContactClick, labels }: TabletDrawerMenuProps) {
  const l = { ...DEFAULT_DRAWER_LABELS, ...labels };
  const [productOpen, setProductOpen] = useState(false);
  const params  = useParams();
  const locale  = typeof params?.locale === 'string' ? params.locale : '';
  const lhref   = (path: string) =>
    path.startsWith('http') ? path : locale ? `/${locale}${path}` : path;

  return (
    <DrawerMenu>
      {/* 1. 제품 — 확장형 아코디언 (하위 항목은 계측 대상 아님 — 데스크톱과 동일) */}
      <DrawerListItem
        label={l.products}
        onClick={() => {
          if (!productOpen) onItemClick?.({ label: l.products, href: '/products' });
          setProductOpen((v) => !v);
        }}
        rightIcon={productOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      >
        {productOpen && (
          <div style={subLayerWrapperStyle}>
            {productMenu.map((p) => (
              <SubMenuItem key={p.href} href={lhref(p.href)} label={p.label} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </DrawerListItem>

      {/* 2. 일반 내부 링크 */}
      <DrawerListItem
        label={l.about}
        href={lhref('/about')}
        onClick={() => { onNavigate?.(); onItemClick?.({ label: l.about, href: '/about' }); }}
      />
      <DrawerListItem
        label={l.media}
        href={lhref('/media')}
        onClick={() => { onNavigate?.(); onItemClick?.({ label: l.media, href: '/media' }); }}
      />

      {/* 3. 채용 — 외부 링크 ↗ (계측 대상 아님) */}
      <DrawerListItem
        label={l.careers}
        href="https://faindersai.career.greetinghr.com/ko/home"
        isExternal={true}
        onClick={onNavigate}
        rightIcon={<ArrowUpRightIcon />}
      />

      {/* 4. 문의하기 — 내부 링크 (리드 CTA) */}
      <DrawerListItem
        label={l.contact}
        href={lhref('/contact')}
        onClick={() => { onNavigate?.(); onContactClick?.(); }}
      />
    </DrawerMenu>
  );
}
