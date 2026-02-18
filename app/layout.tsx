"use client";

import { SessionProvider } from "next-auth/react";
import { Onest } from "next/font/google";
import "./globals.css";

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
    <SessionProvider refetchOnWindowFocus={false}>
      <html lang="en">
        <body
          className={`${onest.className} scroll-smooth min-h-screen h-screen overflow-y-auto text-primary`}
        >
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
