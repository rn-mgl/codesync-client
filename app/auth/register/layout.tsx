import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a free CodeSync account to start practicing coding problems and tracking your progress.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
