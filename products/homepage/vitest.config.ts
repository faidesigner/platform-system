import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  // Tailwind v4 설정이 Vite의 PostCSS 로더와 호환되지 않아 발생하는 에러를 막기 위해
  // Vite 자체의 PostCSS 자동 탐색/해석을 비활성화한다. 임의로 삭제하지 말 것.
  css: {
    postcss: { plugins: [] },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
