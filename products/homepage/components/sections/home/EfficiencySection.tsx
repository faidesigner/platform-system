/**
 * EfficiencySection — Efficiency 섹션
 * 풀스크린 비디오 배경 + scrim 통합 컨텐츠 박스 + 3단 스탯
 *
 * 반응형:
 *   padding   mobile pl-l pr-l pt-6xl pb-5xl → tablet pl-xl pr-xl → desktop pl/pr-[--size-150]
 *   h2        mobile text-title-xl → laptop text-display-s
 *   stats     mobile flex-col → tablet flex-row justify-between
 *   statItem  mobile w-full → desktop w-[380px]
 */

import { AnimatedStat } from './AnimatedStat';

/* ──────────────────────────────────────────
   Types & Data
────────────────────────────────────────── */

interface Stat {
  target: number;
  decimals?: number;
  suffix?: string;
  label: string;
  labelCaption?: string;
  description: string;
}

const STATS: Stat[] = [
  {
    target: 99.7,
    decimals: 1,
    suffix: '%',
    label: '결제 정확도',
    description: '오차 없는 완벽한 비전 AI',
  },
  {
    target: 75,
    suffix: '%',
    label: '고객 대기시간 감소',
    labelCaption: '(VCO 도입 전후 비교)',
    description: '이탈을 막는 초고속 결제',
  },
  {
    target: 15,
    suffix: '%',
    label: '매출 증가율',
    description: '피크타임 회전율 극대화',
  },
];

/* ──────────────────────────────────────────
   Inline Style Tokens  (색상·비반응형 타이포만)
────────────────────────────────────────── */

/* 타이틀 색상 — 크기는 Tailwind className으로 반응형 처리 */
const titleColorStyle: React.CSSProperties = {
  color: 'var(--color-text-basic-inverse)',
  fontFamily: 'Pretendard',
  fontWeight: 700,
  letterSpacing: 'var(--w-display-S-letterSpacing, 0.8px)',
};

const subCopyStyle: React.CSSProperties = {
  color: 'var(--color-text-basic-inverse-secondary)',
  fontFamily: 'Pretendard',
  fontSize: 'var(--w-text-XL-size, 1.25rem)',
  fontWeight: 400,
  lineHeight: 'var(--w-text-XL-lineHeight, 1.875rem)',
  letterSpacing: 'var(--w-text-XL-letterSpacing, 0px)',
};

const titleAreaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--spacing-MS, 0.75rem)',
  alignSelf: 'stretch',
  padding: 'var(--size-4, 0.25rem) 0',
};

/* 전체폭 scrim — 비디오 위에 풀스크린 오버레이 */
const scrimStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  background: 'var(--color-bg-scrim, rgba(0, 0, 0, 0.35))',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
};

/* 컨텐츠 박스 — padding은 Tailwind className으로 반응형 처리 */
const contentBoxStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flexShrink: 0,
  position: 'relative',
  zIndex: 10,
};

/* 스탯 3종 영역 래퍼 */
const statsWrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  alignSelf: 'stretch',
  width: '100%',
};

/* 스탯 아이템 영역 컨테이너 */
const statContainerStyle: React.CSSProperties = {
  display: 'flex',
  width: '311px',
  alignItems: 'center',
  gap: 'var(--spacing-2XL, 32px)',
};

/* 커스텀 라운드 보더 래퍼 박스 */
const borderWrapperStyle: React.CSSProperties = {
  display: 'flex',
  paddingBottom: '3px',
  alignItems: 'flex-end',
  alignSelf: 'stretch',
};

/* 커스텀 라운드 보더 실제 라인 */
const borderLineStyle: React.CSSProperties = {
  borderRadius: 'var(--cornerRadius-circle, 999px)',
  background: 'var(--color-icon-basic-inverse, #FFF)',
  flexShrink: 0,
};

/* 텍스트 묶음 박스 */
const labelBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--spacing-MS, 12px)',
  flex: '1 0 0',
};

/* 스탯 숫자 */
const statTitleStyle: React.CSSProperties = {
  color: 'var(--color-text-basic-inverse, #FFF)',
  textAlign: 'center',
  fontFamily: 'var(--w-font-family, Pretendard)',
  fontStyle: 'normal',
  fontWeight: 600,
  letterSpacing: 'var(--w-title-XL-letterSpacing, 0.3px)',
};

/* 굵은 라벨 */
const statLabelStyle: React.CSSProperties = {
  alignSelf: 'stretch',
  color: 'var(--color-text-basic-inverse, #FFF)',
  fontFamily: 'var(--font-family-Pretendard, Pretendard)',
  fontStyle: 'normal',
  fontWeight: 600,
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
};

/* 보조 캡션 및 설명 */
const statCaptionStyle: React.CSSProperties = {
  alignSelf: 'stretch',
  color: 'var(--color-text-basic-inverse-secondary, #D2D3D5)',
  fontFamily: 'var(--font-family-Pretendard, Pretendard)',
  fontStyle: 'normal',
  fontWeight: 400,
  letterSpacing: 'var(--font-letterSpacing-0, 0)',
};

/* ──────────────────────────────────────────
   Component
────────────────────────────────────────── */

interface EfficiencySectionProps {
  /**
   * 스크롤 핀 지속 구간 (기본 200vh).
   * 실제 section 높이 = pinDuration + 100dvh
   */
  pinDuration?: string;
}

export function EfficiencySection({ pinDuration = '200vh' }: EfficiencySectionProps) {
  return (
    <section
      className="relative w-full"
      style={{ height: `calc(${pinDuration} + 100dvh)` }}
    >
      <div className="sticky top-0 w-full h-dvh overflow-hidden flex justify-center">

        {/* ── 배경 풀스크린 타임랩스 비디오 ── */}
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/case-study-poster.jpg"
        >
          <source src="/videos/home/home-efficiency-timelapse-3.mp4" type="video/mp4" />
        </video>

        {/* ── 전체폭 scrim (비디오 위 풀스크린) ── */}
        <div style={scrimStyle} aria-hidden />

        {/* ── 컨텐츠 박스
              padding: mobile pl-l pr-l pt-6xl pb-5xl → tablet pl-xl pr-xl → desktop pl/pr-[--size-150]
        ── */}
        <div
          className="pl-[var(--padding-XL)] pr-[var(--padding-XL)] pt-6xl pb-5xl min-[961px]:pl-[var(--padding-8XL)] min-[961px]:pr-[var(--padding-8XL)]"
          style={contentBoxStyle}
        >
          <div className="flex flex-1 flex-col items-start justify-between self-stretch w-full">

            {/* ── 타이틀 영역 ── */}
            <div style={titleAreaStyle}>
              {/* font-size: mobile text-title-xl(3rem) → laptop text-display-s(3.5rem) */}
              <h2
                className="text-title-m tablet:text-title-l laptop:text-title-xl desktop:text-display-s"
                style={titleColorStyle}
              >
                Efficiency
              </h2>
              <p style={subCopyStyle}>
                숫자로 증명된 압도적 퍼포먼스, 매장의 기준을 바꿉니다
              </p>
            </div>

            {/* ── 스탯 3종
                  mobile:  flex-col, gap-2xl
                  tablet+: flex-row, justify-between, items-end
            ── */}
            <div className="flex flex-col gap-2xl desktop-s:flex-row desktop-s:justify-between desktop-s:items-end desktop-s:gap-0 self-stretch w-full">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="w-full desktop-s:w-[311px]"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2XL, 32px)' }}
                >

                  {/* 커스텀 라운드 보더 */}
                  <div style={borderWrapperStyle} aria-hidden>
                    <div className="w-[3px] desktop:w-[5px] h-[105px] desktop:h-[118px]" style={borderLineStyle} />
                  </div>

                  {/* 텍스트 묶음 */}
                  <div style={labelBoxStyle}>
                    {/* 1단: 숫자 */}
                    <AnimatedStat
                      target={stat.target}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                      className="text-title-m tablet:text-title-l desktop:text-title-xl"
                      style={statTitleStyle}
                    />

                    {/* 2단 + 3단: 라벨·설명 묶음 (gap 0) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {/* 2단: 굵은 라벨 + 보조 캡션 */}
                      <div className="text-body tablet:text-body-l desktop:text-body-xl" style={statLabelStyle}>
                        {stat.label}
                        {stat.labelCaption && (
                          <span style={{ ...statCaptionStyle, fontSize: 'var(--font-size-14, 14px)' }}> {stat.labelCaption}</span>
                        )}
                      </div>

                      {/* 3단: 서브 설명 */}
                      <div className="text-body-ms tablet:text-body desktop:text-body-l" style={statCaptionStyle}>
                        {stat.description}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
