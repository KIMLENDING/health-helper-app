import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러 무시
  },
};

export default nextConfig;