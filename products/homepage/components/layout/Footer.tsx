"use client";

import Image from "next/image";
import { ScrollTopButton } from "./ScrollTopButton";

/* ── SNS 데이터 ── */
const SNS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: (
      <>
        <path d="M4.6826 6H2.17969V14.0007H4.6826V6Z" fill="currentColor" />
        <path d="M13.6988 9.71111V14.0007H11.1959V10.0014C11.1959 8.94968 11.0696 8.09778 9.84456 8.09778C8.61949 8.09778 8.4951 8.95156 8.4951 10.0014V14.0007H5.99219V6.00008H8.4951V7.14411C8.87205 6.31295 9.58447 5.78711 10.9019 5.78711C11.0037 5.78711 11.1017 5.79088 11.1959 5.79653C13.4557 5.93035 13.6988 7.63037 13.6988 9.71111Z" fill="currentColor" />
        <path d="M4.86667 3.43239C4.86667 2.64081 4.22397 2 3.43239 2C2.64081 2 2 2.64081 2 3.43239C2 4.22397 2.64081 4.86478 3.43239 4.86478C4.22397 4.86478 4.86478 4.22397 4.86478 3.43239H4.86667Z" fill="currentColor" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: <path d="M7.99902 2.83398C8.04384 2.83399 12.589 2.8356 13.7295 3.14453C14.3606 3.31274 14.8572 3.81194 15.0254 4.44824C15.3307 5.59953 15.3281 8.00098 15.3281 8.00098C15.3281 8.03698 15.3254 10.4102 15.0225 11.5527C14.8543 12.1866 14.3578 12.6857 13.7266 12.8564C12.5829 13.1643 7.99609 13.165 7.99609 13.165C7.98886 13.165 3.40832 13.1641 2.26563 12.8564C1.63438 12.6883 1.13791 12.1891 0.969727 11.5527C0.666761 10.4102 0.66408 8.03698 0.664063 8.00098C0.664063 8.00098 0.663806 5.59919 0.97168 4.44531C1.13994 3.81164 1.63741 3.31232 2.26855 3.1416C3.41289 2.83386 7.99902 2.83398 7.99902 2.83398ZM6.49805 10.1816L10.332 8.00098L6.49805 5.81934V10.1816Z" fill="currentColor" />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: (
      <>
        <path d="M8.00174 5.88867C6.8606 5.88867 5.89062 6.85864 5.89062 7.99978C5.89062 9.14092 6.8606 10.1109 8.00174 10.1109C9.14288 10.1109 10.1128 9.14092 10.1128 7.99978C10.1128 6.85864 9.14288 5.88867 8.00174 5.88867Z" fill="currentColor" />
        <path d="M10.7035 1.66602H5.34891C3.27618 1.66602 1.66406 3.27814 1.66406 5.29329V10.6478C1.66406 12.7206 3.27618 14.3327 5.34891 14.3327H10.7035C12.7186 14.3327 14.3307 12.7206 14.3307 10.6478V5.29329C14.3307 3.27814 12.7186 1.66602 10.7035 1.66602ZM7.9974 11.3387C6.15497 11.3387 4.71558 9.84177 4.71558 8.05692C4.71558 6.27208 6.15497 4.71753 7.9974 4.71753C9.83982 4.71753 11.2792 6.2145 11.2792 7.99935C11.2792 9.7842 9.83982 11.3387 7.9974 11.3387ZM11.3944 5.40844C10.9913 5.40844 10.6459 5.06299 10.6459 4.65995C10.6459 4.25692 10.9913 3.91147 11.3944 3.91147C11.7974 3.91147 12.1429 4.25692 12.1429 4.65995C12.1429 5.06299 11.7974 5.40844 11.3944 5.40844Z" fill="currentColor" />
      </>
    ),
  },
];

/* ── 회사 정보 ── */
const COMPANY_NAME = "(주) 파인더스에이아이";

const ROW1_INFO = [
  { title: "대표이사", text: "함명원" },
  { title: "전화",     text: "02-6191-0049" },
  { title: "주소",     text: "0662 서울특별시 서초구 강남대로51길 1, 511타워 13층" },
];

const ROW2_INFO = [
  { title: "사업자등록번호", text: "809-86-01657" },
  { title: "이메일 문의",    text: "contact@fainders.ai" },
];

const POLICIES = [
  { label: "개인정보 처리방침",                  href: "/privacy" },
  { label: "영상정보처리기기 운영 · 관리 방침", href: "/cctv-policy" },
];

/* ── Component ── */

export default function Footer() {
  return (
    <footer className="relative w-full bg-bg-200 flex flex-col items-start px-6 py-10 gap-[40px] md:py-[56px] md:px-[150px] md:items-end">

      <ScrollTopButton />

      {/* ── contents ── */}
      <div className="flex flex-col gap-8 h-auto items-start self-stretch md:flex-row md:justify-between md:items-start">

        {/* ── logoArea ── */}
        <div className="flex flex-col items-start justify-start gap-6 md:justify-between md:self-stretch">
          <Image
            src="/logos/logoFaindersai-b.svg"
            alt="Fainders.AI"
            width={203}
            height={38}
          />

          {/* SNS 버튼 */}
          <div className="flex items-start gap-s">
            {SNS.map((sns) => (
              <a
                key={sns.label}
                href={sns.href}
                aria-label={sns.label}
                className="flex flex-col items-center justify-center rounded-full p-[var(--padding-XS)] bg-filled-optional-brand-secondaryBtn"
              >
                <span className="flex items-center justify-center w-4 h-4">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-secondary">
                    {sns.path}
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── contentsArea ── */}
        <div className="flex flex-col items-start pt-[var(--spacing-MS)] px-[var(--spacing-MS)] pb-0 gap-[var(--spacing-2XL)] md:gap-[var(--size-48)]">

          {/* ── companyInfo ── */}
          <div className="flex flex-col items-start w-[718px] max-w-full gap-[var(--size-48)]">
            <div className="flex flex-col gap-[var(--spacing-MS)]">

              <p className="text-body font-bold text-text-basic-primary leading-[150%]">
                {COMPANY_NAME}
              </p>

              <div className="flex flex-col gap-xl md:flex-row md:justify-between md:items-start md:gap-[var(--size-80)] self-stretch">

                {/* row1 */}
                <div className="flex flex-col items-start gap-s">
                  {ROW1_INFO.map((item) => (
                    <div key={item.title} className="flex items-center">
                      <div className="flex flex-col items-start gap-s w-[92px] shrink-0">
                        <span className="text-[13px] font-normal text-text-basic-primary leading-[20px]">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex flex-col items-start gap-s w-[286px]">
                        <span className="text-[13px] font-normal text-text-basic-primary leading-[20px]">
                          {item.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* row2 */}
                <div className="flex flex-col items-start gap-s w-[256px]">
                  {ROW2_INFO.map((item) => (
                    <div key={item.title} className="flex items-center">
                      <div className="flex flex-col items-start gap-s w-[92px] shrink-0">
                        <span className="text-[13px] font-normal text-text-basic-primary leading-[20px]">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex flex-col items-start gap-s w-[286px]">
                        <span className="text-[13px] font-normal text-text-basic-primary leading-[20px]">
                          {item.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* 정책 링크 */}
          <div className="flex items-center gap-m">
            {POLICIES.map((p, i) => (
              <span key={p.href} className="flex items-center gap-m">
                {i > 0 && <span className="text-border-secondary">|</span>}
                <a href={p.href} className="text-body-s font-normal text-text-basic-secondary leading-[150%]">
                  {p.label}
                </a>
              </span>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
