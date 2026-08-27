"use client";

import { Footer, PrivacyRevisionModal } from "@fai/ui";
import type { FooterLabels } from "@fai/ui";
import { useTranslations, useLocale } from "next-intl";
import { trackEvent } from "@/lib/analytics/track";
import { localePolicy } from "@/config/locale-policy";

/**
 * @fai/ui Footer는 analytics·i18n-agnostic — GA 계측과 번역 문자열 주입을 이 브릿지에서만 연결한다.
 * 서버 컴포넌트(layout.tsx)는 함수 prop을 클라이언트 컴포넌트로 넘길 수 없으므로,
 * 이 클라이언트 브릿지가 콜백과 번역을 소유한다.
 *
 * 로케일별 노출 규칙(HOM-67)도 여기서 해석한다 — Footer는 로케일을 모른 채
 * 받은 행을 그대로 렌더하고, "무엇을 보일지"는 config/locale-policy.ts가 단독으로 정한다.
 */
export default function FooterBridge() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const { footer: footerPolicy } = localePolicy(locale);

  const labels: FooterLabels = {
    company:      t("company"),
    ceo:          t("labels.ceo"),
    tel:          t("labels.tel"),
    address:      t("labels.address"),
    addressValue: t("addressValue"),
    bizNo:        t("labels.bizNo"),
    email:        t("labels.email"),
    privacy:      t("policies.privacy"),
    adSettings:   t("policies.adSettings"),
    ceoValue:     t("ceoValue"),
    telValue:     t("telValue"),
    emailValue:   t("emailValue"),
  };

  // 개인정보 처리방침 개정 안내 모달 콘텐츠 — 로케일별 분기.
  // body를 ReactNode(JSX)로 전달 — whitespace-pre-wrap으로 줄바꿈 보존, 링크만 <a>로 교체.
  const pdfLinkCls = 'underline cursor-pointer';

  const KO_PRIVACY_BODY = (
    <p className="whitespace-pre-wrap">{`안녕하세요, ㈜파인더스에이아이입니다.

당사는 홈페이지(fainders.ai) 이용과 관련한 개인정보 처리 기준을
보다 명확히 안내하기 위해 개인정보 처리방침을 개정합니다.

■ 시행일자 : 2026년 8월 28일

■ 주요 개정 내용

1. 적용 범위 명확화
   기존 방침에 포함되어 있던 무인매장 서비스 관련 조항을 정비하고,
   홈페이지 이용에 적용되는 사항으로 범위를 명확히 하였습니다.

2. 개인정보 국외 이전에 관한 사항 신설 (제5조)
   웹로그 분석 및 광고 성과 측정을 위해 이용 중인 서비스와 관련하여,
   국외로 이전되는 정보의 항목·목적·보유기간 및 거부 방법을 안내드립니다.

3. 쿠키 및 행태정보에 관한 사항 구체화 (제2조)
   수집하는 행태정보의 항목과 보유기간, 맞춤형 광고 수신 거부 방법을
   구체적으로 안내드립니다.

4. 수집 항목 및 보유기간 현행화 (제1조, 제3조)
   도입 문의·상담 및 뉴스레터 신청 시 수집하는 항목과 보유기간을
   실제 처리 현황에 맞게 정비하였습니다.

5. 가명정보 및 자동화된 결정에 관한 사항 신설 (제8조)

개정된 처리방침은 2026년 8월 28일부터 적용되며,
시행일 이전까지는 기존 처리방침이 적용됩니다.

개정 전문은 아래에서 확인하실 수 있습니다.
`}<a href="/contact-us/FaindersAI_개인정보처리방침_2026-1.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ 개인정보 처리방침 (2026. 8. 28. 시행)</a>{`
`}<a href="/contact-us/FaindersAI_개인정보처리방침_2023.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ 개인정보 처리방침 (2023. 6. 19. 시행)</a>{`

문의 : ㈜파인더스에이아이 정보보호담당 02-6191-0049 / contact@fainders.ai

2026년 8월 21일
㈜파인더스에이아이`}</p>
  );

  // 개정 안내 모달은 언어 전환과 무관하게 **항상 한국어**로만 노출한다.
  // 근거: 2026-08-25 김진영(개인정보 담당) — "개정 안내는 한국어로만 진행해주시면 됩니다".
  // 개정 고지는 한국 개인정보보호법상 의무이고 en/ja는 법적 의무 대상이 아니다.
  // 번역본을 두면 법무 미검토 문구가 노출되고 시행일 정정 지점이 3곳으로 늘어난다.
  // (처리방침 PDF 자체는 ko/en/ja 3종 유지 — 고지문만 한국어다.)
  //
  // 날짜는 공식 PDF와 반드시 일치시켜라: 공고일 2026-08-21 / 시행일 2026-08-28.
  // 개정 시 최소 7일 전 사전고지 요건 때문에 두 날짜 간격이 7일이다(2026-08-21 협의).
  // FooterBridge.test.tsx가 이 날짜들을 고정한다.
  const modalConfig = {
    title: '개인정보 처리방침 개정 안내 (2026년 8월 28일 시행)',
    body: KO_PRIVACY_BODY,
    confirmLabel: '확인',
  } as const;

  const privacyModalContent = modalConfig
    ? (onClose: () => void) => (
        <PrivacyRevisionModal
          title={modalConfig.title}
          body={modalConfig.body}
          confirmLabel={modalConfig.confirmLabel}
          onConfirm={onClose}
        />
      )
    : undefined;

  // 일본 법인 정보는 ja 메시지에만 존재한다 — 정책이 켜진 로케일에서만 조회해야 한다.
  // '쿠키 및 광고 설정' — locale별 개인정보 처리방침 PDF 2조 5항 페이지로 이동
  // '쿠키 및 광고 설정' — <embed> 방식 중간 HTML 페이지로 이동.
  // <a target="_blank"> 직접 링크는 Chrome built-in PDF viewer가 #page=N fragment를
  // 무시하는 버그가 있어, <embed> 렌더링 경로를 사용하는 locale별 HTML로 우회.
  const COOKIE_HREF: Record<string, string> = {
    ko: '/privacy-cookie/ko.html',
    en: '/privacy-cookie/en.html',
    ja: '/privacy-cookie/ja.html',
  };
  const cookieHref = COOKIE_HREF[locale];

  const extraInfo = footerPolicy.showJapanEntity
    ? [
        { title: t("japanEntity.companyLabel"), text: t("japanEntity.companyValue") },
        { title: t("japanEntity.ceoLabel"),     text: t("japanEntity.ceoValue") },
        { title: t("japanEntity.telLabel"),     text: t("japanEntity.telValue"), noWrapValue: true },
      ]
    : [];

  return (
    <Footer
      labels={labels}
      showEmail={footerPolicy.showEmail}
      showBizNo={footerPolicy.showBizNo}
      extraInfo={extraInfo}
      privacyModalContent={privacyModalContent}
      cookieHref={cookieHref}
      wideCompact={locale !== 'ko'}
      onSocialClick={(label) => trackEvent("interest_click", { location: "footer", label })}
    />
  );
}
