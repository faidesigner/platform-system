"use client";

/**
 * MegaNavMenu — 메인 네비게이션 메가 메뉴 조립 컴포넌트
 *
 * 역할: 스타일을 직접 정의하지 않고,
 *       packages/ui 의 Menu(L) · Dropdown(XL) 컴포넌트를 조립(Wrapping)한다.
 *
 * ┌──────────────────┬───────────────────────────────────────────────────────┐
 * │ 항목 종류         │ 사용 컴포넌트                                          │
 * ├──────────────────┼───────────────────────────────────────────────────────┤
 * │ 일반 내부/외부 링크│ Menu  size="L"  (gap-4xl · h-3xl · text-body)        │
 * │ 드롭다운 메가메뉴 │ Dropdown size="XL" trigger="hover" (container 1140px) │
 * └──────────────────┴───────────────────────────────────────────────────────┘
 *
 * isTransparent 색 전환:
 *   textColor / hoverBg / hoverText 를 파생해 Menu · Dropdown triggerEl 으로 주입.
 *   semantic 토큰(text-inverse ↔ text-primary)으로만 스위칭.
 *
 * next-intl 라우팅:
 *   lhref() 로 href 를 전처리한 뒤 MenuItem.href 에 주입.
 *   내부 Link 는 next/link 그대로 유지.
 */

import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { Menu, type MenuItem } from "../Menu";
import { Dropdown, type DropdownGroup } from "../Dropdown";

/* ──────────────────────────────────────────
   Types
────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href:  string;
  dropdown?:      boolean;
  dropdownItems?: readonly { label: string; href: string }[];
  external?:      boolean;
  /** 외부 링크 전용 접근성 레이블 (스크린 리더용) */
  ariaLabel?:     string;
}

export interface MegaNavMenuProps {
  isTransparent: boolean;
  navItems:      readonly NavItem[];
}

/**
 * navItems 를 렌더링 단위(Segment)로 분절.
 * 연속된 일반 항목 → 하나의 regular 세그먼트(Menu L 1개).
 * 드롭다운 항목    → 독립 dropdown 세그먼트(Dropdown XL 1개).
 * 이 구조 덕분에 항목 순서가 보장된다.
 */
type Segment =
  | { kind: "dropdown"; item: NavItem }
  | { kind: "regular";  items: NavItem[] };

function cn(...c: (string | undefined | null | false)[]) {
  return c.filter(Boolean).join(" ");
}

/* ──────────────────────────────────────────
   Component
────────────────────────────────────────── */

export default function MegaNavMenu({ isTransparent, navItems }: MegaNavMenuProps) {
  const pathname = usePathname();
  const params   = useParams();
  const locale   = typeof params?.locale === "string" ? params.locale : "";

  /** locale prefix 부착 — 외부 URL 은 그대로 반환 */
  const lhref = (path: string) =>
    path.startsWith("http") ? path : locale ? `/${locale}${path}` : path;

  /** active 판정 (외부 링크는 항상 false) */
  const isItemActive = (href: string, external = false): boolean => {
    if (external || href.startsWith("http")) return false;
    const full = lhref(href);
    return (
      pathname === full ||
      (href !== "/" && pathname.startsWith(`${full}/`))
    );
  };

  /* ── isTransparent → semantic 색상 토큰 ── */
  const textColor = isTransparent
    ? "text-inverse"
    : "text-primary";
  const hoverBg = isTransparent
    ? "hover:bg-interaction-light-white-hover"
    : "hover:bg-interaction-light-black-hover";
  /*
   * hoverText: 투명 배경(흰색 텍스트)에서 hover 시에도 inverse 계열 유지.
   * hover:text-primary를 하드코딩하면 흰 텍스트 → 어두운 색으로 변환되는 오류 발생.
   */
  const hoverText = isTransparent
    ? "hover:text-inverse"
    : "hover:text-primary";

  /* ── navItems → Segment[] 분절 ── */
  const segments = navItems.reduce<Segment[]>((acc, item) => {
    if (item.dropdown) {
      acc.push({ kind: "dropdown", item });
    } else {
      const last = acc[acc.length - 1];
      if (last?.kind === "regular") {
        last.items.push(item);       // 연속 일반 항목 → 동일 세그먼트에 병합
      } else {
        acc.push({ kind: "regular", items: [item] });
      }
    }
    return acc;
  }, []);

  return (
    /*
     * 외부 <nav> : hidden tablet:flex items-center gap-4xl
     *   gap-4xl(3.5rem = 56px) — spacing.json 4XL 토큰
     *   직접 자식: Dropdown(div) | Menu(ul) — 둘 다 flex item 으로 참여
     */
    <nav
      className="hidden tablet:flex items-center gap-4xl"
      aria-label="메인 네비게이션 메가 메뉴"
    >
      {segments.map((seg, idx) => {

        /* ── 드롭다운 세그먼트 → Dropdown XL ── */
        if (seg.kind === "dropdown") {
          const { item } = seg;
          const active   = isItemActive(item.href);

          const groups: DropdownGroup[] = [
            {
              items: (item.dropdownItems ?? []).map((sub) => ({
                label: sub.label,
                href:  lhref(sub.href),
              })),
            },
          ];

          return (
            <Dropdown
              key={item.label}
              size="XL"
              trigger="hover"
              /* flex items-center: nav flex 라인에서 버튼 수직 정렬 보장 */
              className="flex items-center"
              triggerEl={(open) => (
                /*
                 * 트리거 버튼 — 하드코딩 px 없음:
                 *   h-3xl = 2.5rem = 40px  (spacing 3XL 토큰)
                 *   px-m  = 1rem   = 16px  (spacing M 토큰)
                 *   rounded-fai-s = 0.5rem (cornerRadius S 토큰)
                 *   gap-s = 0.5rem = 8px   (spacing S 토큰)
                 *   text-body = 1rem/1.5rem (typography text-M 토큰)
                 */
                <button
                  type="button"
                  className={cn(
                    "h-3xl flex justify-center items-center px-m rounded-fai-s",
                    "transition-colors duration-200 cursor-pointer",
                    hoverBg,
                    hoverText,
                    textColor,
                  )}
                >
                  <span className={cn("flex items-center gap-s text-body", active ? "font-bold" : "font-semibold")}>
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-m w-m shrink-0 transition-transform duration-200",
                        open ? "rotate-180" : "",
                      )}
                      aria-hidden
                    />
                  </span>
                </button>
              )}
              groups={groups}
            />
          );
        }

        /* ── 일반 세그먼트 → Menu L ── */
        /*
         * Menu L 은 <ul flex items-center gap-4xl> 를 렌더링.
         * 외부 nav 의 gap-4xl 이 Dropdown 과 Menu 사이 간격을 담당.
         * Menu 내부 gap-4xl 이 일반 항목 간 간격을 담당.
         * → 전체 네비 항목이 동일한 gap-4xl(56px) 로 균등 배열됨.
         */
        /* 외부 링크(채용) / 내부 링크 분리 */
        const regularMenuItems: MenuItem[] = [];
        const externalNavItems: NavItem[]  = [];

        seg.items.forEach((item) => {
          if (item.external) {
            externalNavItems.push(item);
          } else {
            regularMenuItems.push({
              label:  item.label,
              href:   lhref(item.href),
              active: isItemActive(item.href, false),
            });
          }
        });

        return (
          <Fragment key={idx}>
            {regularMenuItems.length > 0 && (
              <Menu
                size="L"
                items={regularMenuItems}
                textColor={textColor}
                hoverBg={hoverBg}
                hoverText={hoverText}
              />
            )}
            {externalNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel ?? `${item.label} 바로가기`}
                className={cn(
                  "flex justify-center items-center w-[83px] h-3xl rounded-fai-s",
                  "transition-colors duration-200",
                  hoverBg,
                )}
              >
                <div className="flex justify-center items-center h-3xl py-s px-ms gap-3xs">
                  <span className={cn("text-[length:var(--font-size-16,16px)] leading-[var(--font-lineHeight-16,24px)] font-semibold text-center", textColor)}>
                    {item.label}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={cn("w-m h-m shrink-0", textColor)}
                    aria-hidden="true"
                  >
                    <g clipPath="url(#clip_recruit)">
                      <mask id="mask_recruit" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="3" width="10" height="10">
                        <path d="M12.2184 4.37577V11.9178C12.2183 12.2491 11.9496 12.5178 11.6183 12.5179C11.2874 12.5175 11.0192 12.2494 11.0189 11.9185L11.0196 5.82175L4.49958 12.3418C4.26528 12.576 3.88521 12.5767 3.65091 12.3425C3.41667 12.1082 3.41738 11.7281 3.65161 11.4938L10.1702 4.97516L4.07628 4.97585C3.74507 4.97578 3.47638 4.70696 3.47621 4.37577C3.47621 4.04444 3.74497 3.77577 4.07628 3.7757H12.2191L12.2184 4.37577Z" fill="black"/>
                      </mask>
                      <g mask="url(#mask_recruit)">
                        <rect width="16" height="16" fill="currentColor"/>
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip_recruit">
                        <rect width="16" height="16" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </a>
            ))}
          </Fragment>
        );
      })}
    </nav>
  );
}
