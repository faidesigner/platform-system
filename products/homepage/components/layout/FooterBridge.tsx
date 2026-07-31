"use client";

import { Footer } from "@fai/ui";
import type { FooterLabels } from "@fai/ui";
import { useTranslations, useLocale } from "next-intl";
import { trackEvent } from "@/lib/analytics/track";

/**
 * @fai/ui Footer는 analytics·i18n-agnostic — GA 계측과 번역 문자열 주입을 이 브릿지에서만 연결한다.
 * 서버 컴포넌트(layout.tsx)는 함수 prop을 클라이언트 컴포넌트로 넘길 수 없으므로,
 * 이 클라이언트 브릿지가 콜백과 번역을 소유한다.
 */
export default function FooterBridge() {
  const t = useTranslations("footer");
  const locale = useLocale();

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
  };

  return (
    <Footer
      labels={labels}
      hideEmail={locale === "ja"}
      onSocialClick={(label) => trackEvent("interest_click", { location: "footer", label })}
    />
  );
}
