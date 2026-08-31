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

// 정책 문서 경로는 **소비자가 주입한다**(privacyHref / cookieHref) — @fai/ui는 로케일을 모른다.
//
// 하드코딩 폴백을 두지 않는 이유(HOM-101): 과거 `privacy: '/document/privacy-policy.pdf'` 상수가
// 있었고, 이는 **구버전 한국어 PDF**였다. en·ja에서 개정 안내 모달을 끄자 이 폴백으로 떨어져
// 일본·영어 사용자에게 한국어 문서가 열렸다 (2026-08-28 Hyeyoung Shin 지적).
// 폴백은 "조용히 틀린 문서"를 만든다 — 미주입이면 아예 링크를 렌더하지 않는 편이 안전하다.
//
// cctv(영상정보처리기기 운영·관리 방침)도 같은 이유로 상수를 제거했다 — HOM-61에서 푸터에서
// 제거됐는데 폴백이 남아 있으면 되살아난다(2026-07-28 김성태).

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
  /** '맞춤형 광고 설정' 라벨. HOM-61에서 제거된 cctv 슬롯을 재활용한 것이 아니라 별개 항목이다. */
  adSettings?:   string;
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
  adSettings:   '맞춤형 광고 설정',
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
          className={`text-body-s min-[1440px]:text-body font-normal text-text-basic-primary leading-[20px] ${item.noWrapValue ? 'whitespace-nowrap' : ''}`}
        >
          {item.text}
        </span>,
      ])}
    </div>
  );
}

/** compact 레이아웃의 정보 그리드. 본사와 추가 법인이 공유한다(HOM-101). */
function CompactInfoGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-y-ms gap-x-2xl w-full">
      {items.flatMap((item, i) => [
        <span key={`${i}-t`} className="text-body-s font-normal text-text-basic-primary leading-[20px] whitespace-nowrap">
          {item.title}
        </span>,
        <span key={`${i}-v`} className="text-body-s font-normal text-text-basic-primary leading-[20px]">
          {item.text}
        </span>,
      ])}
    </div>
  );
}

/**
 * 법인명 헤더 클래스. 본사와 추가 법인(extraEntity)이 **같은 상수를 공유**해야 한다 —
 * JP-BD 요청("한국 법인과 동일하게 볼드처리")을 문자열 복사로 맞추면 한쪽만 바뀌어 어긋난다.
 * desktop은 1440px 이상에서 한 단계 크고, compact는 고정이라 둘을 분리한다.
 */
const ENTITY_NAME_CLS_DESKTOP =
  'text-body min-[1440px]:text-body-l font-bold text-text-basic-primary leading-[150%]';
const ENTITY_NAME_CLS_COMPACT = 'text-body font-bold text-text-basic-primary leading-[150%]';

/* ── Component ── */

/** 추가 정보 행(로케일 전용). 소비자가 무엇을 덧붙일지 결정한다 — @fai/ui는 로케일을 모른다. */
export interface FooterInfoRow {
  title: string;
  text: string;
  noWrapValue?: boolean;
}

/**
 * 별도 법인 블록(HOM-101). 본사 블록과 **동일한 구조**로 렌더된다 — 볼드 법인명 헤더 + 하위 정보 행.
 *
 * 왜 `extraInfo`(평평한 행)로 부족한가: 일본 법인을 `日本法人 | 株式会社…` 처럼 라벨-값 한 행으로
 * 넣으면 본사 정보와 위계가 달라 보인다. JP-BD 요청이 정확히 그 지점이었다 —
 * "법인명(日本法人도 삭제)을 한국 법인과 동일하게 볼드처리하고 같은 위치에 정렬"
 * (2026-08-28 Hyeyoung Shin). 그래서 '법인'을 1급 개념으로 올렸다.
 */
export interface FooterEntity {
  /** 볼드 헤더로 렌더될 법인명. 라벨을 붙이지 않는다. */
  name: string;
  rows: readonly FooterInfoRow[];
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
   * 본사와 별개인 법인 블록(HOM-101). ja의 일본 법인에 쓰인다.
   * 본사 블록과 같은 구조(볼드 법인명 + 정보 행)로 렌더되어 위계가 맞는다.
   */
  extraEntity?: FooterEntity;
  /**
   * 개인정보 처리방침 문서 경로(로케일별). `privacyModalContent`가 없을 때 이 링크로 이동한다.
   * **미지정 시 링크 자체를 렌더하지 않는다** — 틀린 문서로 보내느니 없는 편이 낫다(HOM-101).
   */
  privacyHref?: string;
  /**
   * 개인정보 처리방침 클릭 시 표시할 모달 콘텐츠 팩토리(로케일별).
   * 소비자(FooterBridge)가 `(onClose) => ReactNode` 형태로 주입한다.
   * onClose는 Footer의 setModalOpen(false)를 래핑하므로, 내부 확인 버튼에 연결하면 된다.
   * 미지정 시 기존 PDF 링크(POLICY_HREFS.privacy)로 폴백.
   */
  privacyModalContent?: (onClose: () => void) => React.ReactNode;
  /**
   * '맞춤형 광고 설정' 클릭 시 이동할 URL(로케일별).
   * 소비자(FooterBridge)가 locale별 개인정보 처리방침 2조 5항 페이지를 주입한다.
   * **미지정 시 해당 행을 렌더하지 않는다** — 폴백 링크를 두면 갈 곳 없는 항목이 노출된다.
   */
  cookieHref?: string;
  /**
   * EN·JA처럼 콘텐츠 영역이 넓은 로케일에서 로고↔콘텐츠 최소 여백 80px 보장 +
   * 여백을 유지할 수 없는 시점(≤1100px)부터 compact 레이아웃으로 전환.
   */
  wideCompact?: boolean;
}

export default function Footer({
  onSocialClick,
  labels,
  showEmail = true,
  showBizNo = true,
  extraInfo = [],
  extraEntity,
  privacyHref,
  privacyModalContent,
  cookieHref,
  wideCompact = false,
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
    // 전화번호도 코드성 문자열이라 중간 줄바꿈 금지(HOM-94). logoArea에 shrink-0를 넣어
    // 축소 압력이 콘텐츠로 오게 되자 ja에서 `+82-2-6191-` / `0049` 로 끊겼다.
    { title: l.tel,     text: l.telValue, noWrapValue: true },
    { title: l.address, text: l.addressValue },
  ];
  // 사업자번호·이메일은 값 자체가 코드성 문자열이라, 라벨이 길어져도(예: ja "事業者登録番号（韓国）")
  // 고정폭 컬럼 안에서 중간에 줄바꿈되면 안 된다 — noWrapValue로 값 칸만 nowrap 고정.
  const row2Info = [
    ...(showBizNo ? [{ title: l.bizNo, text: VALUES.bizNo, noWrapValue: true }] : []),
    ...(showEmail ? [{ title: l.email, text: l.emailValue, noWrapValue: true }] : []),
    ...extraInfo,
  ];
  // 개정 안내 모달이 주입된 로케일(ko)은 모달, 그 외(en·ja)는 로케일 문서로 직행한다(HOM-101).
  // 둘 다 없으면 링크를 만들지 않는다 — 폴백으로 한국어 문서를 열던 회귀를 구조적으로 막는다.
  const privacyPolicy: PolicyItem | null = privacyModalContent
    ? { label: l.privacy, onClick: () => setModalOpen(true) }
    : privacyHref
      ? { label: l.privacy, href: privacyHref }
      : null;
  const policies: PolicyItem[] = [
    ...(privacyPolicy ? [privacyPolicy] : []),
    ...(cookieHref ? [{ label: l.adSettings, href: cookieHref }] : []),
  ];

  return (
    <footer className={`relative w-full bg-bg-200 ${wideCompact ? 'fai-footer--wide' : ''}`}>

      {/* 스크롤 버튼 — 절대 위치, desktop compact 미만에서 숨김(footer.css) */}
      <div className="fai-footer__scroll-top absolute bottom-4xl right-4xl z-10">
        <ScrollTopButton />
      </div>

      <div className="w-full">

        {/* =====================================================
            1. 데스크톱 섹션 (> 1280px KO / > 1100px EN·JA)
            ===================================================== */}
        <div className="fai-footer__desktop flex w-full flex-row justify-between items-start py-4xl">

          {/* logoArea */}
          <div className="fai-footer__logo-area flex flex-col items-start justify-between self-stretch gap-xl shrink-0" style={{ paddingRight: 'var(--spacing-5XL, 80px)' }}>
            <Image src="/logos/logoFaindersai-b.svg" alt="Fainders.AI" width={203} height={38} />
            <SnsButtons onSocialClick={onSocialClick} />
          </div>

          {/* contentsArea — gap·min-w-0 (footer.css) */}
          <div className="fai-footer__contents flex flex-col items-start pt-ms min-w-0">
            <div className="fai-footer__contents-inner flex flex-col items-start">
              <div className="flex flex-col gap-xl">
                <div className="flex flex-col gap-ms">
                  <p className={ENTITY_NAME_CLS_DESKTOP}>{companyName}</p>
                  <div className="flex flex-row justify-between items-start gap-5xl min-[1440px]:gap-7xl self-stretch">
                    <InfoRow items={row1Info} className="min-w-0 shrink" />
                    <InfoRow items={row2Info} className="w-max shrink-0" />
                  </div>
                </div>

                {/* 추가 법인(HOM-101) — 본사와 동일한 구조·클래스로 위계를 맞춘다 */}
                {extraEntity && (
                  <div className="flex flex-col gap-ms">
                    <p className={ENTITY_NAME_CLS_DESKTOP}>{extraEntity.name}</p>
                    <InfoRow items={[...extraEntity.rows]} className="min-w-0 shrink" />
                  </div>
                )}
                {/* 정책 링크 — contentsArea 내부 (fai-footer__desktop 섹션이 ≤960px에서 숨겨짐) */}
                <PolicyLinks policies={policies} />
              </div>
            </div>
          </div>

        </div>


        {/* =====================================================
            2. Compact 섹션 (≤ 1280px KO / ≤ 1100px EN·JA)
            ===================================================== */}
        <div className="fai-footer__compact">

          {/* logoArea */}
          <div className="fai-footer__compact-top flex justify-between items-center self-stretch w-full">
            <div className="fai-footer__logo shrink-0">
              <Image src="/logos/logoFaindersai-b.svg" alt="Fainders.AI" width={203} height={38} />
            </div>
            <div className="fai-footer__socials">
              <SnsButtons onSocialClick={onSocialClick} />
            </div>
          </div>

          {/* contentsArea */}
          <div className="flex flex-col items-start self-stretch w-full pt-ml gap-3xl">

            {/* companyInfo */}
            <div className="fai-footer__info flex flex-col items-start gap-ms">
              <p className={ENTITY_NAME_CLS_COMPACT}>{companyName}</p>
              <CompactInfoGrid items={[...row1Info, ...row2Info]} />
            </div>

            {/* 추가 법인(HOM-101) — 본사와 동일한 구조 */}
            {extraEntity && (
              <div className="fai-footer__info flex flex-col items-start gap-ms">
                <p className={ENTITY_NAME_CLS_COMPACT}>{extraEntity.name}</p>
                <CompactInfoGrid items={[...extraEntity.rows]} />
              </div>
            )}

            {/* policies */}
            <div className="fai-footer__policies flex justify-end items-center gap-ms">
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
