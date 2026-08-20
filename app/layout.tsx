import SessionProviderShell from "@/src/providers/SessionProviderShell";
import { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { env } from "@/src/configs/env.config";

const onest = Onest({
  display: "block",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-onest",
  style: ["normal"],
  subsets: ["latin"],
});

const APP_URL = env.APP_URL;

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: "%s | CodeSync",
    default: "CodeSync | Practice Problems, Track Every Run",
  },
  description:
    "CodeSync is a focused coding practice workspace with curated DSA problems, in-browser code execution, guided hints, AI assistance, and achievement tracking.",
  keywords: [
    "coding practice",
    "DSA problems",
    "data structures",
    "algorithms",
    "code editor",
    "programming",
    "interview prep",
    "leetcode alternative",
    "online judge",
    "code execution",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CodeSync",
    title: "CodeSync | Practice Problems, Track Every Run",
    description:
      "A focused coding practice workspace with curated DSA problems, in-browser code execution, guided hints, AI assistance, and achievement tracking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeSync | Practice Problems, Track Every Run",
    description:
      "A focused coding practice workspace with curated DSA problems, in-browser code execution, guided hints, AI assistance, and achievement tracking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderShell>
      <html lang="en">
        <body
          className={`${onest.className} min-h-screen scroll-smooth h-screen overflow-y-hidden text-primary`}
        >
          {children}
        </body>
      </html>
    </SessionProviderShell>
  );
}
