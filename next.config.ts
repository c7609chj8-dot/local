import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // KAKAO_MAP_KEY는 지도 JavaScript 키이며 브라우저 번들에 포함되어야 합니다.
  // Kakao Developers에서 등록 도메인 제한을 반드시 설정하세요.
  env: {
    KAKAO_MAP_KEY: process.env.KAKAO_MAP_KEY ?? "",
  },
};

export default nextConfig;
