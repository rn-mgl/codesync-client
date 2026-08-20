import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions",
  description:
    "Join or manage real-time collaborative coding sessions with peers.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default RootLayout;
