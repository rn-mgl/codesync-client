import { Onest } from "next/font/google";
import "./globals.css";
import SessionProviderShell from "@/src/providers/SessionProviderShell";
import { Metadata } from "next";

const onest = Onest({
  display: "block",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-onest",
  style: ["normal"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeSync",
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
          className={`${onest.className} scroll-smooth min-h-screen h-screen overflow-y-hidden text-primary`}
        >
          {children}
        </body>
      </html>
    </SessionProviderShell>
  );
}
