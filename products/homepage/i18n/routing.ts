import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "jp"],
  defaultLocale: "ko",
});
