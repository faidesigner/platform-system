import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 공용 컴포넌트(@fai/ui) 소스를 그대로 트랜스파일해서 사용
  transpilePackages: ["@fai/ui"],

  // ── 정적 핸드오프 빌드 ──
  // out/ 폴더에 순수 HTML/CSS/JS 로 구워낸다.
  // 개발자는 이 폴더만 받으면 서버·저장소·패키지 없이 index.html 을 열어 쓸 수 있고,
  // @fai/ui 소스는 빌드 결과에 컴파일되어 원본 구조가 노출되지 않는다.
  output: "export",

  // 정적 export 에는 이미지 최적화 서버가 없으므로 끈다.
  images: { unoptimized: true },

  // 폴더를 파일시스템에서 직접 열 때(파일 프로토콜) 링크가 깨지지 않도록
  // 각 경로를 디렉토리+index.html 로 출력한다. (/pages/sample-landing/index.html)
  trailingSlash: true,
};

export default nextConfig;
