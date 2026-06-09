import Image from "next/image";
import ReviewIcon, { type ReviewIconKey } from "@/assets/icon/ReviewIcon";
import type { QuoteSegment } from "@/config/site";

interface Review {
  category: string;
  categoryColorVar: string;
  iconBgVar: string;
  icon: ReviewIconKey;
  store: string;
  role: string;
  image: string;
  quote: readonly QuoteSegment[];
}

interface ProductReviewsProps {
  title: string;
  reviews: Review[];
}

export default function ProductReviews({ title, reviews }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section
      className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[32px] px-6 py-10 md:gap-[56px] md:px-[150px] md:py-[80px]"
      style={{ background: "var(--color-bg-100, #F4F5F6)" }}
    >
      <h2
        className="w-full"
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

      {/* 가로 슬라이더 — 카드 3개 가로 나열 + snap */}
      <div className="flex h-auto w-full max-w-[1140px] snap-x snap-mandatory items-start gap-[16px] overflow-x-auto scrollbar-none md:h-[540px] md:gap-[24px]">
        {reviews.map((review, i) => (
          <article
            key={i}
            className="flex w-[calc(100%-40px)] shrink-0 snap-start flex-col items-start gap-[24px] rounded-[16px] p-6 md:w-auto md:flex-row md:items-end md:gap-[32px] md:rounded-[24px] md:p-[40px_32px]"
            style={{ background: "var(--color-filled-fourth, #F5F5F5)" }}
          >
            {/* 좌: 텍스트 */}
            <div className="flex flex-col items-start self-stretch gap-[40px] md:gap-[80px]">
              <div className="flex flex-col items-start gap-[20px] self-stretch">
                <span
                  className="flex shrink-0 items-center justify-center rounded-full p-[12px]"
                  style={{ backgroundColor: `var(${review.iconBgVar})` }}
                >
                  <ReviewIcon name={review.icon} />
                </span>
                <span
                  className="self-stretch"
                  style={{
                    color: `var(${review.categoryColorVar})`,
                    fontFamily: "var(--w-font-family, Pretendard)",
                    fontSize: 28,
                    fontWeight: 600,
                    lineHeight: "39px",
                    letterSpacing: "0.3px",
                  }}
                >
                  {review.category}
                </span>
              </div>

              <div className="flex flex-col items-start gap-[20px]">
                <p
                  style={{
                    color: "var(--color-text-basic-secondary, #3A3D40)",
                    fontFamily: "var(--w-font-family, Pretendard)",
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: "27px",
                  }}
                >
                  {review.store}
                  {review.role && (
                    <span style={{ padding: "0 8px", color: "var(--color-text-basic-fourth, #A1A5AA)" }}>|</span>
                  )}
                  {review.role}
                </p>
                <p
                  className="w-full md:w-[432px]"
                  style={{
                    color: "var(--color-text-tertiary, #61646B)",
                    fontFamily: "var(--w-font-family, Pretendard)",
                    fontSize: 20,
                    fontWeight: 400,
                    lineHeight: "30px",
                  }}
                >
                  {review.quote.map((seg, j) =>
                    seg.emphasis ? (
                      <span
                        key={j}
                        style={{
                          color: `var(${review.categoryColorVar})`,
                          fontWeight: 500,
                        }}
                      >
                        {seg.text}
                      </span>
                    ) : (
                      <span key={j}>{seg.text}</span>
                    )
                  )}
                </p>
              </div>
            </div>

            {/* 우: 이미지 613×460 + 그라데이션 오버레이 */}
            <div className="relative flex h-[220px] w-full shrink-0 flex-col items-start justify-end overflow-hidden rounded-[16px] bg-fill-faint md:h-[460px] md:w-[613px] md:rounded-[24px]">
              <Image
                src={review.image}
                alt={`${review.store} 전경`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 613px"
              />
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(9, 9, 11, 0.50) 100%)" }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
