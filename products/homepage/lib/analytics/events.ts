export type GaLocation =
  | "nav"
  | "home_hero"
  | "home_customers"
  | "home_cta_banner"
  | "product_hero"
  | "product_cta_banner"
  | "media_showcase"
  | "footer"
  | "contact_form"
  | "contact_kakao"
  // ja 상담 채널은 LINE이다(HOM-72). contact_kakao로 뭉뚱그리면 유입 채널 분석이 틀어진다.
  | "contact_line";

export type GaEventName =
  | "interest_click"
  | "lead_acquisition_click"
  | "inquiry_complete";

export interface GaParams {
  location: GaLocation;
  label: string;
}

/** GA로 보낼 payload를 조립하는 순수 함수(사이드이펙트 없음). */
export function buildEvent(
  name: GaEventName,
  params: GaParams
): { name: GaEventName; params: GaParams } {
  return { name, params };
}
