import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeSync",
};

const onest = Onest({
  display: "block",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-onest",
  style: ["normal"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.className} scroll-smooth`}>{children}</body>
    </html>
  );
}
