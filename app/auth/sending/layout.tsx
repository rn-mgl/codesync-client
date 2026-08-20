import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sending Email",
  description:
    "Your verification or password reset email is being sent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
