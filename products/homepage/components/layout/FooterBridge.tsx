"use client";

import { Footer } from "@fai/ui";
import { trackEvent } from "@/lib/analytics/track";

/**
 * @fai/ui Footer는 analytics-agnostic — GA 계측은 이 브릿지에서만 연결한다.
 * 서버 컴포넌트(layout.tsx)는 함수 prop을 클라이언트 컴포넌트로 넘길 수 없으므로,
 * 이 클라이언트 브릿지가 콜백을 소유한다.
 */
export default function FooterBridge() {
  return (
    <Footer
      onSocialClick={(label) => trackEvent("interest_click", { location: "footer", label })}
    />
  );
}
