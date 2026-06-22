"use client";

import Image from "next/image";
import HeroShell from "@/components/layout/HeroShell";

interface StoreHeroProps {
  subtitle: string;
  title: string;
  ctaLabel?: string;
  imageSrc: string;
}

export default function StoreHero({ subtitle, title, ctaLabel, imageSrc }: StoreHeroProps) {
  return (
    <HeroShell subtitle={subtitle} title={title} ctaLabel={ctaLabel}>
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        style={{ objectPosition: "0px -30.059px", transform: "scale(1.0668)", filter: "blur(0.5px)" }}
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, rgba(32, 28, 28, 0.50) 0%, rgba(32, 28, 28, 0.30) 100%)" }}
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, rgba(32, 28, 28, 0.00) 33.77%, rgba(32, 28, 28, 0.39) 100%)" }}
      />
    </HeroShell>
  );
}
