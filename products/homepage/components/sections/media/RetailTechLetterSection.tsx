"use client";

import { useState } from "react";
import { IcoTxtButton, Label } from "@fai/ui";

// scripts/sync-stibee.mjs가 Stibee API에서 생성하는 레터 목록 항목 shape(config/retail-tech-letter.json).
interface Letter {
  id: string;
  title: string;
  previewText: string;
  publishedAt: string;
  url: string;
  thumbnailUrl?: string;
}

// "2026-06-25T11:00:..." → "2026. 6. 25."
const fmtDate = (iso: string) => {
  const [y, m, d] = (iso || "").slice(0, 10).split("-");
  return y && m && d ? `${y}. ${Number(m)}. ${Number(d)}` : "";
};

const PAGE = 6; // 처음 6개, 더보기 클릭마다 +6

/* ── Section ─────────────────────────────────────────── */
interface RetailTechLetterSectionProps {
  title: string;
  ctaLabel: string;
  moreLabel: string;
  url: string;
  letters: Letter[];
}

// Stibee는 외부 iframe 임베드를 차단(X-Frame-Options)하므로, 원본 Stibee의 "지난 뉴스레터"
// 목록을 동일한 plain 리스트로 직접 렌더하고, 클릭 시 새 탭으로 개별 글을 연다.
// letters(레터 제목)는 Stibee에서 리싱크마다 그대로 받아오는 원문 — 정적 messages 인덱스로 옮기지 않음.
export default function RetailTechLetterSection({
  title,
  ctaLabel,
  moreLabel,
  url,
  letters,
}: RetailTechLetterSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE);

  if (!letters.length) return null;

  const hasMore = visibleCount < letters.length;
  const handleMore = () => setVisibleCount((prev) => Math.min(prev + PAGE, letters.length));

  return (
    <section className="w-full bg-surface">
      <div className="flex flex-col items-start max-w-[1440px] mx-auto px-[var(--padding-XL)] min-[961px]:px-[var(--padding-8XL)] pt-[var(--padding-5XL,80px)] pb-[var(--padding-7-xl,120px)] gap-[var(--spacing-3XL,40px)]">
        {/* 헤더: 제목 + 구독하기 */}
        <div className="flex w-full flex-col items-start justify-between gap-l min-[641px]:flex-row min-[641px]:items-center">
          <h2 className="text-title-l desktop:text-title-xl font-bold text-text-basic-primary">
            {title}
          </h2>
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block shrink-0">
            <IcoTxtButton variant="secondary" size="L" shape="square">
              {ctaLabel}
            </IcoTxtButton>
          </a>
        </div>

        {/* 지난 뉴스레터 목록 + 더보기 */}
        <div className="flex w-full flex-col items-center gap-[var(--spacing-4XL,56px)]">
          <ul className="w-full flex flex-col gap-[var(--spacing-S,8px)]">
            {letters.slice(0, visibleCount).map((letter) => (
              <li key={letter.id} className="border-b border-border-faint">
                <a
                  href={letter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[var(--spacing-XL,24px)] py-[var(--spacing-M,16px)] transition-opacity hover:opacity-60"
                >
                  <div className="flex flex-col gap-xs flex-1 min-w-0">
                    <Label shape="square" size="S" className="self-start !text-caption-m !text-text-basic-tertiary !font-semibold !px-[var(--padding-S,8px)]">ISSUE NO.{letter.id}</Label>
                    <h3 className="line-clamp-2 text-body-l font-semibold text-text-basic-primary">
                      {letter.title}
                    </h3>
                    <time dateTime={letter.publishedAt} className="text-body-xs leading-[1.25rem] font-normal text-text-basic-secondary">
                      {fmtDate(letter.publishedAt)}
                    </time>
                  </div>
                  {letter.thumbnailUrl && (() => {
                    const issueNum = Number(letter.id);
                    const thumbBg = issueNum >= 1 && issueNum <= 6 ? "var(--color-bg-200)" : "var(--color-filled-basic-primary)";
                    return (
                      <div className="relative shrink-0 w-[160px] aspect-video overflow-hidden rounded-fai-s p-[var(--padding-S,8px)]" style={{ background: thumbBg }}>
                        <img
                          src={letter.thumbnailUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      </div>
                    );
                  })()}
                </a>
              </li>
            ))}
          </ul>

          {/* 더보기 — NewsSection과 동일한 버튼. 모두 노출되면 숨김 */}
          {hasMore && (
            <IcoTxtButton
              variant="tertiary"
              size="XL"
              shape="round"
              iconPosition="right"
              onClick={handleMore}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <mask id="mask_rtl_more" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
                    <path d="M10.0039 2.95898C10.3904 2.95909 10.7041 3.27265 10.7041 3.65918V9.30176H16.3477C16.734 9.3021 17.0469 9.61557 17.0469 10.002C17.0468 10.3883 16.7339 10.7018 16.3477 10.7021H10.7041V16.3457C10.7038 16.7319 10.3902 17.0448 10.0039 17.0449C9.61752 17.0449 9.30405 16.732 9.30371 16.3457V10.7021H3.66113C3.2746 10.7021 2.96104 10.3885 2.96094 10.002C2.96094 9.61535 3.27453 9.30176 3.66113 9.30176H9.30371V3.65918C9.30371 3.27258 9.61731 2.95898 10.0039 2.95898Z" fill="black"/>
                  </mask>
                  <g mask="url(#mask_rtl_more)">
                    <rect width="20" height="20" fill="currentColor"/>
                  </g>
                </svg>
              }
            >
              {moreLabel}
            </IcoTxtButton>
          )}
        </div>
      </div>
    </section>
  );
}
