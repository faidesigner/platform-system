import Image from "next/image";
import type { LogoItem } from "@/config/types";

interface AboutPartnersProps {
  title: string;
  description: string[];
  logoRows: LogoItem[][];
}

export function AboutPartners({ title, description, logoRows }: AboutPartnersProps) {
  return (
    <section className="w-full bg-surface">
      {/* contentsArea: titleSection ↔ logosSection gap 56 = 4xl */}
      <div className="max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex flex-col desktop:flex-row items-start gap-3xl desktop:gap-4xl py-5xl desktop:py-6xl">
        {/* titleSection: 세로 gap 12 = ms */}
        <div className="flex w-full desktop:w-[368px] shrink-0 flex-col gap-ms text-left">
          <h2 className="text-title-l max-[421px]:text-title-m desktop:text-title-xl font-bold text-primary">
            {title}
          </h2>
          <p className="text-body-l desktop:text-body-xl text-tertiary">
            {description.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        {/* logosSection: 행 간 gap 56 = 4xl */}
        <div className="flex shrink-0 flex-col gap-4xl">
          {logoRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-wrap items-start gap-l">
              {row.map((logo) => (
                // 로고칸 164×65 — 디자이너 승인 고정값
                <div key={logo.id} className="relative h-[65px] w-[164px]">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    fill
                    sizes="164px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
