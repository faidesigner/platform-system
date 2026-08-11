"use client";
import * as React from "react";
/** hynix Breadcrumbs — 피그마 w/Breadcrumbs (13:1212).
 *  link(회색 #3A3D40) / current(진한 #1F2023 semibold). 구분자 "/". pad 4/0, gap 4. */
export type Crumb = { label: React.ReactNode; href?: string };
export type BreadcrumbsProps = {
  items: Crumb[]; separator?: React.ReactNode;
  as?: React.ElementType; className?: string; style?: React.CSSProperties;
};
export function Breadcrumbs({ items, separator = "/", as: Link = "a", className, style }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className={className}
      style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Pretendard',sans-serif", fontSize: 14, lineHeight: "21px", ...style }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 0" }}>
            {i > 0 && <span aria-hidden style={{ color: "var(--color-text-sub,#8890A0)", fontWeight: 400 }}>{separator}</span>}
            {last || !it.href ? (
              <span aria-current={last ? "page" : undefined}
                style={{ color: last ? "#1F2023" : "var(--color-gray-800,#3A3D40)", fontWeight: last ? 600 : 400 }}>
                {it.label}
              </span>
            ) : (
              <Link href={it.href} style={{ color: "var(--color-gray-800,#3A3D40)", fontWeight: 400, textDecoration: "none" }}>
                {it.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
export default Breadcrumbs;
