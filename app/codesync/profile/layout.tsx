import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | CodeSync",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
