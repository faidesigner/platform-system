import { InViewVideo } from "@fai/ui";
import BenefitIcon, { type BenefitIconKey } from "@/assets/icon/BenefitIcon";

interface BenefitItem {
  subtitle: string;
  description: string;
}

interface ProductBenefit {
  icon: BenefitIconKey;
  eyebrow: string;
  title: string;
  video: string;
  poster?: string;
  imagePosition: "left" | "right";
  items: BenefitItem[];
}

interface ProductBenefitsProps {
  title: string;
  benefits: ProductBenefit[];
}

export default function ProductBenefits({ title, benefits }: ProductBenefitsProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section
      className="flex flex-col items-start w-full max-w-[1440px] mx-auto py-[80px] px-[150px] gap-[40px]"
      style={{ background: "var(--color-bg-100, #F4F5F6)" }}
    >
      <h2
        className="w-full"
        style={{
          color: "var(--color-text-basic-primary, #1F2023)",
          fontFamily: "var(--w-font-family, Pretendard)",
          fontSize: "var(--w-title-L-size, 36px)",
          fontWeight: 700,
          lineHeight: "var(--w-title-L-lineHeight, 54px)",
          letterSpacing: "var(--w-title-L-letterSpacing, 0.3px)",
        }}
      >
        {title}
      </h2>

      <div className="flex flex-col items-start gap-[var(--size-120)] w-full self-stretch">
      {benefits.map((benefit, i) => {
        const isRight = benefit.imagePosition === "right";

        const mediaBlock = (
          <div
            key={`media-${i}`}
            className={[
              "flex flex-col items-start w-[520px] h-[600px] shrink-0 rounded-[16px] overflow-hidden sticky top-[120px] z-10",
              isRight ? "md:order-2" : "",
            ].join(" ")}
            style={{ background: "var(--color-filled-basic-tertiary, #E4E6E7)" }}
          >
            <InViewVideo
              src={benefit.video}
              poster={benefit.poster}
              className="h-full w-full object-cover"
            />
          </div>
        );

        const textBlock = (
          <div
            key={`text-${i}`}
            className={[
              "flex flex-col items-start py-[24px] px-0 gap-[80px] flex-1",
              isRight ? "md:order-1" : "",
            ].join(" ")}
          >
            <div className="flex flex-col items-start gap-[8px] w-full">
              <div className="flex items-center gap-[8px]">
                <BenefitIcon name={benefit.icon} />
                <span
                  style={{
                    color: "var(--color-text-optional-brand-primary, #36CD1E)",
                    fontFamily: "var(--w-font-family, Pretendard)",
                    fontSize: "var(--w-title-S-size, 24px)",
                    fontWeight: 600,
                    lineHeight: "var(--w-title-S-lineHeight, 36px)",
                    letterSpacing: "var(--w-title-S-letterSpacing, 0.3px)",
                  }}
                >
                  {benefit.eyebrow}
                </span>
              </div>

              <h3
                className="self-stretch whitespace-pre-line"
                style={{
                  color: "var(--color-text-basic-primary, #1F2023)",
                  fontFamily: "var(--w-font-family, Pretendard)",
                  fontSize: "var(--w-title-XL-size, 48px)",
                  fontWeight: 700,
                  lineHeight: "var(--w-title-XL-lineHeight, 67px)",
                  letterSpacing: "var(--w-title-XL-letterSpacing, 0.3px)",
                }}
              >
                {benefit.title}
              </h3>
            </div>

            <div className="flex flex-col items-start gap-[40px] w-full">
              {benefit.items.map((item, j) => (
                <div key={j} className="flex flex-col items-start gap-[8px]">
                  <h4
                    style={{
                      color: "var(--color-text-basic-primary, #1F2023)",
                      fontFamily: "var(--w-font-family, Pretendard)",
                      fontSize: "var(--w-title-M-size, 28px)",
                      fontWeight: 700,
                      lineHeight: "var(--w-title-M-lineHeight, 39px)",
                      letterSpacing: "var(--w-title-M-letterSpacing, 0.3px)",
                    }}
                  >
                    {item.subtitle}
                  </h4>
                  <p
                    className="self-stretch whitespace-pre-line"
                    style={{
                      color: "var(--color-text-basic-secondary, #3A3D40)",
                      fontFamily: "var(--font-family-Pretendard, Pretendard)",
                      fontSize: "var(--font-size-20, 20px)",
                      fontWeight: 400,
                      lineHeight: "var(--font-lineHeight-20, 30px)",
                      letterSpacing: "var(--font-letterSpacing-0, 0)",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

        return (
          <div key={i} className="flex flex-row items-start gap-[80px] w-full self-stretch">
            {mediaBlock}
            {textBlock}
          </div>
        );
      })}
      </div>
    </section>
  );
}
