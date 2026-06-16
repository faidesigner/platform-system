"use client";

/**
 * Dropdown — 티셔츠 사이즈 기반 범용 드롭다운 + 메가 메뉴 컴포넌트
 *
 * ┌──────────┬────────────┬──────────────────────────────────────────────┐
 * │ size     │ 패널 형태  │ 설명                                         │
 * ├──────────┼────────────┼──────────────────────────────────────────────┤
 * │ S        │ compact    │ 트리거 기준 absolute, 내용 폭 자동           │
 * │ M        │ compact    │ 트리거 기준 absolute, 내용 폭 자동           │
 * │ L        │ mega menu  │ fixed full-width + container(1140px) 내부 flex│
 * │ XL       │ mega menu  │ fixed full-width + container(1140px) 4-col grid│
 * └──────────┴────────────┴──────────────────────────────────────────────┘
 *
 * CSS 변수 계약:
 *   소비 컴포넌트(NavigationBar 등)의 <header>에
 *   style={{ '--nav-h': '4rem' }} 을 선언하면 메가 메뉴가 정확히 nav 아래에 위치.
 *   미선언 시 fallback 4rem 적용.
 *
 * 토큰 출처:
 *   root/foundation/spacing.json → Tailwind spacing (s, m, l, xl, 2xl, 3xl …)
 *   root/foundation/color-semantic.json → bg-surface, text-primary, border-border-subtle …
 *   root/web/tokens/grid.json → container (max-w 1140px @ desktop)
 */

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import Link from "next/link";

/* ──────────────────────────────────────────
   Public Types
────────────────────────────────────────── */

export type DropdownSize    = "S" | "M" | "L" | "XL";
export type DropdownTrigger = "hover" | "click";

export interface DropdownItem {
  label:        string;
  href:         string;
  /** 메가 메뉴에서 아이템 하단에 표시되는 부가 설명 */
  description?: string;
  /** true면 새 탭으로 열림 */
  external?:    boolean;
}

export interface DropdownGroup {
  /** 섹션 헤딩 (선택) */
  heading?: string;
  items:    DropdownItem[];
}

export interface DropdownProps {
  /** S / M → compact panel | L / XL → mega menu */
  size?: DropdownSize;
  /**
   * hover (L/XL 기본) | click (S/M 기본).
   * trigger prop을 명시하면 사이즈 기본값을 덮어씀.
   */
  trigger?: DropdownTrigger;
  /**
   * 트리거 렌더 함수.
   * @param open      패널 표시 여부
   * @param onToggle  click 모드일 때만 전달 — 트리거 버튼 onClick에 연결
   */
  triggerEl: (open: boolean, onToggle?: () => void) => ReactNode;
  /**
   * S/M compact: 단일 아이템 목록.
   * href는 소비 컴포넌트에서 locale prefix 적용 후 전달.
   */
  items?: DropdownItem[];
  /**
   * L/XL mega menu: 섹션 헤딩 + 아이템 묶음.
   * href는 소비 컴포넌트에서 locale prefix 적용 후 전달.
   */
  groups?: DropdownGroup[];
  /**
   * 완전 커스텀 패널 콘텐츠.
   * 전달하면 items / groups 자동 렌더링을 완전히 대체.
   */
  panel?: ReactNode;
  /** S/M compact 패널 정렬 방향. @default "left" */
  panelAlign?: "left" | "right";
  /** 루트 래퍼 추가 className */
  className?: string;
  /** 패널 래퍼 추가 className */
  panelClassName?: string;
}

/* ──────────────────────────────────────────
   내부 유틸
────────────────────────────────────────── */

const isMega = (s: DropdownSize): s is "L" | "XL" => s === "L" || s === "XL";

function cn(...c: (string | undefined | null | false)[]) {
  return c.filter(Boolean).join(" ");
}

/* ──────────────────────────────────────────
   패널 래퍼 토큰 매핑
   (포지셔닝 + 서피스 + 보더 — 모두 foundation 토큰)
────────────────────────────────────────── */

/**
 * S/M compact: 트리거 기준 absolute 드롭다운.
 * M은 rounded-ms(0.75rem) 로 S(rounded-s, 0.5rem)보다 부드러운 곡률.
 */
const COMPACT_PANEL: Record<"S" | "M", string> = {
  S: cn(
    "absolute top-full left-0 mt-2xs z-40",
    "min-w-max",
    "bg-surface border border-border-subtle rounded-fai-s overflow-hidden",
  ),
  M: cn(
    "absolute top-full left-0 mt-2xs z-40",
    "min-w-max",
    "bg-surface border border-border-subtle rounded-fai-ms overflow-hidden",
  ),
};

/**
 * L/XL mega menu: viewport 기준 fixed 전폭 바.
 * top은 --nav-h CSS 변수로 소비 컴포넌트와 연동.
 * fallback 4rem = NavigationBar h-16 높이.
 */
const MEGA_PANEL_OUTER = cn(
  "fixed left-0 right-0 top-[var(--nav-h,4rem)] z-40",
  "bg-surface border-t border-border-subtle",
);

/**
 * 메가 메뉴 내부 레이아웃:
 *   L  → flex wrap (유연한 다단 나열)
 *   XL → 4-column grid (구조적 대형 메뉴)
 * container 클래스가 desktop 시 1140px max-w + 자동 center 처리.
 */
const MEGA_INNER: Record<"L" | "XL", string> = {
  L:  "container flex flex-wrap gap-2xl py-2xl",
  XL: "container grid grid-cols-4 gap-2xl py-3xl",
};

/**
 * S/M 아이템 텍스트·패딩 토큰.
 * S: caption-m(0.75rem) + py-xs(0.375rem) — 컴팩트
 * M: body-s(0.875rem)   + py-s(0.5rem)   — 표준
 */
const COMPACT_ITEM: Record<"S" | "M", string> = {
  S: cn(
    "block w-full text-left",
    "px-m py-xs",
    "text-caption-m text-secondary",
    "hover:bg-interaction-light-black-hover hover:text-primary",
    "transition-colors duration-200 whitespace-nowrap",
  ),
  M: cn(
    "block w-full text-left",
    "px-m py-s",
    "text-body-s text-secondary",
    "hover:bg-interaction-light-black-hover hover:text-primary",
    "transition-colors duration-200 whitespace-nowrap",
  ),
};

/* ──────────────────────────────────────────
   서브 렌더러 — CompactPanel
────────────────────────────────────────── */

function CompactPanel({
  size,
  items,
}: {
  size:  "S" | "M";
  items: DropdownItem[];
}) {
  const cls = COMPACT_ITEM[size];
  if (!items.length) return null;

  return (
    <ul role="menu">
      {items.map((item) =>
        item.external ? (
          <li key={item.label} role="none">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className={cls}
            >
              {item.label}
            </a>
          </li>
        ) : (
          <li key={item.label} role="none">
            <Link href={item.href} role="menuitem" className={cls}>
              {item.label}
            </Link>
          </li>
        )
      )}
    </ul>
  );
}

/* ──────────────────────────────────────────
   서브 렌더러 — MegaPanel
────────────────────────────────────────── */

function MegaPanel({
  size,
  groups,
}: {
  size:   "L" | "XL";
  groups: DropdownGroup[];
}) {
  if (!groups.length) return null;

  return (
    <div className={MEGA_INNER[size]} role="menu">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-m">
          {/* 섹션 헤딩 — caption-m + tertiary 토큰 */}
          {group.heading && (
            <p className="text-caption-m font-semibold uppercase tracking-widest text-tertiary select-none">
              {group.heading}
            </p>
          )}

          <ul className="flex flex-col gap-s" role="none">
            {group.items.map((item) => {
              const inner = (
                <>
                  <span className="text-body-s font-medium text-secondary group-hover:text-primary transition-colors duration-200">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-caption-m text-tertiary group-hover:text-secondary transition-colors duration-200">
                      {item.description}
                    </span>
                  )}
                </>
              );

              return (
                <li key={item.label} role="none">
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      className="group flex flex-col gap-2xs"
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      role="menuitem"
                      className="group flex flex-col gap-2xs"
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Dropdown — 메인 컴포넌트
────────────────────────────────────────── */

export function Dropdown({
  size           = "M",
  trigger,
  triggerEl,
  items          = [],
  groups         = [],
  panel,
  panelAlign     = "left",
  className,
  panelClassName,
}: DropdownProps) {
  /**
   * trigger 미지정 시:
   *   L/XL(메가) → hover (네비게이션 UX 표준)
   *   S/M(컴팩트) → click
   */
  const resolvedTrigger: DropdownTrigger =
    trigger ?? (isMega(size) ? "hover" : "click");

  const [open, setOpen]   = useState(false);
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const closeTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── click 모드: 외부 클릭 시 닫기 ── */
  useEffect(() => {
    if (resolvedTrigger !== "click") return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [resolvedTrigger]);

  /* ── hover 모드: 언마운트 시 타이머 정리 ── */
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  /* ── 공통: Escape 키로 닫기 ── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => setOpen((v) => !v);

  /* ── hover 모드: 마우스 진입/이탈 (딜레이 클로즈) ── */
  const hoverProps =
    resolvedTrigger === "hover"
      ? {
          onMouseEnter: () => {
            if (closeTimerRef.current) {
              clearTimeout(closeTimerRef.current);
              closeTimerRef.current = null;
            }
            setOpen(true);
          },
          onMouseLeave: () => {
            closeTimerRef.current = setTimeout(() => setOpen(false), 200);
          },
        }
      : {};

  /* ── 패널 콘텐츠 결정 ── */
  const panelContent =
    panel ?? (
      isMega(size) ? (
        <MegaPanel size={size} groups={groups} />
      ) : (
        <CompactPanel size={size} items={items} />
      )
    );

  /* ── 패널 래퍼 클래스 결정 ── */
  const panelWrapperCls = isMega(size)
    ? cn(MEGA_PANEL_OUTER, panelClassName)
    : cn(
        "absolute top-full mt-2xs z-40 min-w-max",
        "bg-surface border border-border-subtle overflow-hidden",
        size === "M" ? "rounded-fai-ms" : "rounded-fai-s",
        panelAlign === "right" ? "right-0" : "left-0",
        panelClassName,
      );

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      {...hoverProps}
    >
      {/*
       * triggerEl render prop:
       *   - open: 패널 표시 여부 → 트리거 스타일 분기(예: ChevronDown 회전)에 사용
       *   - onToggle: click 모드에서만 전달 → 트리거 버튼 onClick에 연결
       *   - isTransparent 등 소비 컴포넌트 고유 상태는 클로저로 주입 (Dropdown 무관)
       */}
      {triggerEl(open, resolvedTrigger === "click" ? toggle : undefined)}

      {open && (
        <div
          className={panelWrapperCls}
          role="dialog"
          aria-modal="false"
        >
          {panelContent}
        </div>
      )}
    </div>
  );
}
