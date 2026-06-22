"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { IcoTxtButton } from "./button/IcoTxtButton";
import { ChevronDown, Menu, X } from "lucide-react";
import MegaNavMenu, { type NavItem } from "./navigation/MegaNavMenu";
import GlobalUtilityMenu from "./navigation/GlobalUtilityMenu";
import { Drawer } from "./ui/Drawer";
import { TabletNavigationBar } from "./navigation/TabletNavigationBar";
import { TabletDrawerMenu } from "./navigation/TabletDrawerMenu";

/* ──────────────────────────────────────────
   데이터
────────────────────────────────────────── */

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "제품",
    href: "/products",
    dropdown: true,
    dropdownItems: [
      { label: "VISION CHECK-OUT", href: "/products/vision-check-out" },
      { label: "UNMANNED STORE",   href: "/products/unmanned-store"  },
    ],
  },
  { label: "회사소개", href: "/about"  },
  { label: "미디어",   href: "/media"  },
  {
    label:     "채용",
    href:      "https://faindersai.career.greetinghr.com/ko/home",
    external:  true,
    ariaLabel: "파인더스에이아이 채용 홈 바로가기(새창)",
  },
];

const LANGUAGES = ["KO", "EN", "JP"] as const;
type Language = (typeof LANGUAGES)[number];

/* ──────────────────────────────────────────
   Props
────────────────────────────────────────── */

interface NavigationBarProps {
  /** 데스크톱 언어 전환 UI — isTransparent 값을 받아 스타일 분기 */
  desktopLangSwitcher?: (isTransparent: boolean) => ReactNode;
  /** 모바일 오버레이 언어 전환 UI */
  mobileLangSwitcher?: ReactNode;
  /**
   * 네비게이션 아이템 오버라이드.
   * 미지정 시 packages/ui 내부 NAV_ITEMS 사용.
   * homepage 등 소비자가 megaMenuPanel 주입 시 이 prop으로 전달.
   */
  navItems?: readonly NavItem[];
}

/* ──────────────────────────────────────────
   컴포넌트
────────────────────────────────────────── */

export default function NavigationBar({
  desktopLangSwitcher,
  mobileLangSwitcher,
  navItems: navItemsProp,
}: NavigationBarProps = {}) {
  const navItems = navItemsProp ?? NAV_ITEMS;
  const pathname = usePathname();
  const params   = useParams();
  const locale   = typeof params?.locale === "string" ? params.locale : "";
  const router   = useRouter();

  // 홈 판단: locale prefix만 있는 경우 (/ko, /en, /jp)
  const isHome = /^\/(ko|en|jp)\/?$/.test(pathname);
  // 제품 상세 판단: 풀스크린 히어로가 있는 페이지
  const isProductDetail = /^\/(ko|en|jp)\/products\/[^/]+\/?$/.test(pathname);
  // 미디어 판단: 항상 라이트 배경 고정
  const isMedia = /^\/(ko|en|jp)\/media\/?$/.test(pathname);

  // 배경 상태
  const [isTransparent, setIsTransparent] = useState(!isHome && !isMedia);
  // 언어 드롭다운 (desktopLangSwitcher 미주입 시 폴백용)
  const [langOpen, setLangOpen] = useState(false);
  const [lang,     setLang]     = useState<Language>("KO");
  // 글로벌 유틸리티 메뉴 (Drawer)
  const [mobileOpen, setMobileOpen] = useState(false);

  /** 라우트 변경 시 글로벌 유틸리티 메뉴 닫기 */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /** 스크롤 감지: 3단계 시나리오 (홈) / 2단계 (서브) */
  useEffect(() => {
    let threshold = window.innerHeight * 3;

    const update = () => {
      const y = window.scrollY;
      if (isHome) {
        setIsTransparent(y >= 1 && y <= threshold);
      } else if (isProductDetail) {
        // 히어로 비디오 구간(100vh)에서 투명 유지
        setIsTransparent(y < window.innerHeight);
      } else if (isMedia) {
        // 미디어 페이지: 스크롤 무관하게 항상 라이트 배경
        setIsTransparent(false);
      } else {
        setIsTransparent(y < 1);
      }
    };

    const handleResize = () => { threshold = window.innerHeight * 3; update(); };

    update();
    window.addEventListener("scroll",  update,        { passive: true });
    window.addEventListener("resize",  handleResize,  { passive: true });
    return () => {
      window.removeEventListener("scroll",  update);
      window.removeEventListener("resize",  handleResize);
    };
  }, [isHome, isProductDetail, isMedia]);

  /* ── 상태별 색상 토큰 ── */
  const defaultText = isTransparent ? "text-inverse"                          : "text-primary";
  const hoverBg     = isTransparent ? "hover:bg-interaction-light-white-hover" : "hover:bg-interaction-light-black-hover";



  /** locale-prefixed href */
  const lhref = (path: string) => locale ? `/${locale}${path}` : path;

  /** 폴백 언어 선택 핸들러 (desktopLangSwitcher 미주입 시) */
  const handleLangSelect = (selected: Language) => {
    setLang(selected);
    setLangOpen(false);
    document.documentElement.lang = selected.toLowerCase();
  };

  return (
    <>
      {/* ════════════════════════════════════
          Header
      ════════════════════════════════════ */}
      <header
        className={[
          "fixed top-0 left-0 z-50 w-full h-16",
          "tablet:hidden min-[961px]:block",
          "transition-colors duration-300 ease-in-out",
          isTransparent ? "dark bg-transparent" : "bg-surface",
        ].join(" ")}
      >
        <nav className="w-full flex h-full items-center justify-between px-l tablet:px-xl desktop:px-[var(--padding-8-xl,150px)]">

          {/* ── 로고 ── */}
          <Link href={lhref("/")} className="shrink-0">
            <Image
              src={isTransparent ? "/logos/logoFaindersai-w.svg" : "/logos/logoFaindersai-b.svg"}
              alt="Fainders.AI"
              width={110}
              height={28}
              priority
            />
          </Link>

          {/* ── 데스크톱 메뉴 (961px+) ── */}
          <div className="hidden min-[961px]:flex items-center">
            <MegaNavMenu isTransparent={isTransparent} navItems={navItems} />
          </div>

          {/* ── 우측 액션 ── */}
          <div className="flex items-center self-stretch gap-m">

            {/* 언어 전환 (데스크톱) — 주입된 경우 사용, 없으면 폴백 드롭다운 */}
            {desktopLangSwitcher ? (
              desktopLangSwitcher(isTransparent)
            ) : (
              <div
                className="hidden min-[961px]:block relative"
                onMouseEnter={() => setLangOpen(true)}
                onMouseLeave={() => setLangOpen(false)}
              >
                <button
                  type="button"
                  className={[
                    "w-[94px] h-[40px] flex items-center justify-between px-[12px]",
                    "transition-colors duration-200",
                    hoverBg,
                    "hover:text-primary",
                    "rounded-fai-s",
                    defaultText,
                  ].join(" ")}
                  aria-label="언어 선택"
                >
                  <span className="text-[16px] leading-[24px] font-semibold">{lang}</span>
                  <ChevronDown
                    className={`h-m w-m transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>

                {langOpen && (
                  <ul className="absolute right-0 top-full mt-2xs w-[94px] bg-surface border border-border-subtle rounded-fai-s overflow-hidden z-10">
                    {LANGUAGES.map((l) => (
                      <li key={l}>
                        <button
                          type="button"
                          onClick={() => handleLangSelect(l)}
                          className={[
                            "w-full text-left px-m py-xs text-body-s",
                            "hover:bg-interaction-light-black-hover transition-colors duration-200",
                            l === lang ? "text-primary font-bold" : "text-secondary",
                          ].join(" ")}
                        >
                          {l}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 문의하기 — btn/icoTxt/square/primary/L */}
            <IcoTxtButton
              variant="primary"
              shape="square"
              size="L"
              className="hidden min-[961px]:inline-flex"
              onClick={() => router.push(lhref("/contact"))}
            >
              문의하기
            </IcoTxtButton>

            {/* 햄버거 (모바일) */}
            <button
              type="button"
              className={[
                "tablet:hidden transition-colors duration-300 ease-in-out",
                defaultText,
              ].join(" ")}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileOpen
                ? <X    className="h-2xl w-2xl" aria-hidden />
                : <Menu className="h-2xl w-2xl" aria-hidden />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* ════════════════════════════════════
          태블릿 네비게이션 (768px–960px) — 독립 헤더 + 드로어
      ════════════════════════════════════ */}
      <div className="hidden tablet:block min-[961px]:hidden">
        <TabletNavigationBar
          logo={
            <Image
              src={isTransparent ? "/logos/logoFaindersai-w.svg" : "/logos/logoFaindersai-b.svg"}
              alt="Fainders.AI"
              width={110}
              height={28}
              priority
            />
          }
          isDarkMode={isTransparent}
          renderDrawer={(close) => (
            <TabletDrawerMenu
              navItems={navItems}
              onClose={close}
            />
          )}
        />
      </div>

      {/* ════════════════════════════════════
          모바일 드로어 (768px 미만)
      ════════════════════════════════════ */}
      <Drawer isOpen={mobileOpen}>
        <GlobalUtilityMenu
          navItems={navItems}
          onClose={() => setMobileOpen(false)}
        />
      </Drawer>
    </>
  );
}
