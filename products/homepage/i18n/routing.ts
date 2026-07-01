import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "ja"],
  defaultLocale: "ko",
  // 모든 로케일을 경로 prefix로 노출(/ko, /en, /ja). 정적 export엔 미들웨어가 없으므로
  // 자동 협상 대신 항상-prefix가 가장 안전. 루트(/)는 public/index.html이 /ko로 보냄.
  localePrefix: "always",
});
