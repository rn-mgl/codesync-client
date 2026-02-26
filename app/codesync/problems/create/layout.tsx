import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create | Problem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
