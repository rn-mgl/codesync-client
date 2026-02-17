import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | CodeSync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
