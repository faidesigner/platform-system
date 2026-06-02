import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 */}
          <div>
            <p className="text-xl font-bold text-gray-900 mb-2">{siteConfig.name}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{siteConfig.description}</p>
          </div>

          {/* 메뉴 */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">메뉴</p>
            <ul className="space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">연락처</p>
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {siteConfig.social.email}
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

