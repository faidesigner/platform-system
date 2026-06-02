"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";

/* ──────────────────────────────────────────
   데이터
────────────────────────────────────────── */

const LANGUAGES = ["KO", "EN", "JP"] as const;
type Language = (typeof LANGUAGES)[number];

const NAV_ITEMS = [
  { label: "제품",    href: "/products", dropdown: true  },
  { label: "회사소개", href: "/about"                    },
  { label: "미디어",  href: "/media"                     },
  {
    label: "채용",
    href: "https://faindersai.career.greetinghr.com/ko/home",
    external: true,
  },
] as const;

const PRODUCT_DROPDOWN = [
  { label: "VISION CHECK-OUT", href: "/products/vision-checkout" },
  { label: "UNMANNED STORE",   href: "/products/unmanned-store"  },
] as const;

/* ──────────────────────────────────────────
   컴포넌트
────────────────────────────────────────── */

export default function NavigationBar() {
  const pathname  = usePathname();
  const isHome    = pathname === "/";

  // 배경 상태 (surface | transparent)
  const [isTransparent, setIsTransparent] = useState(!isHome);
  // 드롭다운
  const [productOpen, setProductOpen] = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  // 언어
  const [lang, setLang] = useState<Language>("KO");
  // 모바일 메뉴
  const [mobileOpen, setMobileOpen] = useState(false);

  /** 라우트 변경 시 모바일 메뉴 닫기 */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /** 스크롤 감지: 배경 상태 */
  useEffect(() => {
    let threshold = window.innerHeight * 3;

    const update = () => {
      const y = window.scrollY;

      // ── 배경 상태 ──
      if (isHome) {
        // 메인: 3단계 (A: surface / B: transparent / C: surface)
        setIsTransparent(y >= 1 && y <= threshold);
      } else {
        // 서브: 2단계 (0: transparent / y>0: surface)
        setIsTransparent(y < 1);
      }
    };

    const handleResize = () => {
      threshold = window.innerHeight * 3;
      update();
    };

    update();
    window.addEventListener("scroll",  update,        { passive: true });
    window.addEventListener("resize",  handleResize,  { passive: true });
    return () => {
      window.removeEventListener("scroll",  update);
      window.removeEventListener("resize",  handleResize);
    };
  }, [isHome]);

  // 텍스트 색상: 메인-투명 → inverse / 그 외 → primary
  const textColor = isHome && isTransparent ? "text-inverse" : "text-primary";
  const hoverText = isHome && isTransparent ? "hover:text-inverse" : "hover:text-primary";

  /** 언어 선택 핸들러 */
  const handleLangSelect = (selected: Language) => {
    setLang(selected);
    setLangOpen(false);

    // TODO: Next.js i18n 라우팅 연결 필요
    // 1) next.config.js i18n 설정 추가:
    //    i18n: { locales: ["ko", "en", "ja"], defaultLocale: "ko" }
    // 2) useRouter().push()로 교체:
    //    import { useRouter } from "next/navigation";
    //    router.push(pathname, { locale: selected.toLowerCase() })
    // 3) 또는 next-intl 라이브러리 사용 권장
    //    https://next-intl-docs.vercel.app/
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
          "transition-colors duration-300 ease-in-out",
          isTransparent ? "bg-transparent" : "bg-surface",
        ].join(" ")}
      >
        <nav className="container flex h-full items-center justify-between">

          {/* ── 로고 (110×26px) ── */}
          <Link href="/" className="shrink-0">
            <span
              className={[
                "flex items-center w-[110px] h-[26px]",
                "text-body-xl font-bold",
                "transition-colors duration-300 ease-in-out",
                textColor,
              ].join(" ")}
            >
              Fainders.AI
            </span>
          </Link>

          {/* ── 데스크톱 메뉴 (tablet 이상) ── */}
          <ul className="hidden tablet:flex items-center gap-4xl">
            {NAV_ITEMS.map((item) =>
              "dropdown" in item && item.dropdown ? (
                /* 제품 — 드롭다운 */
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setProductOpen(true)}
                  onMouseLeave={() => setProductOpen(false)}
                >
                  <button
                    type="button"
                    className={[
                      "w-[83px] flex items-center justify-center gap-2xs",
                      "text-body-s transition-colors duration-300 ease-in-out",
                      textColor, hoverText,
                    ].join(" ")}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-m w-m shrink-0 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>

                  {/* 서브메뉴: 1140px 중앙 정렬 */}
                  {productOpen && (
                    <div className="fixed left-1/2 -translate-x-1/2 top-16 w-[1140px] bg-surface border-t border-border-subtle z-40">
                      <ul className="container flex gap-2xl py-2xl">
                        {PRODUCT_DROPDOWN.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              className="text-body-s font-medium text-secondary hover:text-primary transition-colors duration-200"
                              onClick={() => setProductOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                /* 일반 메뉴 항목 */
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={"external" in item && item.external ? "_blank" : undefined}
                    rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
                    className={[
                      "w-[83px] flex items-center justify-center gap-2xs",
                      "text-body-s transition-colors duration-300 ease-in-out",
                      textColor, hoverText,
                    ].join(" ")}
                  >
                    {item.label}
                    {"external" in item && item.external && (
                      <ArrowUpRight className="h-m w-m shrink-0" aria-hidden />
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* ── 우측 액션 ── */}
          <div className="flex items-center gap-m">

            {/* 언어 선택 드롭다운 (데스크톱) */}
            <div
              className="hidden tablet:block relative"
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                type="button"
                className={[
                  "w-[94px] flex items-center justify-between",
                  "text-body-s transition-colors duration-300 ease-in-out",
                  textColor, hoverText,
                ].join(" ")}
                aria-label="언어 선택"
              >
                <span>{lang}</span>
                <ChevronDown
                  className={`h-m w-m transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              {langOpen && (
                <ul className="absolute right-0 top-full mt-2xs w-[94px] bg-surface border border-border-subtle rounded-s overflow-hidden z-10">
                  {LANGUAGES.map((l) => (
                    <li key={l}>
                      <button
                        type="button"
                        onClick={() => handleLangSelect(l)}
                        className={[
                          "w-full text-left px-m py-xs text-body-s",
                          "hover:bg-fill-faint transition-colors",
                          l === lang ? "text-primary font-medium" : "text-secondary",
                        ].join(" ")}
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 문의하기 버튼 (데스크톱) — hover 전환 없음
                투명 상태: brand-primaryBtn 다크 기준 → bg-brand(#39DB1F) + text-on-brand
                surface 상태: brand-primaryBtn 라이트 기준 → bg-fill-strong(#2C2D30) + text-inverse */}
            <Link
              href="/contact"
              className={[
                "hidden tablet:flex items-center justify-center",
                "rounded-s px-m py-s text-body-s font-medium",
                isTransparent
                  ? "dark bg-brand text-on-brand"
                  : "bg-fill-strong text-inverse",
              ].join(" ")}
            >
              문의하기
            </Link>

            {/* 햄버거 (모바일/태블릿) */}
            <button
              type="button"
              className={`tablet:hidden transition-colors duration-300 ease-in-out ${textColor}`}
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
          모바일 메뉴 오버레이
      ════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-surface overflow-y-auto">

          {/* 언어 선택 (좌측 나열: KO / EN / JP) */}
          <div className="flex items-center gap-m px-m pt-2xl pb-l border-b border-border-subtle">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => handleLangSelect(l)}
                className={[
                  "text-body-s font-medium transition-colors",
                  l === lang ? "text-primary" : "text-tertiary",
                ].join(" ")}
              >
                {l}
              </button>
            ))}
          </div>

          {/* 메뉴 링크: 제품 / 회사소개 / 미디어 / 채용 / 문의하기 */}
          <nav className="flex flex-col px-m py-2xl gap-l">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={"external" in item && item.external ? "_blank" : undefined}
                rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
                className="text-body-s font-medium text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-body-s font-medium text-primary"
              onClick={() => setMobileOpen(false)}
            >
              문의하기
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
