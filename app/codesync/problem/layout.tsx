import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Problems",
  description:
    "Browse and solve curated data structures and algorithms problems with in-browser code execution.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
