import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sending | CodeSync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
