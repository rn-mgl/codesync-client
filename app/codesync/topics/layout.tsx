import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Explore coding problem topics and categories to focus your practice sessions.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
