import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Test Case",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
