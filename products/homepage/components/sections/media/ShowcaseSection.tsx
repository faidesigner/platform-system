"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IcoTxtButton, IconButton, ProgressBar } from "@fai/ui";
import SocialIcon from "@fai/ui/components/common/Icon/SocialIcon";
import type { SocialLink } from "@/config/types";
import { trackEvent } from "@/lib/analytics/track";

// scripts/sync-youtube.mjs가 RSS에서 생성하는 쇼케이스 영상 데이터의 항목 shape(config/youtube-showcase.json).
interface YoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailAlt: string;
  href: string;
}

type Social = SocialLink;

// 서버 컴포넌트에서 함수 props를 클라이언트로 넘길 수 없어(직렬화 불가),
// "{index}"/"{label}" 플레이스홀더가 남은 템플릿 문자열을 받아 클라에서 치환한다.
interface ShowcaseA11y {
  prevVideo: string;
  nextVideo: string;
  goToVideoTemplate: string;
  followAriaLabelTemplate: string;
}

/* 유튜브 썸네일 — 고화질(maxres) → 표준(hq) → 빈 화면 순으로 fallback */
function YoutubeThumb({ videoId, alt }: { videoId: string; alt: string }) {
  const sources = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];
  const [level, setLevel] = useState(0);
  // 영상이 바뀌면 다시 maxres부터 시도
  useEffect(() => setLevel(0), [videoId]);

  // 썸네일 모두 실패 시: 깨진 X박스 대신 브랜드 디폴트 이미지(Figma 코멘트 반영)
  if (!videoId || level >= sources.length) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-fill-faint">
        <Image
          src="/logos/logoFaindersai-b.svg"
          alt={alt || "Fainders AI"}
          width={180}
          height={42}
          className="opacity-40"
        />
      </div>
    );
  }
  return (
    <Image
      key={`${videoId}-${level}`}
      src={sources[level]}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 1280px) 100vw, 580px"
      onError={() => setLevel((l) => l + 1)}
      onLoad={(e) => {
        // maxresdefault가 없는 영상은 YouTube가 120x90 회색 플레이스홀더를 HTTP 200으로 반환해
        // onError가 발생하지 않는다 → naturalWidth로 감지해 다음 소스(hqdefault)로 폴백.
        const img = e.currentTarget as HTMLImageElement;
        if (img.naturalWidth && img.naturalWidth <= 120) setLevel((l) => l + 1);
      }}
    />
  );
}

/* ── YouTube 카드 ────────────────────────────────────── */
interface YoutubeCardProps {
  channelLabel: string;
  ctaLabel: string;
  videos: YoutubeVideo[];
  a11y: ShowcaseA11y;
}

function YoutubeCard({ channelLabel, ctaLabel, videos, a11y }: YoutubeCardProps) {
  const DURATION = 3500;
  const ANIM_MS = 400;
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1); // 마지막 전환 방향(1=다음, -1=이전) — 슬라이드 애니메이션 방향 결정
  const animatingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  // 자동 전환 타이머
  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setTimeout(() => {
      startSlide((index + 1) % videos.length);
    }, DURATION);
    return () => clearTimeout(timer);
  }, [index, videos.length]);

  // 슬라이드 완료 처리 — StrictMode cleanup에서 animatingRef 리셋해 영구 고착 방지
  useEffect(() => {
    if (!animating || nextIdx === null) return;
    const t = setTimeout(() => {
      setIndex(nextIdx);
      setNextIdx(null);
      setAnimating(false);
      animatingRef.current = false;
    }, ANIM_MS);
    return () => {
      clearTimeout(t);
      animatingRef.current = false;
    };
  }, [animating, nextIdx]);

  const startSlide = (newIdx: number, direction: 1 | -1 = 1) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setDir(direction);
    setNextIdx(newIdx);
    setAnimating(true);
  };

  const move = (d: -1 | 1) =>
    startSlide((index + d + videos.length) % videos.length, d);

  /* 모바일 좌우 스와이프 — 데스크톱 화살표 버튼을 대체하는 터치 제스처(HOM-33).
     세로 스크롤을 막지 않도록 preventDefault 없이 touchend delta만 판정. */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || videos.length <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;      // 임계값 미만은 탭·미세 이동으로 무시
    move(dx < 0 ? 1 : -1);              // ← 스와이프 = 다음, → 스와이프 = 이전
  };

  if (!videos.length) return null;

  const current: YoutubeVideo = videos[index];
  // 이동 방향에 맞춰 슬라이드 애니메이션 방향을 반전(이전 이동은 반대 방향으로 자연스럽게).
  const outAnim = dir === 1 ? 'fai-slide-out-left' : 'fai-slide-out-right';
  const inAnim = dir === 1 ? 'fai-slide-in-right' : 'fai-slide-in-left';

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'pan-y' }}
      className="flex w-full flex-col overflow-hidden rounded-fai-m min-[961px]:flex-row"
    >

      {/* 좌: 텍스트 패널 — 960px 이하에서 order-2 (썸네일 아래) */}
      <div className="flex flex-1 min-w-0 items-center bg-fill-faint p-[var(--padding-2-xl,32px)] max-[960px]:order-2 max-[960px]:flex-none max-[960px]:min-h-[320px] max-[421px]:p-[var(--padding-XL)]">
        <div className="flex flex-col justify-between items-start flex-1 self-stretch">

          {/* 상단: 채널 아이콘 + 캐러셀 화살표 */}
          <div className="flex w-full items-start justify-between self-stretch">
            <div className="flex items-center gap-s">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16.0049 5.66602C16.0049 5.66602 25.1746 5.66619 27.4668 6.28711C28.729 6.62354 29.7222 7.62193 30.0586 8.89453C30.6672 11.1897 30.6641 15.9684 30.6641 15.999C30.6641 15.999 30.6643 20.8009 30.0537 23.1035C29.7174 24.3712 28.7235 25.3694 27.4609 25.7109C25.1737 26.3267 16 26.3271 16 26.3271C15.9853 26.3271 6.82442 26.3262 4.53906 25.7109C3.27652 25.3746 2.28262 24.3764 1.94629 23.1035C1.33574 20.8009 1.33594 15.999 1.33594 15.999C1.33594 15.9684 1.33838 11.19 1.95215 8.88965C2.28849 7.62205 3.28153 6.62377 4.54395 6.28223C6.82333 5.66855 15.9437 5.66602 16.0049 5.66602ZM13.0039 20.3613L20.6729 15.999L13.0039 11.6377V20.3613Z" fill="#FF0000"/>
              </svg>
              <span className="text-body-xl font-semibold text-text-basic-primary">
                {channelLabel}
              </span>
            </div>

            {videos.length > 1 && (
              <div className="flex items-start justify-end gap-ms max-[960px]:hidden">
                <IconButton
                  variant="assistive"
                  size="M"
                  aria-label={a11y.prevVideo}
                  onClick={() => move(-1)}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <mask id="mask0_6537_489" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                        <path d="M9.50586 2.83773C9.77924 2.56457 10.2228 2.56444 10.4961 2.83773C10.769 3.11106 10.7691 3.55472 10.4961 3.82797L5.02344 9.29965H16.667C17.0534 9.29982 17.3662 9.61335 17.3662 9.99984C17.3661 10.3862 17.0534 10.6999 16.667 10.7H5.02539L10.4961 16.1707C10.7691 16.444 10.769 16.8877 10.4961 17.161C10.2228 17.4343 9.77925 17.4341 9.50586 17.161L2.83887 10.495L2.34375 9.99984L9.50586 2.83773Z" fill="black"/>
                      </mask>
                      <g mask="url(#mask0_6537_489)">
                        <rect width="20" height="20" fill="currentColor"/>
                      </g>
                    </svg>
                  }
                />
                <IconButton
                  variant="assistive"
                  size="M"
                  aria-label={a11y.nextVideo}
                  onClick={() => move(1)}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <mask id="mask0_6537_2761" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                        <path d="M10.252 17.1623C9.97857 17.4354 9.53502 17.4356 9.26172 17.1623C8.98882 16.8889 8.98869 16.4453 9.26172 16.172L14.7344 10.7004L3.09082 10.7004C2.70437 10.7002 2.3916 10.3866 2.3916 10.0002C2.39171 9.61375 2.70444 9.30014 3.09082 9.29996L14.7324 9.29996L9.26172 3.82926C8.98872 3.55599 8.9888 3.11234 9.26172 2.83902C9.53501 2.56574 9.97857 2.5659 10.252 2.83902L16.9189 9.50504L17.4141 10.0002L10.252 17.1623Z" fill="black"/>
                      </mask>
                      <g mask="url(#mask0_6537_2761)">
                        <rect width="20" height="20" fill="currentColor"/>
                      </g>
                    </svg>
                  }
                />
              </div>
            )}
          </div>

          {/* 하단: textBox + button */}
          <div className="flex flex-col items-start self-stretch gap-4xl">
            {/* textBox */}
            <div className="flex flex-col items-start self-stretch gap-m">
              {/* min-h 고정 — 영상 전환 시 위치 흔들림 방지 */}
              <h3 className="line-clamp-2 text-body-xl desktop:text-title-s font-bold text-text-basic-primary">
                {current.title}
              </h3>
              <p className="line-clamp-2 text-body-s desktop:text-body font-normal text-text-basic-tertiary">
                {current.description}
              </p>
            </div>
            <a
              href={current.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              onClick={() => trackEvent("interest_click", { location: "media_showcase", label: ctaLabel })}
            >
              <IcoTxtButton variant="primary" size="L" shape="square">
                {ctaLabel}
              </IcoTxtButton>
            </a>
          </div>

        </div>
      </div>

      {/* 우: 영상 썸네일 + progressBar — 960px 이하에서 order-1 (상단). 스와이프는 카드 전체에서 처리. */}
      <div
        className="relative w-full aspect-square overflow-hidden rounded-b-fai-m p-[var(--padding-2-xl,32px)] min-[961px]:flex-1 min-[961px]:min-w-0 min-[961px]:rounded-l-none min-[961px]:rounded-r-fai-m max-[960px]:order-1 max-[960px]:aspect-[960/472] max-[960px]:rounded-t-fai-m max-[960px]:rounded-b-none max-[768px]:h-[335px] max-[768px]:aspect-auto max-[421px]:p-[var(--padding-XL)]">

        {/* 슬라이드 키프레임 */}
        <style>{`
          @keyframes fai-slide-out-left  { from { transform: translateX(0) }     to { transform: translateX(-100%) } }
          @keyframes fai-slide-in-right  { from { transform: translateX(100%) }  to { transform: translateX(0) } }
          @keyframes fai-slide-out-right { from { transform: translateX(0) }     to { transform: translateX(100%) } }
          @keyframes fai-slide-in-left   { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        `}</style>

        {/* 현재 이미지 — 애니메이션 시 이동 방향으로 이탈 */}
        <div
          className="absolute inset-0"
          style={animating ? { animation: `${outAnim} ${ANIM_MS}ms ease-in-out forwards` } : undefined}
        >
          <YoutubeThumb videoId={current.videoId} alt={current.thumbnailAlt} />
        </div>

        {/* 다음 이미지 — 애니메이션 시 우측 진입 */}
        {animating && nextIdx !== null && (
          <div
            className="absolute inset-0"
            style={{ animation: `${inAnim} ${ANIM_MS}ms ease-in-out forwards` }}
          >
            <YoutubeThumb videoId={videos[nextIdx].videoId} alt={videos[nextIdx].thumbnailAlt} />
          </div>
        )}

        {/* progressBar */}
        <div className="absolute top-[var(--padding-2-xl,32px)] left-[var(--padding-2-xl,32px)] right-[var(--padding-2-xl,32px)] max-[421px]:top-[var(--padding-XL)] max-[421px]:left-[var(--padding-XL)] max-[421px]:right-[var(--padding-XL)]">
          <ProgressBar
            count={videos.length}
            activeIndex={animating && nextIdx !== null ? nextIdx : index}
            onChange={(i) => startSlide(i, i >= index ? 1 : -1)}
            duration={DURATION}
            getAriaLabel={(i) => a11y.goToVideoTemplate.replace("{index}", String(i + 1))}
            barClassName="h-[3px]"
          />
        </div>
      </div>

    </div>
  );
}

/* ── 소셜 카드 ─────────────────────────────────────────── */
function SocialCard({ social, followAriaLabel }: { social: Social; followAriaLabel: string }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={followAriaLabel}
      className="group/card flex flex-col items-center flex-1 self-stretch py-xl px-2xl rounded-fai-m bg-fill-faint"
      onClick={() => trackEvent("interest_click", { location: "media_showcase", label: social.label })}
    >
      <div className="flex justify-between items-center self-stretch w-full">
        <div className="flex items-center gap-ms">
          <SocialIcon name={social.label === "LinkedIn" ? "linkedin" : "instagram"} />
          <span className="text-body-l desktop:text-body-xl font-semibold text-text-basic-primary">
            {social.label}
          </span>
        </div>

        <IconButton
          variant="secondary"
          size="L"
          shape="circle"
          aria-hidden
          tabIndex={-1}
          icon={
            <div className="relative overflow-hidden w-xl h-xl">
              {/* 첫 번째: 중앙 → 우상단 이탈 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                className="transition-all duration-300 ease-in-out group-hover/card:translate-x-[150%] group-hover/card:-translate-y-[150%]">
                <g clipPath="url(#clip_sa_a)">
                  <mask id="mask_sa_a" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="5" y="5" width="15" height="14">
                    <path d="M19.3027 17.9986C19.3027 18.4402 18.9445 18.7996 18.5029 18.7998C18.0613 18.7997 17.7026 18.4408 17.7023 17.9993L17.7031 7.98361L7.35909 17.9715C7.04134 18.2783 6.53508 18.2703 6.22814 17.9526C5.92128 17.6348 5.92986 17.1279 6.24766 16.821L16.6277 6.79871L6.50279 6.79832C6.0611 6.79816 5.70292 6.44027 5.70291 5.99855C5.70318 5.55709 6.06121 5.1989 6.50269 5.19868L19.3026 5.19932L19.3027 17.9986Z" fill="black"/>
                  </mask>
                  <g mask="url(#mask_sa_a)">
                    <rect width="24" height="24" fill="currentColor"/>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip_sa_a"><rect width="24" height="24" fill="white"/></clipPath>
                </defs>
              </svg>
              {/* 두 번째: 좌하단 대기 → 중앙 진입 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                className="absolute inset-0 transition-all duration-300 ease-in-out -translate-x-[150%] translate-y-[150%] group-hover/card:translate-x-0 group-hover/card:translate-y-0">
                <g clipPath="url(#clip_sa_b)">
                  <mask id="mask_sa_b" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="5" y="5" width="15" height="14">
                    <path d="M19.3027 17.9986C19.3027 18.4402 18.9445 18.7996 18.5029 18.7998C18.0613 18.7997 17.7026 18.4408 17.7023 17.9993L17.7031 7.98361L7.35909 17.9715C7.04134 18.2783 6.53508 18.2703 6.22814 17.9526C5.92128 17.6348 5.92986 17.1279 6.24766 16.821L16.6277 6.79871L6.50279 6.79832C6.0611 6.79816 5.70292 6.44027 5.70291 5.99855C5.70318 5.55709 6.06121 5.1989 6.50269 5.19868L19.3026 5.19932L19.3027 17.9986Z" fill="black"/>
                  </mask>
                  <g mask="url(#mask_sa_b)">
                    <rect width="24" height="24" fill="currentColor"/>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip_sa_b"><rect width="24" height="24" fill="white"/></clipPath>
                </defs>
              </svg>
            </div>
          }
        />
      </div>
    </a>
  );
}

/* ── Section ─────────────────────────────────────────── */
interface MediaShowcaseSectionProps {
  title: string;
  channelLabel: string;
  ctaLabel: string;
  videos: YoutubeVideo[];
  socials: Social[];
  a11y: ShowcaseA11y;
}

export default function MediaShowcaseSection({
  title,
  channelLabel,
  ctaLabel,
  videos,
  socials,
  a11y,
}: MediaShowcaseSectionProps) {
  const hasContent = videos.length || socials.length;
  if (!hasContent) return null;

  return (
    <section className="w-full bg-bg-100">
      <div className="
        flex flex-col items-start
        max-w-[1440px] mx-auto
        gap-3xl
        px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)]
        pt-7xl pb-5xl
      ">
        <h2 className="text-title-l desktop:text-title-xl font-bold text-text-basic-primary">
          {title}
        </h2>

        <div className="flex w-full flex-col gap-[var(--spacing-2XL,32px)]">
          <YoutubeCard channelLabel={channelLabel} ctaLabel={ctaLabel} videos={videos} a11y={a11y} />

          {socials.length > 0 && (
            <div className="flex items-start self-stretch w-full flex-col gap-[var(--spacing-2XL,32px)] min-[961px]:flex-row min-[961px]:gap-[var(--spacing-XL,24px)]">
              {socials.map((social) => (
                <SocialCard
                  key={social.label}
                  social={social}
                  followAriaLabel={a11y.followAriaLabelTemplate.replace("{label}", social.label)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
