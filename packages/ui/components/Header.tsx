"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TabletNavigationBar } from "./navigation/TabletNavigationBar";

/* packages/ui는 products에 의존하지 않으므로 데이터를 직접 정의 */
const siteConfig = {
  name: "Fainders.AI",
  nav: [
    { label: "제품",    href: "/products" },
    { label: "회사소개", href: "/about"    },
    { label: "미디어",  href: "/media"    },
    { label: "채용",    href: "https://faindersai.career.greetinghr.com/ko/home" },
  ],
} as const;

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 로고 */}
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
            {siteConfig.name}
          </Link>

          {/* 데스크톱 네비게이션 (961px+) */}
          <nav className="hidden min-[961px]:flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-black ${
                  pathname === item.href ? "text-black" : "text-gray-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-fai-s bg-fill-strong px-l py-s text-body-s font-medium text-inverse transition-colors hover:bg-fill"
            >
              문의하기
            </Link>
          </nav>

          {/* 태블릿 네비게이션 — TabletNavigationBar가 독립 헤더로 렌더링되므로 여기서는 제거 */}

          {/* 모바일 햄버거 버튼 (768px 미만) */}
          <button
            className="tablet:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${
                pathname === item.href ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
