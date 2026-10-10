import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Achievement",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
