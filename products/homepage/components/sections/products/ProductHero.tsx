"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface ProductHeroProps {
  subtitle: string;
  title: string;
  ctaLabel: string;
  videoSrc?: string;
}

export default function ProductHero({
  subtitle,
  title,
  ctaLabel,
  videoSrc = "https://www.w3schools.com/html/mov_bbb.mp4",
}: ProductHeroProps) {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const lhref = (path: string) => locale ? `/${locale}${path}` : path;

  return (
    <section className={[
      /* full-bleed: main의 pt-4xl 상쇄 */
      "-mt-4xl",
      /* layout — 섹션 자체는 풀 뷰포트 폭 */
      "relative",
      "flex flex-col justify-end items-center",
      "w-full",
      /* mobile */
      "h-screen py-12 gap-20",
      /* desktop */
      "md:h-[900px] md:py-[180px] md:gap-[286px]",
    ].join(" ")}>

      {/* ── 배경 비디오 — 뷰포트 풀블리드, z-0 ── */}
      <video
        className="absolute inset-0 w-full h-full z-0 object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={videoSrc}
      />

      {/* ── 콘텐츠 래퍼 — max-w + px 여기서 제어, z-10 ── */}
      <div className={[
        "relative z-10 w-full",
        "max-w-[1440px] mx-auto",
        "px-6 md:px-[150px]",
        "flex items-end justify-between",
      ].join(" ")}>
        <div className="flex flex-col gap-s">
          <p className="text-title-s font-medium text-inverse">{subtitle}</p>
          <h1 className="text-title-xl font-bold text-inverse">{title}</h1>
        </div>
        <Link
          href={lhref("/contact")}
          className="shrink-0 rounded-fai-circle bg-fill-soft px-l py-s text-body-s font-medium text-primary transition-colors duration-200 hover:bg-fill-faint"
        >
          {ctaLabel}
        </Link>
      </div>

    </section>
  );
}
