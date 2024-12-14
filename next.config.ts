import type { NextConfig } from "next";
import withPWA from "next-pwa"; // next-pwa 플러그인 추가
import withPlugins from "next-compose-plugins"; // next-compose-plugins 추가

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

export default withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: "public",
          disable: process.env.NODE_ENV === "development",
        },
      },
    ],

  ],
  nextConfig
);