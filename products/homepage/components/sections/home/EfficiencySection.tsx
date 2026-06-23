/**
 * EfficiencySection — Efficiency 섹션
 * 풀스크린 비디오 배경 + scrim 통합 컨텐츠 박스 + 3단 스탯
 *
 * 반응형:
 *   padding   mobile pl-l pr-l pt-6xl pb-5xl → tablet pl-xl pr-xl → desktop pl/pr-[--size-150]
 *   h2        mobile text-title-xl → laptop text-display-s
 *   stats     mobile flex-col → tablet flex-row justify-between
 *   statItem  mobile w-full → desktop w-[311px]
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
   Inline styles — Tailwind로 표현 불가한 것만
────────────────────────────────────────── */

/** 전체폭 scrim: background CSS 변수 + backdrop-filter vendor prefix */
const scrimStyle: React.CSSProperties = {
  background: 'var(--color-bg-scrim, rgba(0, 0, 0, 0.35))',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
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
        <div className="absolute inset-0 z-[1]" style={scrimStyle} aria-hidden />

        {/* ── 컨텐츠 박스
              padding: mobile px-[--padding-XL] pt-6xl pb-5xl → 961+ px-[--padding-8XL]
        ── */}
        <div className="flex w-full h-full flex-col items-start shrink-0 relative z-10 pl-[var(--padding-XL)] pr-[var(--padding-XL)] pt-6xl pb-5xl min-[961px]:pl-[var(--padding-8XL)] min-[961px]:pr-[var(--padding-8XL)]">
          <div className="flex flex-1 flex-col items-start justify-between self-stretch w-full">

            {/* ── 타이틀 영역 ── */}
            <div className="flex flex-col items-start gap-ms self-stretch py-2xs">
              {/* font-size: mobile text-title-m → laptop text-title-xl → desktop text-display-s */}
              <h2
                className="text-title-m tablet:text-title-l laptop:text-title-xl desktop:text-display-s font-bold font-base text-text-basic-inverse"
                style={{ letterSpacing: 'var(--w-display-S-letterSpacing, 0.8px)' }}
              >
                Efficiency
              </h2>
              <p className="text-body-xl font-normal font-base text-text-basic-inverse-secondary">
                숫자로 증명된 압도적 퍼포먼스, 매장의 기준을 바꿉니다
              </p>
            </div>

            {/* ── 스탯 3종
                  mobile:  flex-col, gap-2xl
                  961+:    flex-row, justify-between, items-end
            ── */}
            <div className="flex flex-col gap-2xl desktop-s:flex-row desktop-s:justify-between desktop-s:items-end desktop-s:gap-0 self-stretch w-full">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="w-full desktop-s:w-[311px] flex items-center gap-2xl"
                >

                  {/* 커스텀 라운드 보더 */}
                  <div className="flex pb-[3px] items-end self-stretch" aria-hidden>
                    <div className="w-[3px] desktop:w-[5px] h-[105px] desktop:h-[118px] rounded-fai-circle bg-icon-basic-inverse shrink-0" />
                  </div>

                  {/* 텍스트 묶음 */}
                  <div className="flex flex-col items-start gap-ms grow shrink-0 basis-0">

                    {/* 1단: 숫자 */}
                    <AnimatedStat
                      target={stat.target}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                      className="text-title-m tablet:text-title-l desktop:text-title-xl font-base font-semibold text-text-basic-inverse"
                      style={{ letterSpacing: 'var(--w-title-XL-letterSpacing, 0.3px)' }}
                    />

                    {/* 2단 + 3단: 라벨·설명 */}
                    <div className="flex flex-col">
                      {/* 2단: 굵은 라벨 + 보조 캡션 */}
                      <div className="text-body tablet:text-body-l desktop:text-body-xl self-stretch font-base font-semibold text-text-basic-inverse tracking-normal">
                        {stat.label}
                        {stat.labelCaption && (
                          <span className="font-base font-normal text-text-basic-inverse-secondary tracking-normal text-[length:var(--font-size-14,14px)]">
                            {' '}{stat.labelCaption}
                          </span>
                        )}
                      </div>

                      {/* 3단: 서브 설명 */}
                      <div className="text-body-ms tablet:text-body desktop:text-body-l self-stretch font-base font-normal text-text-basic-inverse-secondary tracking-normal">
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
