interface ProductFeature {
  title: string;
  description: string;
  image: string;
  imagePosition: "bottom" | "right";
}

interface ProductFeaturesProps {
  title: string;
  features: ProductFeature[];
}

export default function ProductFeatures({ title, features }: ProductFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex flex-col gap-2xl pt-7xl pb-5xl">
      <h2 className="text-title-m desktop:text-title-l font-bold text-primary">{title}</h2>

      <div className="grid grid-cols-1 gap-xl tablet:grid-cols-2">
        {features.map((feature, i) => {
          /* ── Card 0 — 피그마 정밀 배경 좌표 시스템 (CSS background) ── */
          if (i === 0) {
            return (
              <article
                key={i}
                className="relative flex flex-col items-start gap-[10px] h-[640px] p-[var(--size-48)] rounded-fai-m flex-1 bg-sand-filled-tertiary"
                style={{
                  backgroundImage: `url(${feature.image})`,
                  backgroundPosition: "-104.841px 73.446px",
                  backgroundSize: "191.549% 101.411%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h3 className="relative z-10 whitespace-pre-line text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                  {feature.title}
                </h3>
                <p className="relative z-10 self-stretch text-body desktop:text-body-l font-normal text-text-basic-tertiary">
                  {feature.description}
                </p>
              </article>
            );
          }

          /* ── Card 1 — 피그마 정밀 배경 좌표 시스템 (CSS background) ── */
          if (i === 1) {
            return (
              <article
                key={i}
                className="relative flex flex-col items-start gap-[10px] h-[640px] p-[var(--size-48)] rounded-fai-m flex-1 bg-sand-filled-tertiary"
                style={{
                  backgroundImage: `url(${feature.image})`,
                  backgroundPosition: "38.482px -0.102px",
                  backgroundSize: "93.104% 110.797%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h3 className="relative z-10 whitespace-pre-line text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                  {feature.title}
                </h3>
                <p className="relative z-10 self-stretch text-body desktop:text-body-l font-normal text-text-basic-tertiary">
                  {feature.description}
                </p>
              </article>
            );
          }

          /* ── Card 2+ — 피그마 절대좌표 기반 가로 분할 (텍스트 좌 / 이미지 우) ── */
          return (
            <article
              key={i}
              className="col-span-1 tablet:col-span-2 relative w-full h-[430px] p-[var(--size-48)] rounded-fai-m bg-sand-filled-tertiary overflow-hidden"
            >
              {/* 좌측 텍스트 영역 — 이미지 침범 방지 */}
              <div className="relative z-10 flex flex-col gap-[10px] w-[calc(100%-490px)] pr-xl">
                <h3 className="whitespace-pre-line self-stretch text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                  {feature.title}
                </h3>
                <p className="self-stretch text-body desktop:text-body-l font-normal text-text-basic-tertiary">
                  {feature.description}
                </p>
              </div>
              {/* 우측 이미지 영역 — 피그마 절대좌표 독립 레이어 */}
              <div
                className="absolute right-[0.019px] top-0 w-[489.981px] h-[430px] overflow-hidden"
                style={{
                  borderRadius: "0 var(--fai-radius-m) var(--fai-radius-m) 0",
                  backgroundImage: `url(${feature.image})`,
                  backgroundPosition: "-53.352px -6.144px",
                  backgroundSize: "160.074% 121.661%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
