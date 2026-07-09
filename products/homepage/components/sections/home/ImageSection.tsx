import Image from 'next/image';

export interface ImageSectionProps {
  src: string;
  alt: string;
  /** next/image priority 힌트 — LCP 이미지일 때 true */
  priority?: boolean;
  /**
   * 스크롤 핀 지속 구간 (기본 200vh).
   * 실제 section 높이 = pinDuration + 100dvh (sticky 요소 높이)
   * → sticky 고정 지속 = section 높이 − sticky 높이 = pinDuration
   */
  pinDuration?: string;
}

export function ImageSection({
  src,
  alt,
  priority    = false,
  pinDuration = '200vh',
}: ImageSectionProps) {
  return (
    /*
     * 스크롤 핀 래퍼
     *   section 높이 = pinDuration + 100dvh
     *   → sticky 고정 지속 = pinDuration (200vh)
     *   overflow 없음 → sticky 차단 방지
     */
    <section
      className="relative w-full"
      style={{ height: `calc(${pinDuration} + 100dvh)` }}
      aria-label={alt}
    >
      {/*
       * sticky top-0  → 뷰포트 상단 고정
       * h-dvh         → 뷰포트 전체 높이
       * w-full        → 뷰포트 전체 폭
       * object-cover object-bottom desktop:object-center
       *   - 기본(모바일·태블릿): object-bottom — 세로 비율에서 바닥 기준 정렬이 자연스러움
       *   - desktop(≥1440px): object-center — 광폭에서 object-bottom은 제품 상단(화면 문구)이
       *     잘리므로, 넘치는 만큼을 상·하 균등 분배해 제품 상단이 보이도록 중앙 정렬로 전환한다.
       */}
      <div className="sticky top-0 w-full h-dvh overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-bottom desktop:object-center"
        />
      </div>
    </section>
  );
}
