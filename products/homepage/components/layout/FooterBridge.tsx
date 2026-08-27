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
    cctv:         t("policies.cctv"),
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

■ 시행일자 : 2026년 8월 12일

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

개정된 처리방침은 2026년 8월 12일부터 적용되며,
시행일 이전까지는 기존 처리방침이 적용됩니다.

개정 전문은 아래에서 확인하실 수 있습니다.
`}<a href="/contact-us/FaindersAI_개인정보처리방침_2026-1.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ 개인정보 처리방침 (2026. 8. 13. 시행)</a>{`
`}<a href="/contact-us/FaindersAI_개인정보처리방침_2023.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ 개인정보 처리방침 (2023. 6. 19. 시행)</a>{`

문의 : ㈜파인더스에이아이 정보보호담당 02-6191-0049 / sbhong@fainders.ai

2026년 8월 6일
㈜파인더스에이아이`}</p>
  );

  const EN_PRIVACY_BODY = (
    <p className="whitespace-pre-wrap">{`Hello, this is Fainders AI Co., Ltd.

We are revising our Privacy Policy to provide clearer guidance on the standards for handling personal information in connection with your use of our website (fainders.ai).

■ Effective Date: August 12, 2026

■ Key Revisions

1. Clarification of Scope
   We have reorganized provisions related to unmanned store services included in the previous policy and clarified the scope to cover matters applicable to website use.

2. New Provisions on Cross-Border Transfer of Personal Information (Article 5)
   In connection with services used for web log analysis and advertising performance measurement, we provide information on the categories, purposes, retention periods, and opt-out methods for information transferred overseas.

3. More Detailed Provisions on Cookies and Behavioral Information (Article 2)
   We provide specific guidance on the categories and retention periods of behavioral information collected, as well as methods to opt out of personalized advertising.

4. Updated Collection Items and Retention Periods (Articles 1 and 3)
   We have updated the items collected and retention periods for inquiry/consultation submissions and newsletter subscriptions to reflect actual processing practices.

5. New Provisions on Pseudonymized Information and Automated Decision-Making (Article 8)

The revised policy will apply from August 12, 2026.
The previous policy will apply until the effective date.

The full text of the revised policy is available below.
`}<a href="/contact-us/FaindersAI_Privacy Policy_2026-1.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ Privacy Policy (Effective August 13, 2026)</a>{`
`}<a href="/contact-us/FaindersAI_Privacy Policy_2023.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ Privacy Policy (Effective June 19, 2023)</a>{`

Contact: Fainders AI Co., Ltd. Privacy Officer  02-6191-0049 / sbhong@fainders.ai

August 6, 2026
Fainders AI Co., Ltd.`}</p>
  );

  const JA_PRIVACY_BODY = (
    <p className="whitespace-pre-wrap">{`いつもFainders AI株式会社をご利用いただき、誠にありがとうございます。

当社は、ウェブサイト（fainders.ai）のご利用に関連する個人情報の取り扱い基準を、より明確にご案内するため、プライバシーポリシーを改定いたします。

■ 施行日：2026年8月12日

■ 主な改定内容

1. 適用範囲の明確化
   従来のポリシーに含まれていた無人店舗サービスに関する条項を整理し、
   ウェブサイト利用に適用される事項を対象として範囲を明確化いたしました。

2. 個人情報の越境移転に関する事項の新設（第5条）
   ウェブログ分析および広告効果測定のために利用しているサービスに関連して、
   海外に移転される情報の項目・目的・保存期間および拒否方法についてご案内いたします。

3. Cookieおよび行動情報に関する事項の具体化（第2条）
   収集する行動情報の項目と保存期間、ターゲット広告の受信拒否方法について
   具体的にご案内いたします。

4. 収集項目および保存期間の現行化（第1条・第3条）
   お問い合わせ・ご相談およびニュースレター申込時に収集する項目と保存期間を、
   実際の取り扱い状況に合わせて整備いたしました。

5. 仮名加工情報および自動化された意思決定に関する事項の新設（第8条）

改定後のポリシーは2026年8月12日より適用され、
施行日前は従来のポリシーが適用されます。

改定全文は以下よりご確認いただけます。
`}<a href="/contact-us/FaindersAI_プライバシーポリシー_個人情報保護方針_2026-1.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ プライバシーポリシー 個人情報保護方針（2026年8月13日施行）</a>{`
`}<a href="/contact-us/FaindersAI_プライバシーポリシー_個人情報保護方針_2023.pdf" target="_blank" rel="noopener noreferrer" className={pdfLinkCls}>▶ プライバシーポリシー 個人情報保護方針（2023年6月19日施行）</a>{`

お問い合わせ：Fainders AI株式会社 個人情報保護担当  02-6191-0049 / sbhong@fainders.ai

2026年8月6日
Fainders AI株式会社`}</p>
  );

  const MODAL_CONFIG = {
    ko: { title: '개인정보 처리방침 개정 안내 (2026년 8월 12일 시행)', body: KO_PRIVACY_BODY, confirmLabel: '확인' },
    en: { title: 'Privacy Policy Update Notice (Effective August 12, 2026)', body: EN_PRIVACY_BODY, confirmLabel: 'Confirm' },
    ja: { title: 'プライバシーポリシー改定のご案内（2026年8月12日施行）', body: JA_PRIVACY_BODY, confirmLabel: '確認' },
  } as const;

  // 개정 안내 모달은 언어 전환과 무관하게 항상 한국어(ko)로 노출.
  const modalConfig = MODAL_CONFIG.ko;

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
