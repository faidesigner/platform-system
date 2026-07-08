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

/** 피그마 정밀 배경 좌표 — Card 0·1 공통 (background-position / background-size) */
const CARD_BG: Record<number, { position: string; size: string }> = {
  0: { position: "20.52% -813%",  size: "191.549% 101.411%" },
  1: { position: "100% 0%",       size: "93.104% 110.797%" },
};

export default function ProductFeatures({ title, features }: ProductFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] flex flex-col gap-2xl pt-3xl min-[769px]:pt-7xl pb-3xl min-[769px]:pb-5xl">
      {/* ── Card 0·2 모바일 전용 정밀 수치 CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 961px) {
          .fai-card-01 {
            padding: var(--padding-3-xl, 40px) !important;
          }
          .fai-card-2-container {
            padding: var(--padding-3-xl, 40px) !important;
          }
        }
        @media (max-width: 960px) {
          .fai-card-01 {
            padding: var(--padding-2-xl, 32px) !important;
          }
          .fai-card-2-container {
            display: flex !important;
            flex-direction: row !important;
            height: 427px !important;
            padding: 0 !important;
            align-items: stretch !important;
            overflow: hidden !important;
          }
          .fai-card-2-textarea {
            display: flex !important;
            flex: 1 !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: var(--padding-2-xl, 32px) !important;
            align-self: auto !important;
            z-index: 10 !important;
          }
          .fai-card-2-image {
            display: flex !important;
            position: relative !important;
            flex: 0 0 50% !important;
            width: auto !important;
            height: 100% !important;
            bottom: auto !important;
            right: auto !important;
            margin-top: 0 !important;
            border-radius: var(--cornerRadius-M, 16px) 0 0 var(--cornerRadius-M, 16px) !important;
            background: var(--fai-card-2-img) transparent 18.13% 6.6% / 160.074% 121.661% no-repeat !important;
          }
        }
        @media (max-width: 768px) {
          /* ── Card 0 · 1 래퍼 ── */
          .fai-card-01 {
            width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            background-image: none !important;
          }
          /* ── Card 0 · 1 텍스트 영역 ── */
          .fai-card-text-area {
            padding: var(--padding-XL, 24px) !important;
            flex: none !important;
          }
          /* ── Card 0 · 1 이미지 영역 ── */
          .fai-card-image-area {
            display: flex !important;
            width: 100% !important;
            height: 291px !important;
          }
          .fai-card-0 .fai-card-image-area {
            background: var(--fai-card-img) transparent -24.218px -79.348px / 172.102% 146.742% no-repeat !important;
          }
          .fai-card-1 .fai-card-image-area {
            background: var(--fai-card-img) transparent 100% -115.723px / 89.644% 171.81% no-repeat !important;
          }
          .fai-card-2-container {
            width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            overflow: hidden !important;
          }
          .fai-card-2-textarea {
            padding: var(--padding-XL, 24px) !important;
            flex: none !important;
          }
          .fai-card-2-image {
            position: relative !important;
            flex: none !important;
            width: 100% !important;
            height: 291px !important;
            margin-top: 0 !important;
            border-radius: 0 !important;
            background: var(--fai-card-2-img) transparent -0.25px -0.108px / 139.315% 118.879% no-repeat !important;
          }
        }
      `}} />

      <h2 className="text-title-m desktop:text-title-l font-bold text-text-basic-primary">{title}</h2>

      <div className="grid grid-cols-1 gap-xl tablet:grid-cols-2">
        {features.map((feature, i) => {

          /* ── Card 0·1 — 피그마 정밀 배경 좌표 (구조 동일, 좌표만 상이) ── */
          if (i < 2) {
            const { position, size } = CARD_BG[i];
            return (
              <article
                key={i}
                className={`fai-card-01${i === 0 ? " fai-card-0" : " fai-card-1"} relative flex flex-col items-start gap-[10px] h-[640px] p-[var(--size-48)] rounded-fai-m flex-1 bg-sand-filled-tertiary`}
                style={{
                  '--fai-card-img': `url(${feature.image})`,
                  backgroundImage: `url(${feature.image})`,
                  backgroundPosition: position,
                  backgroundSize: size,
                  backgroundRepeat: "no-repeat",
                } as React.CSSProperties}
              >
                <div className="fai-card-text-area w-full flex flex-col gap-[10px]">
                  <h3 className="relative z-10 whitespace-pre-line text-title-s desktop:text-title-m font-semibold text-text-basic-primary">
                    {feature.title}
                  </h3>
                  <p className="relative z-10 self-stretch text-body desktop:text-body-l font-normal text-text-basic-tertiary">
                    {feature.description}
                  </p>
                </div>
                <div className="fai-card-image-area hidden" />
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
                <p className="whitespace-pre-line self-stretch max-[420px]:text-body-ms text-body desktop:text-body-l font-normal text-text-basic-tertiary">
                  {feature.description}
                </p>
              </div>
              {/* 이미지 영역 — 모바일: absolute bottom / 태블릿+: absolute right */}
              <div
                className="fai-card-2-image relative tablet:absolute tablet:right-0 tablet:top-0 w-full tablet:w-[43%] h-9xl tablet:h-full mt-l tablet:mt-0 overflow-hidden"
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
