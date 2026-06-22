import Image from "next/image";
import { aboutConfig } from "@/config/site";

export function AboutHero() {
  const { eyebrow, title, image } = aboutConfig.hero;

  return (
    // container 1440×900, 하단 정렬(justify-end), px150/py180 = Hero 전용 고정 여백
    <section className="relative isolate flex min-h-[100svh] w-full flex-col items-start justify-end overflow-hidden py-7xl desktop:py-8xl">
      {/* 배경 이미지 (풀블리드) */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* 스크림 — Hero 전용 세로 그라데이션 (위 투명 → 아래 어둠), 고정값 승인 영역 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[rgba(9,9,11,0)] to-[rgba(23,25,28,0.5)]"
      />

      {/* contentsArea — 세로 gap 16 = m, 텍스트 inverse */}
      <div className="relative w-full px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex flex-col items-start gap-m text-inverse">
        {/* subtitle: w/title/M (28/39/0.3), weight 600 */}
        <p className="w-full text-body-xl desktop:text-title-m font-semibold">
          {eyebrow}
        </p>
        {/* title: w/display/S (56/78/0.8), weight 700, 2줄 */}
        <h1 className="w-full text-title-l tablet:text-title-xl desktop:text-display-s font-bold">
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
