import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 공용 컴포넌트(@fai/ui) 소스를 그대로 트랜스파일해서 사용
  transpilePackages: ["@fai/ui"],
};

export default nextConfig;
