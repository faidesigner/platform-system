#!/usr/bin/env node
/**
 * 모바일 가로 오버플로우 배포 게이트 (재발 방지).
 *
 * 정적 export(out/)를 로컬 서빙하고, 전 라우트 × 로케일을 모바일 폭(390px)으로 로드해
 * document.scrollWidth > viewport 이면 실패(exit 1)한다.
 *
 * 왜 필요한가: 가로 오버플로우가 생기면 iOS Safari에서 position:fixed; width:100% 헤더가
 * 넓어진 레이아웃 뷰포트 폭으로 렌더돼 모바일 우측 메뉴가 화면 밖으로 밀린다(About EN 사례).
 * CJK는 어디서나 줄바꿈돼 안 넘치지만 영문은 넘칠 수 있어 로케일별로 다르게 드러난다.
 *
 * 실행: node scripts/check-mobile-overflow.mjs   (deploy.sh 빌드 직후 자동 호출)
 * 사전조건: out/ 존재, 시스템 Chrome(또는 PUPPETEER_EXECUTABLE_PATH). Chrome 없으면 경고 후 skip.
 */
import { withPreview, measurePage } from "./lib/staticPreview.mjs";

const PORT = 43219;
const VIEWPORT = { width: 390, height: 844 };
const LOCALES = ["ko", "en", "ja"];
const PATHS = ["", "about", "contact", "media", "products", "products/vision-check-out", "products/unmanned-store"];

/**
 * 브라우저 컨텍스트: scrollWidth가 뷰포트를 넘으면, 넘긴 요소 중 **클리핑되지 않은** 가장 오른쪽
 * 요소를 범인으로 지목한다. overflow-x가 걸린 조상 안에 있는 요소는 실제로 문서를 넓히지 않는다.
 */
function measure() {
  const vw = window.innerWidth;
  const sw = document.documentElement.scrollWidth;
  let worst = null;
  if (sw > vw) {
    const isClipped = (el) => {
      let p = el.parentElement;
      while (p) { if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowX)) return true; p = p.parentElement; }
      return false;
    };
    document.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && !isClipped(el) && (!worst || r.right > worst.right)) {
        worst = { right: Math.round(r.right), cls: (el.className?.toString?.() || "").slice(0, 60), tag: el.tagName };
      }
    });
  }
  return { vw, sw, worst };
}

await withPreview({ port: PORT, what: "모바일 오버플로우 검사" }, async ({ browser, origin }) => {
  const offenders = [];

  for (const loc of LOCALES) {
    for (const rt of PATHS) {
      const info = await measurePage(browser, `${origin}/${loc}/${rt ? rt + "/" : ""}`, VIEWPORT, measure);
      const over = info.sw > info.vw;
      console.log(`${over ? "\u2717" : "\u2713"} /${loc}/${rt}  (scrollWidth ${info.sw} / vw ${info.vw})`);
      if (over) offenders.push({ url: `/${loc}/${rt}`, ...info });
    }
  }

  if (offenders.length) {
    console.error(`\n\u2717 \uac00\ub85c \uc624\ubc84\ud50c\ub85c\uc6b0 ${offenders.length}\uac74 \u2014 \ubaa8\ubc14\uc77c\uc5d0\uc11c \uc6b0\uc0b0 \uba54\ub274\uac00 \ubc00\ub9b4 \uc218 \uc788\uc74c:`);
    offenders.forEach((o) => console.error(`  ${o.url}: scrollWidth=${o.sw} > ${o.vw}  worst=${JSON.stringify(o.worst)}`));
    process.exit(1);
  }
  console.log(`\n\u2713 \uc624\ubc84\ud50c\ub85c\uc6b0 \uc5c6\uc74c \u2014 ${LOCALES.length}\u00d7${PATHS.length}\uac1c \ub77c\uc6b0\ud2b8 \ud1b5\uacfc.`);
});
