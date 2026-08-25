'use client';

/**
 * Footer
 *
 * 반응형 전략: CSS 클래스 토글 (footer.css)
 *   > 960px → .fai-footer__desktop + .fai-footer__desktop-policies
 *   ≤ 960px → .fai-footer__compact
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ScrollTopButton } from '../ScrollTopButton';
import './footer.css';

/* ── SNS 데이터 ── */
const SNS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/faindersai',
    path: (
      <>
        <path d="M4.6826 6H2.17969V14.0007H4.6826V6Z" fill="currentColor" />
        <path d="M13.6988 9.71111V14.0007H11.1959V10.0014C11.1959 8.94968 11.0696 8.09778 9.84456 8.09778C8.61949 8.09778 8.4951 8.95156 8.4951 10.0014V14.0007H5.99219V6.00008H8.4951V7.14411C8.87205 6.31295 9.58447 5.78711 10.9019 5.78711C11.0037 5.78711 11.1017 5.79088 11.1959 5.79653C13.4557 5.93035 13.6988 7.63037 13.6988 9.71111Z" fill="currentColor" />
        <path d="M4.86667 3.43239C4.86667 2.64081 4.22397 2 3.43239 2C2.64081 2 2 2.64081 2 3.43239C2 4.22397 2.64081 4.86478 3.43239 4.86478C4.22397 4.86478 4.86478 4.22397 4.86478 3.43239H4.86667Z" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@faindersai',
    path: <path d="M7.99902 2.83398C8.04384 2.83399 12.589 2.8356 13.7295 3.14453C14.3606 3.31274 14.8572 3.81194 15.0254 4.44824C15.3307 5.59953 15.3281 8.00098 15.3281 8.00098C15.3281 8.03698 15.3254 10.4102 15.0225 11.5527C14.8543 12.1866 14.3578 12.6857 13.7266 12.8564C12.5829 13.1643 7.99609 13.165 7.99609 13.165C7.98886 13.165 3.40832 13.1641 2.26563 12.8564C1.63438 12.6883 1.13791 12.1891 0.969727 11.5527C0.666761 10.4102 0.66408 8.03698 0.664063 8.00098C0.664063 8.00098 0.663806 5.59919 0.97168 4.44531C1.13994 3.81164 1.63741 3.31232 2.26855 3.1416C3.41289 2.83386 7.99902 2.83398 7.99902 2.83398ZM6.49805 10.1816L10.332 8.00098L6.49805 5.81934V10.1816Z" fill="currentColor" />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/fainders_ai',
    path: (
      <>
        <path d="M8.00174 5.88867C6.8606 5.88867 5.89062 6.85864 5.89062 7.99978C5.89062 9.14092 6.8606 10.1109 8.00174 10.1109C9.14288 10.1109 10.1128 9.14092 10.1128 7.99978C10.1128 6.85864 9.14288 5.88867 8.00174 5.88867Z" fill="currentColor" />
        <path d="M10.7035 1.66602H5.34891C3.27618 1.66602 1.66406 3.27814 1.66406 5.29329V10.6478C1.66406 12.7206 3.27618 14.3327 5.34891 14.3327H10.7035C12.7186 14.3327 14.3307 12.7206 14.3307 10.6478V5.29329C14.3307 3.27814 12.7186 1.66602 10.7035 1.66602ZM7.9974 11.3387C6.15497 11.3387 4.71558 9.84177 4.71558 8.05692C4.71558 6.27208 6.15497 4.71753 7.9974 4.71753C9.83982 4.71753 11.2792 6.2145 11.2792 7.99935C11.2792 9.7842 9.83982 11.3387 7.9974 11.3387ZM11.3944 5.40844C10.9913 5.40844 10.6459 5.06299 10.6459 4.65995C10.6459 4.25692 10.9913 3.91147 11.3944 3.91147C11.7974 3.91147 12.1429 4.25692 12.1429 4.65995C12.1429 5.06299 11.7974 5.40844 11.3944 5.40844Z" fill="currentColor" />
      </>
    ),
  },
];

/* ── 실데이터 값(번역 대상 아님, address 제외) ── */
const VALUES = {
  ceo:     '함명원ㆍ왕민권',
  tel:     '02-6191-0049',
  address: '06628 서울특별시 서초구 강남대로51길 1, 511타워 13층',
  bizNo:   '809-86-01657',
  email:   'contact@fainders.ai',
};

// 정책 문서(PDF) — 저장소에 자체 호스팅(public/document/). 상대경로라 환경 독립(프리뷰·PRD 모두 동작).
// 기존 /privacy·/cctv-policy 는 존재하지 않는 경로라 404였음.
const POLICY_HREFS = {
  privacy: '/document/privacy-policy.pdf',
  cctv:    '/document/cctv-policy.pdf',
};

/**
 * Footer 라벨 세트 — i18n 비결합(@fai/ui는 next-intl을 import하지 않음).
 * 소비자(homepage FooterBridge)가 번역 문자열을 주입하며, 미지정 시 아래 한국어 기본값을 사용한다.
 */
export interface FooterLabels {
  company?:      string;
  ceo?:          string;
  tel?:          string;
  address?:      string;
  /** 주소 실데이터 값(로케일별). 미지정 시 한국어 기본 주소 사용. */
  addressValue?: string;
  bizNo?:        string;
  email?:        string;
  privacy?:      string;
  cctv?:         string;
  /** 대표이사 값(로케일별, 인명이라 로케일에 따라 표기가 달라짐). 미지정 시 한국어 기본값 사용. */
  ceoValue?:     string;
  /**
   * 전화 실데이터 값(로케일별). ko는 국내 표기(02-…), en·ja는 국가코드 포함(+82-2-…)이다(HOM-67).
   * 미지정 시 한국어 기본값 사용.
   */
  telValue?:     string;
  /** 이메일 실데이터 값(로케일별). ja는 일본팀 주소(contact_jp@)를 쓴다(HOM-67). */
  emailValue?:   string;
}

const DEFAULT_LABELS: Required<FooterLabels> = {
  company:      '(주) 파인더스에이아이',
  ceo:          '대표이사',
  tel:          '전화',
  address:      '주소',
  addressValue: VALUES.address,
  bizNo:        '사업자등록번호',
  email:        '이메일 문의',
  privacy:      '개인정보 처리방침',
  cctv:         '맞춤형 광고 설정',
  ceoValue:     VALUES.ceo,
  telValue:     VALUES.tel,
  emailValue:   VALUES.email,
};

/* ── SNS 버튼 공용 ── */
function SnsButtons({ onSocialClick }: { onSocialClick?: (label: string) => void }) {
  return (
    <div className="flex items-start gap-s">
      {SNS.map((sns) => (
        <a
          key={sns.label}
          href={sns.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={sns.label}
          onClick={() => onSocialClick?.(sns.label)}
          className="flex flex-col items-center justify-center rounded-full p-[var(--padding-XS)] bg-filled-optional-brand-secondaryBtn"
        >
          <span className="flex items-center justify-center w-4 h-4 min-[1600px]:w-5 min-[1600px]:h-5">
            <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" aria-hidden className="text-secondary">
              {sns.path}
            </svg>
          </span>
        </a>
      ))}
    </div>
  );
}

type PolicyItem = { label: string; href?: string; onClick?: () => void };

/* ── 정책 링크 공용 ── */
function PolicyLinks({ policies, className }: { policies: PolicyItem[]; className?: string }) {
  const linkCls = 'text-body-s min-[1440px]:text-body font-normal text-text-basic-secondary leading-[150%]';
  return (
    <div className={`flex items-center gap-m ${className ?? ''}`}>
      {policies.map((p, i) => (
        <span key={p.label} className="flex items-center gap-m">
          {i > 0 && <span className="text-border-secondary">|</span>}
          {p.onClick ? (
            <button type="button" onClick={p.onClick} className={`${linkCls} cursor-pointer`}>
              {p.label}
            </button>
          ) : (
            <a href={p.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {p.label}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}

/* ── 회사 정보 행 공용 (desktop row1·row2 동일 구조) ── */
// grid-cols-[max-content_1fr]: 타이틀 컬럼이 해당 그룹 내 가장 긴 라벨에 맞게 자동 조정.
// 값(value) 컬럼의 whitespace-nowrap은 noWrapValue=true인 항목(사업자번호·이메일·전화 등
// 코드성 문자열)에만 적용한다. 주소처럼 길어질 수 있는 값은 줄바꿈을 허용해야
// KO·EN·JA 모든 언어에서 패딩 영역 밖으로 텍스트가 넘치지 않는다.
function InfoRow({ items, className }: { items: { title: string; text: string; noWrapValue?: boolean }[]; className?: string }) {
  return (
    <div className={`grid grid-cols-[max-content_1fr] gap-y-s gap-x-2xl ${className ?? ''}`}>
      {items.flatMap((item, i) => [
        <span key={`${i}-t`} className="text-body-s min-[1440px]:text-body font-normal text-text-basic-primary leading-[20px] whitespace-nowrap">
          {item.title}
        </span>,
        <span
          key={`${i}-v`}
          className={`text-body-s min-[1440px]:text-body font-normal text-text-basic-primary leading-[20px]${item.noWrapValue ? ' whitespace-nowrap' : ''}`}
        >
          {item.text}
        </span>,
      ])}
    </div>
  );
}

/* ── Component ── */

/** 추가 정보 행(로케일 전용). 소비자가 무엇을 덧붙일지 결정한다 — @fai/ui는 로케일을 모른다. */
export interface FooterInfoRow {
  title: string;
  text: string;
  noWrapValue?: boolean;
}

interface FooterProps {
  onSocialClick?: (label: string) => void;
  /** 회사정보·정책 라벨 오버라이드(번역 주입용). 미지정 값은 한국어 기본값 사용. */
  labels?: FooterLabels;
  /** 이메일 문의 행 노출 여부(HOM-67). 미지정 시 노출. */
  showEmail?: boolean;
  /** 사업자등록번호 행 노출 여부(HOM-67). 한국 사업자번호라 ja에서는 숨긴다. 미지정 시 노출. */
  showBizNo?: boolean;
  /**
   * 회사정보 뒤에 덧붙일 추가 행(HOM-67). ja의 일본 법인 정보(법인명·대표·전화)에 쓰인다.
   * 로케일 판단은 소비자(FooterBridge)가 하고 여기서는 받은 행을 그대로 렌더한다.
   */
  extraInfo?: readonly FooterInfoRow[];
  /**
   * 개인정보 처리방침 클릭 시 표시할 모달 콘텐츠 팩토리(로케일별).
   * 소비자(FooterBridge)가 `(onClose) => ReactNode` 형태로 주입한다.
   * onClose는 Footer의 setModalOpen(false)를 래핑하므로, 내부 확인 버튼에 연결하면 된다.
   * 미지정 시 기존 PDF 링크(POLICY_HREFS.privacy)로 폴백.
   */
  privacyModalContent?: (onClose: () => void) => React.ReactNode;
  /**
   * '쿠키 및 광고 설정' 클릭 시 이동할 URL(로케일별).
   * 소비자(FooterBridge)가 locale별 개인정보 처리방침 PDF + 페이지 앵커를 주입한다.
   * 미지정 시 POLICY_HREFS.cctv로 폴백.
   */
  cookieHref?: string;
}

export default function Footer({
  onSocialClick,
  labels,
  showEmail = true,
  showBizNo = true,
  extraInfo = [],
  privacyModalContent,
  cookieHref,
}: FooterProps = {}) {
  const [modalOpen, setModalOpen] = useState(false);

  // 모달 열릴 때 body 스크롤 잠금 (position:fixed 방식 — Safari 포함 전 브라우저 호환)
  useEffect(() => {
    if (!modalOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [modalOpen]);

  const l = { ...DEFAULT_LABELS, ...labels };

  const companyName = l.company;
  const row1Info = [
    { title: l.ceo,     text: l.ceoValue },
    { title: l.tel,     text: l.telValue },
    { title: l.address, text: l.addressValue },
  ];
  // 사업자번호·이메일은 값 자체가 코드성 문자열이라, 라벨이 길어져도(예: ja "事業者登録番号（韓国）")
  // 고정폭 컬럼 안에서 중간에 줄바꿈되면 안 된다 — noWrapValue로 값 칸만 nowrap 고정.
  const row2Info = [
    ...(showBizNo ? [{ title: l.bizNo, text: VALUES.bizNo, noWrapValue: true }] : []),
    ...(showEmail ? [{ title: l.email, text: l.emailValue, noWrapValue: true }] : []),
    ...extraInfo,
  ];
  const policies: PolicyItem[] = [
    privacyModalContent
      ? { label: l.privacy, onClick: () => setModalOpen(true) }
      : { label: l.privacy, href: POLICY_HREFS.privacy },
    { label: l.cctv, href: cookieHref ?? POLICY_HREFS.cctv },
  ];

  return (
    <footer className="relative w-full bg-bg-200">

      {/* 스크롤 버튼 — 절대 위치, > 960px 에서만 표시 */}
      <div className="fai-footer__scroll-top absolute bottom-[var(--size-56)] right-[var(--size-56)] z-10">
        <ScrollTopButton />
      </div>

      <div className="w-full">

        {/* =====================================================
            1. 데스크톱 섹션 (> 960px)
            ===================================================== */}
        <div className="fai-footer__desktop flex w-full flex-row items-start justify-between py-4xl">

          {/* logoArea */}
          <div className="flex flex-col items-start justify-between self-stretch gap-6">
            <Image src="/logos/logoFaindersai-b.svg" alt="Fainders.AI" width={203} height={38} />
            <SnsButtons onSocialClick={onSocialClick} />
          </div>

          {/* contentsArea — min-w-0: flex child가 컨테이너 밖으로 넘치지 않도록 허용 */}
          <div className="flex flex-col items-start pt-[var(--spacing-MS)] gap-[var(--size-48)] min-w-0">
            <div className="flex flex-col items-start gap-[var(--size-48)]">
              <div className="flex flex-col gap-[var(--spacing-XL,24px)]">
                <div className="flex flex-col gap-[var(--spacing-MS)]">
                  <p className="text-body min-[1440px]:text-body-l font-bold text-text-basic-primary leading-[150%]">
                    {companyName}
                  </p>
                  <div className="flex flex-row justify-between items-start gap-5xl min-[1440px]:gap-7xl self-stretch">
                    <InfoRow items={row1Info} className="min-w-0 shrink" />
                    <InfoRow items={row2Info} className="w-max shrink-0" />
                  </div>
                </div>
                {/* 정책 링크 — contentsArea 내부 (fai-footer__desktop 섹션이 ≤960px에서 숨겨짐) */}
                <PolicyLinks policies={policies} />
              </div>
            </div>
          </div>

        </div>


        {/* =====================================================
            2. Compact 섹션 (≤ 960px)
            ===================================================== */}
        <div className="fai-footer__compact">

          {/* logoArea */}
          <div className="fai-footer__compact-top flex justify-between items-center self-stretch w-full">
            <div className="fai-footer__logo">
              <Image src="/logos/logoFaindersai-b.svg" alt="Fainders.AI" width={203} height={38} />
            </div>
            <div className="fai-footer__socials">
              <SnsButtons onSocialClick={onSocialClick} />
            </div>
          </div>

          {/* contentsArea */}
          <div className="flex flex-col items-start self-stretch w-full pt-[var(--padding-ml,18px)] gap-[var(--spacing-3XL,40px)]">

            {/* companyInfo */}
            <div className="fai-footer__info flex flex-col items-start gap-[var(--spacing-MS,12px)]">
              <p className="text-body font-bold text-text-basic-primary leading-[150%]">
                {companyName}
              </p>
              <div className="grid grid-cols-[max-content_1fr] gap-y-[var(--spacing-MS,12px)] gap-x-2xl w-full">
                {[...row1Info, ...row2Info].flatMap((item, i) => [
                  <span key={`${i}-t`} className="text-body-s font-normal text-text-basic-primary leading-[20px] whitespace-nowrap">
                    {item.title}
                  </span>,
                  <span key={`${i}-v`} className="text-body-s font-normal text-text-basic-primary leading-[20px]">
                    {item.text}
                  </span>,
                ])}
              </div>
            </div>

            {/* policies */}
            <div className="fai-footer__policies flex justify-end items-center gap-[var(--spacing-MS,12px)]">
              {policies.map((p, i) => {
                const cls = 'text-body-s font-normal text-text-basic-secondary leading-[150%]';
                return (
                  <span key={p.label} className="flex items-center gap-m">
                    {i > 0 && <span className="text-border-secondary">|</span>}
                    {p.onClick ? (
                      <button type="button" onClick={p.onClick} className={`${cls} cursor-pointer`}>{p.label}</button>
                    ) : (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>{p.label}</a>
                    )}
                  </span>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* ── 개인정보 처리방침 개정 안내 모달 ──
          스크림: Tailwind 클래스 미의존 — overflow:hidden으로 스크롤 컨테이너가 되지 않게 해야
          InfoItem의 wheel 이벤트가 가로채이지 않고 InfoItem 자체가 스크롤됨.
          딤 클릭 닫힘 없음(onClick 미부여).
      */}
      {modalOpen && privacyModalContent && (
        <div
          style={{
            position: 'fixed',
            top: 0, right: 0, bottom: 0, left: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'var(--color-bg-scrim, rgba(0, 0, 0, 0.52))',
          }}
        >
          {privacyModalContent(() => setModalOpen(false))}
        </div>
      )}

    </footer>
  );
}
