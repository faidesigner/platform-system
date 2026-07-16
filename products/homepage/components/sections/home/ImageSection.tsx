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
       * w-full        → 뷰포트 전체 폭(단, 아래 폭 상한 적용 시 그 안쪽에 필러박스로 채워짐)
       * object-cover object-center (HOM-58)
       *   세로가 긴 뷰포트(모바일·태블릿)는 가로축에서만 크롭되므로 object-position의 세로 성분은
       *   애초에 화면에 영향을 주지 않는다. 세로 크롭이 실제로 발생하는 건 컨테이너가 원본보다
       *   와이드해질 때뿐이라, breakpoint와 무관하게 항상 상/하 균등 크롭(center)으로 통일한다.
       *   (이전 desktop:object-center 분기는 1440px 미만 와이드 뷰포트에서 object-bottom이 남아
       *   크롭이 전부 위쪽에만 몰리는 버그가 있었음 — center 단일화로 근본 해결.)
       */}
      <div className="sticky top-0 w-full h-dvh overflow-hidden bg-gray-50">
        {/*
          와이드+짧은 뷰포트(HOM-58)에서 object-cover가 세로로 과도하게 크롭되는 것을 막기 위해
          이미지 폭에 상한선을 둔다. 원본(3120×2048)의 세로가 최소 80%는 보이도록 하는 폭이
          100dvh × (3120 / (2048 × 0.8)) = 100dvh × 975/512 — 이미지 교체 시 이 상수도 갱신 필요.
          정상 height에서는 min()이 100%로 귀결돼 기존과 동일한 풀블리드 유지, height가 짧아질 때만
          폭이 좁아지고(=크롭 20% 고정) 남는 좌우는 사진 배경과 유사한 bg-gray-50 필러박스로 채워진다.
        */}
        <div className="relative mx-auto h-full w-[min(100%,calc(100dvh*975/512))]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
