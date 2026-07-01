import { sendGAEvent } from "@next/third-parties/google";
import { buildEvent, type GaEventName, type GaParams } from "./events";

/**
 * GA4 커스텀 이벤트 발화. gtag/dataLayer에 접근하는 유일한 지점.
 * sendGAEvent 내부에서 dataLayer 미존재 시 안전 처리되므로 별도 가드 불필요.
 */
export function trackEvent(name: GaEventName, params: GaParams): void {
  const { name: eventName, params: eventParams } = buildEvent(name, params);
  sendGAEvent("event", eventName, eventParams);
}
