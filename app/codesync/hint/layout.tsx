import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hints",
  description:
    "Browse progressive hints for coding problems to guide your learning journey.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
