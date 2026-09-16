import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Permission",
};

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Rootlayout;
