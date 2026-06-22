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
    <section className="w-full flex flex-col items-center py-5xl bg-bg-100">
      <div className="w-full max-w-[1440px] px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex flex-col items-start gap-4xl">
      <div className="flex flex-col items-start gap-[60px] w-full">
        <div className="flex flex-col items-start gap-ms">
          <h2 className="text-title-m tablet:text-title-l desktop:text-title-xl font-bold text-text-basic-primary">
            {title}
          </h2>
          <p className="text-body tablet:text-body-l desktop:text-body-xl font-normal text-text-basic-tertiary">
            {description}
          </p>
        </div>

        <div className="flex flex-col tablet:flex-row items-center gap-m w-full self-stretch">
          {industries.map((industry, i) => (
            <div key={i} className="flex flex-col items-start gap-xl w-full tablet:flex-1 tablet:min-w-0">
              <div className="relative flex flex-col items-start w-full self-stretch aspect-[369/420] rounded-fai-s overflow-hidden">
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
              <h3 className="self-stretch text-body-xl tablet:text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                {industry.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
