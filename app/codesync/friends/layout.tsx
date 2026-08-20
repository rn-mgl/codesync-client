import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Friends",
  description:
    "Connect with friends and see their coding practice activity.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
