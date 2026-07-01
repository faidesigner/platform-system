"use client";

/**
 * Menu — 티셔츠 사이즈 기반 메뉴 리스트 컴포넌트
 *
 * ┌─────┬───────────────┬────────────────────────────────────────────────────┐
 * │size │ 레이아웃      │ 용도 및 토큰 근거                                  │
 * ├─────┼───────────────┼────────────────────────────────────────────────────┤
 * │ S   │ 세로형 1열    │ 모바일 서랍 · 소형 드롭다운 · caption-m + gap-xs  │
 * │ M   │ 세로형 1열    │ 모바일 풀-리스트 · body-s + gap-s                 │
 * │ L   │ 가로형 열     │ 데스크톱 네비 · body + h-3xl(40px) + gap-4xl(56px)│
 * │ XL  │ 다단 그리드   │ 메가 메뉴 · body-s + grid-cols 변수 + gap-2xl    │
 * └─────┴───────────────┴────────────────────────────────────────────────────┘
 *
 * 토큰 출처:
 *   spacing.json  → gap-xs(6px) gap-s(8px) gap-m(16px) gap-l(20px)
 *                    gap-2xl(32px) gap-4xl(56px) h-3xl(40px) px-m(16px)
 *   typography    → text-caption-s/m  text-body-xs/s/ms/body/l/xl
 *   color-semantic→ text-primary text-secondary text-tertiary text-inverse
 *                    hover:bg-interaction-light-*-hover
 *   borderRadius  → rounded-s(8px)  rounded-ms(12px)
 *
 * 부작용 방어:
 *   - isTransparent 색 전환은 textColor / hoverBg props로 소비자(NavigationBar)가 주입.
 *     Menu는 해당 상태를 소유하지 않음.
 *   - next-intl 라우팅: href는 소비자가 lhref() 처리 후 전달.
 *     내부 Link는 next/link 그대로 사용.
 */

import { type ReactNode } from "react";
import Link from "next/link";

/* ──────────────────────────────────────────
   Public Types
────────────────────────────────────────── */

export type MenuSize = "S" | "M" | "L" | "XL";

export interface MenuItem {
  label:        string;
  href:         string;
  /** 아이템 하단 부가 설명 (M·XL에서 표시) */
  description?: string;
  /** 아이템 앞 아이콘 (S·M 세로형에서 표시) */
  icon?:        ReactNode;
  /** true → 새 탭으로 열림 */
  external?:    boolean;
  /**
   * 현재 활성 경로 여부.
   * 소비자가 pathname을 비교한 뒤 전달.
   */
  active?:      boolean;
  /**
   * 클릭 시 호출되는 콜백 (analytics 등 소비자 계측용).
   * 네비게이션(Link/외부 a)은 그대로 유지되며 콜백은 부가적으로 실행된다.
   */
  onClick?:     () => void;
}

export interface MenuSection {
  /** 섹션 구분 헤딩 (L·XL 다단 레이아웃에서 주로 사용) */
  heading?: string;
  items:    MenuItem[];
}

export interface MenuProps {
  /** 레이아웃·타이포·간격을 결정하는 티셔츠 사이즈 */
  size?: MenuSize;
  /**
   * 단일 평면 아이템 목록.
   * sections 미전달 시 자동으로 { items } 단일 섹션으로 래핑됨.
   */
  items?: MenuItem[];
  /**
   * 헤딩 포함 다중 섹션.
   * L / XL 다단 그리드에서 각 섹션이 하나의 열 역할을 함.
   */
  sections?: MenuSection[];
  /**
   * 기본 텍스트 색상 토큰 클래스.
   * NavigationBar isTransparent 상태에 따라 소비자가 주입:
   *   투명(다크)  → "text-inverse"
   *   서피스(라이트) → "text-primary"
   * 미전달 시 "text-primary" 사용.
   */
  textColor?: string;
  /**
   * 호버 배경 토큰 클래스.
   *   투명  → "hover:bg-interaction-light-white-hover"
   *   서피스 → "hover:bg-interaction-light-black-hover"
   * 미전달 시 서피스 hover 사용.
   */
  hoverBg?: string;
  /**
   * 호버 텍스트 색상 토큰 클래스.
   *   투명(다크 bg) → "hover:text-inverse"   (흰색 계열 유지)
   *   서피스(라이트) → "hover:text-primary"  (기본 라이트 모드 토큰)
   * 미전달 시 "hover:text-primary" 사용.
   */
  hoverText?: string;
  /**
   * XL 다단 그리드 열 수.
   * grid.json 브레이크포인트에 맞춰 소비자가 주입.
   * 미전달 시 sections 개수를 자동 적용 (최대 4열).
   */
  columns?: 2 | 3 | 4;
  className?: string;
}

/* ──────────────────────────────────────────
   내부 유틸
────────────────────────────────────────── */

function cn(...c: (string | undefined | null | false)[]) {
  return c.filter(Boolean).join(" ");
}

/* ──────────────────────────────────────────
   토큰 매핑 테이블
   모든 값은 root/foundation/spacing.json,
   typography-w.json 기반 Tailwind 토큰.
   임의 px 값 하드코딩 없음.
────────────────────────────────────────── */

/**
 * 섹션 리스트 래퍼 클래스.
 * S/M: flex-col (세로 단일열)
 * L:   flex items-center gap-4xl (가로 네비, 56px = spacing 4xl)
 * XL:  grid (열 수는 columns prop 또는 섹션 수 자동)
 */
const LIST_LAYOUT: Record<MenuSize, string> = {
  S:  "flex flex-col gap-xs",      // gap-xs = 0.375rem = 6px
  M:  "flex flex-col gap-s",       // gap-s  = 0.5rem  = 8px
  L:  "flex items-center gap-4xl", // gap-4xl = 3.5rem = 56px ← 기존 MegaNavMenu 하드코딩 대체
  XL: "grid gap-2xl",              // gap-2xl = 2rem = 32px; grid-cols-* 동적 주입
};

/**
 * 아이템 래퍼 링크/버튼 기반 클래스.
 * L: h-3xl(40px) = spacing 3xl = 2.5rem ← 기존 h-[40px] 대체
 */
const ITEM_BASE: Record<MenuSize, string> = {
  S:  "flex items-center gap-s px-m py-2xs rounded-fai-s w-full",
  M:  "flex items-center gap-m px-m py-xs  rounded-fai-s w-full",
  L:  "h-3xl flex justify-center items-center px-m rounded-fai-s", // h-3xl = 40px
  XL: "flex flex-col gap-2xs py-s",
};

/**
 * 아이템 레이블 타이포 토큰.
 * S: caption-m (12px) — 컴팩트 드롭다운 텍스트
 * M: body-s (14px)    — 모바일 메뉴 텍스트
 * L: body + semibold  — 데스크톱 네비 텍스트 ← 기존 text-[16px] leading-[24px] 대체
 * XL: body-s + medium — 메가 메뉴 아이템 레이블
 */
const LABEL_CLS: Record<MenuSize, string> = {
  S:  "text-caption-m",
  M:  "text-body-s",
  L:  "text-body font-semibold",
  XL: "text-body-s font-medium",
};

/**
 * 아이콘 크기 토큰 (S/M 세로형에서 사용).
 * L/XL은 일반적으로 아이콘 미사용이므로 빈 문자열.
 */
const ICON_CLS: Record<MenuSize, string> = {
  S:  "shrink-0 w-m h-m",   // w-m = 1rem = 16px
  M:  "shrink-0 w-l h-l",   // w-l = 1.25rem = 20px
  L:  "",
  XL: "",
};

/**
 * 설명 텍스트 타이포 토큰.
 * L은 가로형이라 설명 텍스트 미노출 (빈 문자열).
 */
const DESC_CLS: Record<MenuSize, string> = {
  S:  "text-caption-s text-tertiary leading-none",
  M:  "text-caption-m text-tertiary",
  L:  "",
  XL: "text-caption-m text-tertiary",
};

/**
 * 섹션 헤딩 (L/XL 다단에서 섹션 구분선 역할).
 * S/M은 헤딩 렌더링 생략.
 */
const HEADING_CLS: Record<MenuSize, string> = {
  S:  "",
  M:  "",
  L:  "text-caption-m font-semibold uppercase tracking-widest text-tertiary mb-ms select-none",
  XL: "text-caption-m font-semibold uppercase tracking-widest text-tertiary mb-ms select-none",
};

/* ──────────────────────────────────────────
   서브 컴포넌트 — MenuItemEl
────────────────────────────────────────── */

interface MenuItemElProps {
  item:      MenuItem;
  size:      MenuSize;
  textColor: string;
  hoverBg:   string;
  hoverText: string;
}

function MenuItemEl({ item, size, textColor, hoverBg, hoverText }: MenuItemElProps) {
  /**
   * 활성 아이템: text-primary font-bold
   * (isTransparent 여부 무관 — 강조 토큰 고정)
   * 비활성 아이템: textColor + hoverText 소비자 주입값 사용
   */
  const colorCls = cn(textColor, hoverText);

  const baseCls = cn(
    ITEM_BASE[size],
    "transition-colors duration-200",
    hoverBg,
    colorCls,
  );

  const inner = (
    <>
      {/* 아이콘 (S/M 전용) */}
      {item.icon && ICON_CLS[size] && (
        <span className={ICON_CLS[size]} aria-hidden>
          {item.icon}
        </span>
      )}

      {/* 레이블 + 설명 묶음 */}
      <span className={cn("flex flex-col", size === "XL" ? "gap-2xs" : size === "M" && item.description ? "gap-3xs" : undefined)}>
        <span className={cn(LABEL_CLS[size], item.active && size === "L" ? "font-bold" : undefined)}>{item.label}</span>

        {/* 설명 (L은 항상 숨김) */}
        {item.description && DESC_CLS[size] && (
          <span className={DESC_CLS[size]}>{item.description}</span>
        )}
      </span>
    </>
  );

  const commonProps = {
    className: baseCls,
    role:      "menuitem" as const,
  };

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={item.onClick} {...commonProps}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={item.onClick} {...commonProps}>
      {inner}
    </Link>
  );
}

/* ──────────────────────────────────────────
   서브 컴포넌트 — MenuSectionEl
────────────────────────────────────────── */

interface MenuSectionElProps {
  section:   MenuSection;
  size:      MenuSize;
  textColor: string;
  hoverBg:   string;
  hoverText: string;
}

function MenuSectionEl({ section, size, textColor, hoverBg, hoverText }: MenuSectionElProps) {
  const showHeading = Boolean(section.heading && HEADING_CLS[size]);

  /* 섹션 내 아이템 간격 토큰 */
  const itemGap: Record<MenuSize, string> = {
    S:  "gap-xs",
    M:  "gap-s",
    L:  "gap-4xl",  // L은 ListLayout에서 gap을 처리하므로 여기선 gap-0
    XL: "gap-s",
  };

  return (
    <div className="flex flex-col">
      {showHeading && (
        <p className={HEADING_CLS[size]}>{section.heading}</p>
      )}
      <ul
        className={cn("flex flex-col", itemGap[size])}
        role="none"
      >
        {section.items.map((item) => (
          <li key={`${item.href}-${item.label}`} role="none">
            <MenuItemEl
              item={item}
              size={size}
              textColor={textColor}
              hoverBg={hoverBg}
              hoverText={hoverText}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────
   Menu — 메인 컴포넌트
────────────────────────────────────────── */

export function Menu({
  size      = "M",
  items,
  sections,
  textColor = "text-primary",
  hoverBg   = "hover:bg-interaction-light-black-hover",
  hoverText = "hover:text-primary",
  columns,
  className,
}: MenuProps) {
  /**
   * sections 미전달 시 items를 단일 섹션으로 정규화.
   * L 가로형에서는 각 item이 개별 섹션처럼 동작하므로 flat 처리.
   */
  const normalizedSections: MenuSection[] =
    sections && sections.length > 0
      ? sections
      : [{ items: items ?? [] }];

  /**
   * XL grid-cols 결정:
   * columns prop > sections 개수 > 기본 4
   * 최대 4열 (grid.json desktop 12-col 기준)
   */
  const colCount =
    columns ??
    Math.min(normalizedSections.length || 1, 4) as 2 | 3 | 4;

  const colClass: Record<2 | 3 | 4, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  /**
   * L(가로형) 특수 처리:
   * 섹션 개념 없이 모든 아이템을 flat하게 flex row로 나열.
   */
  const isHorizontal = size === "L";

  if (isHorizontal) {
    const allItems = normalizedSections.flatMap((s) => s.items);
    return (
      <ul
        className={cn(LIST_LAYOUT[size], className)}
        role="menu"
        aria-orientation="horizontal"
      >
        {allItems.map((item) => (
          <li key={`${item.href}-${item.label}`} role="none">
            <MenuItemEl
              item={item}
              size={size}
              textColor={textColor}
              hoverBg={hoverBg}
              hoverText={hoverText}
            />
          </li>
        ))}
      </ul>
    );
  }

  /* S / M / XL — 세로형 또는 그리드 */
  const listCls = cn(
    LIST_LAYOUT[size],
    size === "XL" && colClass[colCount],
    className,
  );

  return (
    <div
      className={listCls}
      role="menu"
      aria-orientation={size === "XL" ? "horizontal" : "vertical"}
    >
      {normalizedSections.map((section, si) => (
        <MenuSectionEl
          key={section.heading ?? si}
          section={section}
          size={size}
          textColor={textColor}
          hoverBg={hoverBg}
          hoverText={hoverText}
        />
      ))}
    </div>
  );
}
