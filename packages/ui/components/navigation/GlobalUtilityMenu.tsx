"use client";

/**
 * GlobalUtilityMenu — 글로벌 유틸리티 메뉴 (다국어 등 부가 기능) 조립 컴포넌트
 *
 * 역할: 스타일을 직접 정의하지 않고,
 *       packages/ui 의 Dropdown(S) · Menu(M) 컴포넌트를 Wrapping 한다.
 *
 * 항목 종류별 렌더링:
 * ┌──────────────┬──────────────────────────────────────────────────────┐
 * │ 일반 링크     │ 직접 <Link> / <a> — hover·active 클래스 동일 토큰   │
 * │ 드롭다운 항목 │ <Dropdown size="S" trigger="click">                  │
 * │               │ → compact 패널에 서브메뉴 나열                       │
 * └──────────────┴──────────────────────────────────────────────────────┘
 *
 * isTransparent:
 *   Drawer 는 항상 bg-surface 위에 열리므로 기본값 false.
 *   인터페이스 일관성을 위해 prop 유지 (미래 확장).
 *
 * onClose / stopPropagation:
 *   최상위 div onClick={onClose} 버블링으로 링크 클릭 시 Drawer 닫기.
 *   Dropdown 트리거 클릭(패널 열기)은 e.stopPropagation() 으로 버블 차단.
 */

import { type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Dropdown }           from "../Dropdown";
import { Menu, type MenuItem } from "../Menu";
import type { NavItem }       from "./MegaNavMenu";

/* ──────────────────────────────────────────
   내부 유틸
────────────────────────────────────────── */

function cn(...c: (string | undefined | null | false)[]) {
  return c.filter(Boolean).join(" ");
}

/* ──────────────────────────────────────────
   Props
────────────────────────────────────────── */

export interface GlobalUtilityMenuProps {
  navItems: readonly NavItem[];
  /** 언어 전환 UI — NavigationBar 가 ReactNode 로 주입 */
  langRow?: ReactNode;
  onClose:  () => void;
  /**
   * NavigationBar isTransparent 상태.
   * Drawer 는 항상 bg-surface 이므로 기본값 false.
   * 인터페이스 일관성을 위해 prop 유지.
   */
  isTransparent?: boolean;
}

/* ──────────────────────────────────────────
   공통 아이템 클래스
  (Dropdown S 트리거 + 일반 링크 동일 토큰)
────────────────────────────────────────── */

const ITEM_BASE = cn(
  "flex w-full items-center justify-between",
  "px-m py-xs",
  "text-body-s font-medium",
  "rounded-fai-s",
  "transition-colors duration-200",
  "hover:bg-interaction-light-black-hover",
  "hover:text-primary",
);

/* ──────────────────────────────────────────
   Component
────────────────────────────────────────── */

export default function GlobalUtilityMenu({
  navItems,
  langRow,
  onClose,
  isTransparent = false,
}: GlobalUtilityMenuProps) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";

  /** locale prefix 부착 — 외부 URL 은 그대로 반환 */
  const lhref = (path: string) =>
    path.startsWith("http") ? path : locale ? `/${locale}${path}` : path;

  /*
   * Drawer 배경 = bg-surface → 항상 라이트 컨텍스트.
   * isTransparent=true 가 전달되더라도 토큰 스위칭이 동작하도록 작성.
   */
  const textColor = isTransparent ? "text-inverse" : "text-primary";

  /*
   * 문의하기 CTA — 항상 하단에 고정.
   * Menu M 을 통해 일관된 패딩·타이포 토큰 사용.
   */
  const ctaItem: MenuItem[] = [{ label: "문의하기", href: lhref("/contact") }];

  return (
    <>
      {/* ── 언어 선택 행 ── */}
      {langRow && (
        /*
         * px-m pt-2xl pb-l border-b — 모두 foundation 토큰
         * px-m=16px / pt-2xl=32px / pb-l=20px
         */
        <div className="flex items-center gap-m px-m pt-2xl pb-l border-b border-border-subtle">
          {langRow}
        </div>
      )}

      {/*
       * div onClick={onClose} — 버블링으로 Link 클릭 시 Drawer 닫기.
       * Dropdown 트리거는 stopPropagation 으로 버블 차단.
       */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div onClick={onClose} className="py-2xl flex flex-col gap-s px-m">

        {navItems.map((item) => {

          /* ── 드롭다운 항목 → Dropdown size="S" ── */
          if (item.dropdown && item.dropdownItems?.length) {
            return (
              <Dropdown
                key={item.label}
                size="S"
                trigger="click"
                /*
                 * DropdownItem 형식으로 변환.
                 * href 는 lhref() 로 locale prefix 처리 완료.
                 */
                items={item.dropdownItems.map((sub) => ({
                  label: sub.label,
                  href:  lhref(sub.href),
                }))}
                /*
                 * triggerEl — Dropdown S 컴팩트 트리거 버튼.
                 *   ITEM_BASE 토큰 공유: px-m py-xs text-body-s rounded-fai-s.
                 *   onClick: e.stopPropagation() 으로 onClose 버블링 차단.
                 *   ChevronDown: 열림 상태에 따라 180° 회전.
                 */
                triggerEl={(open, onToggle) => (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle?.();
                    }}
                    className={cn(ITEM_BASE, textColor)}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-m w-m shrink-0 transition-transform duration-200",
                        open ? "rotate-180" : "",
                      )}
                      aria-hidden
                    />
                  </button>
                )}
              />
            );
          }

          /* ── 외부 링크 ── */
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel ?? `${item.label} 바로가기`}
                className={cn(ITEM_BASE, textColor)}
              >
                {item.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-m h-m shrink-0"
                  aria-hidden="true"
                >
                  <g clipPath="url(#clip_recruit_m)">
                    <mask id="mask_recruit_m" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="3" width="10" height="10">
                      <path d="M12.2184 4.37577V11.9178C12.2183 12.2491 11.9496 12.5178 11.6183 12.5179C11.2874 12.5175 11.0192 12.2494 11.0189 11.9185L11.0196 5.82175L4.49958 12.3418C4.26528 12.576 3.88521 12.5767 3.65091 12.3425C3.41667 12.1082 3.41738 11.7281 3.65161 11.4938L10.1702 4.97516L4.07628 4.97585C3.74507 4.97578 3.47638 4.70696 3.47621 4.37577C3.47621 4.04444 3.74497 3.77577 4.07628 3.7757H12.2191L12.2184 4.37577Z" fill="black"/>
                    </mask>
                    <g mask="url(#mask_recruit_m)">
                      <rect width="16" height="16" fill="currentColor"/>
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip_recruit_m">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </a>
            );
          }

          /* ── 일반 내부 링크 ── */
          return (
            <Link
              key={item.label}
              href={lhref(item.href)}
              className={cn(ITEM_BASE, textColor)}
            >
              {item.label}
            </Link>
          );
        })}

        {/* 문의하기 CTA — Menu M 으로 일관된 토큰 적용 */}
        <Menu
          size="M"
          items={ctaItem}
          textColor={textColor}
          hoverBg="hover:bg-interaction-light-black-hover"
          hoverText="hover:text-primary"
        />
      </div>
    </>
  );
}
