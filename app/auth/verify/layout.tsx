import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to activate your CodeSync account.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
