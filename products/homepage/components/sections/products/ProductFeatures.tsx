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
      {/* ── Card 2 모바일 전용 정밀 수치 CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .fai-card-2-container {
            display: flex !important;
            height: 680px !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            position: relative !important;
            overflow: hidden !important;
          }
          .fai-card-2-textarea {
            display: flex !important;
            padding: 0 !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            flex: 1 0 0 !important;
            align-self: stretch !important;
            z-index: 10 !important;
          }
          .fai-card-2-image {
            display: flex !important;
            width: 720px !important;
            height: 480px !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            border-radius: 0 var(--cornerRadius-M, 16px) var(--cornerRadius-M, 16px) 0 !important;
            background: var(--fai-card-2-img) transparent 130.209px -0.112px / 118.715% 118.773% no-repeat !important;
          }
        }
      `}} />

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
                  backgroundPosition: "20.52% -813%",
                  backgroundSize: "191.549% 101.411%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h3 className="relative z-10 whitespace-pre-line max-[420px]:text-body-xl text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                  {feature.title}
                </h3>
                <p className="relative z-10 self-stretch max-[420px]:text-body-ms text-body desktop:text-body-l font-normal text-text-basic-tertiary">
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
                  backgroundPosition: "100% 0%",
                  backgroundSize: "93.104% 110.797%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h3 className="relative z-10 whitespace-pre-line max-[420px]:text-body-xl text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                  {feature.title}
                </h3>
                <p className="relative z-10 self-stretch max-[420px]:text-body-ms text-body desktop:text-body-l font-normal text-text-basic-tertiary">
                  {feature.description}
                </p>
              </article>
            );
          }

          /* ── Card 2+ — 피그마 절대좌표 기반 가로 분할 (텍스트 좌 / 이미지 우) ── */
          return (
            <article
              key={i}
              className="fai-card-2-container col-span-1 tablet:col-span-2 relative w-full flex flex-col tablet:block h-auto tablet:h-[430px] p-[var(--size-48)] rounded-fai-m bg-sand-filled-tertiary overflow-hidden"
              style={{ '--fai-card-2-img': `url(${feature.image})` } as React.CSSProperties}
            >
              {/* 텍스트 영역 */}
              <div className="fai-card-2-textarea relative z-10 flex flex-col gap-[10px] w-full tablet:w-[57%] tablet:pr-xl">
                <h3 className="whitespace-pre-line self-stretch max-[420px]:text-body-xl text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                  {feature.title}
                </h3>
                <p className="self-stretch max-[420px]:text-body-ms text-body desktop:text-body-l font-normal text-text-basic-tertiary">
                  {feature.description}
                </p>
              </div>
              {/* 이미지 영역 — 모바일: absolute bottom / 태블릿+: absolute right */}
              <div
                className="fai-card-2-image relative tablet:absolute tablet:right-0 tablet:top-0 w-full tablet:w-[43%] h-[240px] tablet:h-full mt-l tablet:mt-0 overflow-hidden"
                style={{
                  borderRadius: "0 var(--fai-radius-m) var(--fai-radius-m) 0",
                  backgroundImage: `url(${feature.image})`,
                  backgroundPosition: "18.13% 6.6%",
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
