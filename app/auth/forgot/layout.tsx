import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your CodeSync account password by entering your email address.",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return children;
}
