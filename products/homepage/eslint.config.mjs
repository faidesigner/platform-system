/**
 * ESLint flat config.
 *
 * eslint-config-next 16부터 flat config를 **직접** export한다(`eslint-config-next/core-web-vitals`,
 * `eslint-config-next/typescript`). 이전 방식인 `FlatCompat`으로 `next/core-web-vitals`를
 * extends 하면 ESLint 9.39에서 `TypeError: Converting circular structure to JSON`으로
 * **lint 자체가 실행되지 않는다** (configs → 자기참조). 그 상태로 방치되면
 * "커밋 전 lint 통과" 규칙이 조용히 무력화되므로 문서 권장 형태로 맞춘다.
 * 근거: node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    // scripts/*.js 는 Node에서 직접 실행하는 CJS 유틸이다(빌드 파이프라인 밖).
    // require()가 정상 형태이므로 ESM 강제 규칙을 적용하지 않는다.
    files: ["scripts/**/*.js", "*.config.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    // 테스트에서 next/image를 <img> 로 mock 하는 것은 정상 패턴이다(jsdom엔 최적화 파이프라인이 없다).
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  globalIgnores(["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
