#!/usr/bin/env node
/**
 * 루트 산출물(out/index.html) 무결성 배포 게이트.
 *
 * 루트 `/`는 Next 라우트가 아니라 `public/index.html` 정적 파일이 담당한다. 이 파일에는
 * 두 가지가 들어 있고 **둘 다 사라지면 조용히 손실이 발생**한다.
 *
 *   ① Meta 도메인 인증 태그 — 없으면 인증이 풀려 iOS 사용자 전환이 광고 성과에서 누락된다.
 *      (Slack #prj_homepage 2026-08-05 김진영 요청)
 *   ② 브라우저 언어 감지 리다이렉트 — 정적 export엔 미들웨어가 없어 서버 언어협상이 불가하므로
 *      이 스크립트가 /ko · /en · /ja 를 고른다. 없으면 전 방문자가 한 언어로 강제된다.
 *
 * 왜 tests/landingTags.test.ts로 부족한가(실제 사고, PR #11):
 *   그 테스트는 `public/index.html`(**소스**)을 읽는다. `app/page.tsx`가 추가되자 Next 라우트가
 *   `out/index.html`을 생성해 public 파일을 **덮어썼는데**, 소스는 그대로였으므로 테스트 212개가
 *   전부 통과했다. 즉 검사 대상이 한 단계 앞이었다. 이 게이트는 **실제 배포되는 산출물**을 본다.
 *
 * 실행: node scripts/check-root-html.mjs   (deploy.sh 빌드 직후 자동 호출)
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");
const ROOT_HTML = path.join(OUT, "index.html");

/** 산출물에 반드시 살아 있어야 하는 것들. 값이 바뀌면 문자열도 함께 갱신할 것. */
const REQUIRED = [
  {
    label: "Meta 도메인 인증 태그",
    needle: 'name="facebook-domain-verification"',
    why: "인증이 풀려 iOS 사용자 전환이 광고 성과에서 누락된다 (2026-08-05 김진영 요청)",
  },
  {
    label: "브라우저 언어 감지 리다이렉트",
    // public/index.html 이 navigator.languages / navigator.language 로 로케일을 고른다.
    needle: "navigator.language",
    why: "정적 export엔 미들웨어가 없어, 이게 없으면 전 방문자가 한 언어로 강제된다",
  },
];

/** Next 라우트가 루트를 점유하면 public/index.html 이 덮어써진다. */
const CONFLICTING_ROUTES = ["app/page.tsx", "app/page.jsx", "app/page.js", "app/index.tsx"];

function run() {
  const failures = [];

  // 1) 루트를 점유하는 Next 라우트가 있으면 그 자체가 원인이다 — 먼저 짚어준다.
  for (const rel of CONFLICTING_ROUTES) {
    if (existsSync(path.resolve(process.cwd(), rel))) {
      failures.push(
        `${rel} 이 존재한다 — Next 라우트가 out/index.html 을 생성해 public/index.html 을 덮어쓴다. ` +
          `dev에서 / 가 404인 문제는 /ko 로 직접 접속하거나 dev 전용 rewrite로 해결할 것.`,
      );
    }
  }

  if (!existsSync(ROOT_HTML)) {
    failures.push("out/index.html 이 없다 — public/index.html 이 산출물로 복사되지 않았다.");
  } else {
    const html = readFileSync(ROOT_HTML, "utf-8");
    for (const { label, needle, why } of REQUIRED) {
      if (!html.includes(needle)) {
        failures.push(`out/index.html 에 ${label}(\`${needle}\`)이 없다 — ${why}`);
      }
    }
    console.log(`  out/index.html ${html.length.toLocaleString()} bytes`);
    for (const { label, needle } of REQUIRED) {
      console.log(`  ${html.includes(needle) ? "✓" : "✗"} ${label}`);
    }
  }

  if (failures.length) {
    console.error(`\n✗ 루트 산출물 무결성 위반 ${failures.length}건:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
  console.log("\n✓ 루트 산출물 정상 — Meta 도메인 인증·언어 감지 리다이렉트 모두 살아 있음.");
}

run();
