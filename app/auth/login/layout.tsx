import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to your CodeSync account to continue practicing coding problems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
