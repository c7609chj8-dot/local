import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "맛집지도",
    template: "%s | 맛집지도",
  },
  description: "카카오맵으로 지역별·현재 위치 주변 맛집을 검색하는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
