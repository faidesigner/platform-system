import { sendGAEvent } from "@next/third-parties/google";
import { buildEvent, type GaEventName, type GaParams } from "./events";

/**
 * GA4 커스텀 이벤트 발화. gtag/dataLayer에 접근하는 유일한 지점.
 * sendGAEvent는 window를 무조건 참조하므로(SSR에서 ReferenceError 발생),
 * trackEvent 자신이 non-browser(SSR) 환경을 가드해 안전한 no-op이 되도록 한다.
 */
export function trackEvent(name: GaEventName, params: GaParams): void {
  if (typeof window === "undefined") return;

  const { name: eventName, params: eventParams } = buildEvent(name, params);
  sendGAEvent("event", eventName, eventParams);
}
