"use client";

import { useState } from "react";
import Image from "next/image";
import { IcoTxtButton, IconButton, ProgressBar } from "@fai/ui";
import SocialIcon from "@/assets/icon/SocialIcon";
import { siteConfig } from "@/config/site";

type YoutubeVideo = (typeof siteConfig.mediaShowcase.youtube.videos)[number];
type Social       = (typeof siteConfig.mediaShowcase.socials)[number];

/* ── YouTube 카드 ────────────────────────────────────── */
function YoutubeCard() {
  const { youtube } = siteConfig.mediaShowcase;
  const videos = youtube.videos;
  const [index, setIndex] = useState(0);

  if (!videos.length) return null;

  const current: YoutubeVideo = videos[index];
  const hasThumb = current.thumbnail && current.thumbnail !== "MISSING_FROM_DESIGN";
  const hasHref  = current.href     && current.href     !== "MISSING_FROM_DESIGN";

  const move = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + videos.length) % videos.length);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-fai-m min-[961px]:flex-row">

      {/* 좌: 텍스트 패널 */}
      <div className="flex flex-1 min-w-0 items-center bg-fill-faint p-3xl">
        <div className="flex flex-col justify-between items-start flex-1 self-stretch">

          {/* 상단: 채널 아이콘 + 캐러셀 화살표 */}
          <div className="flex w-full items-start justify-between self-stretch">
            <div className="flex items-center gap-s">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16.0049 5.66602C16.0049 5.66602 25.1746 5.66619 27.4668 6.28711C28.729 6.62354 29.7222 7.62193 30.0586 8.89453C30.6672 11.1897 30.6641 15.9684 30.6641 15.999C30.6641 15.999 30.6643 20.8009 30.0537 23.1035C29.7174 24.3712 28.7235 25.3694 27.4609 25.7109C25.1737 26.3267 16 26.3271 16 26.3271C15.9853 26.3271 6.82442 26.3262 4.53906 25.7109C3.27652 25.3746 2.28262 24.3764 1.94629 23.1035C1.33574 20.8009 1.33594 15.999 1.33594 15.999C1.33594 15.9684 1.33838 11.19 1.95215 8.88965C2.28849 7.62205 3.28153 6.62377 4.54395 6.28223C6.82333 5.66855 15.9437 5.66602 16.0049 5.66602ZM13.0039 20.3613L20.6729 15.999L13.0039 11.6377V20.3613Z" fill="#FF0000"/>
              </svg>
              <span className="text-body-xl font-semibold text-text-basic-primary">
                {youtube.channelLabel}
              </span>
            </div>

            {videos.length > 1 && (
              <div className="flex items-start justify-end gap-ms">
                <IconButton
                  variant="assistive"
                  size="M"
                  aria-label="이전 영상"
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
                  aria-label="다음 영상"
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
              <h3 className="text-body-xl desktop:text-title-s font-bold text-text-basic-primary">
                {current.title}
              </h3>
              <p className="text-body-s desktop:text-body font-normal text-text-basic-tertiary">
                {current.description}
              </p>
            </div>
            <a
              href="https://www.youtube.com/@faindersAI/featured"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <IcoTxtButton variant="primary" size="L" shape="square">
                {youtube.ctaLabel}
              </IcoTxtButton>
            </a>
          </div>

        </div>
      </div>

      {/* 우: 영상 썸네일 + progressBar */}
      <div className="relative w-full aspect-square overflow-hidden rounded-b-fai-m p-3xl min-[961px]:flex-1 min-[961px]:min-w-0 min-[961px]:rounded-l-none min-[961px]:rounded-r-fai-m">
        {hasThumb ? (
          <Image
            src={current.thumbnail}
            alt={current.thumbnailAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 580px"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-sunken" />
        )}

        {/* progressBar */}
        <ProgressBar
          count={videos.length}
          activeIndex={index}
          onChange={setIndex}
          getAriaLabel={(i) => `영상 ${i + 1}로 이동`}
        />
      </div>

    </div>
  );
}

/* ── 소셜 카드 ─────────────────────────────────────────── */
function SocialCard({ social }: { social: Social }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${social.label} 바로가기`}
      className="group/card flex flex-col items-center flex-1 self-stretch py-xl px-2xl rounded-fai-m bg-fill-faint"
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
export default function MediaShowcaseSection() {
  const { mediaShowcase } = siteConfig;
  const hasContent = mediaShowcase.youtube.videos.length || mediaShowcase.socials.length;
  if (!hasContent) return null;

  return (
    <section className="
      flex w-full flex-col items-start bg-bg-100
      gap-3xl
      px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)]
      pt-7xl pb-5xl
    ">
      <h2 className="text-title-l desktop:text-title-xl font-bold text-text-basic-primary">
        {mediaShowcase.title}
      </h2>

      <div className="flex w-full flex-col gap-l">
        <YoutubeCard />

        {mediaShowcase.socials.length > 0 && (
          <div className="flex items-start self-stretch w-full flex-col gap-3xl min-[961px]:flex-row">
            {mediaShowcase.socials.map((social) => (
              <SocialCard key={social.label} social={social} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
