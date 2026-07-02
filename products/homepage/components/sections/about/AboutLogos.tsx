import Image from "next/image";
import type { InvestorGroup } from "@/config/types";

interface AboutLogosProps {
  groups: InvestorGroup[];
}

export function AboutLogos({ groups }: AboutLogosProps) {
  return (
    <section className="w-full bg-surface">
      <div className="max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-5xl">
      <div className="flex w-full flex-col items-center gap-4xl rounded-fai-xl bg-sand-filled-primary px-l tablet:px-xl laptop:px-5xl py-4xl">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col items-center gap-3xl">
            <p className="text-body-ms max-[420px]:text-body-s font-semibold text-quaternary">
              {group.caption}
            </p>

            <div className="flex flex-col items-start gap-s">
              {group.logoRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-wrap justify-center items-start gap-l laptop:gap-5xl">
                  {row.map((logo) => (
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
        ))}
      </div>
      </div>
    </section>
  );
}
