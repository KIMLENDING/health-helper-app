import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

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

export default withPWA(nextConfig);