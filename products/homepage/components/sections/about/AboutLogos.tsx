import Image from "next/image";
import { aboutConfig } from "@/config/site";

export function AboutLogos() {
  const { groups } = aboutConfig.investors;

  return (
    <section className="flex w-full flex-col items-start bg-surface px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] py-5xl">
      <div className="flex w-full flex-col items-center gap-4xl rounded-fai-xl bg-sand-filled-primary px-l tablet:px-xl laptop:px-5xl py-4xl">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col items-center gap-3xl">
            <p className="text-body-ms font-semibold text-quaternary">
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
    </section>
  );
}
