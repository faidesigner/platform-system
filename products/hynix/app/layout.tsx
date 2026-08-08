import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SK hynix — Design Handoff",
  description: "완성된 UI/UX 페이지 갤러리 · 개발 핸드오프용",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-brand="hynix">
      <body>{children}</body>
    </html>
  );
}
