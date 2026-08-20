import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "View your profile, contribution heatmap, achievements, and practice progress.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
