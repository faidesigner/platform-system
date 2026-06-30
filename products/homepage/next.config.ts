import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // 정적 export(S3/CloudFront 배포용). 미들웨어(proxy)·이미지 최적화 서버 없이 동작.
  output: "export",
  // /ko/about → out/ko/about/index.html 로 생성돼 S3 정적 호스팅에서 경로가 깔끔히 해석됨.
  trailingSlash: true,
  transpilePackages: ["@fai/ui"],
  images: {
    // export 환경엔 이미지 최적화 서버가 없으므로 원본을 그대로 서빙.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    // SVG → React 컴포넌트 변환 (SVGR)
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
