"use client";

import { Footer } from "@fai/ui";
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
    ceoValue:     t("ceoValue"),
    telValue:     t("telValue"),
    emailValue:   t("emailValue"),
  };

  // 일본 법인 정보는 ja 메시지에만 존재한다 — 정책이 켜진 로케일에서만 조회해야 한다.
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
      onSocialClick={(label) => trackEvent("interest_click", { location: "footer", label })}
    />
  );
}
