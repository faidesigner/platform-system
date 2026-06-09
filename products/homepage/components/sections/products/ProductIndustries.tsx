import Image from "next/image";
import type { ProductIndustry } from "@/config/site";

interface ProductIndustriesProps {
  title: string;
  description: string;
  industries: ReadonlyArray<ProductIndustry>;
}

export default function ProductIndustries({ title, description, industries }: ProductIndustriesProps) {
  if (!industries || industries.length === 0) return null;

  return (
    <section
      className="flex flex-col items-start w-full max-w-[1440px] mx-auto py-[80px] px-[150px] gap-[56px]"
      style={{ background: "var(--color-bg-100, #F4F5F6)" }}
    >
      <div className="flex flex-col items-start gap-[60px] w-full max-w-[1139px]">
        <div className="flex flex-col items-start gap-[12px]">
          <h2
            style={{
              color: "var(--color-text-basic-primary, #1F2023)",
              fontFamily: "var(--w-font-family, Pretendard)",
              fontSize: "var(--w-display-S-size, 56px)",
              fontWeight: 700,
              lineHeight: "var(--w-display-S-lineHeight, 78px)",
              letterSpacing: "var(--w-display-S-letterSpacing, 0.8px)",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              color: "var(--color-text-basic-tertiary, #61646B)",
              fontFamily: "var(--font-family-Pretendard, Pretendard)",
              fontSize: "var(--font-size-20, 20px)",
              fontWeight: 400,
              lineHeight: "var(--font-lineHeight-20, 30px)",
              letterSpacing: "var(--font-letterSpacing-0, 0)",
            }}
          >
            {description}
          </p>
        </div>

        <div className="flex flex-row items-center gap-[16px] w-full self-stretch">
          {industries.map((industry, i) => (
            <div key={i} className="flex flex-col items-start gap-[24px] w-[369px] shrink-0">
              <div className="relative flex flex-col items-start w-full self-stretch h-[420px] rounded-[8px] overflow-hidden">
                <Image
                  src={industry.image}
                  alt={industry.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(9, 9, 11, 0.25) 0%, rgba(0, 0, 0, 0.00) 100%)",
                  }}
                />
              </div>
              <h3
                className="self-stretch"
                style={{
                  color: "var(--color-text-basic-primary, #1F2023)",
                  fontFamily: "var(--w-font-family, Pretendard)",
                  fontSize: "var(--w-title-M-size, 28px)",
                  fontWeight: 600,
                  lineHeight: "var(--w-title-M-lineHeight, 39px)",
                  letterSpacing: "var(--w-title-M-letterSpacing, 0.3px)",
                }}
              >
                {industry.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
