import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Cases",
  description:
    "Manage sample and hidden test cases with custom memory limits and execution time constraints.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
