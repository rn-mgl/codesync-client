import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Track your progress with achievement badges across bronze, silver, gold, and diamond tiers.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
