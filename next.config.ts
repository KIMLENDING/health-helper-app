import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러 무시
  },
  env: {
    NEXTAUTH_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://health-helper-app.vercel.app'
        : 'http://localhost:3000',
  },
};

export default nextConfig;