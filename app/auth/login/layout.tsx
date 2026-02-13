import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | CodeSync",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return children;
}
