import React from "react";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster style={{ fontFamily: "var(--font-onest)" }} />
      {children}
    </>
  );
}
