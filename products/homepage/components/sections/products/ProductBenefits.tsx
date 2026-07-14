"use client";

import { motion } from "framer-motion";
import { InViewVideo } from "@fai/ui";
import BenefitGraphic, { type BenefitIconKey } from "@fai/ui/components/common/Icon/BenefitGraphic";

const scrollFadeInUp = {
  initial: { opacity: 0, y: 100, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

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
    <section className="w-full flex flex-col items-center py-5xl bg-bg-100">
      <div className="w-full max-w-[1440px] px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex flex-col items-start gap-3xl">
      <h2 className="w-full text-title-s desktop-s:text-title-m desktop:text-title-l font-bold text-text-basic-primary">
        {title}
      </h2>

      <div className="flex flex-col items-start gap-7xl w-full self-stretch">
        {benefits.map((benefit, i) => {
          const isRight = benefit.imagePosition === "right";

          const mediaBlock = (
            <div
              key={`media-${i}`}
              className={[
                "flex flex-col items-start w-full tablet:w-[45%] aspect-[520/600] tablet:aspect-auto shrink-0 rounded-fai-m overflow-hidden tablet:sticky tablet:top-7xl z-10 bg-surface-sunken",
                "desktop:w-[520px]",
                isRight ? "tablet:order-2" : "order-1",
              ].join(" ")}
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
                "flex flex-col items-start py-xl px-0 gap-3xl desktop:gap-5xl flex-1",
                isRight ? "tablet:order-1" : "order-2",
              ].join(" ")}
            >
              <div className="flex flex-col items-start gap-s w-full">
                <div className="flex items-center gap-s">
                  <BenefitGraphic name={benefit.icon} className="w-10 h-10 max-[961px]:w-8 max-[961px]:h-8 max-[768px]:w-6 max-[768px]:h-6 shrink-0" />
                  <span className="text-body-l desktop-s:text-body-xl desktop:text-title-s font-semibold text-brand-text">
                    {benefit.eyebrow}
                  </span>
                </div>

                <h3 className="self-stretch whitespace-pre-line text-title-m desktop-s:text-title-l desktop:text-title-xl font-bold text-text-basic-primary">
                  {benefit.title}
                </h3>
              </div>

              <div className="flex flex-col items-start gap-xl desktop:gap-3xl w-full">
                {benefit.items.map((item, j) => (
                  <div key={j} className="flex flex-col items-start gap-s">
                    <h4 className="text-body-xl desktop-s:text-title-s desktop:text-title-m font-bold text-text-basic-primary">
                      {item.subtitle}
                    </h4>
                    <p className="self-stretch whitespace-pre-line text-body desktop-s:text-body-l desktop:text-body-xl font-normal text-text-basic-secondary">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );

          return (
            <motion.div
              key={i}
              className="flex flex-col tablet:flex-row items-start tablet:items-stretch gap-3xl tablet:gap-5xl w-full self-stretch"
              variants={scrollFadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1, delay: i * 0.15 }}
            >
              {mediaBlock}
              {textBlock}
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
