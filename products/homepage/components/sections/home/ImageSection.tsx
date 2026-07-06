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
       * object-cover object-center → 꽉 채움, 중앙 기준 정렬
       *   제품(키오스크)이 세로 중앙에 있어, 광폭 화면에서 넘치는 만큼을
       *   위쪽 여백·아래쪽 바닥에서 균등하게 잘라 제품 상단(화면 문구)이 보이도록 한다.
       *   (기존 object-bottom은 광폭에서 제품 상단이 잘리는 문제가 있었음)
       */}
      <div className="sticky top-0 w-full h-dvh overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
