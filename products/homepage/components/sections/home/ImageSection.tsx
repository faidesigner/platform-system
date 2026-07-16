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
       * object-cover object-bottom desktop:object-center
       *   - 기본(모바일·태블릿): object-bottom — 세로 비율에서 바닥 기준 정렬이 자연스러움
       *   - desktop(≥1440px): object-center — 광폭에서 object-bottom은 제품 상단(화면 문구)이
       *     잘리므로, 넘치는 만큼을 상·하 균등 분배해 제품 상단이 보이도록 중앙 정렬로 전환한다.
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
            className="object-cover object-bottom desktop:object-center"
          />
        </div>
      </div>
    </section>
  );
}
