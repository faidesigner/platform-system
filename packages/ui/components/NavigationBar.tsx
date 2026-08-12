"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { IcoTxtButton } from "./button/IcoTxtButton";
import { ChevronDown } from "lucide-react";
import MegaNavMenu, { type NavItem } from "./navigation/MegaNavMenu";
import { TabletDrawerMenu, type DrawerLabels } from "./navigation/TabletDrawerMenu";
import { Drawer } from "./ui/Drawer";

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

const LANGUAGES = ["KO", "EN", "JA"] as const;
type Language = (typeof LANGUAGES)[number];

/* ──────────────────────────────────────────
   Props
────────────────────────────────────────── */

interface NavigationBarProps {
  /** 데스크톱 언어 전환 UI — isTransparent 값을 받아 스타일 분기 */
  desktopLangSwitcher?: (isTransparent: boolean) => ReactNode;
  /** 모바일·태블릿 헤더 언어 전환 UI — isDarkMode 값을 받아 스타일 분기 */
  mobileLangSwitcher?: (isDarkMode: boolean) => ReactNode;
  /**
   * 네비게이션 아이템 오버라이드.
   * 미지정 시 packages/ui 내부 NAV_ITEMS 사용.
   */
  navItems?: readonly NavItem[];
  /**
   * 최상위 nav 항목 활성화(클릭) 시 호출되는 콜백 (analytics 등 소비자 계측용).
   * MegaNavMenu로 그대로 전달된다. 외부 링크(채용)는 호출되지 않는다.
   */
  onItemClick?: (item: NavItem) => void;
  /**
   * 문의하기 CTA 클릭 시 호출되는 콜백 (analytics 등 소비자 계측용).
   * 기존 라우팅(/contact 이동) 동작은 그대로 유지되며 콜백이 선행 호출된다.
   */
  onContactClick?: () => void;
  /** 데스크톱 문의하기 CTA 텍스트(번역 주입용). 미지정 시 한국어 기본값. */
  contactLabel?: string;
  /** 태블릿·모바일 드로어 라벨(번역 주입용). 미지정 값은 한국어 기본값. */
  drawerLabels?: DrawerLabels;
  /**
   * 드로어의 채용 항목 노출 여부(HOM-68). 데스크톱은 navItems에서 제외하면 되지만
   * 드로어는 자체 렌더라 규칙을 따로 전달해야 한다. 미지정 시 기존 동작(노출) 유지.
   */
  showCareers?: boolean;
}

/* ──────────────────────────────────────────
   컴포넌트
────────────────────────────────────────── */

export default function NavigationBar({
  desktopLangSwitcher,
  mobileLangSwitcher,
  navItems: navItemsProp,
  onItemClick,
  onContactClick,
  contactLabel = "문의하기",
  drawerLabels,
  showCareers = true,
}: NavigationBarProps = {}) {
  const navItems = navItemsProp ?? NAV_ITEMS;
  const pathname = usePathname();
  const params   = useParams();
  const locale   = typeof params?.locale === "string" ? params.locale : "";
  const router   = useRouter();

  const isHome          = /^\/(ko|en|ja)\/?$/.test(pathname);
  const isProductDetail = /^\/(ko|en|ja)\/products\/[^/]+\/?$/.test(pathname);
  const isMedia         = /^\/(ko|en|ja)\/media\/?$/.test(pathname);

  const [isTransparent, setIsTransparent] = useState(!isHome && !isMedia);
  const [langOpen, setLangOpen] = useState(false);
  const [lang,     setLang]     = useState<Language>("KO");
  // 960px 이하 공용 드로어
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 스크롤 100px 초과 + 투명 구간일 때 그림자 활성화 (navShadow)
  const [hasShadow, setHasShadow] = useState(false);
  // 라우트 변경 직후 배경 transition 비활성화 플래그
  const [skipTransition, setSkipTransition] = useState(true);

  /** 라우트 변경 시 드로어 닫기 + 초기 투명 상태 즉시 적용 (transition 비활성화) */
  useEffect(() => {
    setSkipTransition(true);

    let initialTransparent = false;
    if (isHome) {
      initialTransparent = false;
    } else if (isProductDetail) {
      initialTransparent = true;
    } else if (isMedia) {
      initialTransparent = false;
    } else {
      initialTransparent = true;
    }

    transparentRef.current = initialTransparent;
    setIsTransparent(initialTransparent);
    setDrawerOpen(false);
    // scrollTo(0) 제거: SmoothScroll이 라우트 전환 스크롤을 단독 책임진다.
    // 여기서 window.scrollTo(0)을 호출하면 언어 전환 시 SmoothScroll의 위치 복원을 덮어쓴다.

    requestAnimationFrame(() => {
      setSkipTransition(false);
    });
  }, [pathname, isHome, isProductDetail, isMedia]);

  /** 드로어 열림/닫힘 시 body 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /** 스크롤 감지 — ref 비교로 불필요한 리렌더 방지 */
  const transparentRef = useRef(!isHome && !isMedia);
  const shadowRef = useRef(false);
  // hero 확장/복귀 이벤트로 홈 nav 투명 상태 관리
  const heroExpandedRef = useRef(false);

  useEffect(() => {
    let threshold = window.innerHeight * 3;

    const update = () => {
      const y = window.scrollY;
      let nextTransparent = transparentRef.current;
      let nextShadow = shadowRef.current;

      if (isHome) {
        if (y < 1) heroExpandedRef.current = false;
        const inTransparentZone = heroExpandedRef.current && y <= threshold;
        nextTransparent = inTransparentZone;
        nextShadow = false;
      } else if (isProductDetail) {
        nextTransparent = y < window.innerHeight;
        nextShadow = false;
      } else if (isMedia) {
        nextTransparent = false;
        nextShadow = false;
      } else {
        nextTransparent = y < 1;
        nextShadow = false;
      }

      if (nextTransparent !== transparentRef.current) {
        transparentRef.current = nextTransparent;
        setIsTransparent(nextTransparent);
      }
      if (nextShadow !== shadowRef.current) {
        shadowRef.current = nextShadow;
        setHasShadow(nextShadow);
      }
    };

    const handleResize = () => { threshold = window.innerHeight * 3; update(); };
    const onHeroExpanded  = () => { heroExpandedRef.current = true;  update(); };
    const onHeroCollapsed = () => { heroExpandedRef.current = false; update(); };

    update();
    window.addEventListener("scroll",        update,          { passive: true });
    window.addEventListener("resize",        handleResize,    { passive: true });
    window.addEventListener("hero:expanded",  onHeroExpanded);
    window.addEventListener("hero:collapsed", onHeroCollapsed);
    return () => {
      window.removeEventListener("scroll",        update);
      window.removeEventListener("resize",        handleResize);
      window.removeEventListener("hero:expanded",  onHeroExpanded);
      window.removeEventListener("hero:collapsed", onHeroCollapsed);
    };
  }, [isHome, isProductDetail, isMedia]);

  /** 데스크톱 브레이크포인트 진입 시 드로어 닫기 */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 961px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setDrawerOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* 드로어가 열리면 헤더를 라이트 모드로 강제 전환 */
  const effectiveTransparent = isTransparent && !drawerOpen;

  const defaultText = effectiveTransparent ? "text-inverse"                          : "text-primary";
  const hoverBg     = effectiveTransparent ? "hover:bg-interaction-light-white-hover" : "hover:bg-interaction-light-black-hover";

  const lhref = (path: string) => locale ? `/${locale}${path}` : path;

  const handleLangSelect = (selected: Language) => {
    setLang(selected);
    setLangOpen(false);
    document.documentElement.lang = selected.toLowerCase();
  };

  return (
    <>
      {/* ════════════════════════════════════
          Header — 모든 breakpoint 공용
      ════════════════════════════════════ */}
      <header
        className={[
          "fixed top-0 left-0 z-50 w-full h-16",
          effectiveTransparent ? "dark" : "",
          hasShadow && !drawerOpen ? "shadow-M" : "",
        ].join(" ")}
      >
        {/* 배경 레이어 — opacity 크로스페이드로 부드러운 전환 (라우트 진입 시 transition 비활성화) */}
        <div
          className={[
            "absolute inset-0 bg-surface",
            skipTransition ? "" : "transition-opacity duration-700 ease-out",
            effectiveTransparent ? "opacity-0" : "opacity-100",
          ].join(" ")}
        />
        <nav className="relative w-full flex h-full items-center justify-between px-l tablet:px-xl desktop:px-[var(--padding-8-xl,150px)]">

          {/* ── 로고 ── */}
          <Link href={lhref("/")} className="shrink-0">
            <Image
              src={effectiveTransparent ? "/logos/logoFaindersai-w.svg" : "/logos/logoFaindersai-b.svg"}
              alt="Fainders.AI"
              width={110}
              height={28}
              priority
            />
          </Link>

          {/* ── 데스크톱 메뉴 (961px+) ── */}
          <div className="hidden desktop-s:flex items-center">
            <MegaNavMenu isTransparent={effectiveTransparent} navItems={navItems} onItemClick={onItemClick} />
          </div>

          {/* ── 우측 액션 ── */}
          <div className="flex items-center self-stretch gap-m">

            {/* 언어 전환 (데스크톱 961px+) */}
            {desktopLangSwitcher ? (
              desktopLangSwitcher(effectiveTransparent)
            ) : (
              <div
                className="hidden desktop-s:block relative"
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
                  <span className="text-body font-semibold">{lang}</span>
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

            {/* 문의하기 (데스크톱 961px+) */}
            <span className="hidden desktop-s:inline-flex">
              <IcoTxtButton
                variant="primary"
                shape="square"
                size="L"
                onClick={() => { onContactClick?.(); router.push(lhref("/contact")); }}
              >
                {contactLabel}
              </IcoTxtButton>
            </span>

            {/* 모바일·태블릿 우측 영역 — 언어 전환 + 햄버거 (gap 6px) */}
            <div className="desktop-s:hidden flex items-center gap-xs">
              {mobileLangSwitcher && (
                <div className={`flex items-center ${defaultText} transition-colors duration-300 ease-in-out`}>
                  {mobileLangSwitcher(effectiveTransparent)}
                </div>
              )}
              <button
                type="button"
                className={[
                  "flex items-center justify-center",
                  "h-10 px-2",
                  "rounded-fai-s",
                  "transition-colors duration-300 ease-in-out",
                  defaultText,
                ].join(" ")}
                onClick={() => setDrawerOpen((v) => !v)}
                aria-label={drawerOpen ? "메뉴 닫기" : "메뉴 열기"}
              >
                {drawerOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ════════════════════════════════════
          드로어 — 960px 이하 공용 (모바일·태블릿)
      ════════════════════════════════════ */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <TabletDrawerMenu
          onNavigate={() => setDrawerOpen(false)}
          onItemClick={onItemClick}
          onContactClick={onContactClick}
          labels={drawerLabels}
          showCareers={showCareers}
        />
      </Drawer>
    </>
  );
}
