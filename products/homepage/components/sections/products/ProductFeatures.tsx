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
    <section className="container pt-[var(--size-120)] pb-[var(--size-80)]">
      <h2 className="text-title-l font-bold text-primary">{title}</h2>

      <div className="mt-2xl grid grid-cols-1 gap-xl md:grid-cols-2">
        {features.map((feature, i) => {
          /* ── Card 0 — 피그마 정밀 배경 좌표 시스템 (CSS background) ── */
          if (i === 0) {
            return (
              <article
                key={i}
                className="relative flex flex-col items-start h-[640px] p-[48px] rounded-[16px] flex-1"
                style={{
                  gap: "10px",
                  backgroundColor: "#ECEAE4",
                  backgroundImage: `url(${feature.image})`,
                  backgroundPosition: "-104.841px 73.446px",
                  backgroundSize: "191.549% 101.411%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h3
                  className="relative z-10 whitespace-pre-line"
                  style={{
                    color:         "var(--color-text-basic-primary, #1F2023)",
                    fontFamily:    "var(--w-font-family, Pretendard)",
                    fontSize:      "var(--w-title-M-size, 28px)",
                    fontWeight:    600,
                    lineHeight:    "var(--w-title-M-lineHeight, 39px)",
                    letterSpacing: "var(--w-title-M-letterSpacing, 0.3px)",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="relative z-10 self-stretch"
                  style={{
                    color:         "var(--color-text-basic-tertiary, #61646B)",
                    fontFamily:    "var(--font-family-Pretendard, Pretendard)",
                    fontSize:      "var(--font-size-18, 18px)",
                    fontWeight:    400,
                    lineHeight:    "var(--font-lineHeight-18, 27px)",
                    letterSpacing: "var(--font-letterSpacing-0, 0)",
                  }}
                >
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
                className="relative flex flex-col items-start h-[640px] p-[48px] rounded-[16px] flex-1"
                style={{
                  gap: "10px",
                  backgroundColor: "#ECEAE4",
                  backgroundImage: `url(${feature.image})`,
                  backgroundPosition: "38.482px -0.102px",
                  backgroundSize: "93.104% 110.797%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h3
                  className="relative z-10 whitespace-pre-line"
                  style={{
                    color:         "var(--color-text-basic-primary, #1F2023)",
                    fontFamily:    "var(--w-font-family, Pretendard)",
                    fontSize:      "var(--w-title-M-size, 28px)",
                    fontWeight:    600,
                    lineHeight:    "var(--w-title-M-lineHeight, 39px)",
                    letterSpacing: "var(--w-title-M-letterSpacing, 0.3px)",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="relative z-10 self-stretch"
                  style={{
                    color:         "var(--color-text-basic-tertiary, #61646B)",
                    fontFamily:    "var(--font-family-Pretendard, Pretendard)",
                    fontSize:      "var(--font-size-18, 18px)",
                    fontWeight:    400,
                    lineHeight:    "var(--font-lineHeight-18, 27px)",
                    letterSpacing: "var(--font-letterSpacing-0, 0)",
                  }}
                >
                  {feature.description}
                </p>
              </article>
            );
          }

          /* ── Card 2+ — 피그마 절대좌표 기반 가로 분할 (텍스트 좌 / 이미지 우) ── */
          return (
            <article
              key={i}
              className="col-span-1 md:col-span-2 relative w-full h-[430px] p-[48px] rounded-[16px] bg-[#ECEAE4] overflow-hidden"
            >
              {/* 좌측 텍스트 영역 — 이미지 침범 방지 */}
              <div className="relative z-10 flex flex-col w-[calc(100%-490px)] pr-[24px]" style={{ gap: "10px" }}>
                <h3
                  className="whitespace-pre-line self-stretch"
                  style={{
                    color:         "var(--color-text-basic-primary, #1F2023)",
                    fontFamily:    "var(--w-font-family, Pretendard)",
                    fontSize:      "var(--w-title-M-size, 28px)",
                    fontWeight:    600,
                    lineHeight:    "var(--w-title-M-lineHeight, 39px)",
                    letterSpacing: "var(--w-title-M-letterSpacing, 0.3px)",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="self-stretch"
                  style={{
                    color:         "var(--color-text-basic-tertiary, #61646B)",
                    fontFamily:    "var(--font-family-Pretendard, Pretendard)",
                    fontSize:      "var(--font-size-18, 18px)",
                    fontWeight:    400,
                    lineHeight:    "var(--font-lineHeight-18, 27px)",
                    letterSpacing: "var(--font-letterSpacing-0, 0)",
                  }}
                >
                  {feature.description}
                </p>
              </div>
              {/* 우측 이미지 영역 — 피그마 절대좌표 독립 레이어 */}
              <div
                className="absolute right-[0.019px] top-0 w-[489.981px] h-[430px] overflow-hidden"
                style={{
                  borderRadius: "0 16px 16px 0",
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
