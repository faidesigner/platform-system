"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

interface HeroShellProps {
  subtitle: string;
  title: string;
  ctaLabel?: string;
  children: ReactNode;
}

export default function HeroShell({ subtitle, title, ctaLabel, children }: HeroShellProps) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const lhref = (path: string) => (locale ? `/${locale}${path}` : path);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* ── 미디어 레이어 — 풀블리드, z-0 ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {children}
      </div>

      {/* ── 콘텐츠 래퍼 — max-w + px, z-20 ── */}
      <div className="absolute inset-0 flex w-full flex-col justify-end items-start px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] pb-[var(--size-180)] z-20">
        <div className="flex flex-col items-start gap-m w-full max-w-[1140px]">
          <p className="text-title-s tablet:text-title-m font-semibold text-inverse">
            {subtitle}
          </p>
          <h1 className="text-title-xl tablet:text-display-s desktop:text-display-m font-bold text-inverse">
            {title}
          </h1>
        </div>
        {ctaLabel && (
          <Link
            href={lhref("/contact")}
            className="mt-3xl shrink-0 rounded-fai-circle bg-fill-soft px-l py-s text-body-s font-medium text-primary transition-colors duration-200 hover:bg-fill-faint"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
