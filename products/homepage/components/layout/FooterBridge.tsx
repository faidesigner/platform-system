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
    // 이메일은 노출 로케일에서만 조회한다(HOM-101). 미노출 로케일(ja)의 메시지 번들에서 키를
    // 아예 뺐기 때문에 무조건 t()를 부르면 MISSING_MESSAGE가 난다. 그리고 그게 목적이다 —
    // 번들에 남겨두면 next-intl이 HTML script 페이로드로 직렬화해 **소스에 주소가 실린다**.
    ...(footerPolicy.showEmail ? { email: t("labels.email"), emailValue: t("emailValue") } : {}),
    privacy:      t("policies.privacy"),
    adSettings:   t("policies.adSettings"),
    ceoValue:     t("ceoValue"),
    telValue:     t("telValue"),
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

  // 개정 안내 모달은 **ko에서만** 띄운다(HOM-101).
  // 근거: 2026-08-28 김진영(개인정보 담당) — "한국어 개정 공지 유지 / 영어·일본어는 한국어 공지
  // 삭제 후 바로 개인정보 처리방침 페이지로 이동". 개정 고지는 한국 개인정보보호법상 의무이고
  // en·ja는 대상이 아닌데, 한국어 모달만 뜨면 그 사용자에게는 읽을 수 없는 안내가 된다.
  const privacyModalContent = locale === 'ko'
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

  // 개인정보 처리방침 문서 — 로케일별 최신본(2026-08-28 시행).
  // ⚠️ 여기서 주입하지 않으면 링크가 아예 렌더되지 않는다. @fai/ui의 하드코딩 폴백을 제거했기
  //    때문인데(HOM-101), 그 폴백이 구버전 **한국어** PDF라 en·ja에서 한국어 문서가 열렸다.
  // `#page=N`을 붙이지 않는다 — 처리방침은 1페이지부터 봐야 한다(2026-08-28 Hyeyoung Shin).
  //  조항 점프는 '맞춤형 광고 설정'(COOKIE_HREF) 전용이다.
  //
  // ⚠️ encodeURI 필수: en 파일명에 **공백**이 있다. 로컬 정적 서버는 관대해서 그냥 열리지만
  //    CloudFront는 raw 공백 URL을 거부한다(실측: 공백 그대로 HTTP 000 / %20 HTTP 200).
  //    즉 로컬·테스트만 보면 통과하고 배포에서만 깨지는 종류다.
  const PRIVACY_DOC: Record<string, string> = {
    ko: '/contact-us/FaindersAI_개인정보처리방침_2026-1.pdf',
    en: '/contact-us/FaindersAI_Privacy Policy_2026-1.pdf',
    ja: '/contact-us/FaindersAI_プライバシーポリシー_個人情報保護方針_2026-1.pdf',
  };
  const privacyHref = PRIVACY_DOC[locale] ? encodeURI(PRIVACY_DOC[locale]) : undefined;

  // 일본 법인은 본사와 **동일한 블록 구조**로 렌더한다(HOM-101) — 볼드 법인명 + 하위 정보 행.
  // 라벨(日本法人)을 붙이지 않는 것이 요청사항이며, 그래야 본사 블록과 위계가 맞는다.
  const extraEntity = footerPolicy.showJapanEntity
    ? {
        name: t("japanEntity.companyValue"),
        rows: [
          { title: t("japanEntity.ceoLabel"),     text: t("japanEntity.ceoValue") },
          { title: t("japanEntity.telLabel"),     text: t("japanEntity.telValue"), noWrapValue: true },
          { title: t("japanEntity.addressLabel"), text: t("japanEntity.addressValue") },
        ],
      }
    : undefined;

  return (
    <Footer
      labels={labels}
      showEmail={footerPolicy.showEmail}
      showBizNo={footerPolicy.showBizNo}
      extraEntity={extraEntity}
      privacyModalContent={privacyModalContent}
      privacyHref={privacyHref}
      cookieHref={cookieHref}
      wideCompact={locale !== 'ko'}
      onSocialClick={(label) => trackEvent("interest_click", { location: "footer", label })}
    />
  );
}
